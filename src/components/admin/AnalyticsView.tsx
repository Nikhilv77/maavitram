"use client";

import { useMemo, useState } from "react";
import { Boxes, ClipboardList, IndianRupee, Receipt } from "lucide-react";
import { OrderStatusBreakdown } from "@/components/admin/OrderStatusBreakdown";
import { RevenueByProduct } from "@/components/admin/RevenueByProduct";
import { SalesOverviewChart } from "@/components/admin/SalesOverviewChart";
import { StatCard } from "@/components/admin/StatCard";
import { formatPrice } from "@/features/products/lib/pricing";
import {
  analyticsRanges,
  getProductRevenue,
  getRangeSummary,
  type AnalyticsRange,
  type StatusBreakdownLine,
} from "@/features/admin/lib/mock-analytics";
import { cn } from "@/lib/utils";

interface AnalyticsViewProps {
  statusBreakdown: StatusBreakdownLine[];
  delay: {
    stats: number;
    statStep: number;
    chart: number;
    products: number;
    status: number;
  };
}

/** Shown in place of a delta when there's no prior window to compare to. */
const NO_COMPARISON = "No prior period";

export function AnalyticsView({ statusBreakdown, delay }: AnalyticsViewProps) {
  const [rangeKey, setRangeKey] = useState<AnalyticsRange["key"]>("6m");

  const range =
    analyticsRanges.find((entry) => entry.key === rangeKey) ??
    analyticsRanges[1];

  const summary = useMemo(() => getRangeSummary(range.months), [range.months]);
  const products = useMemo(
    () => getProductRevenue(range.months),
    [range.months],
  );

  const comparison = `vs previous ${range.label}`;

  return (
    <>
      <div
        style={{ animationDelay: `${delay.stats - 20}ms` }}
        className="animate-rise-in mt-6 flex flex-wrap items-center gap-1"
      >
        {analyticsRanges.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setRangeKey(entry.key)}
            aria-pressed={rangeKey === entry.key}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium",
              "transition-colors duration-[var(--duration-fast)]",
              rangeKey === entry.key
                ? "bg-green/10 text-green-dark"
                : "text-muted hover:bg-surface hover:text-green",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(summary.revenue)}
          icon={IndianRupee}
          tone="green"
          deltaPercent={summary.deltas.revenue ?? undefined}
          deltaLabel={comparison}
          hint={NO_COMPARISON}
          delay={delay.stats}
        />
        <StatCard
          label="Orders"
          value={summary.orders.toLocaleString("en-IN")}
          icon={ClipboardList}
          tone="gold"
          deltaPercent={summary.deltas.orders ?? undefined}
          deltaLabel={comparison}
          hint={NO_COMPARISON}
          delay={delay.stats + delay.statStep}
        />
        <StatCard
          label="Avg Order Value"
          value={formatPrice(summary.averageOrderValue)}
          icon={Receipt}
          tone="saumya"
          deltaPercent={summary.deltas.averageOrderValue ?? undefined}
          deltaLabel={comparison}
          hint={NO_COMPARISON}
          delay={delay.stats + delay.statStep * 2}
        />
        <StatCard
          label="Units Sold"
          value={summary.units.toLocaleString("en-IN")}
          icon={Boxes}
          tone="red"
          deltaPercent={summary.deltas.units ?? undefined}
          deltaLabel={comparison}
          hint={NO_COMPARISON}
          delay={delay.stats + delay.statStep * 3}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 xl:grid-cols-3">
        <SalesOverviewChart
          data={summary.points}
          title="Revenue Trend"
          description={`Monthly revenue · last ${range.label}`}
          className="xl:col-span-2"
          delay={delay.chart}
        />
        <RevenueByProduct
          lines={products}
          rangeLabel={range.label}
          delay={delay.products}
        />
      </div>

      <div className="mt-4 sm:mt-5">
        <OrderStatusBreakdown
          lines={statusBreakdown}
          delay={delay.status}
        />
      </div>
    </>
  );
}
