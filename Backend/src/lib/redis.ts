import { Redis } from "ioredis";

// Use 'rediss' prefix for TLS on Render
export const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

redisConnection.on("connect", () =>
  console.log("✅ Redis connected successfully"),
);
redisConnection.on("error", (err) =>
  console.error("❌ Redis connection error:", err),
);
const info = await redisConnection.info("memory");
console.log("Redis", info);
