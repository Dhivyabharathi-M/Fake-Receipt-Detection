from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from model import predict_image

app = FastAPI()

origins = ["*"]  # Allow all for demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Fake Receipt Detection API"}

@app.post("/predict")
async def classify_image(file: UploadFile = File(...)):
    label, conf = predict_image(file.file)

    return {
        "label": "REAL" if label == 1 else "FAKE",
        "confidence": round(conf, 4)
    }
