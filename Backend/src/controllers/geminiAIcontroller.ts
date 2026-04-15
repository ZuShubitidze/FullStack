import "dotenv/config";
import type { Request, Response } from "express";
import axios from "axios";

const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const PYTHON_SERVICE_URL =
      process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

    const pythonResponse = await axios.post(
      `${PYTHON_SERVICE_URL}/geminiAI/generateResponse`,
      { prompt },
    );

    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: prompt,
    //   config: {
    //     temperature: 0.7,
    //   },
    // });

    res.status(200).json(pythonResponse.data);
  } catch (error: any) {
    console.error("Error in geminiAI Controller:", error.message);
    res
      .status(500)
      .json({ message: "Error communicating with Python service" });
  }
};

export { generateResponse };
