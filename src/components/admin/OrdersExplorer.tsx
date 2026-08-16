"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Phone, Search, ShoppingBag } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { orderStatusStyle } from "@/components/admin/order-status";
import { formatPrice } from "@/features/products/lib/pricing";
import { formatPhoneNumber, phoneHref } from "@/features/orders/lib/format";
import { orderStatusLabel } from "@/features/orders/lib/status";
import { accentChipClass } from "@/features/admin/lib/accents";
import type { AdminOrder } from "@/features/admin/lib/mock-orders";
import type { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrdersExplorerProps {
  orders: AdminOrder[];
  /** Opens the detail dialog for an order. */
  onOpen: (orderId: string) => void;
  className?: string;
  delay?: number;
}

const statusFilters: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
];

const avatarTones = Object.values(accentChipClass);

/**
 * FNV-1a — a plain character sum clusters adjacent names into the same
 * bucket; this avalanches, so the tints spread evenly.
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
 * Same responsive grid contract as the other admin tables: three columns
 * on phones (avatar, details, stacked meta) expanding to six on desktop,
 * so nothing truncates and nothing scrolls sideways.
 */
const ROW_GRID =
  "grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-3 xl:grid-cols-[2.25rem_minmax(0,0.95fr)_minmax(0,1.45fr)_5rem_6rem_4rem] xl:gap-x-4";

/** Dissolves at xl so total, status and the action get their own columns. */
const META_STACK = "flex flex-col items-end gap-1.5 xl:contents";

export function OrdersExplorer({
  orders,
  onOpen,
  className,
  delay,
}: OrdersExplorerProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (!needle) return true;
      // Digits-only match too, so a pasted "+91 98451 12207" still finds
      // the order stored as the bare "9845112207" — the trailing slice
      // drops a country code the stored number doesn't carry.
      const digits = needle.replace(/\D/g, "");
      const localDigits = digits.length > 10 ? digits.slice(-10) : digits;
      return (
        order.id.toLowerCase().includes(needle) ||
        order.customerName.toLowerCase().includes(needle) ||
        order.itemSummary.toLowerCase().includes(needle) ||
        (localDigits.length > 0 && order.customerPhone.includes(localDigits))
      );
    });
  }, [orders, query, status]);

  return (
    <Panel
      title="All Orders"
      description={`${visible.length} of ${orders.length} shown · newest first`}
      delay={delay}
      className={className}
      bodyClassName="px-2 pb-3"
      action={
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <div className="relative w-full sm:w-auto">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order, name or phone"
              aria-label="Search orders"
              className="h-8 w-full rounded-md bg-background py-1 pr-3 pl-8 text-xs text-foreground placeholder:text-muted/70 focus:outline-none sm:w-56"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatus(filter.value)}
                aria-pressed={status === filter.value}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium",
                  "transition-colors duration-[var(--duration-fast)]",
                  status === filter.value
                    ? "bg-green/10 text-green-dark"
                    : "text-muted hover:bg-background hover:text-green",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* Column headers only make sense where there are real columns —
          on phones each order reads as a card, so they'd just be noise. */}
      <div
        aria-hidden="true"
        className={cn(
          ROW_GRID,
          "hidden px-3 pb-2 text-[11px] font-medium tracking-wide text-muted uppercase xl:grid",
        )}
      >
        <span />
        <span>Customer</span>
        <span>Items</span>
        <span className="text-right">Total</span>
        <span className="text-right">Status</span>
        <span />
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-3 py-12 text-center">
          <ShoppingBag className="h-6 w-6 text-muted/60" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No orders match</p>
          <p className="text-xs text-muted">
            Try a different order id, customer or status.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {visible.map((order) => {
            const style = orderStatusStyle[order.status];

            return (
              <li
                key={order.id}
                className={cn(
                  ROW_GRID,
                  "group rounded-md px-3 py-3.5 transition-colors duration-[var(--duration-base)] hover:bg-background/70 xl:py-3",
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
                  <p className="text-sm font-medium text-foreground xl:truncate">
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
                  {/* Desktop carries these in the Items column. */}
                  <p className="mt-0.5 text-xs text-muted xl:hidden">
                    {order.id} · {order.placedAt}
                  </p>
                  <p className="mt-0.5 text-xs text-muted xl:hidden">
                    {order.itemSummary}
                  </p>
                </div>

                <div className="hidden min-w-0 xl:block">
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
                        style.pill,
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          style.dot,
                        )}
                      />
                      {orderStatusLabel[order.status]}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onOpen(order.id)}
                      aria-label={`View order ${order.id}`}
                      className="group/btn inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-green transition-colors duration-[var(--duration-fast)] hover:bg-green/10 hover:text-green-dark"
                    >
                      View
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)] group-hover/btn:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
