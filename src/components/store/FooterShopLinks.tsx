"use client";

import { useProductModal } from "@/components/store/products/ProductModalProvider";
import { products } from "@/components/store/products/products-data";

/**
 * The footer's Shop column. Opens the same description sheet the product
 * grid uses instead of navigating — there are no per-product routes, and
 * a link to one would 404.
 *
 * Client-only so the rest of the footer can stay a Server Component.
 * Labels come from the shared product data, so they can't drift from the
 * cards above.
 */
export function FooterShopLinks() {
  const { openDetails } = useProductModal();

  return (
    <nav aria-label="Shop">
      <h2 className="text-sm font-semibold text-green">Shop</h2>
      <ul className="mt-3.5 grid gap-2">
        {products.map((product) => (
          <li key={product.slug}>
            <button
              type="button"
              onClick={() => openDetails(product)}
              className="cursor-pointer text-left text-sm font-medium text-foreground/62 transition-colors duration-[var(--duration-fast)] hover:text-green"
            >
              {product.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
