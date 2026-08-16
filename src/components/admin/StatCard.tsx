import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StatTone = "green" | "gold" | "saumya" | "red";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: StatTone;
  /** Period-over-period change, e.g. 12.4 or -3.1. Omit to hide the row. */
  deltaPercent?: number;
  /** What the delta is measured against, e.g. "vs last month". */
  deltaLabel?: string;
  /**
   * Inverts the delta's colour. For metrics where "up" is bad (low stock
   * climbing), a rise should read as a warning, not as success.
   */
  invertDelta?: boolean;
  /**
   * Plain secondary line, for counts where a percentage change isn't
   * meaningful ("across 4 blends"). Ignored when a delta is supplied.
   */
  hint?: string;
  /** Stagger offset in ms for the entrance animation. */
  delay?: number;
}

// Static maps, not template strings — Tailwind's scanner only sees class
// names it can read literally in the source.
const iconToneClass: Record<StatTone, string> = {
  green: "bg-green/10 text-green",
  gold: "bg-gold/15 text-achaari",
  saumya: "bg-saumya/12 text-saumya",
  red: "bg-red/10 text-red",
};

/** A single headline metric tile for the dashboard's top row. */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "green",
  deltaPercent,
  deltaLabel,
  invertDelta = false,
  hint,
  delay = 0,
}: StatCardProps) {
  const hasDelta = typeof deltaPercent === "number";
  const isUp = hasDelta && deltaPercent > 0;
  const isPositive = invertDelta ? !isUp : isUp;
  const DeltaIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "animate-rise-in group rounded-lg bg-surface p-5 ",
        // Lifts on hover. Transform + shadow only, so nothing around it
        // reflows.
        "transition-[box-shadow,transform] duration-[var(--duration-base)] ease-out",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <span
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            "transition-transform duration-[var(--duration-base)] ease-out group-hover:scale-110",
            iconToneClass[tone],
          )}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 text-[1.75rem] leading-none font-semibold tracking-tight text-foreground">
        {value}
      </p>

      {hasDelta ? (
        <p className="mt-3 flex flex-wrap items-center gap-x-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-medium",
              isPositive ? "bg-saumya/10 text-saumya" : "bg-red/10 text-red",
            )}
          >
            <DeltaIcon className="h-3 w-3" aria-hidden="true" />
            {isUp ? "+" : ""}
            {deltaPercent.toFixed(1)}%
          </span>
          {deltaLabel ? <span className="text-muted">{deltaLabel}</span> : null}
        </p>
      ) : hint ? (
        <p className="mt-3 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
