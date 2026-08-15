import type { Prisma } from "@prisma/client";

export type { Order, OrderItem, OrderStatus } from "@prisma/client";
export type {
  CustomerDetails,
  CheckoutInput,
  OrderItemInput,
} from "@/schemas/order";

/** An Order with its line items loaded — what the WhatsApp message is built from. */
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;
