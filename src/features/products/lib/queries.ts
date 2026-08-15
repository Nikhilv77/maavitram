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
