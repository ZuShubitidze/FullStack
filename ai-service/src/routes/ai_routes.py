from fastapi import APIRouter, HTTPException
from src.services.gemini import get_gemini_model
from fastapi.responses import StreamingResponse
import httpx

router = APIRouter()


@router.post("/chat")
async def chat_with_history(request: dict):
    async def event_generator():
        try:
            model = get_gemini_model()
            history = request.get("history") or []
            user_prompt = request.get("prompt")
            image_url = request.get("imageUrl")
            # Initialize chat with history with get from NodeJS
            chat = model.start_chat(history=history)

            if not image_url:  # If no image
                print("DEBUG: No ImageURL found in request body", flush=True)
            # If image
            if image_url:
                async with httpx.AsyncClient() as imageClient:
                    resp = await imageClient.get(image_url)
                    if resp.status_code != 200:  # Check if download succeeded
                        yield ("Failed to fetch image from Cloudinary")
                        return  # Exit generator
                    content_type = resp.headers.get(
                        "Content-Type", "image/jpeg")
                    # from google.genai import types
                    # image_part = types.Part.from_bytes(
                    #     data=resp.content,
                    #     mime_type=content_type
                    # )
                    image_part = {"mime_type": content_type,
                                  "data": resp.content}
                    # Sending both Text and Image
                    response = await chat.send_message_async([user_prompt, image_part], stream=True)

                    async for chunk in response:
                        yield f"data: {chunk.text}\n\n"

            else:
                # If no image, just send prompt
                response = await chat.send_message_async(user_prompt)

            async for chunk in response:
                yield chunk.text

        except Exception as e:
            print(f"Chat Error: {str(e)}")  # Crucial for Render logs
            yield f"data: Error: {str(e)}"
            # raise HTTPException(status_code=500, detail=str(e))

    return StreamingResponse(event_generator(), media_type="text/event-stream")
