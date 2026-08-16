import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  /** Small supporting line under the title. */
  description?: string;
  /** Right-aligned slot in the header — a "View all" link, a total, etc. */
  action?: ReactNode;
  className?: string;
  /** Applied to the body wrapper — pass "p-0" for edge-to-edge content. */
  bodyClassName?: string;
  /** Stagger offset in ms for the entrance animation. */
  delay?: number;
  children: ReactNode;
}

/**
 * The single card shell every dashboard section sits in. Borderless by
 * design — separation comes from the surface/background contrast and a
 * soft shadow, so the grid reads as floating cards rather than a page
 * full of boxes.
 */
export function Panel({
  title,
  description,
  action,
  className,
  bodyClassName,
  delay = 0,
  children,
}: PanelProps) {
  return (
    <section
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "animate-rise-in flex flex-col rounded-lg bg-surface",
        className,
      )}
    >
      {/* `flex-wrap` + `max-w-full` on the action let a wide action (the
          products search + category filters) drop to its own line and wrap
          internally, instead of `shrink-0` forcing it to its full
          max-content width and overflowing the panel on narrow screens.
          Small actions — a "View all" link — still sit inline. */}
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 px-5 pt-5 pb-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs text-muted">{description}</p>
          ) : null}
        </div>
        {action ? <div className="max-w-full shrink-0">{action}</div> : null}
      </header>

      <div className={cn("flex flex-1 flex-col px-5 pb-5", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}
