import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"

# Load CNN model
cnn = models.resnet18(weights=None)
cnn.fc = nn.Linear(512, 2)  # EXACTLY same as training

state = torch.load("models/best_model.pth", map_location=device)
cnn.load_state_dict(state)
cnn.eval().to(device)

# Image preprocessing
img_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict_image(file):
    img = Image.open(file).convert("RGB")
    tensor = img_transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = cnn(tensor)
        prob = torch.softmax(output, dim=1).cpu().numpy()

    label = prob.argmax()
    confidence = float(prob.max())
    
    return label, confidence
