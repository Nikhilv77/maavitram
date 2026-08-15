import { formatPrice } from "@/features/products/lib/pricing";
import type { OrderWithItems } from "@/types/order";

/**
 * Renders an Order as the plain-text WhatsApp message a customer sends to
 * place it — this is the entire checkout flow, there is no payment step.
 */
export function formatOrderMessage(order: OrderWithItems): string {
  const lines = [
    `New order from ${order.customerName}`,
    `Order ref: ${order.id.slice(-6).toUpperCase()}`,
    "",
    ...order.items.map(
      (item) =>
        `• ${item.productName} (${item.variantLabel}) x${item.quantity} — ${formatPrice(item.unitPrice * item.quantity)}`,
    ),
    "",
    `Total: ${formatPrice(order.totalAmount)}`,
    `Phone: ${order.customerPhone}`,
  ];

  if (order.address) {
    lines.push(`Address: ${order.address}`);
  }
  if (order.notes) {
    lines.push(`Notes: ${order.notes}`);
  }

  return lines.join("\n");
}

export function formatProductInquiryMessage(productName: string): string {
  return `Hi Maavitram, I'd like to know more about ${productName}.`;
}
