from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from src.routes.ai_routes import router as ai_router
import sys
print(f"DEBUG - Python Version: {sys.version}", flush=True)
print(f"DEBUG - Sys Path: {sys.path}", flush=True)

try:
    from google import genai
    print("DEBUG - google-genai imported successfully", flush=True)
except Exception as e:
    print(f"DEBUG - CRITICAL IMPORT ERROR: {e}", flush=True)

load_dotenv()

app = FastAPI(redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000",
                   "https://full-stack-black-delta.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)


# Health Check
@app.get("/")
def health_check():
    return {"status": "healthy"}
# uv run uvicorn src.main:app --host 0.0.0.0 --port $PORT
