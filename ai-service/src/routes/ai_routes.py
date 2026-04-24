from fastapi import APIRouter, HTTPException
from src.services.gemini import get_gemini_model
import httpx

router = APIRouter()


@router.post("/chat")
async def chat_with_history(request: dict):
    try:
        model = get_gemini_model()
        # Get Data from Request
        history = request.get("history") or []
        user_prompt = request.get("prompt")
        image_url = request.get("imageUrl")
        chat = model.start_chat(history=history)
        print(f"DEBUG: Received ImageURL: {image_url}", flush=True)

        if not image_url:
            print("DEBUG: No ImageURL found in request body", flush=True)

        if (image_url):
            print(f"FETCHING IMAGE: {image_url}", flush=True)
            async with httpx.AsyncClient() as client:
                # Get Image with httpx and Request URL
                resp = await client.get(image_url)
                content_type = resp.headers.get("Content-Type", "image/jpeg")
                # Prepare multi-modal content
                image_part = {"mime_type": content_type, "data": resp.content}
                # Send message with both Image and Prompt
                response = await chat.send_message_async([user_prompt, image_part])
        else:
            # If no Image, just send prompt
            response = chat.send_message_async(user_prompt)

        print(f"DEBUG: Received ImageURL: {image_url}", flush=True)
        return {"reply": response.text}
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
