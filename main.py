from dotenv import load_dotenv
import os
# Muat environment variables dari file .env secara lokal
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import io
from PIL import Image
from datetime import datetime
import database
import klasifikasi
import predict_utils

# Inisialisasi FastAPI
app = FastAPI(
    title="API Klasifikasi Cabai Rawit Indonesia",
    description="REST API backend murni untuk mendeteksi jenis cabai rawit menggunakan arsitektur MobileNetV2 dan menyimpan riwayat prediksi ke database berbasis akun.",
    version="1.1.0",
    docs_url=None,
    redoc_url=None
)

# Konfigurasi CORS (Cross-Origin Resource Sharing) agar API bisa diakses oleh frontend lain (web/mobile)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi Database
db_type, db_err = database.init_db()

# Path model
MODEL_PATH = "model_chili_mobilenetv2.keras"
CLASS_NAMES = predict_utils.load_class_names()

# Memuat model Keras secara aman saat server startup
model = None
model_load_error = None

try:
    if os.path.exists(MODEL_PATH):
        model = predict_utils.load_model(MODEL_PATH)
        print("Model MobileNetV2 berhasil dimuat di REST API.")
    else:
        model_load_error = "File model tidak ditemukan di server. Harap jalankan training terlebih dahulu."
        print(f"Peringatan API: {model_load_error}")
except Exception as e:
    model_load_error = f"Gagal memuat model: {str(e)}"
    print(f"Error API: {model_load_error}")

# ==========================================
# MODEL DATA (PYDANTIC SCHEMAS) & SECURITY
# ==========================================

class UserAuth(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

# Inisialisasi Security HTTPBearer
security_optional = HTTPBearer(auto_error=False)
security_required = HTTPBearer(auto_error=True)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_required)):
    """Dependency untuk mewajibkan autentikasi token (Bearer <token>)"""
    token = credentials.credentials
    user_id, username = database.verify_session(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Sesi tidak valid atau telah kedaluwarsa.")
    return {"user_id": user_id, "username": username, "token": token}

async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security_optional)):
    """Dependency opsional: jika token dikirim diproses, jika tidak tetap diizinkan sebagai guest"""
    if not credentials:
        return None
    
    token = credentials.credentials
    user_id, username = database.verify_session(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Sesi tidak valid atau telah kedaluwarsa.")
    return {"user_id": user_id, "username": username, "token": token}


# ==========================================
# ENDPOINT AUTENTIKASI PENGGUNA
# ==========================================

@app.post("/register", tags=["Autentikasi"])
def register(user: UserRegister):
    """Mendaftarkan akun pengunjung baru"""
    if not user.username or not user.password or not user.email:
        raise HTTPException(status_code=400, detail="Username, email, dan password tidak boleh kosong.")
    success, err = database.register_user(user.username, user.email, user.password)
    if not success:
        raise HTTPException(status_code=400, detail=str(err))
    return {"status": "success", "message": "Pendaftaran berhasil. Silakan login."}

@app.post("/login", tags=["Autentikasi"])
def login(user: UserAuth):
    """Login untuk mendapatkan token sesi"""
    token, err = database.authenticate_user(user.username, user.password)
    if err:
        raise HTTPException(status_code=400, detail=str(err))
    return {"status": "success", "token": token, "token_type": "bearer"}

@app.post("/logout", tags=["Autentikasi"])
def logout(current_user: dict = Depends(get_current_user)):
    """Logout dan menghapus sesi yang aktif"""
    database.delete_session(current_user["token"])
    return {"status": "success", "message": "Logout berhasil."}

# ==========================================
# ENDPOINT SISTEM & KLASIFIKASI
# ==========================================

# Dataset count persistence
DATASET_COUNT_FILE = "dataset_count.txt"

def get_dataset_count() -> int:
    try:
        with open(DATASET_COUNT_FILE, "r", encoding="utf-8") as f:
            return int(f.read().strip())
    except Exception:
        return 0

def set_dataset_count(count: int) -> None:
    with open(DATASET_COUNT_FILE, "w", encoding="utf-8") as f:
        f.write(str(count))

@app.get("/dataset/count", tags=["Dataset"])
def dataset_count():
    return {"total": get_dataset_count()}

@app.post("/dataset/set", tags=["Dataset"])
def dataset_set(payload: dict):
    count = payload.get("total")
    if not isinstance(count, int) or count < 0:
        raise HTTPException(status_code=400, detail="Invalid count")
    set_dataset_count(count)
    return {"status": "success", "total": count}

@app.get("/", tags=["Sistem"])
def read_root():
    """Mengembalikan informasi status server API"""
    return {
        "status": "online",
        "app_name": "API Klasifikasi Cabai Rawit Indonesia",
        "version": "1.1.0",
        "model_loaded": model is not None,
        "model_error": model_load_error,
        "database_connected": db_type is not None,
        "database_type": db_type,
        "developer": {
            "nama": "Difa Fadhilah",
            "nim": "2311081010",
            "institusi": "Politeknik Negeri Padang"
        }
    }

@app.post("/predict", tags=["Klasifikasi"])
async def predict_chili(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_optional_user)
):
    """
    Mengklasifikasikan jenis cabai rawit dari gambar yang diunggah.
    Hasil prediksi akan otomatis disimpan ke database riwayat (terhubung ke user jika login, atau guest jika tidak).
    Untuk login: kirimkan token di header 'Authorization: Bearer <token>'
    """
    global model
    
    # 1. Validasi format file
    extension = file.filename.split(".")[-1].lower()
    if extension not in ["jpg", "jpeg", "png"]:
        raise HTTPException(
            status_code=400, 
            detail="Format file tidak didukung. Harap unggah gambar berformat JPG, JPEG, atau PNG."
        )
        
    # 2. Cek kesiapan layanan klasifikasi
    if model is None:
        print(f"Peringatan: model lokal belum dimuat ({model_load_error}). Menggunakan inferensi alternatif.")
        
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        try:
            prediction_label, confidence, all_probs = klasifikasi.classify_cabai(
                contents,
                extension,
                CLASS_NAMES,
                filename=file.filename,
            )
            print(f"Prediksi: {prediction_label} ({confidence * 100:.2f}%)")
        except Exception as gemini_err:
            print(f"PERINGATAN: OpenRouter gagal, fallback ke model lokal: {gemini_err}")
            if model is None:
                raise HTTPException(
                    status_code=503,
                    detail=f"Layanan klasifikasi belum siap. {model_load_error}",
                )
            prediction_label, confidence, all_probs = predict_utils.predict_chili(
                model, image, CLASS_NAMES
            )
            print(f"Prediksi model lokal: {prediction_label} ({confidence * 100:.2f}%)")

        if prediction_label == "Bukan Cabai":
            return JSONResponse(
                status_code=400,
                content={
                    "status": "failed",
                    "filename": file.filename,
                    "message": "Gambar yang diunggah bukan merupakan gambar cabai.",
                    "predicted_class": "Bukan Cabai",
                    "confidence": 1.0,
                    "confidence_percentage": "100.00%"
                }
            )

        # Simpan hasil ke Database (kaitkan dengan user jika ada)
        user_id = current_user["user_id"] if current_user else None
        db_success, db_err = database.save_prediction(
            nama_file=file.filename,
            hasil_prediksi=prediction_label,
            confidence_score=confidence * 100,
            user_id=user_id
        )
        
        return {
            "status": "success",
            "filename": file.filename,
            "predicted_class": prediction_label,
            "confidence": confidence,
            "confidence_percentage": f"{confidence * 100:.2f}%",
            "all_probabilities": {
                name: f"{score * 100:.2f}%" for name, score in all_probs.items()
            },
            "database_saved": db_success,
            "database_error": str(db_err) if db_err else None,
            "user_type": "user" if current_user else "guest",
            "username": current_user["username"] if current_user else None,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat memproses gambar: {str(e)}")

# ==========================================
# ENDPOINT DATABASE RIWAYAT
# ==========================================

@app.get("/history", tags=["Database"])
def get_history(current_user: dict = Depends(get_optional_user)):
    """
    Mengambil riwayat prediksi dari database. 
    Jika login (menyertakan token), mengambil riwayat akun tersebut. 
    Jika tidak (guest), mengambil riwayat guest umum (user_id IS NULL).
    """
    user_id = current_user["user_id"] if current_user else None
    history_list, err = database.get_prediction_history(user_id=user_id)
    if err:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil data dari database: {str(err)}")
    return {
        "status": "success",
        "user_type": "user" if current_user else "guest",
        "username": current_user["username"] if current_user else None,
        "total_records": len(history_list),
        "data": history_list
    }

@app.delete("/history/{record_id}", tags=["Database"])
def delete_history_record(record_id: int):
    """Menghapus satu data riwayat berdasarkan ID"""
    # Ambil riwayat all untuk cek keberadaan ID
    history_list, err = database.get_prediction_history(user_id="all")
    if err:
         raise HTTPException(status_code=500, detail=f"Gagal memvalidasi ID database: {str(err)}")
         
    id_exists = any(item['id'] == record_id for item in history_list)
    if not id_exists:
        raise HTTPException(status_code=404, detail=f"Data dengan ID {record_id} tidak ditemukan.")
        
    success, del_err = database.delete_prediction(record_id)
    if not success:
        raise HTTPException(status_code=500, detail=f"Gagal menghapus data: {str(del_err)}")
        
    return {
        "status": "success",
        "message": f"Data riwayat dengan ID {record_id} berhasil dihapus."
    }

@app.get("/metrics", tags=["Evaluasi Model"])
def get_model_metrics():
    """Membaca file laporan metrik pelatihan model (precision, recall, f1-score)"""
    metrics_file = "classification_report.txt"
    if not os.path.exists(metrics_file):
        return {
            "status": "info",
            "message": "Metrik evaluasi belum tersedia. Harap jalankan training model terlebih dahulu."
        }
        
    try:
        with open(metrics_file, "r") as f:
            report_content = f.read()
        return {
            "status": "success",
            "metrics_report": report_content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membaca file metrik: {str(e)}")


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    from fastapi.openapi.docs import get_swagger_ui_html
    
    swagger_html = get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - API Docs",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    )
    
    html_content = swagger_html.body.decode("utf-8")
    
    injected_code = """
    <!-- Google Fonts: Outfit -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    
    <script>
        // Preview gambar yang di-upload di Swagger UI secara dinamis
        document.body.addEventListener('change', function(e) {
            if (e.target && e.target.type === 'file') {
                const fileInput = e.target;
                const file = fileInput.files[0];
                if (file && file.type.startsWith('image/')) {
                    let previewImg = fileInput.parentNode.querySelector('.swagger-image-preview');
                    if (!previewImg) {
                        previewImg = document.createElement('img');
                        previewImg.className = 'swagger-image-preview mt-3 rounded-xl border-2 border-dashed border-gray-300 p-1 max-w-xs h-auto max-h-48 object-contain block shadow-lg bg-gray-50';
                        fileInput.parentNode.appendChild(previewImg);
                    }
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        previewImg.src = evt.target.result;
                        if (window.gsap) {
                            gsap.fromTo(previewImg, { opacity: 0, scale: 0.8 }, { duration: 0.5, opacity: 1, scale: 1, ease: 'back.out(1.5)' });
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    const previewImg = fileInput.parentNode.querySelector('.swagger-image-preview');
                    if (previewImg) {
                        previewImg.remove();
                    }
                }
            }
        });
    </script>
    """
    
    new_html = html_content.replace("</body>", f"{injected_code}</body>")
    return HTMLResponse(content=new_html)


