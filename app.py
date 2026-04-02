import streamlit as st
import torch
import numpy as np
from PIL import Image
import cv2
import zipfile
import pandas as pd
import io
import plotly.express as px


from apex_master import (
    HybridChimeraAI, 
    OmniChaosInjector, 
    VisualHealer, 
    FourierHealer, 
    TTAPipeline
)

st.set_page_config(page_title="Apex Ultimate | Command Center", layout="wide")
CLASSES = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']

def get_heatmap(model, image_pil, tta_pipe):
    #Generates an ultra-resilient CAM 
    model.eval()
    with torch.no_grad():
        img_tensor = tta_pipe.base_transform(image_pil).unsqueeze(0).to(tta_pipe.device)
        features = model.cnn_stem(img_tensor).squeeze(0).cpu().numpy()
        #where AI notice sharm changes
        f_mean = np.maximum(np.mean(features, axis=0), 0)
        f_var = np.var(features, axis=0)
        heatmap = f_mean * f_var
        
        heatmap = cv2.resize(heatmap, (224, 224), interpolation=cv2.INTER_CUBIC)
        
        #restrict map to brain
        x, y = np.meshgrid(np.linspace(-1, 1, 224), np.linspace(-1, 1, 224))
        distance = np.sqrt(x*x + y*y)
        spatial_mask = np.exp(-( (distance)**2 / (2.0 * 0.38**2) )) 
        
        heatmap = heatmap * spatial_mask
        
        heatmap = heatmap - np.min(heatmap)
        if np.max(heatmap) > 0: 
            heatmap /= np.max(heatmap)
            
        # clear visual proof
        heatmap = np.power(heatmap, 2.5) 
        heatmap = cv2.GaussianBlur(heatmap, (45, 45), 0)
        
        if np.max(heatmap) > 0:
            heatmap /= np.max(heatmap)
            
        heatmap_color = cv2.applyColorMap(np.uint8(255 * heatmap), cv2.COLORMAP_JET)
        orig_bgr = cv2.cvtColor(np.array(image_pil.resize((224, 224))), cv2.COLOR_RGB2BGR)
        
        alpha = np.clip(heatmap * 1.5, 0, 0.6)[..., np.newaxis]
        superimposed = (orig_bgr * (1.0 - alpha) + heatmap_color * alpha).astype(np.uint8)
        
        return cv2.cvtColor(superimposed, cv2.COLOR_BGR2RGB)

def render_confidence(probs):
    #Renders clean text-based confidence scores
    for i, cls in enumerate(CLASSES):
        st.write(f"**{cls}:** {float(probs[i])*100:.1f}%")

#system initialisation 
@st.cache_resource
def load_system():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = HybridChimeraAI(num_classes=4).to(device)
    
    try:
        model.load_state_dict(torch.load('apex_master_weights.pth', map_location=device, weights_only=True))
    except Exception as e:
        st.error(f"Weights missing: {e}. Ensure 'apex_master_weights.pth' is in the root folder.")
        
    return model, device, OmniChaosInjector(), FourierHealer(), VisualHealer()

model, device, chaos_engine, fourier_healer, visual_healer = load_system()
tta_pipeline = TTAPipeline(model, device)


# 🧭 NAVIGATION
st.sidebar.title("Apex Command Center")
page = st.sidebar.radio("Modules", ["Diagnostic Pipeline", "Chaos Sandbox", "Batch Auditor"])


#  PAGE 1: DIAGNOSTIC PIPELINE 
if page == "Diagnostic Pipeline":
    st.title("Diagnostic Pipeline")
    uploaded_file = st.file_uploader("Upload MRI Scan", type=["jpg", "png", "jpeg"], key="diag_uploader")
    
    if uploaded_file:
        pil_img = Image.open(uploaded_file).convert('RGB')
        img_np = np.array(pil_img)
        
        st.subheader("1. Real-World Constraints (The Chaos Engine)")
        st.write("Displaying the baseline scan alongside the extreme noise conditions our AI was trained to survive.")
        
        corrupted_5l = chaos_engine.inject_5_layer_visual(img_np.copy())
        corrupted_phys = chaos_engine.inject_2_layer_physics(img_np.copy())
        
        c1, c2, c3 = st.columns(3)
        with c1: st.image(pil_img, caption="1. Clean MRI", use_container_width=True)
        with c2: st.image(corrupted_5l, caption="2. Visual Traps (Shadow/Warp)", use_container_width=True)
        with c3: st.image(corrupted_phys, caption="3. Hardware Traps (K-Space Stripes)", use_container_width=True)
        
        st.divider()
        
        # FINAL DIAGNOSIS
        st.subheader("2. Apex AI Diagnosis & Explainability")
        
        c4, c5 = st.columns(2)
        with c4: 
            # Show the Grad-CAM Heatmap
            heatmap_img = get_heatmap(model, pil_img, tta_pipeline)
            st.image(heatmap_img, caption="Grad-CAM Heatmap (Focus Area)", use_container_width=True)
            
        with c5:
            # Show the final safe prediction
            st.write("### Final Prediction")
            res_clean = tta_pipeline.predict(pil_img)
            predicted_class = CLASSES[np.argmax(res_clean)]
            
            st.success(f"**Diagnosis:** {predicted_class}")
            render_confidence(res_clean)




#  PAGE 2: CHAOS SANDBOX
elif page == "Chaos Sandbox":
    st.title("Chaos Sandbox")
    uploaded_file = st.file_uploader("Upload Target MRI", type=["jpg", "png", "jpeg"], key="chaos_uploader")
    
    if uploaded_file:
        img_np = np.array(Image.open(uploaded_file).convert('RGB'))
        
        v_stress = st.sidebar.checkbox("Apply Visual Stress (5-Layer)")
        p_stress = st.sidebar.checkbox("Apply Physics Stress (K-Space)")
        
        working = img_np.copy()
        if v_stress: working = chaos_engine.inject_5_layer_visual(working)
        if p_stress: working = chaos_engine.inject_2_layer_physics(working)
        
        processed_pil = Image.fromarray(working)
        
        c1, c2 = st.columns(2)
        with c1: st.image(processed_pil, caption="Synthesized Scan", use_container_width=True)
        with c2:
            probs = tta_pipeline.predict(processed_pil)
            st.image(get_heatmap(model, processed_pil, tta_pipeline), caption="AI Focal Point", use_container_width=True)
            st.write(f"**Predicted:** {CLASSES[np.argmax(probs)]} ({np.max(probs)*100:.1f}%)")

# PAGE 3: BATCH AUDITOR
elif page == "Batch Auditor":
    st.title("Batch Auditor")
    uploaded_zip = st.file_uploader("Upload ZIP File containing folders of images", type=["zip"], key="batch_uploader")
    
    if uploaded_zip:
        results = []
        class_map = {'glioma': 'Glioma', 'meningioma': 'Meningioma', 'notumor': 'No Tumor', 'no_tumor': 'No Tumor', 'pituitary': 'Pituitary'}
        
        with zipfile.ZipFile(uploaded_zip, 'r') as z:
            files = [f for f in z.namelist() if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            if not files: 
                st.error("No valid images found in the ZIP.")
            else:
                p_bar = st.progress(0)
                for i, f_name in enumerate(files):
                    parts = f_name.split('/')
                    true_class = class_map.get(parts[-2].lower() if len(parts) > 1 else "unknown", "Unknown")
                    with z.open(f_name) as f:
                        probs = tta_pipeline.predict(Image.open(io.BytesIO(f.read())).convert('RGB'))
                        results.append({
                            "File": f_name.split('/')[-1], 
                            "True Class": true_class, 
                            "Prediction": CLASSES[np.argmax(probs)], 
                            "Confidence (%)": round(np.max(probs)*100, 2)
                        })
                    p_bar.progress((i+1)/len(files))
            
                df = pd.DataFrame(results)
                
                if "Unknown" not in df['True Class'].values:
                    acc = (df['True Class'] == df['Prediction']).mean() * 100
                    st.success(f"**Overall Accuracy:** {acc:.2f}%")
                    
                    cm = pd.crosstab(df['True Class'], df['Prediction']).reindex(index=CLASSES, columns=CLASSES, fill_value=0) #cross table
                    fig = px.imshow(cm, text_auto=True, color_continuous_scale='Blues', title="Confusion Matrix")  #blue grid
                    st.plotly_chart(fig)
                
                st.dataframe(df, use_container_width=True)