import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env")
# Setup Gemini
genai.configure(api_key=api_key)  # type: ignore


def get_gemini_model():
    return genai.GenerativeModel(model_name="gemini-2.5-flash-lite", system_instruction="")
