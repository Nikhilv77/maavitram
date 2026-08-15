import "server-only";
import { db } from "@/lib/db";
import { inventoryAdjustmentInputSchema } from "@/schemas/inventory";
import type { InventoryAdjustmentInput } from "@/types/inventory";
import type { Inventory } from "@prisma/client";

/**
 * Applies a validated stock adjustment to a variant's inventory row and
 * returns the updated record. Throws if the input is invalid or the
 * adjustment would take stock below zero — callers (admin actions) decide
 * how to surface that.
 */
export async function applyInventoryAdjustment(
  input: InventoryAdjustmentInput,
): Promise<Inventory> {
  const parsed = inventoryAdjustmentInputSchema.parse(input);

  return db.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUniqueOrThrow({
      where: { variantId: parsed.variantId },
    });
    const nextQuantity = inventory.stockQuantity + parsed.quantityChange;

    if (nextQuantity < 0) {
      throw new Error(
        `Adjustment would take variant "${parsed.variantId}" stock below zero.`,
      );
    }

    return tx.inventory.update({
      where: { variantId: parsed.variantId },
      data: { stockQuantity: nextQuantity },
    });
  });
}
