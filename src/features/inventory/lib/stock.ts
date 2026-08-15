import type { StockStatus } from "@/types/inventory";

const LOW_STOCK_THRESHOLD = 10;

export function getStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= 0) return "out-of-stock";
  if (stockQuantity <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function isInStock(stockQuantity: number): boolean {
  return stockQuantity > 0;
}

/** Total value of stock on hand, at selling price. Used by admin analytics. */
export function getTotalInventoryValue(
  lines: { price: number; stockQuantity: number }[],
): number {
  return lines.reduce(
    (total, line) => total + line.price * line.stockQuantity,
    0,
  );
}
