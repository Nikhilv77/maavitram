import { getStockStatus } from "@/features/inventory/lib/stock";
import { adminProducts } from "@/features/admin/lib/mock-products";
import type { ProductAccent } from "@/features/admin/lib/mock-dashboard";
import type { InventoryAdjustmentReason, StockStatus } from "@/types/inventory";

/**
 * Inventory is tracked per variant, not per product — one row per SKU,
 * mirroring the Inventory model in prisma/schema.prisma (`variantId` is
 * unique there).
 *
 * These lines are *derived* from the products mock rather than declared
 * again, so stock levels can never drift between the Products screen,
 * this one and the dashboard's Low Stock panel.
 */

export interface InventoryLine {
  sku: string;
  productName: string;
  productSlug: string;
  accent: ProductAccent;
  image: string;
  variantLabel: string;
  weightInGrams: number;
  price: number;
  stockQuantity: number;
  /** Units this SKU is restocked up to — the bar's denominator. */
  targetStock: number;
  status: StockStatus;
  /** Relative, human-facing; the real one comes from Inventory.updatedAt. */
  updatedAt: string;
}

/** Restock targets scale with pack size — small packs move fastest. */
const targetByWeight: Record<number, number> = { 100: 60, 250: 40, 500: 20 };

const updatedBySku: Record<string, string> = {
  "MAV-TEZ-100": "2 hr ago",
  "MAV-TEZ-250": "Yesterday",
  "MAV-TEZ-500": "4 hr ago",
  "MAV-SAU-100": "Yesterday",
  "MAV-SAU-250": "2 days ago",
  "MAV-SAU-500": "6 hr ago",
  "MAV-ACH-100": "3 days ago",
  "MAV-ACH-250": "1 hr ago",
  "MAV-LAL-100": "Yesterday",
  "MAV-LAL-250": "30 min ago",
};

// Problems first: an ops screen should open on what needs a decision,
// not on alphabetical order.
const statusRank: Record<StockStatus, number> = {
  "out-of-stock": 0,
  "low-stock": 1,
  "in-stock": 2,
};

export const inventoryLines: InventoryLine[] = adminProducts
  .flatMap((product) =>
    product.variants.map((variant) => ({
      sku: variant.sku,
      productName: product.name,
      productSlug: product.slug,
      accent: product.accent,
      image: product.image,
      variantLabel: variant.label,
      weightInGrams: variant.weightInGrams,
      price: variant.price,
      stockQuantity: variant.stockQuantity,
      targetStock: targetByWeight[variant.weightInGrams] ?? 40,
      status: getStockStatus(variant.stockQuantity),
      updatedAt: updatedBySku[variant.sku] ?? "Recently",
    })),
  )
  .sort(
    (a, b) =>
      statusRank[a.status] - statusRank[b.status] ||
      a.stockQuantity - b.stockQuantity ||
      a.productName.localeCompare(b.productName),
  );

/** Value of the stock held in one line, at selling price. */
export function getLineValue(line: InventoryLine): number {
  return line.price * line.stockQuantity;
}

/** One applied stock movement, as shown in the session's adjustment log. */
export interface AdjustmentEntry {
  id: string;
  sku: string;
  productName: string;
  variantLabel: string;
  /** Carried so the log can show the same thumbnail as the stock table. */
  image: string;
  accent: ProductAccent;
  quantityChange: number;
  reason: InventoryAdjustmentReason;
  note?: string;
  /** Stock after the movement — what the log shows as the outcome. */
  resultingStock: number;
  at: string;
}

/**
 * Applies a movement to a line, returning a new line rather than
 * mutating. Stock is floored at zero: the UI blocks over-removal before
 * it gets here, but a negative on-hand quantity should be impossible by
 * construction, not just by validation.
 */
export function applyAdjustment(
  line: InventoryLine,
  quantityChange: number,
): InventoryLine {
  const stockQuantity = Math.max(0, line.stockQuantity + quantityChange);
  return {
    ...line,
    stockQuantity,
    status: getStockStatus(stockQuantity),
    updatedAt: "Just now",
  };
}
