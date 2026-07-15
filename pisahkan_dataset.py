import os
import shutil

src = os.path.join('dataset', 'cabai rawit')
dst = os.path.join('dataset', 'cabai setan')

if not os.path.exists(dst):
    os.makedirs(dst)

files_moved = 0
if os.path.exists(src):
    for f in os.listdir(src):
        # Memisahkan kembali gambar-gambar Kaggle yang tadi tergabung
        if f.startswith(('Grade_', 'IMG_', 'busuk')):
            src_path = os.path.join(src, f)
            dst_path = os.path.join(dst, f)
            shutil.move(src_path, dst_path)
            files_moved += 1

print(f"Berhasil memisahkan {files_moved} gambar ke folder 'cabai setan'.")
print("Sekarang ada 5 folder (5 kelas) di dalam dataset!")
