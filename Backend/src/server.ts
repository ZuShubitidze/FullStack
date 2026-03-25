import { httpServer } from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("🚀 Database connected successfully");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e: any) {
    console.error("❌ Database connection failed:", e.message);
    process.exit(1);
  }
}

startServer();
