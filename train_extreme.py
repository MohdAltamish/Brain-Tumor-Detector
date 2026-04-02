import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import Xception
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import matplotlib.pyplot as plt

# 1. Data (Standard Augmentation)
datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_gen = datagen.flow_from_directory('data/Training', target_size=(224, 224), batch_size=32, class_mode='categorical', subset='training')
val_gen = datagen.flow_from_directory('data/Training', target_size=(224, 224), batch_size=32, class_mode='categorical', subset='validation')

# 2. Xception Model
base_model = Xception(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False 

model = models.Sequential([
    layers.GaussianNoise(0.05, input_shape=(224, 224, 3)),
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(4, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# 3. Train & Store History
print("\n--- Training Xception (Extreme) Model ---")
history = model.fit(train_gen, validation_data=val_gen, epochs=8) # Increased epochs slightly

# 4. Save Model & Graphs
model.save('models/v2_Xception_Robust.h5')

# Plotting Accuracy
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train Acc')
plt.plot(history.history['val_accuracy'], label='Val Acc')
plt.title('Xception Accuracy')
plt.legend()

# Plotting Loss
plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Xception Loss')
plt.legend()

plt.savefig('presentation_assets/xception_performance.png')
print("Model and Graphs saved!")