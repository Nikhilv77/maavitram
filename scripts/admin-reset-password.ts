import "dotenv/config";
import { input, password } from "@inquirer/prompts";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// Relative, not "@/schemas/auth" — see scripts/admin-create.ts.
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
  const rawEmail = await input({ message: "Admin email:" });
  const emailResult = adminCredentialsSchema.shape.email.safeParse(rawEmail);
  if (!emailResult.success) {
    console.error("Enter a valid email address.");
    process.exitCode = 1;
    return;
  }

  const admin = await db.adminUser.findUnique({
    where: { email: emailResult.data },
  });
  if (!admin) {
    console.error(`No admin found for ${emailResult.data}.`);
    process.exitCode = 1;
    return;
  }

  const rawPassword = await password({
    message: "New password (min 8 characters):",
    mask: "*",
    validate: (value) =>
      adminCredentialsSchema.shape.password.safeParse(value).success ||
      "Password must be at least 8 characters",
  });

  const confirmPassword = await password({
    message: "Confirm new password:",
    mask: "*",
  });

  if (rawPassword !== confirmPassword) {
    console.error("Passwords do not match. Nothing was changed.");
    process.exitCode = 1;
    return;
  }

  // The raw password is never logged or persisted anywhere — only its
  // hash, computed here, ever reaches the database.
  const passwordHash = await hash(rawPassword, BCRYPT_COST);

  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  console.log(`✔ Password updated for ${admin.email}`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exitCode = 1;
  });
