from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
# Setup Gemini
# genai.configure(api_key=api_key)
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# For Chat
chat_response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Hello")

# For Imagen
img_res = client.models.generate_images(
    model="imagen-3.0-generate-001", prompt="...")


def get_gemini_model():
    return client.models


# def get_imagen_client():
#     # return modern_client


# def get_gemini_imagen_model():
#     # return genai.GenerativeModel(model_name="imagen-4.0-generate-001")
