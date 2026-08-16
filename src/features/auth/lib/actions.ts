"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  requestPasswordResetFor,
  resetPasswordWithToken,
} from "@/features/auth/lib/password-reset";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/schemas/auth";

export interface LoginActionState {
  error?: string;
}

export async function login(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    // A successful signIn() redirects by throwing Next's internal
    // NEXT_REDIRECT signal — only AuthError means the login itself
    // failed. Anything else must be rethrown or the redirect never happens.
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/auth/login" });
}

export interface ForgotPasswordActionState {
  error?: string;
  /** Set once the request has been accepted, whatever the address was. */
  sent?: boolean;
}

/**
 * Always reports the same outcome for a well-formed address, whether or
 * not it matches the admin. Confirming which addresses exist would let
 * anyone enumerate the account.
 *
 * A send failure is also swallowed into that same response — surfacing
 * "we couldn't email you" would leak that the address *did* match. The
 * cause is logged server-side instead.
 */
export async function requestPasswordReset(
  _prevState: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await requestPasswordResetFor(parsed.data.email);
  } catch (error) {
    console.error("[password-reset] failed to send reset email:", error);
  }

  return { sent: true };
}

export interface SelfResetActionState {
  error?: string;
  /** The address the link went to, echoed back on success. */
  sentTo?: string;
}

/**
 * Emails a reset link to the signed-in admin's own address, for the
 * Settings screen.
 *
 * Unlike the public forgot-password action, this one reports real
 * failures: the caller is already authenticated, so there's no account to
 * enumerate and nothing to hide behind a generic message. A silent
 * "check your inbox" here would just leave the admin waiting for an email
 * that a bad SMTP password stopped from ever being sent.
 *
 * The recipient is resolved from the session's admin row, never from
 * client input.
 */
export async function sendResetLinkToSelf(
  _prevState: SelfResetActionState,
  _formData: FormData,
): Promise<SelfResetActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Your session has expired. Sign in again." };
  }

  const admin = await db.adminUser.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });
  if (!admin) {
    return { error: "Admin account not found." };
  }

  try {
    await requestPasswordResetFor(admin.email);
  } catch (error) {
    console.error("[password-reset] settings request failed:", error);
    return {
      error:
        "Couldn't send the email. Check the SMTP settings in .env, then try again.",
    };
  }

  return { sentTo: admin.email };
}

export interface ResetPasswordActionState {
  error?: string;
}

export async function resetPassword(
  _prevState: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const outcome = await resetPasswordWithToken(
    parsed.data.token,
    parsed.data.password,
  );

  if (outcome === "invalid-token") {
    return {
      error:
        "This reset link is invalid or has expired. Request a new one to continue.",
    };
  }

  // Outside the try/catch above on purpose: redirect() signals by throwing.
  redirect("/auth/login?reset=success");
}
