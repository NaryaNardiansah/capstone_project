import os
import shutil

target = os.path.join('dataset', 'cabai rawit')

if os.path.exists(target):
    print(f"Menghapus folder '{target}' beserta seluruh isinya...")
    shutil.rmtree(target)
    print("Folder berhasil dihapus!")
    print("Sekarang dataset Anda kembali menjadi 4 kelas MURNI dari Kaggle.")
else:
    print(f"Folder '{target}' sudah tidak ada.")
