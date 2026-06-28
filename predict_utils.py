import json
import os
from typing import Optional, Tuple

import numpy as np
import tensorflow as tf
from PIL import Image

IMAGE_SIZE = (224, 224)
DEFAULT_CLASS_NAMES = [
    "Cabai Merah Keriting",
    "Cabai Setan",
    "Cabai Celeng",
    "Cabai Putih",
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


def predict_chili(
    model: tf.keras.Model,
    image: Image.Image,
    class_names: Optional[list[str]] = None,
) -> Tuple[str, float, dict[str, float]]:
    class_names = class_names or load_class_names()

    base = preprocess_image(image)
    flipped = np.flip(base, axis=1)

    batch = np.stack([base, flipped], axis=0)
    probs_batch = model(batch, training=False).numpy()
    probs = probs_batch.mean(axis=0)

    class_idx = int(np.argmax(probs))
    confidence = float(probs[class_idx])
    label = class_names[class_idx]
    all_probs = {class_names[i]: float(probs[i]) for i in range(len(class_names))}
    return label, confidence, all_probs
