import "server-only";
import { db } from "@/lib/db";
import { checkoutInputSchema } from "@/schemas/order";
import type { CheckoutInput, OrderWithItems } from "@/types/order";

/**
 * V1 order flow: WhatsApp order -> Order row created here -> WhatsApp URL
 * generated -> redirect. There is no payment step, and every redirect
 * counts as an order, so this is the entire "checkout" — no separate
 * confirmation write.
 */
export function createOrder(input: CheckoutInput): Promise<OrderWithItems> {
  const parsed = checkoutInputSchema.parse(input);
  const totalAmount = parsed.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  return db.order.create({
    data: {
      customerName: parsed.customer.name,
      customerPhone: parsed.customer.phone,
      address: parsed.customer.address,
      notes: parsed.customer.notes,
      totalAmount,
      status: "pending",
      items: {
        create: parsed.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: { items: true },
  });
}
