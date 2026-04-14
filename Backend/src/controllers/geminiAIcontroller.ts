import "dotenv/config";
import type { Request, Response } from "express";
import axios from "axios";

const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const pythonResponse = await axios.post(
      "http://127.0.0.1:8000/geminiAI/generateResponse",
      {
        prompt: prompt,
      },
    );

    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: prompt,
    //   config: {
    //     temperature: 0.7,
    //   },
    // });

    res.status(200).json(pythonResponse.data);
  } catch (error) {
    res.status(500).json({ message: "Error in controller" });
    console.log("Error in geminiAI Controller");
  }
};

export { generateResponse };
