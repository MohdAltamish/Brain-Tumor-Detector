import cv2
import numpy as np
import os
import random
from glob import glob

def add_salt_and_pepper(image, prob):
    output = np.copy(image)
    thres = 1 - prob 
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            rdn = random.random()
            if rdn < prob:
                output[i][j] = 0 # Pepper
            elif rdn > thres:
                output[i][j] = 255 # Salt
    return output

# 1. AUTO-FIND the first image in the folder
search_path = 'data/Testing/glioma/*.jpg'
image_files = glob(search_path)

if not image_files:
    print(f"Error: No images found in {search_path}")
    print("Check if your 'data' folder is actually in: C:\\Users\\ASUS\\OneDrive\\Desktop\\BrainTumorProject")
else:
    sample_path = image_files[0] # Grab the first image found
    print(f"Testing on: {sample_path}")
    
    original = cv2.imread(sample_path)
    
    # 2. Apply Attack (10% noise is a 'heavy' attack)
    attacked = add_salt_and_pepper(original, 0.05)
    
    # 3. Apply The Secret Shield (Our Median Filter)
    shielded = cv2.medianBlur(attacked, 3)

    # 4. Display Results
    cv2.imshow('1. Original MRI', original)
    cv2.imshow('2. Attacked MRI (Salt & Pepper)', attacked)
    cv2.imshow('3. Secret Shield Recovery', shielded)

    print("\n--- ATTACK SUCCESSFUL ---")
    print("1. Original: Clean Scan")
    print("2. Attacked: Random salt/pepper noise added.")
    print("3. Shielded: Noise removed using Median filtering.")
    print("\nPress any key on the image windows to close.")
    
    cv2.waitKey(0)
    cv2.destroyAllWindows()