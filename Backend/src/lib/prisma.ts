import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
import { PrismaClient } from "@prisma/client";

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

// Pass the pool directly to the adapter
const adapter = new PrismaPg(pool as any);

const prisma = new PrismaClient({ adapter });

export default prisma;
