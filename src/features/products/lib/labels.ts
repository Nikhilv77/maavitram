import type { ProductCategory } from "@/types/product";

/**
 * Human-readable names for the `ProductCategory` enum. The enum values
 * are snake_case database identifiers and should never reach the UI
 * directly.
 */
export const productCategoryLabel: Record<ProductCategory, string> = {
  whole_spices: "Whole Spices",
  ground_spices: "Ground Spices",
  blended_masalas: "Blended Masalas",
  seasonings: "Seasonings",
};
