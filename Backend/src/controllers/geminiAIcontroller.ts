import "dotenv/config";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import axios from "axios";

const pythonServiceUrl = "https://fullstack-1-w4l1.onrender.com";

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
    const { prompt, imageURL } = req.body;
    const userId = req.user.id;

    const dbHistory = await prisma.airequest.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "asc" },
    });

    // Format for Gemini
    const formattedHistory = dbHistory.flatMap((msg) => [
      { role: "user", parts: [{ text: msg.prompt }] },
      { role: "model", parts: [{ text: msg.text }] },
    ]);

    console.log("SENDING TO PYTHON:", {
      prompt,
      imageURL,
      historyCount: formattedHistory.length,
    });

    // Call Python service on Render
    const pythonRes = await axios.post(
      `${pythonServiceUrl}/chat`,
      { prompt: prompt, history: formattedHistory, imageURL },
      {
        adapter: "http",
        responseType: "stream", // Get Streaming Response
        headers: { "Content-Type": "application/json" },
      },
    );

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disables Nginx/Render buffering
    res.flushHeaders(); // Forces headers to be sent immediately

    let fullReply = "";

    // Listen to the stream data to save to DB later
    pythonRes.data.on("data", (chunk: any) => {
      const chunkStr = chunk.toString();
      fullReply += chunkStr.replace("data: ", "").replace("\n\n", "");

      // Send the chunk immediately to the frontend
      res.write(chunkStr);
    });
    console.log("Full Reply:", fullReply, "Python Response:", pythonRes);

    // res.status(200).json({ reply: fullReply });

    // When the stream finishes, save to Prisma and end the response
    pythonRes.data.on("end", async () => {
      try {
        if (fullReply) {
          await prisma.airequest.create({
            data: { userId, text: fullReply, prompt },
          });
        }
      } catch (err) {
        console.error("DB Save Error:", err);
      } finally {
        res.end(); // Close the frontend connection
      }
    });

    pythonRes.data.on("error", (err: any) => {
      console.error("Python Stream Error:", err);
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
export { getAIRequests, chat };
