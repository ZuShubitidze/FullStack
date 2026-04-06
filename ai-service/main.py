import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env")

# Setup Gemini
genai.configure(api_key=api_key)

# Define what the request body should look like


class AIRequest(BaseModel):
    prompt: str


@app.post("/geminiAI/generateResponse")
async def generate_response(request: AIRequest):
    try:
        # Use 1.5 Flash for free tier
        model = genai.GenerativeModel("gemini-2.5-flash")

        response = model.generate_content(
            request.prompt,
            generation_config={"temperature": 0.7}
        )

        return {"reply": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def home():
    return {"status": "AI Service is running"}
