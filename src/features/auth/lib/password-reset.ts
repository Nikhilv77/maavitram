import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { hash as hashPassword } from "bcryptjs";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { siteConfig } from "@/config/site";
import {
  renderResetEmailHtml,
  renderResetEmailText,
} from "@/features/auth/lib/reset-email";

/** How long a reset link stays valid. */
export const RESET_TOKEN_TTL_MINUTES = 30;

/** Matches the cost used by the admin CLI scripts. */
const BCRYPT_COST = 12;

/**
 * Reset tokens are 256 bits of CSPRNG output, so a fast hash is the right
 * choice here — unlike a password, there is nothing to brute-force. bcrypt
 * would also make lookup impossible: its salt is per-hash, so we could
 * never find the row by hashing the token from the URL.
 */
function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

function generateRawToken(): string {
  // base64url: safe in a query string with no encoding, unlike base64.
  return randomBytes(32).toString("base64url");
}

/**
 * Creates a reset link for the admin with this email and sends it.
 *
 * Returns nothing either way. Callers must not vary their response on
 * whether the address matched — that would turn this endpoint into an
 * oracle for whether an account exists.
 */
export async function requestPasswordResetFor(email: string): Promise<void> {
  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin) return;

  // Only the newest link should work. Deleting rather than marking used
  // keeps the table from growing with dead rows.
  await db.passwordResetToken.deleteMany({
    where: { adminId: admin.id, usedAt: null },
  });

  const rawToken = generateRawToken();
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60_000);

  await db.passwordResetToken.create({
    data: { adminId: admin.id, tokenHash: hashToken(rawToken), expiresAt },
  });

  // The raw token exists only here and in the email — never in the database.
  const resetUrl = new URL("/auth/reset-password", siteConfig.url);
  resetUrl.searchParams.set("token", rawToken);

  const payload = {
    resetUrl: resetUrl.toString(),
    expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
  };

  await sendMail({
    to: admin.email,
    subject: "Reset your Maavitram admin password",
    html: renderResetEmailHtml(payload),
    text: renderResetEmailText(payload),
  });
}

/** Constant-time compare, so a token can't be recovered by timing. */
function hashesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

interface ValidToken {
  id: string;
  adminId: string;
}

/**
 * Looks up a live token by its raw value. Returns null when it's unknown,
 * already used, or past its expiry — the caller shows the same message
 * for all three rather than explaining which.
 */
async function findValidToken(rawToken: string): Promise<ValidToken | null> {
  const tokenHash = hashToken(rawToken);
  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, adminId: true, tokenHash: true, usedAt: true, expiresAt: true },
  });

  if (!record) return null;
  if (!hashesMatch(record.tokenHash, tokenHash)) return null;
  if (record.usedAt) return null;
  if (record.expiresAt.getTime() <= Date.now()) return null;

  return { id: record.id, adminId: record.adminId };
}

/** Whether a link is still usable — for rendering the reset page. */
export async function isResetTokenValid(rawToken: string): Promise<boolean> {
  return (await findValidToken(rawToken)) !== null;
}

export type ResetOutcome = "ok" | "invalid-token";

/**
 * Applies a new password and burns the token. The update and the burn run
 * in one transaction so a failure can't leave the password changed with
 * the link still live.
 */
export async function resetPasswordWithToken(
  rawToken: string,
  newPassword: string,
): Promise<ResetOutcome> {
  const token = await findValidToken(rawToken);
  if (!token) return "invalid-token";

  const passwordHash = await hashPassword(newPassword, BCRYPT_COST);

  await db.$transaction([
    db.adminUser.update({
      where: { id: token.adminId },
      data: { passwordHash },
    }),
    db.passwordResetToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    }),
    // Any other outstanding link is void once the password changes.
    db.passwordResetToken.deleteMany({
      where: { adminId: token.adminId, usedAt: null },
    }),
  ]);

  return "ok";
}
