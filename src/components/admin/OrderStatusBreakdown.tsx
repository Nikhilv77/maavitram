import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { orderStatusStyle } from "@/components/admin/order-status";
import { formatPrice } from "@/features/products/lib/pricing";
import { orderStatusLabel } from "@/features/orders/lib/status";
import type { StatusBreakdownLine } from "@/features/admin/lib/mock-analytics";
import { cn } from "@/lib/utils";

interface OrderStatusBreakdownProps {
  lines: StatusBreakdownLine[];
  className?: string;
  delay?: number;
}

export function OrderStatusBreakdown({
  lines,
  className,
  delay,
}: OrderStatusBreakdownProps) {
  const total = lines.reduce((sum, line) => sum + line.count, 0);
  const present = lines.filter((line) => line.count > 0);

  return (
    <Panel
      title="Order Status"
      // Scoped deliberately: this counts the current order book, not the
      // revenue trend above it.
      description={`How the ${total} orders on the books are split`}
      className={className}
      delay={delay}
      action={
        <Link
          href="/admin/orders"
          className="group inline-flex items-center gap-1 text-xs font-medium text-green transition-colors duration-[var(--duration-fast)] hover:text-green-dark"
        >
          View orders
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      }
    >
      {/* One bar, segmented by status — a stacked proportion reads faster
          than four separate bars when the question is "what's the mix?" */}
      <div
        role="img"
        aria-label={present
          .map(
            (line) =>
              `${orderStatusLabel[line.status]}: ${line.count} of ${total}`,
          )
          .join(", ")}
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-foreground/6"
      >
        {present.map((line) => (
          <div
            key={line.status}
            style={{ width: `${line.share * 100}%` }}
            className={cn("h-full", orderStatusStyle[line.status].dot)}
          />
        ))}
      </div>

      <ul className="mt-5 grid flex-1 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
        {lines.map((line) => (
          <li key={line.status} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full",
                orderStatusStyle[line.status].dot,
              )}
            />
            <div className="min-w-0">
              <p className="text-xs text-muted">
                {orderStatusLabel[line.status]}
              </p>
              <p className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-lg font-semibold tabular-nums text-foreground">
                  {line.count}
                </span>
                <span className="text-xs tabular-nums text-muted">
                  {formatPrice(line.revenue)}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
