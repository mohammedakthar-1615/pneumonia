# train_model.py

import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
from model import build_model

# ======================================
# GET ml-service ROOT DIRECTORY
# ======================================

# train_model.py → model → ml-service
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

train_dir = os.path.join(BASE_DIR, 'dataset', 'chest_xray', 'train')
val_dir = os.path.join(BASE_DIR, 'dataset', 'chest_xray', 'val')

print("Training Directory:", train_dir)
print("Validation Directory:", val_dir)

# ======================================
# CHECK DATASET EXISTS
# ======================================

if not os.path.exists(train_dir):
    raise FileNotFoundError(f"Training folder not found at {train_dir}")

if not os.path.exists(val_dir):
    raise FileNotFoundError(f"Validation folder not found at {val_dir}")

# ======================================
# PARAMETERS
# ======================================

IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10

# ======================================
# DATA GENERATORS
# ======================================

train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(
    rescale=1./255
)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# ======================================
# BUILD MODEL
# ======================================

model = build_model()

# ======================================
# CALLBACKS
# ======================================

checkpoint = ModelCheckpoint(
    "pneumonia_model_best.h5",
    monitor='val_accuracy',
    save_best_only=True,
    mode='max',
    verbose=1
)

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=3,
    restore_best_weights=True,
    verbose=1
)

# ======================================
# TRAIN MODEL
# ======================================

history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    callbacks=[checkpoint, early_stop]
)

# Save final model
model.save("pneumonia_model_final.h5")

print("Training Completed Successfully!")
