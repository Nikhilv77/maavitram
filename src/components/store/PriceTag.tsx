import { formatPrice, isDiscounted } from "@/features/products/lib/pricing";
import type { ProductVariant } from "@/types/product";

interface PriceTagProps {
  variant: ProductVariant;
}

/** Displays a variant's selling price, with the MRP struck through if discounted. */
export function PriceTag({ variant }: PriceTagProps) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="text-lg font-semibold text-foreground">
        {formatPrice(variant.price)}
      </span>
      {isDiscounted(variant) && variant.mrp ? (
        <span className="text-sm text-muted line-through">
          {formatPrice(variant.mrp)}
        </span>
      ) : null}
    </span>
  );
}
