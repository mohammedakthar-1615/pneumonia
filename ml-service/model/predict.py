import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import cv2
import numpy as np
import tensorflow as tf

if not os.path.exists("results"):
    os.makedirs("results")
# ================================
# Paths
# ================================

INPUT_IMAGE = "../dataset/chest_xray/train/NORMAL/IM-0129-0001.jpeg"

PREPROCESS_PATH = "results/preprocessed_image.png"
SEGMENT_PATH = "results/segmented_image.png"
EDGE_PATH = "results/edge_image.png"
HEATMAP_PATH = "results/heatmap_image.png"

MODEL_PATH = "pneumonia_model_final.h5"

os.makedirs("results", exist_ok=True)


# ================================
# 1️⃣ PREPROCESSING
# ================================

def preprocessing():

    img = cv2.imread(INPUT_IMAGE)

    if img is None:
        print("ERROR: Image not found ->", INPUT_IMAGE)
        exit()

    img = cv2.resize(img, (224,224))

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blur = cv2.GaussianBlur(gray,(5,5),0)

    equalized = cv2.equalizeHist(blur)

    cv2.imwrite(PREPROCESS_PATH,equalized)

    print("Preprocessing Done")
    print("Image:", os.path.abspath(PREPROCESS_PATH))

    return equalized


# ================================
# 2️⃣ SEGMENTATION
# ================================

def segmentation(image):

    _,thresh = cv2.threshold(image,120,255,cv2.THRESH_BINARY)

    contours,_ = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    seg = cv2.cvtColor(image,cv2.COLOR_GRAY2BGR)

    cv2.drawContours(seg,contours,-1,(0,0,255),2)

    cv2.imwrite(SEGMENT_PATH,seg)

    print("Segmentation Done")
    print("Image:", os.path.abspath(SEGMENT_PATH))


# ================================
# 3️⃣ EDGE DETECTION
# ================================

def edge_detection(image):

    edges = cv2.Canny(image,50,150)

    cv2.imwrite(EDGE_PATH,edges)

    print("Edge Detection Done")
    print("Image:", os.path.abspath(EDGE_PATH))


# ================================
# 4️⃣ AI HEATMAP (Grad-CAM)
# ================================

def ai_heatmap():

    model = tf.keras.models.load_model(MODEL_PATH)

    img = cv2.imread(INPUT_IMAGE)
    img = cv2.resize(img,(224,224))

    img_array = np.expand_dims(img/255.0,axis=0)

    last_conv = None
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            last_conv = layer.name
            break

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv).output, model.output]
    )

    with tf.GradientTape() as tape:

        conv_output,preds = grad_model(img_array)

        loss = preds[:,0]

    grads = tape.gradient(loss,conv_output)

    pooled_grads = tf.reduce_mean(grads,axis=(0,1,2))

    conv_output = conv_output[0]

    heatmap = conv_output @ pooled_grads[...,tf.newaxis]

    heatmap = tf.squeeze(heatmap)

    heatmap = np.maximum(heatmap,0)/np.max(heatmap)

    heatmap = cv2.resize(heatmap,(224,224))

    heatmap = np.uint8(255*heatmap)

    heatmap = cv2.applyColorMap(heatmap,cv2.COLORMAP_JET)

    superimposed = cv2.addWeighted(img,0.6,heatmap,0.4,0)

    cv2.imwrite(HEATMAP_PATH,superimposed)

    print("AI Heatmap Generated")
    print("Image:", os.path.abspath(HEATMAP_PATH))


# ================================
# 5️⃣ PREDICTION + STAGE
# ================================

def prediction():

    model = tf.keras.models.load_model(MODEL_PATH)

    img = cv2.imread(INPUT_IMAGE)
    img = cv2.resize(img,(224,224))
    img = img/255.0
    img = np.expand_dims(img,axis=0)

    pred = model.predict(img)

    probability = float(pred[0][0])

    # Reverse probability if model trained with Normal=1
    pneumonia_prob = 1 - probability

    accuracy = round(pneumonia_prob * 100,2)

    # Disease detection
    if pneumonia_prob < 0.5:
        disease = "NORMAL"
    else:
        disease = "PNEUMONIA"

    # Stage detection
    if pneumonia_prob < 0.25:
        stage = "Healthy Lung"
    elif pneumonia_prob < 0.50:
        stage = "Congestion Stage"
    elif pneumonia_prob < 0.75:
        stage = "Red Hepatization Stage"
    else:
        stage = "Grey Hepatization Stage"

    print("\n==============================")
    print(" FINAL AI DIAGNOSIS RESULT")
    print("==============================")

    print("Disease Detected :", disease)
    print("Prediction Score :", pneumonia_prob)
    print("Model Confidence :", accuracy,"%")
    print("Pneumonia Stage  :", stage)

    print("\nGenerated Result Images:")
    print("Preprocessed :", os.path.abspath(PREPROCESS_PATH))
    print("Segmented    :", os.path.abspath(SEGMENT_PATH))
    print("Edges        :", os.path.abspath(EDGE_PATH))
    print("AI Heatmap   :", os.path.abspath(HEATMAP_PATH))

    print("Pipeline Started...")

if __name__ == "__main__":

    img = preprocessing()

    segmentation(img)

    edge_detection(img)

    ai_heatmap()

    prediction()