import "dotenv/config";
import type { Request, Response } from "express";
import axios from "axios";

const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const PYTHON_SERVICE_URL =
      process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:10000";
    console.log("Calling URL:", PYTHON_SERVICE_URL);

    const pythonResponse = await axios.post(
      `${PYTHON_SERVICE_URL}/geminiAI/generateResponse`,
      // "http://fullstack-1-w4l1:10000/geminiAI/generateResponse",
      { prompt },
    );

    res.status(200).json(pythonResponse.data);
  } catch (error: any) {
    console.error("Error in geminiAI Controller:", error.message);
    res
      .status(500)
      .json({ message: "Error communicating with Python service" });
  }
};

export { generateResponse };
// uv run --active uvicorn main:app --host 0.0.0.0 --port $PORT
// uv run --active uvicorn main:app --host 0.0.0.0 --port 8000
