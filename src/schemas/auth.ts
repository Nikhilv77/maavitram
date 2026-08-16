import { z } from "zod";

/**
 * Login form input. Password is presence-only here — complexity rules
 * belong at creation/reset time (see `adminCredentialsSchema`), not on
 * every sign-in attempt, where the real check is the passwordHash
 * comparison anyway.
 */
export const loginSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Used by the `admin:create` / `admin:reset-password` CLI scripts —
 * the only two places an admin's credentials are ever set.
 */
export const adminCredentialsSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminCredentialsInput = z.infer<typeof adminCredentialsSchema>;

/** Just the address — the response is identical whether it matches or not. */
export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * New password from a reset link. Reuses the same minimum as the CLI so a
 * password set by email can't be weaker than one set by
 * `pnpm admin:reset-password`.
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "This reset link is missing its token"),
    password: adminCredentialsSchema.shape.password,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
