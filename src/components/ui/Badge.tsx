import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "gold" | "red" | "muted";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClassName: Record<BadgeTone, string> = {
  green: "bg-green/10 text-green-dark",
  gold: "bg-gold/15 text-achaari",
  red: "bg-red/10 text-red",
  muted: "bg-foreground/5 text-muted",
};

export function Badge({ tone = "muted", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        toneClassName[tone],
        className,
      )}
      {...props}
    />
  );
}
