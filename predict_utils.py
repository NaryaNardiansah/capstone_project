import json
import os
from typing import Optional, Tuple

import numpy as np
import tensorflow as tf
from PIL import Image

IMAGE_SIZE = (224, 224)
DEFAULT_CLASS_NAMES = [
    "Cabai Rawit Merah",
    "Cabai Rawit Hijau",
    "Cabai Merah Keriting",
    "Cabai Merah Besar",
    "Cabai Hijau Besar",
    "Cabai Hijau Keriting",
    "Paprika",
]
CLASS_NAMES_FILE = "class_names.json"
MODEL_PATH = "model_chili_mobilenetv2.keras"


def load_class_names() -> list[str]:
    if os.path.exists(CLASS_NAMES_FILE):
        with open(CLASS_NAMES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return DEFAULT_CLASS_NAMES.copy()


def load_model(model_path: str = MODEL_PATH) -> tf.keras.Model:
    custom_objects = {
        "preprocess_input": tf.keras.applications.mobilenet_v2.preprocess_input
    }
    full_model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)

    # Lewati augmentasi acak dan dropout agar inferensi deterministik.
    inputs = full_model.input
    x = inputs
    for layer in full_model.layers[1:]:
        if layer.name in {"data_augmentation", "dropout"}:
            continue
        x = layer(x)
    return tf.keras.Model(inputs=inputs, outputs=x, name="inference_model")


def _center_crop_square(image: Image.Image) -> Image.Image:
    width, height = image.size
    side = min(width, height)
    left = (width - side) // 2
    top = (height - side) // 2
    return image.crop((left, top, left + side, top + side))


def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.convert("RGB")
    image = _center_crop_square(image)
    image = image.resize(IMAGE_SIZE, Image.Resampling.LANCZOS)
    return np.array(image, dtype=np.float32)


def check_is_chili(image: Image.Image) -> Tuple[bool, str]:
    """
    Memeriksa apakah citra memiliki karakteristik warna & visual alami cabai
    atau merupakan citra di luar domain cabai (misal wajah manusia, logo grafis biru, objek sintetis).
    """
    # 1. Deteksi Wajah / Potret Manusia menggunakan Haar Cascade OpenCV
    try:
        import cv2
        cv_img = cv2.cvtColor(np.array(image.convert("RGB")), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
        if len(faces) > 0:
            return False, "Terdeteksi wajah atau profil manusia pada gambar, bukan cabai."
    except Exception:
        pass

    # 2. Analisis Spektrum Warna
    img_rgb = image.convert("RGB")
    img_hsv = img_rgb.convert("HSV")
    np_hsv = np.array(img_hsv)
    
    h = np_hsv[:, :, 0]
    s = np_hsv[:, :, 1]
    v = np_hsv[:, :, 2]
    
    # Abaikan piksel latar belakang (putih netral atau hitam pekat)
    foreground_mask = (v >= 30) & ~((v > 220) & (s < 40))
    total_fg_pixels = int(np.sum(foreground_mask))
    
    if total_fg_pixels < 60:
        return False, "Citra terlalu minim objek visual."
        
    fg_h_deg = h[foreground_mask].astype(float) * (360.0 / 255.0)
    fg_s = s[foreground_mask]
    
    # Spektrum warna biru / cyan / ungu (175° - 325°) dengan saturasi signifikan
    # Cabai alami TIDAK PERNAH memiliki pigmen biru/cyan/ungu
    blue_cyan_mask = (fg_h_deg >= 175) & (fg_h_deg <= 325) & (fg_s > 45)
    blue_ratio = float(np.sum(blue_cyan_mask)) / total_fg_pixels
    
    # Spektrum warna cabai alami:
    # Merah / Merah Tua: >= 340° atau <= 20°
    # Oranye / Kuning: 20° - 65°
    # Hijau (Cabai Celeng, batang/daun): 65° - 165°
    chili_colors_mask = (
        ((fg_h_deg >= 340) | (fg_h_deg <= 20) | ((fg_h_deg >= 20) & (fg_h_deg <= 165)))
        & (fg_s > 25)
    )
    chili_ratio = float(np.sum(chili_colors_mask)) / total_fg_pixels
    
    if blue_ratio > 0.30:
        return False, f"Terdeteksi warna dominan biru sintetis ({blue_ratio*100:.1f}%), bukan cabai."
        
    if chili_ratio < 0.08 and total_fg_pixels > 400:
        return False, "Objek tidak memiliki spektrum warna cabai alami."
        
    return True, "Karakteristik citra sesuai."


def predict_chili(
    model: tf.keras.Model,
    image: Image.Image,
    class_names: Optional[list[str]] = None,
) -> Tuple[str, float, dict[str, float]]:
    class_names = class_names or load_class_names()

    # Validasi awal domain citra cabai secara cerdas (deteksi wajah, logo sintetis, dll.)
    is_chili, reason = check_is_chili(image)
    if not is_chili:
        all_probs = {name: 0.01 for name in class_names}
        all_probs["Bukan Cabai"] = 0.98
        return "Bukan Cabai", 0.98, all_probs

    base = preprocess_image(image)
    flipped = np.flip(base, axis=1)

    batch = np.stack([base, flipped], axis=0)
    probs_batch = model(batch, training=False).numpy()
    probs = probs_batch.mean(axis=0)

    class_idx = int(np.argmax(probs))
    confidence = float(probs[class_idx])
    label = class_names[class_idx]
    all_probs = {class_names[i]: float(probs[i]) for i in range(len(class_names))}

    # Ambang batas keyakinan (Out-of-Distribution Detection)
    # Jika tingkat keyakinan < 65%, artinya model ragu-ragu dan citra tidak menyerupai varietas cabai
    if confidence < 0.65:
        all_probs["Bukan Cabai"] = 0.95
        return "Bukan Cabai", 0.95, all_probs

    return label, confidence, all_probs
