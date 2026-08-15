import { z } from "zod";

/**
 * Validates seed data in prisma/seed.ts before it's written to the
 * database — the DB (via Prisma-generated types) is the source of truth
 * for the entity shape once persisted; this only guards the input.
 */

export const productCategorySchema = z.enum([
  "whole_spices",
  "ground_spices",
  "blended_masalas",
  "seasonings",
]);

export const productVariantSeedSchema = z.object({
  sku: z.string().min(1),
  label: z.string().min(1),
  weightInGrams: z.number().int().positive(),
  price: z.number().int().positive(),
  mrp: z.number().int().positive().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().default(true),
  stockQuantity: z.number().int().nonnegative(),
});

export const productSeedSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: productCategorySchema,
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().default(true),
  variants: z
    .array(productVariantSeedSchema)
    .min(1, "A product needs at least one variant"),
});

export type ProductCategory = z.infer<typeof productCategorySchema>;

// `z.input` (pre-default shape) so hand-authored seed literals can omit
// fields like `isActive` that the schema defaults at parse time.
export type ProductVariantSeedInput = z.input<typeof productVariantSeedSchema>;
export type ProductSeedInput = z.input<typeof productSeedSchema>;
