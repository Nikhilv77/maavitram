"use client";

import { useState } from "react";
import { Boxes, CircleAlert, IndianRupee, TriangleAlert } from "lucide-react";
import { AdjustStockDialog } from "@/components/admin/AdjustStockDialog";
import { AdjustmentLog } from "@/components/admin/AdjustmentLog";
import { InventoryExplorer } from "@/components/admin/InventoryExplorer";
import { StatCard } from "@/components/admin/StatCard";
import { formatPrice } from "@/features/products/lib/pricing";
import { getTotalInventoryValue } from "@/features/inventory/lib/stock";
import {
  applyAdjustment,
  type AdjustmentEntry,
  type InventoryLine,
} from "@/features/admin/lib/mock-inventory";
import type { InventoryAdjustmentReason } from "@/types/inventory";

interface InventoryManagerProps {
  initialLines: InventoryLine[];
  delay: { stats: number; statStep: number; list: number; log: number };
}

/** Keeps the in-session log to the most recent handful. */
const LOG_LIMIT = 6;

/**
 * Owns the mutable inventory state for the screen.
 *
 * The stat cards live in here rather than in the page's Server Component
 * on purpose: they're derived from the same lines the table edits, so
 * rendering them upstream would leave the totals stale the moment an
 * adjustment lands.
 */
export function InventoryManager({
  initialLines,
  delay,
}: InventoryManagerProps) {
  const [lines, setLines] = useState(initialLines);
  const [entries, setEntries] = useState<AdjustmentEntry[]>([]);
  const [activeSku, setActiveSku] = useState<string | null>(null);

  // Derived from `lines` rather than held in state, so the dialog always
  // reflects the latest stock even after a previous adjustment.
  const activeLine = lines.find((line) => line.sku === activeSku) ?? null;

  const totalUnits = lines.reduce((total, line) => total + line.stockQuantity, 0);
  // The same helper the storefront analytics use, so "inventory value"
  // means one thing across the app.
  const totalValue = getTotalInventoryValue(lines);
  const lowCount = lines.filter((line) => line.status === "low-stock").length;
  const outCount = lines.filter((line) => line.status === "out-of-stock").length;

  const handleApply = (input: {
    quantityChange: number;
    reason: InventoryAdjustmentReason;
    note?: string;
  }) => {
    if (!activeLine) return;
    const updated = applyAdjustment(activeLine, input.quantityChange);

    // Position is deliberately preserved instead of re-sorting by
    // urgency — a row jumping across the table the instant you restock it
    // loses the reading position you were working from.
    setLines((previous) =>
      previous.map((line) => (line.sku === updated.sku ? updated : line)),
    );

    setEntries((previous) =>
      [
        {
          id: `${updated.sku}-${previous.length}-${Date.now()}`,
          sku: updated.sku,
          productName: updated.productName,
          variantLabel: updated.variantLabel,
          image: updated.image,
          accent: updated.accent,
          quantityChange: input.quantityChange,
          reason: input.reason,
          note: input.note,
          resultingStock: updated.stockQuantity,
          at: "Just now",
        },
        ...previous,
      ].slice(0, LOG_LIMIT),
    );

    setActiveSku(null);
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard
          label="Units in Stock"
          value={totalUnits.toLocaleString("en-IN")}
          icon={Boxes}
          tone="green"
          hint={`Across ${lines.length} SKUs`}
          delay={delay.stats}
        />
        <StatCard
          label="Inventory Value"
          value={formatPrice(totalValue)}
          icon={IndianRupee}
          tone="gold"
          hint="At selling price"
          delay={delay.stats + delay.statStep}
        />
        <StatCard
          label="Low Stock"
          value={String(lowCount)}
          icon={TriangleAlert}
          tone="saumya"
          hint="At or below threshold"
          delay={delay.stats + delay.statStep * 2}
        />
        <StatCard
          label="Out of Stock"
          value={String(outCount)}
          icon={CircleAlert}
          tone="red"
          hint="Needs restocking now"
          delay={delay.stats + delay.statStep * 3}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 2xl:grid-cols-3">
        <InventoryExplorer
          lines={lines}
          onAdjust={setActiveSku}
          delay={delay.list}
          className="2xl:col-span-2"
        />
        <AdjustmentLog entries={entries} delay={delay.log} />
      </div>

      <AdjustStockDialog
        line={activeLine}
        onClose={() => setActiveSku(null)}
        onApply={handleApply}
      />
    </>
  );
}
