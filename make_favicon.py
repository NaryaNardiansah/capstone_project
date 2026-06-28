"""
Script untuk membuat favicon bulat yang fokus ke wajah dari foto-my.jpg
Jalankan: python make_favicon.py
"""
from PIL import Image, ImageDraw, ImageFilter
import math

# Path file
INPUT  = r"D:\capstone project\frontend\public\images\foto-my.jpg"
OUTPUT_PNG  = r"D:\capstone project\frontend\public\images\favicon-circle.png"
OUTPUT_ICO  = r"D:\capstone project\frontend\public\favicon.ico"

img = Image.open(INPUT)
w, h = img.size
print(f"Ukuran asli: {w} x {h}")

# ── Koordinat crop fokus wajah ────────────────────────────────────────────────
# Foto ASLI adalah 3000x4000 (bukan 954x1270!)
# Wajah ada di sekitar x:700-2300, y:600-2100
crop_left   = 850
crop_top    = 1250
crop_right  = 2350
crop_bottom = 2850

face = img.crop((crop_left, crop_top, crop_right, crop_bottom))
face_w, face_h = face.size
print(f"Crop wajah: {face_w} x {face_h}")

# ── Resize ke 512x512 ────────────────────────────────────────────────────────
SIZE = 512
face_sq = face.resize((SIZE, SIZE), Image.LANCZOS)

# ── Buat mask lingkaran ───────────────────────────────────────────────────────
mask = Image.new("L", (SIZE, SIZE), 0)
draw = ImageDraw.Draw(mask)
# Lingkaran penuh dengan sedikit padding
draw.ellipse((4, 4, SIZE - 4, SIZE - 4), fill=255)

# ── Terapkan mask ke gambar ───────────────────────────────────────────────────
result = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
face_rgba = face_sq.convert("RGBA")
result.paste(face_rgba, (0, 0), mask)

# ── Simpan PNG 512x512 (untuk favicon di browser) ────────────────────────────
result.save(OUTPUT_PNG, "PNG")
print(f"[OK] Disimpan: {OUTPUT_PNG}")

# ── Simpan juga sebagai .ico dengan berbagai ukuran ──────────────────────────
ico_img = result.resize((256, 256), Image.LANCZOS)
ico_small = result.resize((64, 64), Image.LANCZOS)
ico_tiny  = result.resize((32, 32), Image.LANCZOS)
ico_img.save(OUTPUT_ICO, format="ICO", sizes=[(256,256),(64,64),(32,32),(16,16)])
print(f"[OK] Disimpan: {OUTPUT_ICO}")

print("\nSelesai! Favicon bulat berhasil dibuat.")
