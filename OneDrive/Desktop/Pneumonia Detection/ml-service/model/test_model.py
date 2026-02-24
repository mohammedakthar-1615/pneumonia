# test_model.py

import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

# ======================================
# GET ml-service ROOT DIRECTORY
# ======================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

test_dir = os.path.join(BASE_DIR, 'dataset', 'chest_xray', 'test')

print("Test Directory:", test_dir)

if not os.path.exists(test_dir):
    raise FileNotFoundError(f"Test folder not found at {test_dir}")

# ======================================
# LOAD TRAINED MODEL
# ======================================

model_path = os.path.join(os.path.dirname(__file__), "pneumonia_model_best.h5")

model = tf.keras.models.load_model(model_path)

# ======================================
# TEST DATA GENERATOR
# ======================================

IMG_SIZE = 224
BATCH_SIZE = 32

test_datagen = ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
    test_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

# ======================================
# EVALUATE MODEL
# ======================================

loss, accuracy = model.evaluate(test_generator)

print("\nTest Loss:", loss)
print("Test Accuracy:", accuracy)

# ======================================
# CONFUSION MATRIX & REPORT
# ======================================

predictions = model.predict(test_generator)
y_pred = np.argmax(predictions, axis=1)

print("\nClassification Report:")
print(classification_report(test_generator.classes, y_pred, target_names=test_generator.class_indices.keys()))

print("\nConfusion Matrix:")
print(confusion_matrix(test_generator.classes, y_pred))
