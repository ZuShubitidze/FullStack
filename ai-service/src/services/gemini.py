import os
import google.generativeai as genai
from google import genai as modern_genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env")
# Setup Gemini
genai.configure(api_key=api_key)  # type: ignore
modern_client = modern_genai.Client(api_key=api_key)


def get_gemini_model():
    # type: ignore
    return genai.GenerativeModel(model_name="gemini-2.5-flash-lite", system_instruction="", tools="")


def get_imagen_client():
    return modern_client


def get_gemini_imagen_model():
    return genai.GenerativeModel(model_name="imagen-4.0-generate-001")
