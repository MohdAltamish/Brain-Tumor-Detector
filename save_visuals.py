import cv2
import numpy as np
from glob import glob
import os

# Auto-grab an image
img_path = glob('data/Testing/glioma/*.jpg')[0]
original = cv2.imread(img_path)
original = cv2.resize(original, (224, 224))

# Attack & Shield
def add_noise(img):
    out = np.copy(img)
    prob = 0.05
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            rdn = np.random.random()
            if rdn < prob: out[i][j] = 0
            elif rdn > (1-prob): out[i][j] = 255
    return out

attacked = add_noise(original)
shielded = cv2.medianBlur(attacked, 3)

# Stack them horizontally for one big "Comparison" image
comparison = np.hstack((original, attacked, shielded))

# Save it to your folder
if not os.path.exists('presentation_assets'):
    os.makedirs('presentation_assets')

cv2.imwrite('presentation_assets/attack_comparison_v1.png', comparison)
print("Comparison image saved in presentation_assets/ folder!")