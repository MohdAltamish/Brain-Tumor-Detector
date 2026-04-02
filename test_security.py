import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
from glob import glob

# 1. Load your 'Professional' Brain
model = load_model('models/v4_Unbeatable_Final.h5')

# 2. Define our Attack and Shield
def add_salt_and_pepper(img_array, prob=0.05):
    # Scale to 0-255 for OpenCV
    img = (img_array * 255).astype(np.uint8)
    output = np.copy(img)
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            rdn = np.random.random()
            if rdn < prob:
                output[i][j] = 0
            elif rdn > (1 - prob):
                output[i][j] = 255
    return output / 255.0

def apply_shield(img_array):
    # 1. Convert to 0-255 uint8
    img = (img_array * 255).astype(np.uint8)
    # 2. Median Filter (The Noise Defense)
    denoised = cv2.medianBlur(img, 3)
    # 3. CLAHE (The Accuracy Booster)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    for i in range(3):
        denoised[:,:,i] = clahe.apply(denoised[:,:,i])
    return denoised / 255.0

# 3. Setup Test Data
test_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
    'data/Testing',
    target_size=(224, 224),
    batch_size=1,
    class_mode='categorical',
    shuffle=True
)

# ... (Keep your existing imports and functions)

# 4. RUN THE TRIPLE TEST (Optimized)
results = {"Clean": 0, "Attacked": 0, "Shielded": 0}
total_images = 50 

print(f"Testing {total_images} images with CLAHE Normalization...")

for i in range(total_images):
    img, label = next(test_gen)
    true_class = np.argmax(label)

    # Scenario A: Clean (NOW WITH CLAHE)
    # We apply the same pre-processing used in training
    clean_img_boosted = apply_shield(img[0]) # This applies Median + CLAHE
    clean_img_boosted = np.expand_dims(clean_img_boosted, axis=0)
    pred_clean = np.argmax(model.predict(clean_img_boosted, verbose=0))
    if pred_clean == true_class: results["Clean"] += 1

    # Scenario B: Attacked (Noise)
    noisy_img = add_salt_and_pepper(img[0], 0.05)
    noisy_img_input = np.expand_dims(noisy_img, axis=0)
    pred_noisy = np.argmax(model.predict(noisy_img_input, verbose=0))
    if pred_noisy == true_class: results["Attacked"] += 1

    # Scenario C: Shielded (Recovery)
    recovered_img = apply_shield(noisy_img)
    recovered_img = np.expand_dims(recovered_img, axis=0)
    pred_shielded = np.argmax(model.predict(recovered_img, verbose=0))
    if pred_shielded == true_class: results["Shielded"] += 1

# ... (Keep final print statements)

print("\n--- FINAL SECURITY REPORT ---")
print(f"Clean Data Accuracy:    {(results['Clean']/total_images)*100}%")
print(f"Attacked Data Accuracy: {(results['Attacked']/total_images)*100}% (FAIL)")
print(f"Shielded Data Accuracy: {(results['Shielded']/total_images)*100}% (RECOVERY)")