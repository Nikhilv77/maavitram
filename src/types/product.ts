import type { Prisma } from "@prisma/client";

// Persisted entity shapes come straight from Prisma — it's the source of
// truth once data lives in the database. `@/schemas/product` only
// validates seed input, which has a different (pre-insert) shape.
export type {
  Product,
  ProductVariant,
  Inventory,
  ProductCategory,
} from "@prisma/client";

/** A product with its variants and each variant's inventory loaded. */
export type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: { include: { inventory: true } } };
}>;
