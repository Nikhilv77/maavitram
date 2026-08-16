import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { formatPrice } from "@/features/products/lib/pricing";
import { formatPhoneNumber, phoneHref } from "@/features/orders/lib/format";
import type { RecentOrder } from "@/features/admin/lib/mock-dashboard";
import { orderStatusStyle } from "@/components/admin/order-status";
import { orderStatusLabel } from "@/features/orders/lib/status";
import { accentChipClass } from "@/features/admin/lib/accents";
import { cn } from "@/lib/utils";

interface RecentOrdersProps {
  orders: RecentOrder[];
  className?: string;
  delay?: number;
}

const avatarTones = Object.values(accentChipClass);

/**
 * FNV-1a. A plain character sum clusters badly across a small palette
 * (adjacent names land in the same bucket); this avalanches, so the
 * tints spread evenly — measured at 940–1043 per bucket over 5,000
 * names, against an expected 1,000.
 */
function toneFor(name: string): string {
  let hash = 2166136261;
  for (const char of name) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return avatarTones[(hash >>> 0) % avatarTones.length];
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * One grid definition shared by the header and every row, so desktop
 * columns stay aligned without a <table>.
 *
 * Cards up to 2xl, five columns beyond it. This panel occupies only
 * two thirds of the dashboard grid, so it needs a much wider viewport
 * than the standalone Orders page before the columns stop crowding —
 * below that the stacked card layout reads better anyway.
 */
const ROW_GRID =
  "grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-3 2xl:grid-cols-[2.25rem_minmax(0,0.95fr)_minmax(0,1.5fr)_5rem_6.5rem] 2xl:gap-x-4";

/**
 * `display: contents` is the trick that keeps this one DOM tree: below
 * 2xl this wrapper is the third grid cell and stacks its two children
 * vertically; at 2xl it dissolves, so the amount and status become grid
 * items in their own columns.
 */
const META_STACK = "flex flex-col items-end gap-1.5 2xl:contents";

export function RecentOrders({ orders, className, delay }: RecentOrdersProps) {
  return (
    <Panel
      title="Recent Orders"
      description="Latest orders placed over WhatsApp"
      delay={delay}
      action={
        <Link
          href="/admin/orders"
          className="group inline-flex items-center gap-1 text-xs font-medium text-green transition-colors duration-[var(--duration-fast)] hover:text-green-dark"
        >
          View all
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      }
      className={className}
      bodyClassName="px-2 pb-3"
    >
      {/* Column headers only make sense where there are real columns —
          on phones each order reads as a card, so they'd just be noise. */}
      <div
        aria-hidden="true"
        className={cn(
          ROW_GRID,
          "hidden px-3 pb-2 text-[11px] font-medium tracking-wide text-muted uppercase 2xl:grid",
        )}
      >
        <span />
        <span>Customer</span>
        <span>Items</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Status</span>
      </div>

      <ul className="flex flex-col">
        {orders.map((order) => {
          const status = orderStatusStyle[order.status];

          return (
            <li
              key={order.id}
              className={cn(
                ROW_GRID,
                "group rounded-md px-3 py-3.5 transition-colors duration-[var(--duration-base)] hover:bg-background/70 2xl:py-3",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold",
                  "transition-transform duration-[var(--duration-base)] ease-out group-hover:scale-105",
                  toneFor(order.customerName),
                )}
              >
                {initialsOf(order.customerName)}
              </span>

              <div className="min-w-0">
                {/* Wraps on phones rather than truncating — the stacked
                    meta column leaves enough room, and a clipped customer
                    name is worse than a second line. */}
                <p className="text-sm font-medium text-foreground 2xl:truncate">
                  {order.customerName}
                </p>
                <a
                  href={phoneHref(order.customerPhone)}
                  className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted transition-colors duration-[var(--duration-fast)] hover:text-green"
                >
                  <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">
                    {formatPhoneNumber(order.customerPhone)}
                  </span>
                </a>
                {/* On desktop this context sits under Items instead. */}
                <p className="mt-0.5 text-xs text-muted 2xl:hidden">
                  {order.id} · {order.placedAt}
                </p>
              </div>

              <div className="hidden min-w-0 2xl:block">
                <p className="truncate text-sm text-foreground/80">
                  {order.itemSummary}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {order.id} · {order.placedAt}
                </p>
              </div>

              <div className={META_STACK}>
                <p className="text-right text-sm font-semibold tabular-nums text-foreground">
                  {formatPrice(order.totalAmount)}
                </p>

                <div className="flex justify-end">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                      status.pill,
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        status.dot,
                      )}
                    />
                    {orderStatusLabel[order.status]}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
