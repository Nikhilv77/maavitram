import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/lib/env";

// Prisma 7 requires a driver adapter — no more bare `new PrismaClient()`
// reading DATABASE_URL implicitly. `@prisma/adapter-pg` is the plain
// node-postgres adapter; it works with Neon's pooled connection string
// as-is, no Neon-specific package needed.
const adapter = new PrismaPg(env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
