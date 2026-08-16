import { Panel } from "@/components/admin/Panel";
import { formatPrice } from "@/features/products/lib/pricing";
import type { SalesPoint } from "@/features/admin/lib/mock-dashboard";

interface SalesOverviewChartProps {
  data: SalesPoint[];
  /** Overridable so the Analytics screen can label its own range. */
  title?: string;
  description?: string;
  className?: string;
  delay?: number;
}

const AXIS_STEP = 20_000;
/** Per-bar stagger, in ms, so the series sweeps left to right. */
const BAR_STAGGER = 45;

/**
 * Bars are sized as a percentage of a fixed-height track, so the chart
 * reflows with the panel at any width — no viewBox maths, no charting
 * dependency, no client-side JS.
 *
 * Deliberately axis-free: the headline total sits in the panel header
 * and exact figures appear on hover, which keeps the panel free of the
 * gridline clutter a full axis would add.
 */
export function SalesOverviewChart({
  data,
  title = "Sales Overview",
  description = "Revenue, last 12 months",
  className,
  delay,
}: SalesOverviewChartProps) {
  const peak = Math.max(...data.map((point) => point.revenue));
  // Round the ceiling up to a whole step so the tallest bar leaves a
  // little headroom instead of running into the top of the track.
  const axisMax = Math.ceil(peak / AXIS_STEP) * AXIS_STEP;
  const total = data.reduce((sum, point) => sum + point.revenue, 0);

  return (
    <Panel
      title={title}
      description={description}
      delay={delay}
      action={
        <p className="text-base font-semibold tracking-tight text-foreground">
          {formatPrice(total)}
        </p>
      }
      className={className}
    >
      <div
        role="img"
        aria-label={`Monthly revenue from ${data[0].month} to ${
          data[data.length - 1].month
        }, ranging from ${formatPrice(
          Math.min(...data.map((p) => p.revenue)),
        )} to ${formatPrice(peak)}.`}
        className="mt-1 flex h-52 items-end gap-1.5 sm:h-64 sm:gap-2.5"
      >
        {data.map((point, i) => (
          <div
            key={point.month}
            className="group relative flex h-full flex-1 items-end"
          >
            {/* Column highlight, hover only — gives the pointer something
                to land on without adding any resting clutter. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-md bg-foreground/0 transition-colors duration-[var(--duration-base)] group-hover:bg-foreground/[0.035]"
            />

            <div
              style={{
                height: `${(point.revenue / axisMax) * 100}%`,
                animationDelay: `${i * BAR_STAGGER}ms`,
              }}
              className="animate-grow-y relative w-full origin-bottom rounded-t-md bg-green/70 transition-colors duration-[var(--duration-base)] group-hover:bg-green"
            />

            <span
              style={{ bottom: `${(point.revenue / axisMax) * 100}%` }}
              className="pointer-events-none absolute left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 rounded-md bg-foreground px-2 py-1 text-[11px] font-medium whitespace-nowrap text-surface opacity-0 shadow-[var(--shadow-card-hover)] transition-[opacity,transform] duration-[var(--duration-fast)] group-hover:translate-y-0 group-hover:opacity-100"
            >
              {formatPrice(point.revenue)}
            </span>
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="mt-3 flex gap-1.5 sm:gap-2.5">
        {data.map((point) => (
          <span
            key={point.month}
            className="flex-1 text-center text-[11px] text-muted"
          >
            {point.month}
          </span>
        ))}
      </div>
    </Panel>
  );
}
