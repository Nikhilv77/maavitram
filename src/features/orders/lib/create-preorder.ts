import "server-only";
import { db } from "@/lib/db";
import { preorderInputSchema, type PreorderInput } from "@/schemas/order";
import type { OrderWithItems } from "@/types/order";

/**
 * Reserves a pack before a batch exists.
 *
 * Unlike `createOrder`, nothing here is handed to WhatsApp — the row is
 * the whole outcome, and the team reaches out from the admin queue. The
 * order is written as `orderType: "preorder"` with `status: "pending"`,
 * so it sorts alongside normal orders without being mistaken for one.
 */
export async function createPreorder(
  input: PreorderInput,
): Promise<OrderWithItems> {
  const parsed = preorderInputSchema.parse(input);

  // Price, product name and variant label all come from the database, not
  // from the client. The modal displays them, but display values are not
  // evidence — a posted price would otherwise set what the customer owes.
  const variant = await db.productVariant.findFirst({
    where: { id: parsed.variantId, isActive: true },
    include: { product: true },
  });

  if (!variant || !variant.product.isActive) {
    throw new Error("That pack is no longer available.");
  }

  return db.order.create({
    data: {
      customerName: parsed.name,
      customerPhone: parsed.phone,
      customerEmail: parsed.email,
      totalAmount: variant.price * parsed.quantity,
      orderType: "preorder",
      status: "pending",
      items: {
        create: [
          {
            variantId: variant.id,
            // Denormalised at write time so the order still reads
            // correctly if the product is renamed or repriced later.
            productId: variant.productId,
            productName: variant.product.name,
            variantLabel: variant.label,
            quantity: parsed.quantity,
            unitPrice: variant.price,
          },
        ],
      },
    },
    include: { items: true },
  });
}
