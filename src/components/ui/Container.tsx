import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Responsive content wrapper capped at the theme's 1440px max-width. */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container", className)} {...props} />;
}
