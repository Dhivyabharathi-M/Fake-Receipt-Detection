from sentence_transformers import SentenceTransformer

sbert = SentenceTransformer("all-MiniLM-L6-v2")

def embed(text):
    return sbert.encode(text).tolist()
