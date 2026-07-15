import os
import shutil

src = os.path.join('dataset', 'cabai rawit setan')
dst = os.path.join('dataset', 'cabai rawit')

if os.path.exists(src):
    # Pindahkan sisa file dengan menimpa (overwrite) atau menghapus duplikat
    for f in os.listdir(src):
        src_path = os.path.join(src, f)
        dst_path = os.path.join(dst, f)
        if os.path.exists(dst_path):
            os.remove(src_path) # Hapus karena sudah ada duplikatnya di tujuan
        else:
            shutil.move(src_path, dst_path)
    
    # Hapus folder
    os.rmdir(src)
    print("Folder sisa 'cabai rawit setan' berhasil dihapus!")
else:
    print("Folder 'cabai rawit setan' sudah bersih.")
