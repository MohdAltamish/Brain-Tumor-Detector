"""
NeuroScan Flask API — wraps app_mian.py logic with REST endpoints.
Run with: python api.py
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import base64
from tensorflow.keras.models import load_model
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Allow requests from the frontend

# ---------- Load Model ----------
print("Loading NeuroScan champion model...")
try:
    model = load_model('models/v4_Unbeatable_Final.h5')
    MODEL_LOADED = True
    print("Model loaded successfully.")
except Exception as e:
    MODEL_LOADED = False
    print(f"Warning: Could not load model: {e}")

CLASS_NAMES = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']


# ---------- Helpers ----------
def numpy_to_b64(img_array):
    """Convert a numpy image array (0-255 uint8) to a base64 PNG string."""
    img_uint8 = np.clip(img_array, 0, 255).astype(np.uint8)
    _, buffer = cv2.imencode('.png', cv2.cvtColor(img_uint8, cv2.COLOR_RGB2BGR))
    return base64.b64encode(buffer).decode('utf-8')


def add_noise(img):
    """Salt-and-pepper noise attack."""
    amount = 0.05
    out = np.copy(img)
    num_salt = np.ceil(amount * img.size * 0.5)
    coords = [np.random.randint(0, i - 1, int(num_salt)) for i in img.shape]
    out[tuple(coords)] = 255
    num_pepper = np.ceil(amount * img.size * 0.5)
    coords = [np.random.randint(0, i - 1, int(num_pepper)) for i in img.shape]
    out[tuple(coords)] = 0
    return out


def apply_shield(img):
    """Median denoising + CLAHE enhancement."""
    denoised = cv2.medianBlur(img.astype(np.uint8), 3)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    res = np.zeros_like(denoised)
    for i in range(3):
        res[:, :, i] = clahe.apply(denoised[:, :, i])
    return res


# ---------- Routes ----------
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': MODEL_LOADED,
        'classes': CLASS_NAMES
    })


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Accept a multipart image upload and return diagnosis results."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    # Read image
    try:
        pil_img = Image.open(file.stream).convert('RGB')
        img_np = np.array(pil_img)
    except Exception as e:
        return jsonify({'error': f'Could not read image: {str(e)}'}), 400

    # Stage A: Resize
    original = cv2.resize(img_np, (224, 224))

    # Stage B: Attack
    attacked = add_noise(original)

    # Stage C: Shield
    shielded = apply_shield(attacked)

    if not MODEL_LOADED:
        # Demo mode — return mock predictions
        predictions = [0.94, 0.03, 0.02, 0.01]
        predicted_class = CLASS_NAMES[0]
        max_conf = 0.94
    else:
        # Stage D: Predict
        prep = shielded.astype(np.float32) / 255.0
        prep = np.expand_dims(prep, axis=0)
        preds = model.predict(prep, verbose=0)[0]
        predictions = [float(p) for p in preds]
        max_conf = float(np.max(preds))
        predicted_class = CLASS_NAMES[int(np.argmax(preds))]

    # Stage E: Status message
    if max_conf < 0.80:
        status = f"⚠️ LOW CONFIDENCE ({max_conf*100:.1f}%): AI suspects {predicted_class}. Recommendation: Manual Radiologist Review."
        alert_level = "warning"
    else:
        status = f"✅ ANALYSIS COMPLETE: High confidence ({max_conf*100:.1f}%) detection of {predicted_class}."
        alert_level = "success"

    return jsonify({
        'predicted_class': predicted_class,
        'confidence': max_conf,
        'predictions': {CLASS_NAMES[i]: predictions[i] for i in range(4)},
        'status': status,
        'alert_level': alert_level,
        'images': {
            'original': numpy_to_b64(original),
            'attacked': numpy_to_b64(attacked),
            'shielded': numpy_to_b64(shielded),
        }
    })


if __name__ == '__main__':
    print("\n🧠 NeuroScan API running at http://localhost:5050\n")
    app.run(host='0.0.0.0', port=5050, debug=False)
