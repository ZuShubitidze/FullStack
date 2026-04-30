import "dotenv/config";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import axios from "axios";
import cloudinary from "../lib/cloudinary.js";

const pythonServiceUrl = "https://fullstack-1-w4l1.onrender.com/chat";

const getAIRequests = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const AIRequests = await prisma.airequest.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    take: 20, // Limit
  });

  res.status(200).json(AIRequests);
};

const chat = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.id;
    let imageUrl = null;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cloudRes = await cloudinary.uploader.upload(dataURI);
      imageUrl = cloudRes.secure_url;
    }

    const dbHistory = await prisma.airequest.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "asc" },
    });

    // Format for Gemini
    const formattedHistory = dbHistory.flatMap((msg) => [
      { role: "user", parts: [{ text: msg.prompt }] },
      { role: "model", parts: [{ text: msg.text }] },
    ]);
    console.log("ImageURL:", imageUrl);
    // Call Python service on Render
    const pythonServiceUrl = "https://fullstack-1-w4l1.onrender.com/chat";
    console.log("SENDING TO PYTHON:", {
      prompt,
      imageUrl,
      historyCount: formattedHistory.length,
    });
    const pythonRes = await axios.post(
      pythonServiceUrl,
      { prompt: prompt, history: formattedHistory, imageUrl },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "stream", // Get Streaming Response
      },
    );

    // 2. Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullReply = "";

    // Listen to the stream data to save to DB later
    pythonRes.data.on("data", (chunk: any) => {
      const chunkStr = chunk.toString();
      fullReply += chunkStr.replace("data: ", "").replace("\n\n", "");

      // Send the chunk immediately to the frontend
      res.write(chunkStr);
    });
    console.log("Full Reply:", fullReply, "Python Response:", pythonRes);

    res.status(200).json({ reply: fullReply });

    // When the stream finishes, save to Prisma and end the response
    pythonRes.data.on("end", async () => {
      if (fullReply) {
        await prisma.airequest.create({
          data: {
            userId: userId,
            text: fullReply,
            prompt: prompt,
          },
        });
      }
      res.end();
    });

    // Save to DB
    // if (pythonRes.data.reply) {
    //   await prisma.airequest.create({
    //     data: {
    //       userId: userId,
    //       text: pythonRes.data.reply,
    //       prompt: prompt,
    //     },
    //   });
    // }

    // res.status(200).json({
    //   reply: pythonRes.data.reply,
    //   data: pythonRes.data,
    //   date: pythonRes.headers["date"],
    //   chatHistory: formattedHistory,
    // });
  } catch (error: any) {
    console.error("Error calling Python service:", error);
    res.status(500).write(`data: Error: ${error.message}\n\n`);
    res.end();
  }
};

const generateImage = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  // const pythonServiceUrl = "https://fullstack-1-w4l1.onrender.com/chat"
  console.log(pythonServiceUrl);
  const pythonRes = await axios.post(`${pythonServiceUrl}/generateImage`, {
    prompt,
  });
  res.status(200).json({
    reply: pythonRes.data.reply,
    generatedImage: pythonRes.data.imageUrl,
  });
};

export { getAIRequests, chat, generateImage };
