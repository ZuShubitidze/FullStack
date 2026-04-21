import "dotenv/config";
import type { Request, Response } from "express";
import ai from "../lib/geminiAI.js";
import prisma from "../lib/prisma.js";
import axios from "axios";

const generateResponse = async (req: Request, res: Response) => {
  // const { prompt } = req.body;
  // const userId = req.user.id;

  // const AIResponse = await ai.models.generateContent({
  //   model: "gemini-2.5-flash-lite",
  //   contents: prompt,
  //   config: { temperature: 0.7 },
  // });

  // const replyText = AIResponse.text;

  // if (replyText) {
  //   await prisma.airequest.create({
  //     data: {
  //       userId: userId,
  //       text: replyText,
  //       prompt: prompt,
  //     },
  //   });
  // }

  // res.status(200).json({ reply: replyText, AIResponse });

  // Python
  try {
    const { prompt } = req.body;
    const userId = req.user.id;
    // Call Python service on Render
    const pythonServiceUrl = "https://fullstack-1-w4l1.onrender.com/generate";
    const response = await axios.post(
      pythonServiceUrl,
      { prompt: prompt },
      { headers: { "Content-Type": "application/json" } },
    );
    const replyText = response.data.reply;

    // Save to DB
    if (replyText) {
      await prisma.airequest.create({
        data: {
          userId: userId,
          text: replyText,
          prompt: prompt,
        },
      });
    }
    res.status(200).json({
      reply: replyText,
      data: response.data,
      date: response.headers["date"],
    });
  } catch (error: any) {
    console.error("Error calling Python service:", error);
    console.log("Error Message:", error.message);
    res.status(500).json({ error: "AI Service unavailable" });
  }
};

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

    const dbHistory = await prisma.airequest.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Format for Gemini
    const formattedHistory = dbHistory.flatMap((msg) => [
      { role: "user", parts: [{ text: msg.prompt }] },
      { role: "model", parts: [{ text: msg.text }] },
    ]);

    // const history = previousMessages

    // Call Python service on Render
    const pythonServiceUrl = "https://fullstack-1-w4l1.onrender.com/chat";
    const response = await axios.post(
      pythonServiceUrl,
      { prompt: prompt, history: formattedHistory },
      { headers: { "Content-Type": "application/json" } },
    );
    const replyText = response.data.reply;

    // Save to DB
    if (replyText) {
      await prisma.airequest.create({
        data: {
          userId: userId,
          text: replyText,
          prompt: prompt,
        },
      });
    }

    res.status(200).json({
      reply: replyText,
      data: response.data,
      date: response.headers["date"],
      chatHistory: history,
    });
  } catch (error: any) {
    console.error("Error calling Python service:", error);
    console.log("Error Message:", error.message);
    res.status(500).json({ error: "AI Service unavailable" });
  }
};

export { generateResponse, getAIRequests, chat };
