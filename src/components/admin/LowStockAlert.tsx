import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { Badge } from "@/components/ui/Badge";
import { getStockStatus } from "@/features/inventory/lib/stock";
import type { LowStockLine } from "@/features/admin/lib/mock-dashboard";
import { cn } from "@/lib/utils";

interface LowStockAlertProps {
  lines: LowStockLine[];
  className?: string;
  delay?: number;
}

export function LowStockAlert({
  lines,
  className,
  delay,
}: LowStockAlertProps) {
  return (
    <Panel
      title="Low Stock Alert"
      description="Variants at or below the restock threshold"
      delay={delay}
      action={
        <Link
          href="/admin/inventory"
          className="group inline-flex items-center gap-1 text-xs font-medium text-green transition-colors duration-[var(--duration-fast)] hover:text-green-dark"
        >
          Manage
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      }
      className={className}
    >
      <ul className="flex flex-1 flex-col gap-1">
        {lines.map((line) => {
          // Same threshold logic the storefront uses, so "low" means the
          // same thing on both sides of the app.
          const outOfStock =
            getStockStatus(line.stockQuantity) === "out-of-stock";

          return (
            <li
              key={line.sku}
              className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-colors duration-[var(--duration-base)] hover:bg-background/70"
            >
              <div className="flex min-w-0 items-center gap-3">
                {/* Colour-coded rail instead of a divider line — carries
                    the severity without adding another horizontal rule. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-8 w-1 shrink-0 rounded-full",
                    outOfStock ? "bg-red" : "bg-gold",
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {line.productName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {line.variantLabel} · {line.sku}
                  </p>
                </div>
              </div>

              {/* "Out" rather than "Out of stock": this panel is a third
                  of the dashboard grid, and the longer label squeezed the
                  product name below the width of the word "Maavitram" —
                  which no amount of wrapping can rescue. Matches the
                  Inventory screen's pill wording. */}
              <Badge tone={outOfStock ? "red" : "gold"} className="shrink-0">
                {outOfStock ? "Out" : `${line.stockQuantity} left`}
              </Badge>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
