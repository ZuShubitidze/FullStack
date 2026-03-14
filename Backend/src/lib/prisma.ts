import "dotenv/config"; // Load .env variables
import { PrismaPg } from "@prisma/adapter-pg";
// import pg from "pg";
import { Pool } from "pg";
import { PrismaClient } from "generated/prisma/client.ts";

// const { Pool } = pg;

// 1. Create the connection pool for PostgreSQL
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

// 2. Initialize the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Create the Prisma Client instance
export const prisma = new PrismaClient({ adapter });
