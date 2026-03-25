// import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { pinoHttp } from "pino-http";
import "./workers/emailWorker.js";

const app = express();
const httpServer = createServer(app); // Wrap Express app

// Configure Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Socket connection test
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Listen for the join event
  socket.on("join_user_room", (userId) => {
    socket.join(userId.toString());
    console.log(`👤 User ${userId} joined room: ${socket.id}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ User disconnected:", socket.id, "Reason:", reason);
  });
});

// Allowed Domains
const allowedOrigins = [
  "http://localhost:5173", // Local Vite/React dev
  process.env.FRONTEND_URL, // Vercel URL
];
// Allow domains access CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no origin (like mobile apps/Postman)
      if (!origin) return callback(null, true);

      // Check if it's in the allowed list or is a Vercel preview URL
      const isVercelPreview = /\.vercel\.app$/.test(origin);
      const isAllowed = allowedOrigins.includes(origin);

      if (isAllowed || isVercelPreview) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked this request"));
      }
    },
    credentials: true, // Allow the browser to send/receive the JWT cookie
  }),
);
// Middleware
app.use(express.json());

// Automatically logs every HTTP request and response
if (process.env.NODE_ENV !== "production") {
  app.use(
    pinoHttp({
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    }),
  );
} else {
  app.use(pinoHttp());
}

app.use(helmet());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Custom JSON response
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      status: "Error",
      message: options.message,
      error: "TOO_MANY_REQUESTS",
    });
  },
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.set("trust proxy", 1); // Necessary for Render
app.use(limiter);

app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request to: ${req.url}`);
  next();
});

// API Routes
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/notifications", notificationRoutes);
app.use("/posts/:postId/comments", commentRoutes);

app.use(errorHandler);

// Health Check
app.get("/health", async (req, res) => {
  try {
    // Quick "ping" to the database
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("VERSION 4.0 - TESTING TS");
});

export { app, io, httpServer };
