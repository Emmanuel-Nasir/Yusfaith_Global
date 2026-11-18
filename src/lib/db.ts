/*
  DATABASE CLIENT (Prisma)
  One shared connection for the whole server. DATABASE_URL comes from the
  environment (.env locally, Vercel → Settings → Environment Variables live).
*/
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

/** null when DATABASE_URL is not set, so the site keeps working without a database. */
export const prisma: PrismaClient | null = process.env.DATABASE_URL
  ? (globalForPrisma.prisma ??= createClient())
  : null;
