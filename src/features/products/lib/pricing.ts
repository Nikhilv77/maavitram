import { siteConfig } from "@/config/site";
import type { ProductVariant, ProductWithVariants } from "@/types/product";

const currencyFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}

export function getDefaultVariant(
  product: ProductWithVariants,
): ProductVariant {
  return (
    product.variants.find((variant) => variant.isDefault) ?? product.variants[0]
  );
}

export function getPriceRange(product: ProductWithVariants): {
  min: number;
  max: number;
} {
  const prices = product.variants.map((variant) => variant.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function isDiscounted(variant: ProductVariant): boolean {
  return typeof variant.mrp === "number" && variant.mrp > variant.price;
}
