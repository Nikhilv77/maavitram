import type { InputHTMLAttributes } from "react";
import { authInputClass } from "@/components/auth/auth-input-class";
import { cn } from "@/lib/utils";

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

/** Labeled text input for auth forms (email, etc.) — no internal state. */
export function AuthTextField({
  label,
  id,
  className,
  ...props
}: AuthTextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input id={id} className={cn(authInputClass, className)} {...props} />
    </div>
  );
}
