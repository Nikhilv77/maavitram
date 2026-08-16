"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  /** Overrides the track styling — the storefront sits it on white. */
  className?: string;
  /** Forwarded to the text field so a dialog can focus it on open. */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * Minus/plus stepper with an editable centre.
 *
 * Deliberately a text input with `inputMode="numeric"` rather than
 * `type="number"`: the native control paints browser spinner arrows that
 * can't be styled and differ per platform, and it lets scroll wheels
 * silently change the value while the field has focus. This keeps the
 * numeric keypad on mobile without either problem.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99_999,
  label,
  className,
  inputProps,
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const buttonClass = cn(
    "inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md",
    "text-foreground/70 transition-colors duration-[var(--duration-fast)]",
    "hover:bg-green/10 hover:text-green disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground/70",
  );

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-background p-1",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={buttonClass}
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        aria-label={label}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "");
          // Empty is allowed mid-typing; it settles to `min` on blur.
          onChange(digits === "" ? 0 : Math.min(max, Number(digits)));
        }}
        onBlur={() => onChange(clamp(value))}
        onFocus={(event) => event.target.select()}
        className="h-10 w-16 rounded-md bg-transparent text-center text-base font-semibold tabular-nums text-foreground focus:outline-none"
        {...inputProps}
      />

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={buttonClass}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
