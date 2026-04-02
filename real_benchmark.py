import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
import cv2

# 1. Load the model
model = load_model('models/v4_Unbeatable_Final.h5')

# 2. Medical Pre-processing (Must match training exactly)
def medical_preprocessing(img):
    img = img.astype('uint8')
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    for i in range(3):
        img[:,:,i] = clahe.apply(img[:,:,i])
    return img.astype('float32') / 255.0

# 3. Setup the REAL Test Data
test_datagen = ImageDataGenerator(preprocessing_function=medical_preprocessing)
test_generator = test_datagen.flow_from_directory(
    'data/Testing', # Point this to your actual test folder
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    shuffle=False # Very important for the report!
)

# 4. Run Evaluation
print("\n--- CALCULATING REAL-WORLD ACCURACY ---")
loss, acc = model.evaluate(test_generator)
print(f"Overall Accuracy on Testing Folder: {acc*100:.2f}%")

# 5. Generate the "Panel Proof" Report
Y_pred = model.predict(test_generator)
y_pred = np.argmax(Y_pred, axis=1)

print('\n--- DETAILED PERFORMANCE BY TUMOR TYPE ---')
target_names = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']
print(classification_report(test_generator.classes, y_pred, target_names=target_names))