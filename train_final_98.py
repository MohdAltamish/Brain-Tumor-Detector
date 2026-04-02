import tensorflow as tf
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import cv2
import numpy as np
import matplotlib.pyplot as plt

# 1. THE "SECRET" PRE-PROCESSING (CLAHE)
# This function is applied to EVERY image before the model sees it.
def medical_preprocessing(img):
    # Convert to 0-255 uint8 for OpenCV to work
    img = img.astype(np.uint8)
    # Apply CLAHE to make tumor edges "pop"
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    for i in range(3): # Apply to each color channel (R, G, B)
        img[:,:,i] = clahe.apply(img[:,:,i])
    return img.astype(np.float32) / 255.0

# 2. DATA LOADERS (With the new Pre-processing)
datagen = ImageDataGenerator(
    preprocessing_function=medical_preprocessing,
    validation_split=0.2
)

train_gen = datagen.flow_from_directory(
    'data/Training', 
    target_size=(224, 224), 
    batch_size=32, 
    class_mode='categorical', 
    subset='training'
)

val_gen = datagen.flow_from_directory(
    'data/Training', 
    target_size=(224, 224), 
    batch_size=32, 
    class_mode='categorical', 
    subset='validation'
)

# 3. BUILD THE FINE-TUNING MODEL
base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')

# THE TRICK: Unfreeze only the top layers of the pre-trained brain
base_model.trainable = True
for layer in base_model.layers[:-30]: # Unfreeze the last 30 layers
    layer.trainable = False

model = models.Sequential([
    layers.GaussianNoise(0.01, input_shape=(224, 224, 3)), # Minimal noise defense
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.4), # Increased dropout to stop overfitting (Xception lesson)
    layers.Dense(4, activation='softmax')
])

# 4. VERY LOW LEARNING RATE (Crucial so we don't 'break' the brain)
model.compile(
    optimizer=optimizers.Adam(learning_rate=0.00001), 
    loss='categorical_crossentropy', 
    metrics=['accuracy']
)

print("\n--- Starting Phase 3: Final Medical Fine-Tuning ---")
history = model.fit(train_gen, validation_data=val_gen, epochs=10)

# 5. SAVE EVERYTHING
model.save('models/v3_Final_Booster.h5')

# Save the new graphs for your presentation
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train')
plt.plot(history.history['val_accuracy'], label='Val')
plt.title('Final Model Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train')
plt.plot(history.history['val_loss'], label='Val')
plt.title('Final Model Loss')
plt.legend()

plt.savefig('presentation_assets/final_v3_performance.png')
print("\nSuccess! Model saved as v3_Final_Booster.h5")