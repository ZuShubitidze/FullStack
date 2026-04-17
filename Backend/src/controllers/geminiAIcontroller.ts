import "dotenv/config";
import type { Request, Response } from "express";
import ai from "@lib/geminiAI.js";

const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const AIResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // contents: prompt
      contents: "Capital of France",
    });

    res.status(200).json();
  } catch (error: any) {
    console.error("Error in geminiAI Controller:", error.message);
    res.status(500).json({ message: "Error communicating with AI" });
  }
};

export { generateResponse };
// uv run --active uvicorn main:app --host 0.0.0.0 --port $PORT
// uv run --active uvicorn main:app --host 0.0.0.0 --port 8000
