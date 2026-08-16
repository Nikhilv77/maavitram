import { getStockStatus } from "@/features/inventory/lib/stock";
import type { ProductAccent } from "@/features/admin/lib/mock-dashboard";
import type { ProductCategory } from "@/types/product";

/**
 * Placeholder catalogue for the admin Products screen.
 *
 * SKUs, labels and prices match prisma/seed.ts, and the stock levels
 * agree with the dashboard's Low Stock panel (Lal Tadka 250 g out,
 * Achaari 250 g at 3, Saumya 500 g at 6, Tez 500 g at 9) — so the two
 * screens tell the same story until real queries replace both.
 */

export interface AdminProductVariant {
  sku: string;
  label: string;
  weightInGrams: number;
  price: number;
  stockQuantity: number;
}

export interface AdminProduct {
  slug: string;
  name: string;
  accent: ProductAccent;
  category: ProductCategory;
  shortDescription: string;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
  variants: AdminProductVariant[];
}

export const adminProducts: AdminProduct[] = [
  {
    slug: "maavitram-tez",
    name: "Maavitram Mix Tez",
    accent: "tez",
    category: "blended_masalas",
    shortDescription: "Bold, high-heat all-purpose masala.",
    image: "/images/products/1.png",
    isActive: true,
    isFeatured: true,
    variants: [
      { sku: "MAV-TEZ-100", label: "100 g", weightInGrams: 100, price: 99, stockQuantity: 50 },
      { sku: "MAV-TEZ-250", label: "250 g", weightInGrams: 250, price: 219, stockQuantity: 25 },
      { sku: "MAV-TEZ-500", label: "500 g", weightInGrams: 500, price: 399, stockQuantity: 9 },
    ],
  },
  {
    slug: "maavitram-saumya",
    name: "Maavitram Mix Saumya",
    accent: "saumya",
    category: "blended_masalas",
    shortDescription: "Gentle, aromatic masala for everyday cooking.",
    image: "/images/products/2.png",
    isActive: true,
    isFeatured: true,
    variants: [
      { sku: "MAV-SAU-100", label: "100 g", weightInGrams: 100, price: 95, stockQuantity: 48 },
      { sku: "MAV-SAU-250", label: "250 g", weightInGrams: 250, price: 209, stockQuantity: 22 },
      { sku: "MAV-SAU-500", label: "500 g", weightInGrams: 500, price: 379, stockQuantity: 6 },
    ],
  },
  {
    slug: "maavitram-achaari-virasat",
    name: "Maavitram Achaari Virasat",
    accent: "achaari",
    category: "blended_masalas",
    shortDescription: "Tangy pickle-spiced masala rooted in tradition.",
    image: "/images/products/3.png",
    isActive: true,
    isFeatured: true,
    variants: [
      { sku: "MAV-ACH-100", label: "100 g", weightInGrams: 100, price: 109, stockQuantity: 30 },
      { sku: "MAV-ACH-250", label: "250 g", weightInGrams: 250, price: 239, stockQuantity: 3 },
    ],
  },
  {
    slug: "maavitram-lal-tadka",
    name: "Maavitram Lal Tadka",
    accent: "lal-tadka",
    category: "ground_spices",
    shortDescription: "Vibrant red chilli powder for a bold tadka.",
    image: "/images/products/4.png",
    isActive: true,
    isFeatured: true,
    variants: [
      { sku: "MAV-LAL-100", label: "100 g", weightInGrams: 100, price: 99, stockQuantity: 40 },
      { sku: "MAV-LAL-250", label: "250 g", weightInGrams: 250, price: 219, stockQuantity: 0 },
    ],
  },
];

/** Units on hand across every variant of a product. */
export function getTotalStock(product: AdminProduct): number {
  return product.variants.reduce(
    (total, variant) => total + variant.stockQuantity,
    0,
  );
}

/** Variants that are low or out — the ones needing a restock decision. */
export function getLowStockVariants(
  product: AdminProduct,
): AdminProductVariant[] {
  return product.variants.filter(
    (variant) => getStockStatus(variant.stockQuantity) !== "in-stock",
  );
}

/**
 * Variants that have actually run out, as distinct from merely low. A
 * product can hold plenty of total units and still have a dead SKU —
 * that's worse than "low" and should be surfaced as such.
 */
export function getOutOfStockVariants(
  product: AdminProduct,
): AdminProductVariant[] {
  return product.variants.filter(
    (variant) => getStockStatus(variant.stockQuantity) === "out-of-stock",
  );
}

export function getPriceRange(product: AdminProduct): {
  min: number;
  max: number;
} {
  const prices = product.variants.map((variant) => variant.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
