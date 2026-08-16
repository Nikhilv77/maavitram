import "dotenv/config";
import { input, password } from "@inquirer/prompts";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// Relative, not "@/schemas/auth" — tsx (run directly, outside Next's own
// bundler) doesn't resolve the tsconfig `@/*` path alias, same as
// prisma/seed.ts.
import { adminCredentialsSchema } from "../src/schemas/auth";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required — set it in .env (see .env.example)",
  );
}

const db = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

const BCRYPT_COST = 12;

async function main() {
  // There is exactly one admin — refuse to create a second one rather
  // than silently allowing it. Use `pnpm admin:reset-password` instead.
  const existing = await db.adminUser.count();
  if (existing > 0) {
    console.error(
      "An admin already exists. This project supports exactly one admin — " +
        "run `pnpm admin:reset-password` to change its credentials instead.",
    );
    process.exitCode = 1;
    return;
  }

  const email = await input({
    message: "Admin email:",
    validate: (value) =>
      adminCredentialsSchema.shape.email.safeParse(value).success ||
      "Enter a valid email address",
  });

  const rawPassword = await password({
    message: "Admin password (min 8 characters):",
    mask: "*",
    validate: (value) =>
      adminCredentialsSchema.shape.password.safeParse(value).success ||
      "Password must be at least 8 characters",
  });

  const confirmPassword = await password({
    message: "Confirm password:",
    mask: "*",
  });

  if (rawPassword !== confirmPassword) {
    console.error("Passwords do not match. Nothing was created.");
    process.exitCode = 1;
    return;
  }

  // The raw password is never logged or persisted anywhere — only its
  // hash, computed here, ever reaches the database.
  const passwordHash = await hash(rawPassword, BCRYPT_COST);

  const admin = await db.adminUser.create({
    data: { email: adminCredentialsSchema.shape.email.parse(email), passwordHash },
  });

  console.log(`✔ Admin account created for ${admin.email}`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exitCode = 1;
  });
