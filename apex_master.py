import os
import time
import random
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from scipy.ndimage import map_coordinates, gaussian_filter
import numpy as np
import cv2
from PIL import Image

#architecture
#MOE
class MixtureOfExperts(nn.Module):
    def __init__(self, input_dim, num_experts=4, num_classes=4):
        super().__init__()
        self.experts = nn.ModuleList([
            #4 mini networks
            #linear :connect data to 256 neurons     relu : negative to 0     dropout : turns off neurons       linear : shrinks to 4 classes
            nn.Sequential(nn.Linear(input_dim, 256), nn.ReLU(), nn.Dropout(0.5), nn.Linear(256, num_classes)) 
            for _ in range(num_experts)
        ])
        #softmax : ensures that weights are given
        self.gate = nn.Sequential(nn.Linear(input_dim, 128), nn.ReLU(), nn.Linear(128, num_experts), nn.Softmax(dim=1))
        
    def forward(self, x):
        gate_weights = self.gate(x).unsqueeze(2) #prevent multiplication clash due to dimensions
        expert_outputs = torch.stack([expert(x) for expert in self.experts], dim=1) #pass data to all 4 expert 
        return torch.sum(expert_outputs * gate_weights, dim=1) # get final prediction

class HybridChimeraAI(nn.Module):
    def __init__(self, num_classes=4):
        super().__init__()
        #features extract
        self.cnn_stem = nn.Sequential(
            #kernel size 3x3
            nn.Conv2d(3, 64, kernel_size=3, stride=2, padding=1), nn.BatchNorm2d(64), nn.ReLU(), nn.MaxPool2d(2, 2),  #batchnorm : all numbers back to normal safe range
            nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1), nn.BatchNorm2d(128), nn.ReLU(), nn.MaxPool2d(2, 2),  #maxpool : pick brightest from 2x2
            nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1), nn.BatchNorm2d(256), nn.ReLU()
        )
        #to remember the pos for texture for transformers
        self.embed_dim = 256
        self.pos_embedding = nn.Parameter(torch.randn(1, 196, self.embed_dim)) #generates random set of cordinates 

        #transformers 
        self.transformer = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=self.embed_dim, nhead=8, dim_feedforward=512, dropout=0.3, batch_first=True), 
            num_layers=2
        )
        #experts MOE
        self.moe = MixtureOfExperts(input_dim=self.embed_dim, num_experts=4, num_classes=num_classes)
        
    def forward(self, x): 
        #flat the output for transformers
        features = self.cnn_stem(x).view(x.size(0), self.embed_dim, -1).transpose(1, 2)
        return self.moe(self.transformer(features + self.pos_embedding).mean(dim=1))



#7 layers 
class OmniChaosInjector:
    def inject_5_layer_visual(self, img):
        shape = img.shape
        #2 layer dx dy 
        #push pixels slightly 
        dx = gaussian_filter((np.random.rand(*shape[:2]) * 2 - 1), 4, mode="constant", cval=0) * 20
        dy = gaussian_filter((np.random.rand(*shape[:2]) * 2 - 1), 4, mode="constant", cval=0) * 20
        #layer 3  applying the wrap 
        x, y = np.meshgrid(np.arange(shape[1]), np.arange(shape[0])) #digital grid
        indices = np.reshape(y + dy, (-1, 1)), np.reshape(x + dx, (-1, 1)) 
        warped = np.zeros_like(img)  # new black screen 
        for i in range(3): warped[:,:,i] = map_coordinates(img[:,:,i], indices, order=1, mode='reflect').reshape(shape[:2]) #warped image generated
        #bell curve/circle   pixels at centre are bright and edges are black
        #layer 4 
        X, Y = np.meshgrid(np.linspace(-1, 1, shape[1]), np.linspace(-1, 1, shape[0]))
        shadow = np.stack([np.exp(-(X**2 + Y**2) / 2.5)]*3, axis=-1)
        warped = np.clip(warped * shadow, 0, 255).astype(np.float32) / 255.0
        #layer 5 tiny random numbers noise
        noise = np.random.normal(0, 0.05, warped.shape)
        return np.clip((warped + noise) * 255.0, 0, 255).astype(np.uint8)

    def inject_2_layer_physics(self, img):
        #layer1 k space
        fshift = np.fft.fftshift(np.fft.fft2(cv2.cvtColor(img, cv2.COLOR_RGB2GRAY))) #to black and white #fourier transform
        rows, cols = img.shape[:2]
        #layer 2 : high freq spikes 
        if random.random() < 0.5:
            if random.choice([True, False]): fshift[rows//2 - 1: rows//2 + 2, :] += 1e5
            else: fshift[:, cols//2 - 1: cols//2 + 2] += 1e5
        else:
            fshift[random.randint(0, rows-1), random.randint(0, cols-1)] += 5e6
        #inverse fast fourier transform 
        reconstructed = np.abs(np.fft.ifft2(np.fft.ifftshift(fshift)))
        return cv2.cvtColor(cv2.normalize(reconstructed, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8), cv2.COLOR_GRAY2RGB)

class OmniInjection:
    #33 33 34% rule applied
    def __init__(self): self.injector = OmniChaosInjector()
    def __call__(self, img): 
        roll = random.random()
        if roll < 0.33: return img #clean image
        img_np = np.array(img)
        #attacked image 
        return Image.fromarray(self.injector.inject_5_layer_visual(img_np) if roll < 0.66 else self.injector.inject_2_layer_physics(img_np))

#preprocessing
#healers
class VisualHealer:
    #Removes 5-Layer Visual noise 
    def heal(self, img_np):
        denoised = cv2.fastNlMeansDenoisingColored(img_np, None, 10, 10, 7, 21) #blur filter, remove static noise that we added , but still keeps the tumor intact
        lab = cv2.cvtColor(denoised, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)  #seperate colour and brightness
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))  #CLAHE : Contrast Limited Adaptive Histogram Equalization
        return cv2.cvtColor(cv2.merge((clahe.apply(l), a, b)), cv2.COLOR_LAB2RGB)  #merge to get standard rgb 

class FourierHealer:
    #Removes K-Space Physics noise 
    def heal(self, image_np):
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        fshift = np.fft.fftshift(np.fft.fft2(gray))  #fourier transform 
        rows, cols = gray.shape
        crow, ccol = rows//2, cols//2
        mask = np.ones((rows, cols), np.uint8)
        mask[0:crow-30, ccol-2:ccol+2] = 0; mask[crow+30:rows, ccol-2:ccol+2] = 0  #deletes the strip noise but keep center pixel to keep actual brain shape
        mask[crow-2:crow+2, 0:ccol-30] = 0; mask[crow-2:crow+2, ccol+30:cols] = 0
        
        img_healed = np.abs(np.fft.ifft2(np.fft.ifftshift(fshift * mask)))  #multiply freq with mask to delete spikes
        return cv2.cvtColor(cv2.normalize(img_healed, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8), cv2.COLOR_GRAY2RGB)

#TTA pipeline
class TTAPipeline:
    #Test-Time Augmentation 
    def __init__(self, model, device):
        self.model = model
        self.device = device
        #base resize 224 x 224 
        self.base_transform = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor(), transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])
        #rotate and zoom
        self.aug_transform = transforms.Compose([transforms.RandomRotation(10), transforms.RandomResizedCrop(224, scale=(0.95, 1.0)), transforms.ToTensor(), transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])

    def predict(self, image_pil, num_votes=3):
        self.model.eval()  
        votes = []
        with torch.no_grad():  #turn off learning now , locks the model
            votes.append(torch.softmax(self.model(self.base_transform(image_pil).unsqueeze(0).to(self.device)), dim=1).cpu().numpy()[0])  #normal image
            for _ in range(num_votes - 1):  #3 votes  normal , tilted , zoomed
                votes.append(torch.softmax(self.model(self.aug_transform(image_pil).unsqueeze(0).to(self.device)), dim=1).cpu().numpy()[0])
        return np.mean(votes, axis=0)

#exwcution training loop
if __name__ == '__main__':
    
    print(" PROJECT APEX MASTER: INITIATING TRAINING ")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = HybridChimeraAI(num_classes=4).to(device)
    
    dataset_path = "data/Training" 
    if not os.path.exists(dataset_path):
        print(f"[!] ERROR: '{dataset_path}' folder not found. Please add the dataset.")
        exit()

    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        OmniInjection(), # Data Augmentation
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    train_loader = DataLoader(datasets.ImageFolder(root=dataset_path, transform=train_transform), batch_size=32, shuffle=True)
    criterion, optimizer = nn.CrossEntropyLoss(), optim.AdamW(model.parameters(), lr=0.0001, weight_decay=1e-4)
    #crossentropy : how wrong is AI percentage guess 
    #adamw : adusts learning speeed , prevents overfitting , helps to make better guess in next batch
    epochs = 35
    for epoch in range(epochs):
        model.train(); running_loss, correct, total, start_time = 0.0, 0, 0, time.time()
        for batch_idx, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad() #clean last batch memory
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward(); optimizer.step()  #to check which neuron made the mistake
            
            running_loss += loss.item()
            correct += (torch.max(outputs.data, 1)[1] == labels).sum().item()  #get hightest percentage
            total += labels.size(0)
            print(f"\r  -> Batch {batch_idx+1}/{len(train_loader)} | Loss: {loss.item():.4f}", end="")
            
        print(f"\n[+] Epoch {epoch+1:02d} | Accuracy: {100 * correct / total:.2f}% | Time: {(time.time() - start_time)/60:.1f} min")
        
    torch.save(model.state_dict(), 'apex_master_weights.pth')
    print("\n✅ Training Complete. All modules (Healers, Injectors, TTA) are ready for import.")