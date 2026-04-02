import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model

# 1. Load the new 'Robust' Brain
model = load_model('models/robust_brain_model.h5')

# 2. Setup a clean test generator (No shuffle so we can track labels)
test_datagen = ImageDataGenerator(rescale=1./255)
test_gen = test_datagen.flow_from_directory(
    'data/Testing', # Use the Testing folder this time
    target_size=(224, 224),
    batch_size=1,
    class_mode='categorical',
    shuffle=False
)

def test_with_noise(noise_level):
    correct = 0
    total = 50 # Let's test 50 images
    
    for i in range(total):
        img, label = next(test_gen)
        
        # Add the 'Killer' Noise
        noisy_img = np.clip(img + np.random.normal(0, noise_level, img.shape), 0, 1)
        
        pred = model.predict(noisy_img, verbose=0)
        if np.argmax(pred) == np.argmax(label):
            correct += 1
            
    return (correct / total) * 100

print("Testing Robustness against 10% Noise...")
acc = test_with_noise(0.1)
print(f"Final Accuracy under Noise: {acc:.2f}%")