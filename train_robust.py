import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# 1. LOAD DATA (Standard Augmentation)
datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

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

# 2. THE "PROFESSIONAL" MODEL (MobileNetV2)
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3), 
    include_top=False, 
    weights='imagenet'
)
base_model.trainable = False  # Freeze the pre-trained weights

model = models.Sequential([
    layers.GaussianNoise(0.05, input_shape=(224, 224, 3)), # Small noise defense
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.2),
    layers.Dense(4, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# 3. TRAIN (Only 5 epochs needed because it's already smart!)
print("\n--- Training Professional Robust Model ---")
model.fit(train_gen, validation_data=val_gen, epochs=5)

model.save('models/robust_brain_model.h5')