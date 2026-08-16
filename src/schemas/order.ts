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

/** Upper bound on a single reservation, so a typo can't reserve a batch. */
export const MAX_PREORDER_QUANTITY = 20;

/**
 * What the storefront preorder modal submits.
 *
 * Note there is no price field: unit price is read from the variant row
 * server-side. Trusting a client-supplied price would let anyone reserve
 * a pack at whatever amount they posted.
 */
export const preorderInputSchema = z.object({
  variantId: z.string().min(1, "Choose a pack size"),
  quantity: z
    .number()
    .int()
    .min(1, "Choose at least one pack")
    .max(MAX_PREORDER_QUANTITY, `Reserve up to ${MAX_PREORDER_QUANTITY} packs`),
  name: z.string().trim().min(2, "Enter your full name"),
  phone: customerDetailsSchema.shape.phone,
  // Empty string is normalised away so a blank optional field doesn't
  // fail email validation.
  email: z
    .union([z.email("Enter a valid email address"), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type PreorderInput = z.infer<typeof preorderInputSchema>;
