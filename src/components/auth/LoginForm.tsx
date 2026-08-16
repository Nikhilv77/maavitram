"use client";

import { useActionState } from "react";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { login, type LoginActionState } from "@/features/auth/lib/actions";
import { cn } from "@/lib/utils";

const initialState: LoginActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <AuthTextField
        id="login-email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <PasswordField
        id="login-password"
        name="password"
        autoComplete="current-password"
      />

      {state.error ? (
        <p role="alert" className="text-sm text-red">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "btn btn-primary mt-2 h-13 w-full hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none",
          // See SignupForm's original note (now here): re-specifies the
          // full property list `.btn` already transitions rather than a
          // bare `transition-shadow`, which would silently drop the
          // existing hover-color and active-press animations — Tailwind
          // utilities in `@layer utilities` always beat `.btn`'s
          // shorthand in `@layer components`.
          "transition-[background-color,border-color,color,transform,box-shadow] duration-[var(--duration-fast)]",
        )}
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
