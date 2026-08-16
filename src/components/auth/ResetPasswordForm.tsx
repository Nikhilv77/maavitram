"use client";

import { useActionState } from "react";
import { PasswordField } from "@/components/auth/PasswordField";
import {
  resetPassword,
  type ResetPasswordActionState,
} from "@/features/auth/lib/actions";
import { cn } from "@/lib/utils";

interface ResetPasswordFormProps {
  token: string;
}

const initialState: ResetPasswordActionState = {};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* The page validated this token before rendering, but it's re-checked
          server-side on submit — the link could expire in between. */}
      <input type="hidden" name="token" value={token} />

      <PasswordField
        id="reset-password"
        name="password"
        label="New password"
        autoComplete="new-password"
      />
      <PasswordField
        id="reset-confirm-password"
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
      />

      <p className="-mt-2 text-xs text-muted">
        Use at least 8 characters.
      </p>

      {state.error ? (
        <p role="alert" className="text-sm text-red">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "btn btn-primary mt-1 h-13 w-full hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none",
          "transition-[background-color,border-color,color,transform,box-shadow] duration-[var(--duration-fast)]",
        )}
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
