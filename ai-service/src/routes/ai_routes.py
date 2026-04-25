from fastapi import APIRouter, HTTPException
# from src.services.gemini import get_gemini_model, get_gemini_imagen_model, get_imagen_client
from src.services.gemini import chat_response, img_res, client
import httpx

router = APIRouter()


# @router.post("/chat")
# async def chat_with_history(request: dict):
#     try:
#         # model = get_gemini_model()
#         # Get Data from Request
#         history = request.get("history") or []
#         user_prompt = request.get("prompt")
#         image_url = request.get("imageUrl")

#         chat = client.chats.create(
#             model="gemini-2.0-flash",
#             history=history
#         )

#         print(
#             f"Received Prompt:{user_prompt}, ImageURL: {image_url}", flush=True)

#         if not image_url:
#             print("DEBUG: No ImageURL found in request body", flush=True)

#         if (image_url):
#             print(f"FETCHING IMAGE: {image_url}", flush=True)
#             async with httpx.AsyncClient() as imageClient:
#                 # Get Image with httpx and Request URL
#                 resp = await imageClient.get(image_url)
#                 content_type = resp.headers.get("Content-Type", "image/jpeg")
#                 # Prepare multi-modal content
#                 from google.genai import types
#                 image_part = types.Part.from_bytes(
#                     data=resp.content,
#                     mime_type=content_type
#                 )
#                 # image_part = {"mime_type": content_type, "data": resp.content}
#                 # Send message with both Image and Prompt
#                 response = await chat.send_message([user_prompt, image_part])
#         else:
#             # If no Image, just send prompt
#             response = await chat.send_message(user_prompt)  # type: ignore

#         return {"reply": response.text}
#     except Exception as e:
#         print(f"Chat Error: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/generateImage")
# async def generate_image(request: str):
#     try:
#         client = get_imagen_client()
#         model = get_gemini_imagen_model(),
#         user_prompt = request
#         print(f"Received Prompt {user_prompt}", flush=True)

#         response = client.models.generate_images(
#             model="imagen-3.0-generate-001",
#             prompt=user_prompt,
#         )

#         if not response.generated_images or len(response.generated_images):
#             raise HTTPException(
#                 status_code=400, detail="AI refused to generate image")

#         image = response.generated_images[0]

#         import base64
#         img_bytes = image.image_bytes  # type: ignore
#         image_base64 = base64.b64encode(img_bytes).decode('utf-8')

#         return {
#             "reply": "Image generated successfully!",
#             "imageUrl": f"data:image/jpeg;base64,{image_base64}"
#         }
#     except Exception as e:
#         print(f"Imagen Error: {e}")
#         raise HTTPException(status_code=500, detail=str(e))
