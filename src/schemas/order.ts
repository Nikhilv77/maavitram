import { z } from "zod";

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  productName: z.string().min(1),
  variantLabel: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().positive(),
});

export const customerDetailsSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  address: z.string().min(5, "Enter a delivery address").optional(),
  notes: z.string().optional(),
});

/**
 * What's needed from the customer to place an order. There is no payment
 * gateway — the resulting Order is handed to `@/features/whatsapp` to
 * become the message the customer sends to place it.
 */
export const checkoutInputSchema = z.object({
  items: z.array(orderItemInputSchema).min(1),
  customer: customerDetailsSchema,
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type CustomerDetails = z.infer<typeof customerDetailsSchema>;
export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
