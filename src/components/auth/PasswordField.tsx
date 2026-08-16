"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authInputClass } from "@/components/auth/auth-input-class";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id: string;
  name?: string;
  label?: string;
  autoComplete?: string;
  required?: boolean;
}

/** Password input with a show/hide toggle. Owns its own visibility state. */
export function PasswordField({
  id,
  name = "password",
  label = "Password",
  autoComplete = "new-password",
  required = true,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className={cn(authInputClass, "pr-12")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className={cn(
            "absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-foreground/50",
            "transition-colors duration-[var(--duration-fast)] hover:text-green",
          )}
        >
          {visible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
