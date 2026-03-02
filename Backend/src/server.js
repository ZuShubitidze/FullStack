import "dotenv/config";
import { prisma } from "./lib/prisma.ts";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import cors from "cors";

const app = express();
// Middleware
app.use(express.json());

// Allowed Domains
const allowedOrigins = [
  "http://localhost:5173", // Local Vite/React dev
  process.env.FRONTEND_URL, // Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Allow no origin (like mobile apps/Postman)
      if (!origin) return callback(null, true);

      // 2. Check if it's in the allowed list or is a Vercel preview URL
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

// Ensure the server is running with DatabaseURL
async function main() {
  try {
    await prisma.$connect();
    console.log("🚀 Database connected successfully");
  } catch (e) {
    console.error("❌ Database connection failed:", e.message);
    process.exit(1);
  }
}
main();

app.use(cookieParser());

// API Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:postId/comments", commentRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Main page server");
});
