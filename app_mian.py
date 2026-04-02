import gradio as gr
import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.models import load_model

# 1. Load the Champion Model
model = load_model('models/v4_Unbeatable_Final.h5')
class_names = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']

# 2. Helper: The Noise Attack (For Demonstration)
def add_noise(img):
    amount = 0.05
    out = np.copy(img)
    # Salt
    num_salt = np.ceil(amount * img.size * 0.5)
    coords = [np.random.randint(0, i - 1, int(num_salt)) for i in img.shape]
    out[tuple(coords)] = 255
    # Pepper
    num_pepper = np.ceil(amount * img.size * 0.5)
    coords = [np.random.randint(0, i - 1, int(num_pepper)) for i in img.shape]
    out[tuple(coords)] = 0
    return out

# 3. Helper: The Shield (Median + CLAHE)
def apply_shield_logic(img):
    # Median Filter to remove S&P noise
    denoised = cv2.medianBlur(img.astype(np.uint8), 3)
    # CLAHE to enhance features
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    res = np.zeros_like(denoised)
    for i in range(3):
        res[:,:,i] = clahe.apply(denoised[:,:,i])
    return res

# 4. Main Diagnostic Pipeline
def process_everything(input_img):
    if input_img is None:
        return None, None, {}, "⚠️ Please upload an MRI scan."

    # Stage A: Resize for Model
    original = cv2.resize(input_img, (224, 224))
    
    # Stage B: The Attack
    attacked = add_noise(original)
    
    # Stage C: The Shield
    shielded = apply_shield_logic(attacked)
    
    # Stage D: AI Prediction
    prep_for_ai = shielded.astype(np.float32) / 255.0
    prep_for_ai = np.expand_dims(prep_for_ai, axis=0)
    
    preds = model.predict(prep_for_ai, verbose=0)[0]
    max_conf = np.max(preds)
    predicted_class = class_names[np.argmax(preds)]
    
    # Format labels for Gradio
    result_dict = {class_names[i]: float(preds[i]) for i in range(4)}
    
    # Stage E: Professional Status Message
    if max_conf < 0.80:
        status = f"⚠️ LOW CONFIDENCE ({max_conf*100:.1f}%): AI suspects {predicted_class}. Recommendation: Manual Radiologist Review."
    else:
        status = f"✅ ANALYSIS COMPLETE: High confidence ({max_conf*100:.1f}%) detection of {predicted_class}."

    return attacked, shielded, result_dict, status

# 5. The Professional UI Layout
with gr.Blocks(title="NeuroScan AI") as demo:
    gr.HTML("<h1 style='text-align: center; color: #1f2937;'>NeuroScan: Resilient Diagnostic Workstation</h1>")
    gr.HTML("<p style='text-align: center;'>Semester 6 Minor Project | Adversarial Defense & Robust Classification</p>")
    
    with gr.Row():
        with gr.Column(scale=1):
            mri_input = gr.Image(label="Upload Patient MRI", type="numpy")
            run_btn = gr.Button("PROCEED TO DIAGNOSIS", variant="primary")
            status_box = gr.Textbox(label="System Status / Clinical Alert")
        
        with gr.Column(scale=2):
            with gr.Row():
                noise_output = gr.Image(label="Simulated Signal Interference (Attack)")
                recovery_output = gr.Image(label="Shielded Diagnostic View (Recovery)")
            
            final_label = gr.Label(label="Classification Confidence", num_top_classes=4)

    # Click Event
    run_btn.click(
        fn=process_everything,
        inputs=mri_input,
        outputs=[noise_output, recovery_output, final_label, status_box]
    )

# 6. Launch App
if __name__ == "__main__":
    demo.launch()