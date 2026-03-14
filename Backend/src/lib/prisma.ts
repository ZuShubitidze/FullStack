import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
import { PrismaClient } from "@prisma/client";

// Use this specific destructuring for ESM compatibility
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

// Explicitly type the pool if it keeps complaining
const pool = new Pool({ connectionString });

// Pass the pool directly to the adapter
const adapter = new PrismaPg(pool as any);

export const prisma = new PrismaClient({ adapter });
