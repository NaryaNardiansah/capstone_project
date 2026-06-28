<div align="center">

# 🌶️ ChiliDetect

### Sistem Klasifikasi Cabai Rawit Indonesia

*Deep Learning berbasis MobileNetV2 untuk identifikasi 4 jenis cabai rawit*

<br/>

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15+-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.90+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

<br/>

> 🎓 **Proyek Tugas Akhir (Capstone Project)**
> Program Studi Teknologi Rekayasa Perangkat Lunak
> Jurusan Teknologi Informasi — Politeknik Negeri Padang — 2026

</div>

---

## 📖 Tentang Proyek

**ChiliDetect** adalah aplikasi web berbasis kecerdasan buatan yang mampu mengklasifikasikan 4 jenis cabai rawit Indonesia secara otomatis hanya dari sebuah foto. Proyek ini dikembangkan sebagai Tugas Akhir (Capstone Project) dengan mengimplementasikan arsitektur *Convolutional Neural Network* (CNN) **MobileNetV2** untuk proses klasifikasi gambar.

### Permasalahan yang Diselesaikan

Cabai rawit merupakan komoditas pangan penting di Indonesia, namun banyak masyarakat awam, petani, maupun pedagang pasar yang kesulitan membedakan jenis-jenis cabai secara visual. Perbedaan harga dan kegunaan antar jenis cabai sangat signifikan, sehingga identifikasi yang tepat sangat dibutuhkan.

### Solusi

ChiliDetect menyediakan antarmuka web yang sederhana dan intuitif — pengguna cukup mengunggah foto cabai, dan sistem akan langsung mengidentifikasi jenisnya beserta tingkat kepedasan dan informasi tambahan.

---

## 🌶️ Kelas Cabai yang Dapat Diidentifikasi

| Kelas | Nama | Tingkat Kepedasan | Deskripsi |
|:---:|---|:---:|---|
| 🌶️ | **Cabai Setan** | ⭐⭐⭐⭐⭐ Sangat Pedas | Bentuk lonjong ujung runcing, warna orange hingga merah menyala |
| 🫑 | **Cabai Celeng** | ⭐⭐⭐ Pedas Sedang | Rawit hijau panjang, umum untuk lalapan dan masakan sehari-hari |
| 🟡 | **Cabai Putih** | ⭐⭐⭐⭐ Pedas Tajam | Putih gading saat muda, aroma khas, matang berwarna merah jingga |
| 🔥 | **Cabai Merah Keriting** | ⭐⭐⭐ Pedas Sedang | Bentuk panjang ramping bergelombang, cocok untuk sambal |

---

## ✨ Fitur Utama

- 🔐 **Sistem Autentikasi** — Register & Login dengan token sesi berbasis Bearer
- 🖼️ **Klasifikasi Real-time** — Upload gambar → hasil prediksi instan dengan confidence score
- 📊 **Riwayat Prediksi** — Histori klasifikasi tersimpan per-akun pengguna
- 🤖 **Fallback AI Vision** — Integrasi OpenRouter sebagai cadangan bila confidence model rendah
- 📱 **Antarmuka Responsif** — UI modern, animasi GSAP, tema rose pastel
- 🐰 **Loading Screen Charming** — Transition screen whimsical rabbit wonderland saat login

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│              Next.js 14 · Tailwind CSS · GSAP           │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / REST API
                        ▼
┌─────────────────────────────────────────────────────────┐
│               BACKEND (FastAPI · Port 8000)             │
│                                                         │
│  /register   /login   /logout                           │
│  /predict    /history /history/{id}   /model-info       │
│                                                         │
│  ┌─────────────────┐    ┌──────────────────────────┐   │
│  │  MobileNetV2    │    │  OpenRouter Vision API   │   │
│  │  (.keras model) │    │  (Fallback AI Classifier) │   │
│  └─────────────────┘    └──────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │        SQLite Database (cabai_db.sqlite)         │   │
│  │      users · sessions · predictions             │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🧠 Model Machine Learning

### Arsitektur: MobileNetV2 (Transfer Learning)

| Parameter | Nilai |
|---|---|
| **Arsitektur** | MobileNetV2 (Transfer Learning dari ImageNet) |
| **Input Size** | 224 × 224 × 3 (RGB) |
| **Jumlah Kelas** | 4 kelas cabai |
| **Total Dataset** | ±320 gambar |
| **Komposisi Data** | 60% Pasar Lokal · 40% Dataset Kaggle |
| **Train/Val Split** | 80% / 20% |
| **Batch Size** | 16 |
| **Epochs** | 20 training + 8 fine-tuning |
| **Learning Rate** | 1e-4 → 1e-5 (fine-tune) |
| **Optimizer** | Adam |
| **Format Model** | `.keras` (TensorFlow/Keras) |

### Augmentasi Data

Untuk meningkatkan ketahanan dan generalisasi model terhadap variasi gambar:
- 🔄 Rotasi acak
- 🔍 Zoom in/out
- ↔️ Horizontal & vertical flip
- ↕️ Width & height shift

### Hasil Evaluasi Model

```
                      precision    recall  f1-score   support

Cabai Merah Keriting       1.00      1.00      1.00        34
         Cabai Setan       1.00      0.90      0.95       206
        Cabai Celeng       0.94      1.00      0.97        15
         Cabai Putih       0.34      1.00      0.51        10

            accuracy                           0.92       265
           macro avg       0.82      0.98      0.86       265
        weighted avg       0.97      0.92      0.94       265
```

> ✅ **Overall Accuracy: 92%** pada validation set

---

## 🛠️ Tech Stack

### Backend

| Teknologi | Versi | Fungsi |
|---|---|---|
| **Python** | 3.10+ | Bahasa pemrograman utama |
| **FastAPI** | ≥0.90 | REST API framework |
| **Uvicorn** | ≥0.20 | ASGI server production |
| **TensorFlow / Keras** | ≥2.15 | Deep learning framework |
| **SQLite** | Built-in | Database lokal |
| **OpenCV** | ≥4.5 | Preprocessing & manipulasi gambar |
| **Pillow** | ≥9.0 | Image I/O handler |
| **scikit-learn** | ≥1.0 | Evaluasi model & metrics |
| **OpenRouter API** | — | Fallback Vision AI (LLM-based) |

### Frontend

| Teknologi | Versi | Fungsi |
|---|---|---|
| **Next.js** | 14.2.3 | React full-stack framework |
| **React** | 18 | UI component library |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **GSAP** | 3.15 | Animasi & motion design |
| **Space Grotesk** | — | Tipografi display utama |
| **Inter** | — | Tipografi body |
| **JetBrains Mono** | — | Tipografi numerik/kode |

---

## 🚀 Cara Menjalankan

### Prasyarat

- Python **3.10+**
- Node.js **18+**
- npm / yarn

---

### 1. Clone Repository

```bash
git clone <url-repository>
cd capstone-project
```

---

### 2. Setup Backend (FastAPI + TensorFlow)

```bash
# Buat virtual environment
python -m venv python-env

# Aktifkan virtual environment
# Windows PowerShell:
.\python-env\Scripts\activate

# Linux / macOS:
source python-env/bin/activate

# Install semua dependencies
pip install -r requirements.txt
```

#### Melatih Model (lewati jika file .keras sudah ada)

```bash
# Pastikan dataset sudah ada di folder dataset/
python train.py
```

> ⚠️ **Struktur dataset yang diharapkan:**
> ```
> dataset/
> ├── cabai merah keriting/
> ├── cabai rawit/
> ├── cabai rawit celeng/
> └── cabai rawit putih/
> ```

#### Menjalankan Server API

```bash
uvicorn main:app --reload
```

Server berjalan di: **http://localhost:8000**

---

### 3. Setup Frontend (Next.js)

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi berjalan di: **http://localhost:3000**

---

## 📁 Struktur Proyek

```
capstone-project/
│
├── 📂 dataset/                         # Dataset gambar cabai per kelas
│   ├── cabai merah keriting/
│   ├── cabai rawit/
│   ├── cabai rawit celeng/
│   └── cabai rawit putih/
│
├── 📂 frontend/                        # Aplikasi web Next.js
│   ├── public/
│   │   └── images/
│   │       └── foto-my.jpg             # Foto pengembang
│   └── src/
│       ├── app/
│       │   ├── page.jsx                # Halaman Login / Register
│       │   ├── globals.css             # Global styles & animasi
│       │   ├── layout.jsx              # Root layout
│       │   └── dashboard/
│       │       ├── page.jsx            # Dashboard utama
│       │       ├── layout.jsx          # Dashboard layout + navigasi
│       │       ├── klasifikasi/        # Fitur klasifikasi gambar
│       │       ├── riwayat/            # Riwayat prediksi
│       │       └── tentang/            # Info aplikasi & pengembang
│       └── components/
│           ├── auth/
│           │   ├── AuthRabbitTrack.jsx # Animasi kelinci form login
│           │   └── LoadingScreen.jsx   # Loading screen transisi login
│           └── klasifikasi/
│               └── CardRabbitTrack.jsx # Animasi kelinci card hasil
│
├── 🐍 main.py                          # FastAPI REST API (entry point)
├── 🐍 train.py                         # Script pelatihan model MobileNetV2
├── 🐍 klasifikasi.py                   # Logika klasifikasi & prediksi
├── 🐍 predict_utils.py                 # Utility preprocessing & load model
├── 🐍 database.py                      # SQLite database handler
├── 🐍 gemini_classifier.py             # Integrasi OpenRouter Vision API
├── 🐍 app.py                           # Streamlit app (versi alternatif)
│
├── 📦 model_chili_mobilenetv2.keras    # File model terlatih
├── 📋 requirements.txt                 # Python dependencies
├── 🗃️ cabai_db.sqlite                  # Database SQLite
├── 📊 accuracy_loss_plot.png           # Grafik training accuracy/loss
├── 📊 confusion_matrix.png             # Confusion matrix hasil evaluasi
└── 📄 classification_report.txt       # Laporan evaluasi model
```

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:8000`

### Autentikasi

| Method | Endpoint | Deskripsi |
|:---:|---|---|
| `POST` | `/register` | Daftarkan akun baru |
| `POST` | `/login` | Login dan dapatkan token sesi |
| `POST` | `/logout` | Logout dan hapus sesi aktif |

### Klasifikasi & Riwayat

| Method | Endpoint | Auth | Deskripsi |
|:---:|---|:---:|---|
| `POST` | `/predict` | Opsional | Upload gambar & klasifikasi cabai |
| `GET` | `/history` | ✅ | Ambil semua riwayat prediksi user |
| `DELETE` | `/history/{id}` | ✅ | Hapus satu riwayat berdasarkan ID |
| `DELETE` | `/history` | ✅ | Hapus semua riwayat user |
| `GET` | `/model-info` | ❌ | Info & status model aktif |
| `GET` | `/` | ❌ | Status server & info developer |

### Contoh Request Prediksi

```bash
curl -X POST http://localhost:8000/predict \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@foto_cabai.jpg"
```

### Contoh Response

```json
{
  "status": "success",
  "label": "Cabai Setan",
  "confidence": 0.9823,
  "source": "mobilenetv2",
  "all_probabilities": {
    "Cabai Setan": 0.9823,
    "Cabai Celeng": 0.0102,
    "Cabai Putih": 0.0043,
    "Cabai Merah Keriting": 0.0032
  }
}
```

---

## 🎨 Desain & UI

Aplikasi ini menggunakan tema **Rose Pastel Rabbit Wonderland** yang konsisten di seluruh halaman:

- 🎨 **Palette:** Rose-100 → Pink-50 → White gradient
- 🔲 **Glassmorphism:** Backdrop blur card dengan border rose pastel
- 🐰 **Maskot Kelinci:** Animasi kelinci SVG interaktif di halaman login & klasifikasi
- ✨ **Animasi:** GSAP untuk entry animations, parallax, dan transition
- 📝 **Tipografi:** Space Grotesk + Inter + JetBrains Mono

---

## 👨‍💻 Pengembang

<div align="center">

| | |
|---|---|
| **Nama Lengkap** | Difa Fadhillah |
| **Nama Tambahan** | Anasera Kaluna |
| **NIM** | 2311081010 |
| **Program Studi** | Teknologi Rekayasa Perangkat Lunak |
| **Jurusan** | Teknologi Informasi |
| **Institusi** | Politeknik Negeri Padang |
| **Tahun** | 2026 |

</div>

---

## 📝 Lisensi

Proyek ini dikembangkan untuk keperluan akademik sebagai **Tugas Akhir (Capstone Project)**.
Penggunaan untuk tujuan komersial memerlukan izin dari pengembang.

---

<div align="center">

Made with ❤️ and 🌶️ by **Difa Fadhillah** · Politeknik Negeri Padang · 2026

*"Identifikasi cabai rawit Indonesia dengan teknologi masa kini"*

</div>
