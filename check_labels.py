import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model

model = load_model('models/robust_brain_model.h5')
test_datagen = ImageDataGenerator(rescale=1./255)
test_gen = test_datagen.flow_from_directory('data/Testing', target_size=(224, 224), batch_size=1, class_mode='categorical', shuffle=False)

# Get the class names the generator is using
labels = (test_gen.class_indices)
print(f"Generator considers these labels: {labels}")

# Test 5 images and see what the AI thinks vs what the label says
for i in range(5):
    img, label = next(test_gen)
    pred = model.predict(img, verbose=0)
    print(f"Image {i}: Real Index: {np.argmax(label)} | AI Guessed Index: {np.argmax(pred)}")
    