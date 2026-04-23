import "dotenv/config";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import axios from "axios";
import cloudinary from "../lib/cloudinary.js";

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
      const dataURI = "data:" + req.file.mimetype + ";base64" + b64;
      const cloudRes = await cloudinary.uploader.upload(dataURI);
      imageUrl = cloudRes.secure_url;
    }

    const dbHistory = await prisma.airequest.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Format for Gemini
    const formattedHistory = dbHistory.flatMap((msg) => [
      { role: "user", parts: [{ text: msg.prompt }] },
      { role: "model", parts: [{ text: msg.text }] },
    ]);

    // Call Python service on Render
    const pythonServiceUrl = "https://fullstack-1-w4l1.onrender.com/chat";
    const pythonRes = await axios.post(
      pythonServiceUrl,
      { prompt: prompt, history: formattedHistory, imageUrl },
      { headers: { "Content-Type": "application/json" } },
    );

    // Save to DB
    if (pythonRes.data.reply) {
      await prisma.airequest.create({
        data: {
          userId: userId,
          text: pythonRes.data.reply,
          prompt: prompt,
        },
      });
    }

    res.status(200).json({
      reply: pythonRes.data.reply,
      data: pythonRes.data,
      date: pythonRes.headers["date"],
      chatHistory: formattedHistory,
    });
  } catch (error: any) {
    console.error("Error calling Python service:", error);
    console.log("Error Message:", error.message);
    res.status(500).json({ error: "AI Service unavailable" });
  }
};

export { getAIRequests, chat };
