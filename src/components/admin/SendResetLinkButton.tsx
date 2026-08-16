"use client";

import { useActionState } from "react";
import { CircleCheck, Mail } from "lucide-react";
import {
  sendResetLinkToSelf,
  type SelfResetActionState,
} from "@/features/auth/lib/actions";
import { cn } from "@/lib/utils";

const initialState: SelfResetActionState = {};

export function SendResetLinkButton() {
  const [state, formAction, pending] = useActionState(
    sendResetLinkToSelf,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "btn btn-primary h-10 w-fit gap-2 px-4 text-xs disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        {pending ? "Sending…" : "Email me a reset link"}
      </button>

      {state.sentTo ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-md bg-green/10 px-3 py-2.5 text-xs text-green-dark"
        >
          <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            Reset link sent to <strong>{state.sentTo}</strong>. It expires in 30
            minutes and works once.
          </span>
        </p>
      ) : null}

      {state.error ? (
        <p
          role="alert"
          className="rounded-md bg-red/10 px-3 py-2.5 text-xs text-red"
        >
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
