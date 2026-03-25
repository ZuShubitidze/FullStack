import dotenv from "dotenv";
import { afterAll, beforeAll, vi } from "vitest";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
import { prisma } from "../lib/prisma.js";

beforeAll(async () => {
  // Confirm it's Neon now
  console.log("🚀 TEST SETUP DB:", process.env.DATABASE_URL);

  // Optional: If using a singleton that won't change,
  // you may need to manually re-assign the adapter or use a fresh client.
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

vi.mock("../queues/emailQueue.js", () => ({
  // 🚀 The key must match the function name in the real file
  addEmailToQueue: vi.fn().mockResolvedValue({ id: "mock-id" }),

  // If you also export the queue itself, add it here too
  emailQueue: {
    add: vi.fn().mockResolvedValue({ id: "mock-id" }),
    on: vi.fn(),
  },
}));
