import "server-only";
import { z } from "zod";

// Server-only secrets. Public (NEXT_PUBLIC_*) values are read directly in
// `@/config/site` — they aren't secret and don't need this guard.
const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required — set it in .env (see .env.example)"),
  // Signs/verifies the Auth.js session JWT. Generate with `openssl rand
  // -base64 32` — never reuse across environments.
  AUTH_SECRET: z
    .string()
    .min(1, "AUTH_SECRET is required — set it in .env (see .env.example)"),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;
