import { z } from "zod";

export const stockStatusSchema = z.enum([
  "in-stock",
  "low-stock",
  "out-of-stock",
]);

export const inventoryAdjustmentReasonSchema = z.enum([
  "restock",
  "sale",
  "correction",
  "damage",
]);

/** What an admin submits to change a variant's stock quantity. */
export const inventoryAdjustmentInputSchema = z.object({
  variantId: z.string().min(1),
  quantityChange: z
    .number()
    .int()
    .refine((value) => value !== 0, "Quantity change cannot be zero"),
  reason: inventoryAdjustmentReasonSchema,
  note: z.string().optional(),
});

export type StockStatus = z.infer<typeof stockStatusSchema>;
export type InventoryAdjustmentReason = z.infer<
  typeof inventoryAdjustmentReasonSchema
>;
export type InventoryAdjustmentInput = z.infer<
  typeof inventoryAdjustmentInputSchema
>;
