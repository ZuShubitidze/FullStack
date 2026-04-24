import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env")
# Setup Gemini
# genai.configure(api_key=api_key)
client = genai.Client(api_key=api_key)

# For Chat
chat_response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Hello")

# For Imagen
img_res = client.models.generate_images(
    model="imagen-3.0-generate-001", prompt="...")


# def get_gemini_model():
#     # return genai.GenerativeModel(model_name="gemini-2.5-flash-lite", system_instruction="", tools="")


# def get_imagen_client():
#     # return modern_client


# def get_gemini_imagen_model():
#     # return genai.GenerativeModel(model_name="imagen-4.0-generate-001")
