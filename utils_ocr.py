import easyocr

reader = easyocr.Reader(['en'])

def extract_text(image_path):
    try:
        text_blocks = reader.readtext(image_path, detail=0)
        return " ".join(text_blocks)
    except:
        return ""
