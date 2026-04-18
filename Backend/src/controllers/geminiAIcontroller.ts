import "dotenv/config";
import type { Request, Response } from "express";
import ai from "../lib/geminiAI.js";

const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const AIResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: { temperature: 0.7 },
    });

    // Use .text to get the string from the first candidate
    const replyText = AIResponse.text;

    // Log it to verify it's not empty in your Render logs
    console.log("Gemini Response:", replyText);
    res.status(200).json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in geminiAI Controller:", error.message);
    res.status(500).json({ message: "Error communicating with AI" });
  }
};

export { generateResponse };
