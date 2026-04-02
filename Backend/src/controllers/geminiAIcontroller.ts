import ai from "@lib/geminiAI.js";
import "dotenv/config";
import type { Request, Response } from "express";

const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    // const response2 = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: "Explain how AI works",
    //   config: {
    //     temperature: 0.7,
    //   },
    // });

    console.log(response);
    res.status(200).json({ reply: response });
  } catch (error: any) {
    console.error("Gemini AI Error:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

export { generateResponse };
