"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { productImageSrc } from "@/config/images";
import { formatPrice } from "@/features/products/lib/pricing";
import {
  getLineValue,
  type InventoryLine,
} from "@/features/admin/lib/mock-inventory";
import type { StockStatus } from "@/types/inventory";
import { accentRailClass } from "@/features/admin/lib/accents";
import { cn } from "@/lib/utils";

interface InventoryExplorerProps {
  lines: InventoryLine[];
  /** Opens the adjust-stock dialog for a SKU. */
  onAdjust: (sku: string) => void;
  className?: string;
  delay?: number;
}

const statusStyle: Record<
  StockStatus,
  { pill: string; dot: string; bar: string; label: string }
> = {
  "in-stock": {
    pill: "bg-saumya/10 text-saumya",
    dot: "bg-saumya",
    bar: "bg-saumya",
    label: "In stock",
  },
  "low-stock": {
    pill: "bg-gold/12 text-achaari",
    dot: "bg-gold",
    bar: "bg-gold",
    label: "Low",
  },
  "out-of-stock": {
    pill: "bg-red/10 text-red",
    dot: "bg-red",
    bar: "bg-red",
    label: "Out",
  },
};

const statusFilters: { value: StockStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "out-of-stock", label: "Out" },
  { value: "low-stock", label: "Low" },
  { value: "in-stock", label: "In stock" },
];

/**
 * Same responsive grid contract as the Orders and Products tables, but
 * on `xl` rather than `lg`: with six columns plus a progress bar this one
 * needs ~900px before the columns stop crowding each other, so it stays
 * in card form until then.
 */
const ROW_GRID =
  "grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-3 xl:grid-cols-[3rem_minmax(0,1.25fr)_minmax(0,1fr)_6rem_5.5rem_5rem] xl:gap-x-4";

export function InventoryExplorer({
  lines,
  onAdjust,
  className,
  delay,
}: InventoryExplorerProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StockStatus | "all">("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return lines.filter((line) => {
      if (status !== "all" && line.status !== status) return false;
      if (!needle) return true;
      return (
        line.sku.toLowerCase().includes(needle) ||
        line.productName.toLowerCase().includes(needle) ||
        line.variantLabel.toLowerCase().includes(needle)
      );
    });
  }, [lines, query, status]);

  return (
    <Panel
      title="Stock by SKU"
      description={`${visible.length} of ${lines.length} shown · most urgent first`}
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
              placeholder="Search SKU or product"
              aria-label="Search inventory"
              className="h-8 w-full rounded-md bg-background py-1 pr-3 pl-8 text-xs text-foreground placeholder:text-muted/70 focus:outline-none sm:w-52"
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
          on phones each SKU reads as a card, so they'd just be noise. */}
      <div
        aria-hidden="true"
        className={cn(
          ROW_GRID,
          "hidden px-3 pb-2 text-[11px] font-medium tracking-wide text-muted uppercase xl:grid",
        )}
      >
        <span />
        <span>SKU</span>
        <span>Stock level</span>
        <span className="text-right">Value</span>
        <span className="text-right">Status</span>
        <span />
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-3 py-12 text-center">
          <PackageSearch className="h-6 w-6 text-muted/60" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            No stock lines match
          </p>
          <p className="text-xs text-muted">
            Try a different SKU, product or status.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {visible.map((line) => {
            const style = statusStyle[line.status];
            // Capped so an over-stocked SKU can't overflow its track.
            const fill = Math.min(
              100,
              (line.stockQuantity / line.targetStock) * 100,
            );

            return (
              <li
                key={line.sku}
                className={cn(
                  ROW_GRID,
                  "group rounded-md px-3 py-3.5 transition-colors duration-[var(--duration-base)] hover:bg-background/70 xl:py-3",
                )}
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-background">
                  <Image
                    src={productImageSrc(line.image)}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-1 transition-transform duration-[var(--duration-base)] ease-out group-hover:scale-110"
                  />
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-8 w-1 shrink-0 rounded-full",
                      accentRailClass[line.accent],
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground xl:truncate">
                      {line.productName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted xl:truncate">
                      {line.variantLabel} · {line.sku}
                    </p>
                    {/* Desktop carries these in their own columns. */}
                    <p className="mt-0.5 text-xs tabular-nums text-muted xl:hidden">
                      {formatPrice(line.price)} each ·{" "}
                      {formatPrice(getLineValue(line))} value
                    </p>
                  </div>
                </div>

                <div className="hidden min-w-0 xl:block">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm tabular-nums text-foreground">
                      {line.stockQuantity}
                      <span className="text-muted">
                        {" / "}
                        {line.targetStock}
                      </span>
                    </p>
                    <p className="text-xs text-muted">{line.updatedAt}</p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/6">
                    <div
                      style={{ width: `${fill}%` }}
                      className={cn("h-full rounded-full", style.bar)}
                    />
                  </div>
                </div>

                <p className="hidden text-right text-sm font-medium tabular-nums text-foreground xl:block">
                  {formatPrice(getLineValue(line))}
                </p>

                <div className="flex flex-col items-end gap-1.5 xl:contents">
                  <p className="text-sm font-semibold tabular-nums text-foreground xl:hidden">
                    {line.stockQuantity}
                    <span className="ml-1 text-xs font-normal text-muted">
                      units
                    </span>
                  </p>
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
                    {style.label}
                  </span>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onAdjust(line.sku)}
                      aria-label={`Adjust stock for ${line.productName} ${line.variantLabel}`}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium",
                        "text-green transition-colors duration-[var(--duration-fast)] hover:bg-green/10 hover:text-green-dark",
                      )}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                      Adjust
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
