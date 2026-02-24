import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing import image

# ======================================
# PATH SETTINGS
# ======================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

model_path = os.path.join(BASE_DIR, "pneumonia_model_final.h5")

test_image_path = os.path.join(
    PROJECT_ROOT,
    "dataset",
    "chest_xray",
    "test",
    "NORMAL",
    "NORMAL2-IM-0199-0001.jpeg"
)

IMG_SIZE = 224  # ⚠️ Change to 150 if training used 150

# ======================================
# LOAD MODEL
# ======================================

if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model not found at:\n{model_path}")

print("Loading trained model...")
model = tf.keras.models.load_model(model_path)
print("Model loaded successfully!\n")

# ======================================
# PREDICTION FUNCTION
# ======================================

def predict_image(img_path):

    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image not found at:\n{img_path}")

    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array, verbose=0)

    # 🔥 Handle BOTH binary and categorical models
    if predictions.shape[1] == 1:
        # Binary sigmoid output
        prob = predictions[0][0]

        if prob > 0.5:
            label = "PNEUMONIA"
            confidence = prob * 100
        else:
            label = "NORMAL"
            confidence = (1 - prob) * 100

    else:
        # Softmax categorical output
        class_index = np.argmax(predictions[0])
        confidence = predictions[0][class_index] * 100

        class_labels = ["NORMAL", "PNEUMONIA"]  # adjust if reversed
        label = class_labels[class_index]

    # Stage mapping (only if pneumonia)
    if label == "PNEUMONIA":
        if confidence < 65:
            stage = "Congestion"
        elif confidence < 75:
            stage = "Resolution"
        elif confidence < 85:
            stage = "Grey Hepatization"
        else:
            stage = "Red Hepatization"
    else:
        stage = "No Stage"

    return label, stage, round(confidence, 2)

# ======================================
# MAIN
# ======================================

if __name__ == "__main__":

    label, stage, confidence = predict_image(test_image_path)

    print("=================================")
    print("        PREDICTION RESULT        ")
    print("=================================")
    print(f"Image Path : {test_image_path}")
    print(f"Prediction : {label}")
    print(f"Stage      : {stage}")
    print(f"Confidence : {confidence}%")
    print("=================================")
