import os
from dotenv import load_dotenv
import google.generativeai as genai
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

load_dotenv()
# Setup Gemini
genai.configure(api_key=api_key)  # type: ignore


def get_gemini_model():
    return genai.GenerativeModel(  # pyright: ignore
        model_name="gemini-2.5-flash-lite",
    )
