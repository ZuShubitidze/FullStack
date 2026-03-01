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

app.use(
  cors({
    origin: "http://localhost:5173", // Default for Vite/React
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

// Listen to server port
const server = app.listen(3000, () => {
  console.log("Server is ruuning on port http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send("Main page server");
});
