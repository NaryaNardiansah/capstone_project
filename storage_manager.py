import os
import io
import uuid
from datetime import datetime, timedelta
from typing import Optional
from PIL import Image
import database

# Direktori target penyimpanan thumbnail WebP terkompresi
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads", "predictions")

# Batas kuota dan retensi untuk mengamankan penyimpanan server
MAX_PHOTOS_PER_USER = 10     # Fitur 3: Maksimal 10 foto per akun pengguna (FIFO)
MAX_PHOTOS_GUEST = 15        # Maksimal 15 foto untuk pengunjung tanpa login
RETENTION_DAYS = 7           # Fitur 4: Foto otomatis kedaluwarsa setelah 7 hari
THUMBNAIL_MAX_SIZE = 380     # Fitur 2: Resolusi thumbnail maksimal 380px
WEBP_QUALITY = 75            # Kualitas kompresi WebP (ukuran berkisar 15 - 30 KB)


def ensure_upload_dir() -> str:
    """Memastikan folder penyimpanan uploads/predictions sudah dibuat."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    return UPLOAD_DIR


def save_compressed_thumbnail(
    contents: bytes,
    original_filename: str,
    user_id: Optional[int] = None
) -> Optional[str]:
    """
    Fitur 2: Mengompres citra menjadi thumbnail WebP berukuran sangat kecil (15 - 30 KB).
    Mengembalikan relative path URL statis (/uploads/predictions/...).
    """
    try:
        ensure_upload_dir()
        
        # Buka gambar dari memori bytes tanpa menyimpan raw file besar ke disk
        image = Image.open(io.BytesIO(contents))
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        elif image.mode != "RGB":
            image = image.convert("RGB")
            
        # Perkecil ukuran citra mempertahankan aspect ratio (LANCZOS)
        image.thumbnail((THUMBNAIL_MAX_SIZE, THUMBNAIL_MAX_SIZE), Image.Resampling.LANCZOS)

        # Buat nama berkas WebP yang aman dan unik
        user_prefix = f"u{user_id}" if user_id else "guest"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_token = uuid.uuid4().hex[:6]
        webp_filename = f"chili_{user_prefix}_{timestamp}_{unique_token}.webp"
        
        target_path = os.path.join(UPLOAD_DIR, webp_filename)
        
        # Simpan ke format WebP berkualitas optimal
        image.save(target_path, format="WEBP", quality=WEBP_QUALITY, method=6)
        
        file_size_kb = os.path.getsize(target_path) / 1024
        print(f"[Storage Manager] Berhasil kompresi WebP: {webp_filename} ({file_size_kb:.1f} KB)")
        
        return f"/uploads/predictions/{webp_filename}"
    except Exception as e:
        print(f"[Storage Manager] Gagal mengompresi gambar WebP: {e}")
        return None


def enforce_user_photo_quota(user_id: Optional[int], max_photos: int = MAX_PHOTOS_PER_USER) -> int:
    """
    Fitur 3 (FIFO): Menjaga kuota penyimpanan per pengguna.
    Jika foto melebihi `max_photos`, foto terlama akan dihapus fisiknya dari disk.
    """
    try:
        limit = max_photos if user_id is not None else MAX_PHOTOS_GUEST
        photos, err = database.get_user_photos(user_id=user_id)
        if err or not photos:
            return 0

        # Jika jumlah foto melebihi kuota
        if len(photos) > limit:
            excess_count = len(photos) - limit
            # Ambil data terlama yang melebihi kuota
            to_remove = photos[:excess_count]
            removed_count = 0

            for item in to_remove:
                rel_url = item.get("image_url")
                if rel_url:
                    filename = os.path.basename(rel_url)
                    file_path = os.path.join(UPLOAD_DIR, filename)
                    if os.path.exists(file_path):
                        try:
                            os.remove(file_path)
                            removed_count += 1
                        except OSError as e:
                            print(f"[Storage Manager] Gagal hapus file fisik {filename}: {e}")

                # Update database: hilangkan image_url agar riwayat teks tetap ada
                database.clear_prediction_image(item["id"])

            print(f"[Storage Manager] FIFO Quota: Dihapus {removed_count} foto terlama untuk user {user_id or 'guest'} (Batas: {limit})")
            return removed_count

        return 0
    except Exception as e:
        print(f"[Storage Manager] Error pada enforce_user_photo_quota: {e}")
        return 0


def cleanup_expired_photos(retention_days: int = RETENTION_DAYS) -> int:
    """
    Fitur 4 (TTL Auto-Cleanup): Menghapus berkas foto yang umurnya melebihi batas waktu (7 hari).
    Data teks statistik tetap tersimpan di database untuk riwayat.
    """
    try:
        ensure_upload_dir()
        expired_records, err = database.get_expired_photos(retention_days=retention_days)
        deleted_count = 0

        if not err and expired_records:
            for item in expired_records:
                rel_url = item.get("image_url")
                if rel_url:
                    filename = os.path.basename(rel_url)
                    file_path = os.path.join(UPLOAD_DIR, filename)
                    if os.path.exists(file_path):
                        try:
                            os.remove(file_path)
                            deleted_count += 1
                        except OSError:
                            pass
                database.clear_prediction_image(item["id"])

        # Pembersihan orphan files di disk yang mungkin tidak tercatat
        cutoff_time = datetime.now() - timedelta(days=retention_days)
        for fname in os.listdir(UPLOAD_DIR):
            if fname.endswith(".webp"):
                fpath = os.path.join(UPLOAD_DIR, fname)
                try:
                    mtime = datetime.fromtimestamp(os.path.getmtime(fpath))
                    if mtime < cutoff_time:
                        os.remove(fpath)
                        deleted_count += 1
                except OSError:
                    pass

        if deleted_count > 0:
            print(f"[Storage Manager] Auto-Cleanup TTL: Dihapus {deleted_count} foto usang (> {retention_days} hari)")

        return deleted_count
    except Exception as e:
        print(f"[Storage Manager] Error pada cleanup_expired_photos: {e}")
        return 0


def process_prediction_photo(
    contents: bytes,
    original_filename: str,
    user_id: Optional[int] = None
) -> Optional[str]:
    """
    Pipeline Utama Penyimpanan Pintar:
    1. Jalankan pembersihan foto kadaluarsa (> 7 hari).
    2. Kompresi gambar ke thumbnail WebP ringan (20 - 30 KB).
    3. Terapkan kuota FIFO (maks 10 foto per akun).
    """
    # 1. Auto cleanup background
    cleanup_expired_photos(retention_days=RETENTION_DAYS)

    # 2. Simpan WebP terkompresi
    image_url = save_compressed_thumbnail(contents, original_filename, user_id=user_id)

    # 3. Kunci kuota pengguna
    enforce_user_photo_quota(user_id=user_id, max_photos=MAX_PHOTOS_PER_USER)

    return image_url
