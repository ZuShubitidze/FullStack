import "dotenv/config";
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
// Basic connection test
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
app.use(cors({
    origin: function (origin, callback) {
        // Allow no origin (like mobile apps/Postman)
        if (!origin)
            return callback(null, true);
        // Check if it's in the allowed list or is a Vercel preview URL
        const isVercelPreview = /\.vercel\.app$/.test(origin);
        const isAllowed = allowedOrigins.includes(origin);
        if (isAllowed || isVercelPreview) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS blocked this request"));
        }
    },
    credentials: true, // Allow the browser to send/receive the JWT cookie
}));
// Middleware
app.use(express.json());
// Ensure the server is running with DatabaseURL
async function main() {
    try {
        await prisma.$connect();
        console.log("🚀 Database connected successfully");
    }
    catch (e) {
        console.error("❌ Database connection failed:", e.message);
        process.exit(1);
    }
}
main();
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(`${req.method} request to: ${req.url}`);
    next();
});
app.post("/test-upload", (req, res) => {
    res.json({ message: "Server is alive" });
});
// API Routes
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/notifications", notificationRoutes);
app.use("/posts/:postId/comments", commentRoutes);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("VERSION 4.0 - TESTING TS");
});
export { io };
//# sourceMappingURL=server.js.map