from pydantic import BaseModel

# Define what the request body should look like


class AIRequest(BaseModel):
    prompt: str
