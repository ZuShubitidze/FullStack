from fastapi import APIRouter, HTTPException
from src.services.gemini import get_gemini_model
import httpx

router = APIRouter()


@router.post("/chat")
async def chat_with_history(request: dict):
    try:
        model = get_gemini_model()
        history = request.get("history") or []
        user_prompt = request.get("prompt")
        image_url = request.get("imageUrl")
        content = [user_prompt]

        if (image_url):
            async with httpx.AsyncClient() as client:
                resp = await client.get(image_url)
                image_data = {"mime_type": "image/jpeg", "data": resp.content}
                content.append(image_data)

        chat = model.start_chat(history=history)
        response = chat.send_message(user_prompt)

        return {"reply": response.text}
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
