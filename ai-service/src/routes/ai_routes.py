from fastapi import APIRouter, HTTPException
from src.models.schema import AIRequest
from src.services.gemini import get_gemini_model

router = APIRouter()


@router.post("/generate")
async def generate_response(request: AIRequest):
    try:
        model = get_gemini_model()
        response = model.generate_content(
            request.prompt,
            generation_config={"temperature": 0.7}
        )
        return {"reply": response.text}
    # Error
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat_with_history(request: dict):
    try:
        model = get_gemini_model()
        history = request.get("history") or []
        user_prompt = request.get("prompt")

        chat = model.start_chat(history=history)
        response = chat.send_message(user_prompt)

        return {"reply": response.text}
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
