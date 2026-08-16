import Image from "next/image";
import { History } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { productImageSrc } from "@/config/images";
import { adjustmentReasonLabel } from "@/features/inventory/lib/labels";
import type { AdjustmentEntry } from "@/features/admin/lib/mock-inventory";
import { accentRailClass } from "@/features/admin/lib/accents";
import { cn } from "@/lib/utils";

interface AdjustmentLogProps {
  entries: AdjustmentEntry[];
  className?: string;
  delay?: number;
}

export function AdjustmentLog({
  entries,
  className,
  delay,
}: AdjustmentLogProps) {
  return (
    <Panel
      title="Recent Adjustments"
      description="Stock movements made in this session"
      className={className}
      delay={delay}
    >
      {entries.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
          <History className="h-6 w-6 text-muted/60" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            No adjustments yet
          </p>
          <p className="max-w-[15rem] text-xs text-muted">
            Use Adjust on any SKU to record a restock, sale, correction or
            damage.
          </p>
        </div>
      ) : (
        <ul className="flex flex-1 flex-col gap-1">
          {entries.map((entry) => {
            const added = entry.quantityChange > 0;

            return (
              <li
                key={entry.id}
                className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-[var(--duration-base)] hover:bg-background/70"
              >
                {/* Same thumbnail + accent rail treatment as the stock
                    table, so a movement is recognisable at a glance. */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-background">
                  <Image
                    src={productImageSrc(entry.image)}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain p-1 transition-transform duration-[var(--duration-base)] ease-out group-hover:scale-110"
                  />
                </div>

                <span
                  aria-hidden="true"
                  className={cn(
                    "h-8 w-1 shrink-0 rounded-full",
                    accentRailClass[entry.accent],
                  )}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {entry.productName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {entry.variantLabel} · {entry.sku}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {adjustmentReasonLabel[entry.reason]} · {entry.at}
                  </p>
                  {entry.note ? (
                    <p className="mt-0.5 text-xs text-muted/80 italic">
                      {entry.note}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      added ? "text-saumya" : "text-red",
                    )}
                  >
                    {added ? "+" : "−"}
                    {Math.abs(entry.quantityChange)}
                  </span>
                  <span className="text-[11px] tabular-nums text-muted">
                    → {entry.resultingStock} units
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
