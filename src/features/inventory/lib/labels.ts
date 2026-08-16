import type { InventoryAdjustmentReason } from "@/types/inventory";

/**
 * Human-readable names for the adjustment reasons. The enum values are
 * lowercase identifiers and should never reach the UI directly.
 */
export const adjustmentReasonLabel: Record<InventoryAdjustmentReason, string> =
  {
    restock: "Restock",
    sale: "Sale",
    correction: "Correction",
    damage: "Damage",
  };

/** Reasons that add stock, as opposed to removing it. */
export const stockAddingReasons: InventoryAdjustmentReason[] = [
  "restock",
  "correction",
];

export const stockRemovingReasons: InventoryAdjustmentReason[] = [
  "sale",
  "damage",
  "correction",
];
