from flask import Flask, request, jsonify
import cv2
import numpy as np
import tensorflow as tf
import os
import base64
import io
from datetime import datetime

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

app = Flask(__name__)

# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'pneumonia_model_final.h5')
MODEL_PATH_2 = os.path.join(BASE_DIR, 'model', 'pneumonia_model_best.h5')
RESULTS_DIR = os.path.join(BASE_DIR, 'results')

# Create results directory if it doesn't exist
os.makedirs(RESULTS_DIR, exist_ok=True)

# Load models once (ensemble)
models = []
try:
    models.append(tf.keras.models.load_model(MODEL_PATH))
except Exception as e:
    print(f"Warning: failed to load {MODEL_PATH}: {e}")

try:
    models.append(tf.keras.models.load_model(MODEL_PATH_2))
except Exception as e:
    print(f"Warning: failed to load {MODEL_PATH_2}: {e}")

if not models:
    raise RuntimeError("No models could be loaded. Check model files.")


# ================================
# UTILITY FUNCTIONS
# ================================

def encode_image_to_base64(image):
    """Convert OpenCV image to base64 string"""
    _, buffer = cv2.imencode('.png', image)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    return image_base64


def save_image(image, filename):
    """Save image to results directory"""
    filepath = os.path.join(RESULTS_DIR, filename)
    cv2.imwrite(filepath, image)
    return filepath


# ================================
# 1️⃣ PREPROCESSING
# ================================

def preprocess_image(image_path):
    """Preprocess image and return model-ready RGB array and visualization artifacts.

    - Model input: RGB, resized to 224x224, scaled to [0,1].
    - Visualization: grayscale equalized image used for segmentation/edges.
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Image not found")

    original = img.copy()

    # Resize for model and visualizations
    img_resized = cv2.resize(img, (224, 224))

    # Convert BGR->RGB for model (DenseNet was trained on RGB ImageNet weights)
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
    img_for_model = img_rgb.astype('float32') / 255.0
    img_for_model = np.expand_dims(img_for_model, axis=0)

    # Create grayscale equalized image for segmentation/edges visualizations
    gray = cv2.cvtColor(img_resized, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    equalized = cv2.equalizeHist(blur)

    # Save preprocessing visualization (as color image)
    preprocessing_vis = cv2.cvtColor(equalized, cv2.COLOR_GRAY2BGR)
    preprocessing_base64 = encode_image_to_base64(preprocessing_vis)

    return img_for_model, equalized, preprocessing_base64, original


# ================================
# 2️⃣ SEGMENTATION
# ================================

def segmentation(gray_image):
    """Segment lungs from X-ray"""
    _, thresh = cv2.threshold(gray_image, 120, 255, cv2.THRESH_BINARY)
    
    contours, _ = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    
    # Create color image for visualization
    seg = cv2.cvtColor(gray_image, cv2.COLOR_GRAY2BGR)
    cv2.drawContours(seg, contours, -1, (0, 255, 0), 2)
    
    segmentation_base64 = encode_image_to_base64(seg)
    return seg, segmentation_base64


# ================================
# 3️⃣ EDGE DETECTION
# ================================

def edge_detection(gray_image):
    """Detect edges using Canny"""
    edges = cv2.Canny(gray_image, 50, 150)
    
    # Convert to color for visualization
    edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    edges_base64 = encode_image_to_base64(edges_color)
    
    return edges, edges_base64


# ================================
# 4️⃣ GRAD-CAM HEATMAP
# ================================

def generate_gradcam(image_array, original_image):
    """Generate Grad-CAM heatmap"""
    try:
        # Use first loaded model for Grad-CAM (ensemble average used for prediction)
        gradcam_model = models[0]

        # Find last convolutional layer
        last_conv = None
        for layer in reversed(gradcam_model.layers):
            if isinstance(layer, tf.keras.layers.Conv2D):
                last_conv = layer.name
                break
        
        if last_conv is None:
            # If no conv layer found, return None
            return None, None
        
        # Create gradient model
        grad_model = tf.keras.models.Model(
            gradcam_model.inputs,
            [gradcam_model.get_layer(last_conv).output, gradcam_model.output]
        )

        with tf.GradientTape() as tape:
            conv_output, preds = grad_model(image_array)

            # Decide target for Grad-CAM: use pneumonia index.
            if preds.ndim == 2 and preds.shape[1] == 1:
                # sigmoid output: treat output as pneumonia probability
                loss = preds[:, 0]
            else:
                # softmax two-class: assume index 1 == PNEUMONIA
                loss = preds[:, 1]

        grads = tape.gradient(loss, conv_output)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_output = conv_output[0]
        
        heatmap = conv_output @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = np.maximum(heatmap, 0) / np.max(heatmap)
        heatmap = cv2.resize(heatmap, (224, 224))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        # Superimpose on original
        original_resized = cv2.resize(original_image, (224, 224))
        superimposed = cv2.addWeighted(original_resized, 0.6, heatmap, 0.4, 0)
        
        heatmap_base64 = encode_image_to_base64(superimposed)
        return superimposed, heatmap_base64
    except Exception as e:
        print(f"Grad-CAM error: {e}")
        return None, None


# ================================
# 5️⃣ PNEUMONIA STAGE DETECTION
# ================================

def detect_pneumonia_stage(pneumonia_prob):
    """Map pneumonia probability to an interpretable stage.

    Note: higher pneumonia_prob => more likely pneumonia (worse).
    """
    if pneumonia_prob >= 0.75:
        stage = "Severe Pneumonia"
        severity = "Severe"
        color = "#ff0000"
    elif pneumonia_prob >= 0.50:
        stage = "Moderate Pneumonia"
        severity = "Moderate"
        color = "#ff6600"
    elif pneumonia_prob >= 0.25:
        stage = "Mild Pneumonia"
        severity = "Mild"
        color = "#ffcc00"
    else:
        stage = "Healthy or Low Probability"
        severity = "Healthy"
        color = "#00cc00"
    
    return {
        "stage": stage,
        "severity": severity,
        "color": color
    }


@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint with diagnostic images"""
    data = request.get_json()
    image_path = data['imagePath']

    try:
        # Step 1: Preprocessing
        img_array, gray_image, preprocessing_base64, original_img = preprocess_image(image_path)

        # Step 2: Segmentation
        seg_img, segmentation_base64 = segmentation(gray_image)

        # Step 3: Edge Detection
        edges_img, edges_base64 = edge_detection(gray_image)

        # Step 4: Grad-CAM Heatmap (use first model)
        heatmap_img, heatmap_base64 = generate_gradcam(img_array, original_img)

        # Step 5: Prediction (ensemble + simple TTA)
        def extract_pneumonia_prob(pred):
            pred = np.array(pred)
            if pred.ndim == 2 and pred.shape[1] == 1:
                return float(pred[0][0])
            elif pred.ndim == 2 and pred.shape[1] == 2:
                # assume index 1 == PNEUMONIA
                return float(pred[0][1])
            else:
                return float(pred.flatten()[-1])

        probs = []
        # original image
        for m in models:
            try:
                p = extract_pneumonia_prob(m.predict(img_array))
            except Exception:
                p = 0.0
            probs.append(p)

        # TTA: horizontally flipped
        img_flipped = np.flip(img_array, axis=2)
        for m in models:
            try:
                p = extract_pneumonia_prob(m.predict(img_flipped))
            except Exception:
                p = 0.0
            probs.append(p)

        # Average probabilities from ensemble + TTA
        pred_prob = float(np.mean(probs))

        # Map final label (threshold 0.5)
        pred_label = 'Pneumonia' if pred_prob >= 0.5 else 'Normal'

        # Confidence score
        confidence = float(pred_prob) * 100.0

        # Detect pneumonia stage
        pneumonia_stage_info = detect_pneumonia_stage(pred_prob)

        # For single-image predictions we return model confidence.
        accuracy = confidence
        precision = None
        f1_score = None

        response = {
            'prediction': pred_label,
            'confidence': round(confidence, 2),
            'accuracy': round(accuracy, 2),
            'precision': precision,
            'f1Score': f1_score,
            'pneumoniaStage': pneumonia_stage_info['stage'],
            'severity': pneumonia_stage_info['severity'],
            'stageSeverity': pneumonia_stage_info,
            # Diagnostic images as base64
            'diagnosticImages': {
                'preprocessing': preprocessing_base64,
                'segmentation': segmentation_base64,
                'edgeDetection': edges_base64,
                'gradcam': heatmap_base64 if heatmap_base64 else None,
            },
            'timestamp': datetime.now().isoformat()
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model': 'loaded'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)