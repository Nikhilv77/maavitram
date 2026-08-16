"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { AuthTextField } from "@/components/auth/AuthTextField";
import {
  requestPasswordReset,
  type ForgotPasswordActionState,
} from "@/features/auth/lib/actions";
import { cn } from "@/lib/utils";

const initialState: ForgotPasswordActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  // Wording is deliberately non-committal about whether the address
  // matched — the action behaves identically either way.
  if (state.sent) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
          <MailCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-foreground">Check your inbox</p>
        <p className="max-w-xs text-sm text-muted">
          If that address belongs to the Maavitram admin, a reset link is on
          its way. It expires in 30 minutes.
        </p>
        <Link
          href="/auth/login"
          className="group mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-green transition-colors duration-[var(--duration-fast)] hover:text-green-dark"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <AuthTextField
        id="forgot-email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
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
          "transition-[background-color,border-color,color,transform,box-shadow] duration-[var(--duration-fast)]",
        )}
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>

      <Link
        href="/auth/login"
        className="group inline-flex items-center justify-center gap-1.5 text-sm text-muted transition-colors duration-[var(--duration-fast)] hover:text-green"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to sign in
      </Link>
    </form>
  );
}
