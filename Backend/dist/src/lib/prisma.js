import "dotenv/config"; // Load .env variables
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
import { PrismaClient } from "generated/prisma/client.ts";
const { Pool } = pkg;
// 1. Create the connection pool for PostgreSQL
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
// 2. Initialize the Prisma Adapter
// const adapter = new PrismaPg(pool);
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
// 3. Create the Prisma Client instance
export const prisma = new PrismaClient({ adapter });
//# sourceMappingURL=prisma.js.map