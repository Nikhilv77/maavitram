import "server-only";
import { db } from "@/lib/db";
import type { ProductCategory, ProductWithVariants } from "@/types/product";

// Data-access layer for the product catalogue. Marked server-only so
// catalogue reads only ever happen in Server Components — Client Components
// receive already-fetched data as props, never a DB handle.

const includeVariants = {
  variants: {
    where: { isActive: true },
    include: { inventory: true },
    orderBy: { weightInGrams: "asc" as const },
  },
} as const;

export function getAllProducts(): Promise<ProductWithVariants[]> {
  return db.product.findMany({
    where: { isActive: true },
    include: includeVariants,
    orderBy: { name: "asc" },
  });
}

/** A pack the storefront can offer for preorder. */
export interface CatalogueVariant {
  id: string;
  label: string;
  price: number;
  sku: string;
}

export interface CatalogueEntry {
  slug: string;
  variants: CatalogueVariant[];
}

/**
 * Lean, serializable catalogue for the preorder modal — real variant ids
 * and prices, keyed by slug so the storefront's static marketing cards
 * can look themselves up.
 *
 * Deliberately narrow: this crosses into a Client Component, so it
 * carries only what the modal renders, not whole Prisma rows.
 */
export async function getPreorderCatalogue(): Promise<CatalogueEntry[]> {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      variants: {
        where: { isActive: true },
        select: { id: true, label: true, price: true, sku: true },
        orderBy: { weightInGrams: "asc" },
      },
    },
  });

  return products;
}

export function getProductBySlug(
  slug: string,
): Promise<ProductWithVariants | null> {
  return db.product.findFirst({
    where: { slug, isActive: true },
    include: includeVariants,
  });
}

export function getFeaturedProducts(): Promise<ProductWithVariants[]> {
  return db.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: includeVariants,
    orderBy: { name: "asc" },
  });
}

export function getProductsByCategory(
  category: ProductCategory,
): Promise<ProductWithVariants[]> {
  return db.product.findMany({
    where: { isActive: true, category },
    include: includeVariants,
    orderBy: { name: "asc" },
  });
}
