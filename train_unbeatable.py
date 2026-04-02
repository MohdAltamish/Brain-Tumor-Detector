import tensorflow as tf
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import cv2
import numpy as np

# 1. CLAHE Pre-processing (The Standardizer)
def medical_preprocessing(img):
    img = img.astype(np.uint8)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    for i in range(3):
        img[:,:,i] = clahe.apply(img[:,:,i])
    return img.astype(np.float32) / 255.0

# 2. HEAVY AUGMENTATION (The "Toughness" Factor)
# This creates new variations of your images on the fly!
datagen = ImageDataGenerator(
    preprocessing_function=medical_preprocessing,
    rotation_range=20,      # Rotate up to 20 degrees
    width_shift_range=0.1,  # Shift horizontally
    height_shift_range=0.1, # Shift vertically
    shear_range=0.1,        # Distort slightly
    zoom_range=0.1,         # Zoom in/out
    horizontal_flip=True,   # Flip left to right
    fill_mode='nearest',
    validation_split=0.2    # 20% for testing
)

train_gen = datagen.flow_from_directory('data/Training', target_size=(224, 224), batch_size=32, class_mode='categorical', subset='training')
val_gen = datagen.flow_from_directory('data/Training', target_size=(224, 224), batch_size=32, class_mode='categorical', subset='validation')

# 3. THE MODEL (Fine-Tuning Enabled)
base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = True
for layer in base_model.layers[:-30]: # Unfreeze last 30 layers
    layer.trainable = False

model = models.Sequential([
    layers.Input(shape=(224, 224, 3)),
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.5), # Stronger dropout to prevent overfitting
    layers.Dense(4, activation='softmax')
])

# 4. TRAINING
model.compile(optimizer=optimizers.Adam(learning_rate=0.00001), loss='categorical_crossentropy', metrics=['accuracy'])

print("\n--- Training the Unbeatable Model (Heavy Augmentation) ---")
# We do 15 epochs because augmentation makes the data "harder" to learn
model.fit(train_gen, validation_data=val_gen, epochs=15) 

model.save('models/v4_Unbeatable_Final.h5')
print("Model saved as v4_Unbeatable_Final.h5")