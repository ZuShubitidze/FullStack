import { Queue } from "bullmq";
import { redisConnection } from "../lib/redis.js";

export const emailQueue = new Queue("email-queue", {
  connection: redisConnection as any,
});

export const addEmailToQueue = async (
  to: string,
  subject: string,
  template: string,
  context: object,
) => {
  await emailQueue.add(
    "send-email",
    {
      to,
      subject,
      template, // e.g. Welcome
      context, // e.g., { name: "John", appName: "MyStore" }
    },
    {
      attempts: 3, // Retry 3 times if it fails
      backoff: { type: "exponential", delay: 1000 }, // Wait 1s, then 2s, then 4s...
      removeOnComplete: { count: 50 }, // Keep only the last 100 successful jobs
      removeOnFail: { age: 24 * 3600 }, // Keep failed jobs for 24 hours for debugging
    },
  );
};
