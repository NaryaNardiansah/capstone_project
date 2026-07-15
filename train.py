import json
import os
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
import seaborn as sns

# Pengaturan konstanta
DATASET_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dataset")
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 20
FINE_TUNE_EPOCHS = 8
LEARNING_RATE = 1e-4
FINE_TUNE_LR = 1e-5

# Label mapping dari nama folder ke nama tampilan
FOLDER_TO_LABEL = {
    "cabai merah keriting": "Cabai Merah Keriting",
    "cabai setan": "Cabai Setan",
    "cabai rawit setan": "Cabai Setan",
    "cabai rawit celeng": "Cabai Celeng",
    "cabai celeng": "Cabai Celeng",
    "cabai rawit putih": "Cabai Putih",
    "cabai putih": "Cabai Putih",
}


def load_image_paths_and_labels():
    image_paths = []
    labels = []
    class_names_tf = sorted(
        d for d in os.listdir(DATASET_DIR)
        if os.path.isdir(os.path.join(DATASET_DIR, d))
    )

    for class_idx, folder_name in enumerate(class_names_tf):
        folder_path = os.path.join(DATASET_DIR, folder_name)
        for filename in os.listdir(folder_path):
            if filename.lower().endswith((".jpg", ".jpeg", ".png")):
                image_paths.append(os.path.join(folder_path, filename))
                labels.append(class_idx)

    if not image_paths:
        raise ValueError("Dataset kosong! Harap periksa folder dataset.")

    print(f"Total gambar ditemukan: {len(image_paths)}")
    print("Kelas terdeteksi dari folder:", class_names_tf)
    return image_paths, np.array(labels), class_names_tf


def create_datasets(image_paths, labels):
    train_paths, temp_paths, train_labels, temp_labels = train_test_split(
        image_paths,
        labels,
        test_size=0.30,
        random_state=42,
        stratify=labels,
    )
    val_paths, test_paths, val_labels, test_labels = train_test_split(
        temp_paths,
        temp_labels,
        test_size=0.50,
        random_state=42,
        stratify=temp_labels,
    )

    print(
        f"Pembagian data (stratified): "
        f"Train={len(train_paths)}, Val={len(val_paths)}, Test={len(test_paths)}"
    )

    def load_image(path, label):
        image = tf.io.read_file(path)
        image = tf.image.decode_jpeg(image, channels=3)
        image = tf.image.resize(image, IMAGE_SIZE)
        return image, label

    def augment(image, label):
        image = tf.cast(image, tf.float32)
        image = tf.image.random_flip_left_right(image)
        image = tf.image.random_brightness(image, 0.15)
        image = tf.image.random_contrast(image, 0.85, 1.15)
        image = tf.image.random_saturation(image, 0.85, 1.15)
        image = tf.clip_by_value(image, 0.0, 255.0)
        return image, label

    train_ds = (
        tf.data.Dataset.from_tensor_slices((train_paths, train_labels))
        .map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
        .map(augment, num_parallel_calls=tf.data.AUTOTUNE)
        .shuffle(512)
        .batch(BATCH_SIZE)
        .prefetch(tf.data.AUTOTUNE)
    )
    val_ds = (
        tf.data.Dataset.from_tensor_slices((val_paths, val_labels))
        .map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
        .batch(BATCH_SIZE)
        .prefetch(tf.data.AUTOTUNE)
    )
    test_ds = (
        tf.data.Dataset.from_tensor_slices((test_paths, test_labels))
        .map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
        .batch(BATCH_SIZE)
        .prefetch(tf.data.AUTOTUNE)
    )
    return train_ds, val_ds, test_ds, test_labels


def build_model(num_classes, trainable_base=False):
    print("Membangun arsitektur model MobileNetV2...")

    preprocess_input = tf.keras.layers.Lambda(
        tf.keras.applications.mobilenet_v2.preprocess_input,
        name="preprocess_input",
    )

    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = trainable_base

    inputs = tf.keras.Input(shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3), name="input_image")
    x = preprocess_input(inputs)
    x = base_model(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax", name="output_classification")(x)

    model = tf.keras.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=FINE_TUNE_LR if trainable_base else LEARNING_RATE
        ),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=["accuracy"],
    )
    model.summary()
    return model, base_model


def plot_history(history, filename="accuracy_loss_plot.png"):
    acc = history.history["accuracy"]
    val_acc = history.history["val_accuracy"]
    loss = history.history["loss"]
    val_loss = history.history["val_loss"]
    epochs_range = range(len(acc))

    plt.figure(figsize=(12, 5))

    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label="Training Accuracy", color="#00C9A7", linewidth=2)
    plt.plot(epochs_range, val_acc, label="Validation Accuracy", color="#FF8066", linewidth=2)
    plt.legend(loc="lower right")
    plt.title("Training and Validation Accuracy")
    plt.grid(True, linestyle="--", alpha=0.6)

    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label="Training Loss", color="#00C9A7", linewidth=2)
    plt.plot(epochs_range, val_loss, label="Validation Loss", color="#FF8066", linewidth=2)
    plt.legend(loc="upper right")
    plt.title("Training and Validation Loss")
    plt.grid(True, linestyle="--", alpha=0.6)

    plt.tight_layout()
    plt.savefig(filename, dpi=300)
    print(f"Grafik akurasi & loss disimpan ke '{filename}'")
    plt.close()


def evaluate_model(model, test_ds, test_labels, class_names_tf):
    print("\nMengevaluasi Model pada Data Test...")

    predictions = model.predict(test_ds, verbose=0)
    pred_labels = np.argmax(predictions, axis=1)

    display_classes = [FOLDER_TO_LABEL.get(c, c) for c in class_names_tf]
    report = classification_report(test_labels, pred_labels, target_names=display_classes)
    print("\nClassification Report:")
    print(report)

    with open("classification_report.txt", "w", encoding="utf-8") as f:
        f.write(report)
    print("Laporan evaluasi disimpan ke 'classification_report.txt'")

    cm = confusion_matrix(test_labels, pred_labels)
    plt.figure(figsize=(8, 6))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=display_classes,
        yticklabels=display_classes,
        cbar=False,
    )
    plt.ylabel("Label Sebenarnya")
    plt.xlabel("Label Prediksi")
    plt.title("Confusion Matrix - Klasifikasi Cabai Rawit")
    plt.tight_layout()
    plt.savefig("confusion_matrix.png", dpi=300)
    print("Confusion Matrix disimpan ke 'confusion_matrix.png'")
    plt.close()


def save_class_names(class_names_tf):
    display_classes = [FOLDER_TO_LABEL.get(c, c) for c in class_names_tf]
    with open("class_names.json", "w", encoding="utf-8") as f:
        json.dump(display_classes, f, ensure_ascii=False, indent=2)
    print("Daftar kelas disimpan ke 'class_names.json'")


def main():
    gpus = tf.config.list_physical_devices("GPU")
    if gpus:
        print(f"GPU terdeteksi: {gpus}. Menggunakan akselerasi GPU!")
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
        except RuntimeError as e:
            print(e)
    else:
        print("GPU tidak terdeteksi. Pelatihan akan menggunakan CPU.")

    try:
        image_paths, labels, class_names_tf = load_image_paths_and_labels()
        train_ds, val_ds, test_ds, test_labels = create_datasets(image_paths, labels)
    except Exception as e:
        print(f"Error memuat data: {e}")
        return

    print("\nMenghitung Class Weights untuk penyeimbangan loss...")
    unique_classes = np.unique(labels)
    class_weights = compute_class_weight(
        class_weight="balanced",
        classes=unique_classes,
        y=labels,
    )
    class_weight_dict = dict(zip(unique_classes, class_weights))
    print("Class Weights yang dihitung:")
    for cls_idx, weight in class_weight_dict.items():
        folder_name = class_names_tf[cls_idx]
        display_name = FOLDER_TO_LABEL.get(folder_name, folder_name)
        print(f"  Kelas {cls_idx} ({display_name}): Bobot = {weight:.4f}")

    model, base_model = build_model(num_classes=len(class_names_tf), trainable_base=False)

    print("\nMemulai pelatihan model (tahap 1: backbone dibekukan)...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        class_weight=class_weight_dict,
    )

    print("\nMemulai fine-tuning (tahap 2: unfreeze layer atas MobileNetV2)...")
    base_model.trainable = True
    for layer in base_model.layers[:-40]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=FINE_TUNE_LR),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=["accuracy"],
    )

    fine_tune_history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=FINE_TUNE_EPOCHS,
        class_weight=class_weight_dict,
    )

    for key in history.history:
        history.history[key].extend(fine_tune_history.history[key])

    plot_history(history)
    evaluate_model(model, test_ds, test_labels, class_names_tf)
    save_class_names(class_names_tf)

    model_save_path = "model_chili_mobilenetv2.keras"
    model.save(model_save_path)
    print(f"\nModel berhasil disimpan di: {model_save_path}")


if __name__ == "__main__":
    main()
