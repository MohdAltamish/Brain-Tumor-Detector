# 🧠 NeuroScan: Resilient Brain Tumor Diagnostic Workstation

> **An adversarially robust AI system for MRI-based brain tumor classification, featuring a custom hybrid architecture, physics-based attack simulation, and intelligent signal recovery.**

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://tensorflow.org)
[![Streamlit](https://img.shields.io/badge/UI-Streamlit-ff4b4b.svg)](https://streamlit.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Overview

NeuroScan is a health-tech AI prototype that classifies brain MRI scans into four categories — **Glioma, Meningioma, Pituitary Tumor, and No Tumor** — while remaining robust against real-world signal interference and adversarial noise.

Most medical AI models fail silently when MRI scans are degraded by hardware noise, motion artifacts, or transmission errors. NeuroScan addresses this by training and deploying an end-to-end **attack-aware, defense-integrated diagnostic pipeline**.

The system was developed through 5 iterative experiments, evolving from a simple MobileNetV2 baseline to a custom **HybridChimeraAI** architecture combining CNNs, Transformers, and a Mixture-of-Experts (MoE) classifier — achieving **96% shielded recovery accuracy** on the final benchmark.

---

## 🏗️ Tech Stack & Tools

| Layer | Technology |
|---|---|
| Core Architecture | PyTorch (custom `HybridChimeraAI`) |
| Transfer Learning Baseline | TensorFlow / Keras (MobileNetV2, Xception) |
| Attack Simulation | NumPy, SciPy, OpenCV |
| Defense / Pre-processing | OpenCV (CLAHE, Fourier filtering, NL-Means denoising) |
| UI — Streamlit App | Streamlit, Plotly, Pandas |
| UI — Gradio App | Gradio |
| Explainability | Custom CAM (Class Activation Mapping) via CNN stem features |
| Dataset | [Brain Tumor MRI Dataset — Kaggle](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset) |

---

## ✨ Features

### 🔬 Core AI Capabilities
- **4-class MRI classification**: Glioma, Meningioma, Pituitary, No Tumor
- **HybridChimeraAI**: Custom PyTorch architecture combining a 3-layer CNN stem, a Transformer encoder (8-head self-attention), and a Mixture-of-Experts (MoE) classifier with 4 expert sub-networks and a learned gating function
- **Test-Time Augmentation (TTA)**: Voting ensemble across clean + rotated + zoomed views for more stable inference

### ⚔️ OmniChaos Attack Engine (7-Layer Adversarial Simulation)
- **5-Layer Visual Attack**: Elastic pixel warping (Gaussian displacement fields), edge-darkening shadow overlay, and Gaussian noise injection
- **2-Layer Physics / K-Space Attack**: Fourier-domain corruption mimicking MRI hardware artifacts — simulates stripe noise caused by k-space frequency spikes, a real failure mode in clinical scanners

### 🛡️ Intelligent Signal Recovery
- **VisualHealer**: NL-Means denoising + CLAHE (Contrast Limited Adaptive Histogram Equalization) on LAB color space to recover edge detail from visual noise
- **FourierHealer**: Fourier-domain band-stop filtering that surgically removes k-space spike artifacts while preserving the brain's anatomical structure

### 🖥️ Streamlit Command Center (3 Modules)
- **Diagnostic Pipeline**: Upload scan → view attack → view recovery → get CAM heatmap + class prediction with confidence scores
- **Chaos Sandbox**: Interactive toggle of individual attack layers with live re-prediction
- **Batch Auditor**: Upload a ZIP of patient scans, get per-image predictions, overall accuracy, and a Plotly confusion matrix

### 🎨 Gradio App (NeuroScan Workstation)
- Lightweight three-panel view: Original → Attacked → Shielded with classification confidence bars and clinical alert status messages

---

## 📁 Project Structure

```
Brain-Tumor-Detector/
│
├── apex_master.py          # Core PyTorch architecture + attack/defense modules
│   ├── HybridChimeraAI     # CNN + Transformer + MoE model
│   ├── OmniChaosInjector   # 7-layer adversarial attack engine
│   ├── VisualHealer        # NL-Means + CLAHE defense
│   ├── FourierHealer       # K-Space band-stop defense
│   └── TTAPipeline         # Test-Time Augmentation inference
│
├── app.py                  # Streamlit Command Center (3-module UI)
├── app_mian.py             # Gradio Diagnostic Workstation (TF/Keras)
│
├── train_robust.py         # Experiment 1: MobileNetV2 baseline
├── train_extreme.py        # Experiment 2: Xception with heavy augmentation
├── train_final_98.py       # Experiment 3: MobileNetV2 + CLAHE fine-tuning
├── train_unbeatable.py     # Experiment 4-5: Final champion model
│
├── real_benchmark.py       # Full test-set evaluation + classification report
├── test_security.py        # Triple-scenario robustness test (Clean/Attack/Shield)
├── verify_robustness.py    # Noise-level stress test
├── check_labels.py         # Label alignment validation
├── generate_attack.py      # Standalone attack/shield visual demo
├── save_visuals.py         # Generate comparison images for presentation
│
├── experiment_log.md       # Full iterative experiment journal
│
├── data/
│   ├── Training/           # Kaggle training set (by class folder)
│   └── Testing/            # Kaggle test set (by class folder)
│
├── models/                 # Saved model weights
│   ├── v4_Unbeatable_Final.h5    # TF/Keras champion (96% accuracy)
│   └── apex_master_weights.pth   # PyTorch HybridChimeraAI weights
│
└── presentation_assets/    # Auto-generated comparison/graph images
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- CUDA-capable GPU recommended (CPU inference works but is slower)

### 1. Clone the Repository
```bash
git clone https://github.com/MohdAltamish/Brain-Tumor-Detector.git
cd Brain-Tumor-Detector
```

### 2. Install Dependencies
```bash
pip install torch torchvision tensorflow streamlit gradio \
            opencv-python-headless scipy numpy pillow \
            pandas plotly scikit-learn
```

### 3. Download the Dataset
Get the dataset from Kaggle: [Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)

Place the downloaded folders as:
```
data/
├── Training/
│   ├── glioma/
│   ├── meningioma/
│   ├── notumor/
│   └── pituitary/
└── Testing/
    ├── glioma/
    ├── meningioma/
    ├── notumor/
    └── pituitary/
```

### 4. Train or Download Weights

**Option A — Train from scratch (PyTorch HybridChimeraAI):**
```bash
python apex_master.py
# Trains for 35 epochs, saves apex_master_weights.pth
```

**Option B — Train the TF/Keras champion model:**
```bash
python train_unbeatable.py
# Trains for 15 epochs with CLAHE + heavy augmentation
# Saves models/v4_Unbeatable_Final.h5
```

---

## 🚀 Running the Application

### Streamlit Command Center (PyTorch)
```bash
streamlit run app.py
```
Navigate to `http://localhost:8501` — use the sidebar to switch between Diagnostic Pipeline, Chaos Sandbox, and Batch Auditor.

### Gradio Workstation (TF/Keras)
```bash
python app_mian.py
```
Navigate to the local URL printed in the terminal.

---

## 🧪 Technical Workflow

```
Input MRI Scan
      │
      ▼
┌─────────────────────────────────┐
│     OmniChaos Attack Engine     │
│  ┌──────────────┐  ┌──────────┐ │
│  │ 5-Layer      │  │ 2-Layer  │ │
│  │ Visual Attack│  │ K-Space  │ │
│  │ (Warp+Shadow │  │ Physics  │ │
│  │  +Noise)     │  │ Attack   │ │
│  └──────────────┘  └──────────┘ │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│      Defense / Healing Layer    │
│  ┌──────────────┐  ┌──────────┐ │
│  │ VisualHealer │  │ Fourier  │ │
│  │ NL-Means +   │  │ Healer   │ │
│  │ CLAHE        │  │ Band-Stop│ │
│  └──────────────┘  └──────────┘ │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│       HybridChimeraAI           │
│                                 │
│  CNN Stem (3 conv blocks)       │
│       │                         │
│  Transformer Encoder            │
│  (8-head attention, 2 layers)   │
│       │                         │
│  Mixture of Experts (4 experts) │
│  + Learned Gating Function      │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│   Test-Time Augmentation (TTA)  │
│   3-vote ensemble inference     │
└─────────────────────────────────┘
      │
      ▼
 Diagnosis + CAM Heatmap + Confidence
```

---

## 📊 Experiment Results

The system was developed through 5 iterative experiments:

| Experiment | Architecture | Val Acc | Clean Test | Attacked | Shielded |
|---|---|---|---|---|---|
| 1 | MobileNetV2 + Median Filter | 80.9% | 66% | 38% | 58% |
| 2 | Xception (overfitting) | 73.3% | 56% | 42% | 42% |
| 3 | MobileNetV2 + CLAHE Fine-tune | **91.8%** | — | — | — |
| 4 | v3 Robustness Validation | — | 74% | 42% | 70% |
| 5 | MobileNetV2 + Heavy Aug (Champion) | **92.7%** | 96% | 40% | **96%** |

**Training Performance - Xception Model**
![Xception Performance](presentation_assets/xception_performance.png)

**Training Performance - v3 Booster Model**
![Final v3 Performance](presentation_assets/final_v3_performance.png)

### Key Insight
The Fourier-based K-Space attack drops accuracy to ~40% by design — it targets the frequency domain directly. The FourierHealer restores performance to baseline (96%) by applying a surgical band-stop mask in the frequency domain, proving that **domain-aware defenses are essential for real-world medical AI robustness**.

---

## 🖼️ Demo Screenshots

| Clean MRI | Signal Attack | Shielded Recovery |
|---|---|---|
| Original diagnostic scan | OmniChaos 7-layer corruption | Defense pipeline restored |

![Adversarial Attack Comparison](presentation_assets/attack_comparison_v1.png)

![Pituitary Tumor Prediction](presentation_assets/pituitary_demo.png)  
**Pituitary Tumor** — 99.5% confidence after adversarial recovery  

![Meningioma Prediction](presentation_assets/meningioma_demo.png)  
**Meningioma** — 93.4% confidence with visible tumor mass in CAM focus area  

![No Tumor Prediction](presentation_assets/no_tumor_demo.png)  
**No Tumor** — 99.9% confidence on clean healthy scan

---

## 🔑 Key Technical Highlights for Judges

1. **Custom architecture from scratch** — HybridChimeraAI is not a fine-tuned pretrained model; it combines spatial feature extraction (CNN), global context (Transformer), and specialized decision-making (MoE) in a single unified forward pass.

2. **Physics-grounded attack simulation** — The K-Space attack is based on actual MRI hardware failure modes (frequency-domain spike artifacts), not random pixel noise. This makes it a clinically meaningful robustness test.

3. **Domain-matched defenses** — VisualHealer and FourierHealer are paired to match the specific attack type, demonstrating that defense mechanisms must be designed to match the signal degradation domain.

4. **Iterative scientific methodology** — The experiment log documents 5 complete training runs with hypothesis, architecture change, results, and analysis for each — following standard ML research practice.

5. **Production-ready UI** — The Streamlit app includes a Batch Auditor with confusion matrix visualization, suitable for radiologist-style workflow evaluation.

---

## ⚠️ Disclaimer

This project is a research prototype developed for academic and hackathon purposes. It is **not intended for clinical diagnosis**. All predictions should be reviewed by a qualified medical professional. The adversarial attack simulation is included for robustness research only.

---

## 👤 Author

**Mohd Altamish**  
B.Tech Computer Science Engineering, GL Bajaj Institute of Technology and Management (2025–2029)  
LinkedIn [Mohd-Altamish](https://www.linkedin.com/in/mohd-altamish/)  
GitHub: [@MohdAltamish](https://github.com/MohdAltamish)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.