"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PackageSearch, Search } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { productImageSrc } from "@/config/images";
import { formatPrice } from "@/features/products/lib/pricing";
import { productCategoryLabel } from "@/features/products/lib/labels";
import {
  getLowStockVariants,
  getOutOfStockVariants,
  getPriceRange,
  getTotalStock,
  type AdminProduct,
} from "@/features/admin/lib/mock-products";
import type { ProductCategory } from "@/types/product";
import { accentRailClass } from "@/features/admin/lib/accents";
import { cn } from "@/lib/utils";

interface ProductsExplorerProps {
  products: AdminProduct[];
  delay?: number;
}

/**
 * One grid definition shared by the header and every row — same approach
 * as Recent Orders. The Variants and Price columns are `hidden` below xl,
 * which drops them out of grid flow entirely, so this is a 3-column
 * layout up to xl and a 5-column one beyond it, with no sideways scroll
 * at either end.
 */
const ROW_GRID =
  "grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-3 xl:grid-cols-[3.5rem_minmax(0,1.3fr)_minmax(0,1fr)_7rem_8rem] xl:gap-x-4";

type CategoryFilter = ProductCategory | "all";

export function ProductsExplorer({ products, delay }: ProductsExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  // Only the categories actually present, so the filter never offers a
  // tab that returns nothing.
  const categories = useMemo(() => {
    const present = new Set(products.map((product) => product.category));
    return [...present];
  }, [products]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (!needle) return true;
      // Search covers SKUs too — an admin looking at a physical pouch has
      // the SKU in front of them, not the product name.
      return (
        product.name.toLowerCase().includes(needle) ||
        product.slug.toLowerCase().includes(needle) ||
        product.variants.some((variant) =>
          variant.sku.toLowerCase().includes(needle),
        )
      );
    });
  }, [products, query, category]);

  return (
    <Panel
      title="All Products"
      description={`${visible.length} of ${products.length} shown`}
      delay={delay}
      bodyClassName="px-2 pb-3"
      action={
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <div className="relative w-full sm:w-auto">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or SKU"
              aria-label="Search products"
              className="h-8 w-full rounded-md bg-background py-1 pr-3 pl-8 text-xs text-foreground placeholder:text-muted/70 focus:outline-none sm:w-52"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {(["all", ...categories] as CategoryFilter[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                aria-pressed={category === value}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium",
                  "transition-colors duration-[var(--duration-fast)]",
                  category === value
                    ? "bg-green/10 text-green-dark"
                    : "text-muted hover:bg-background hover:text-green",
                )}
              >
                {value === "all" ? "All" : productCategoryLabel[value]}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* Column headers only make sense where there are real columns —
          on phones each product reads as a card, so they'd just be noise. */}
      <div
        aria-hidden="true"
        className={cn(
          ROW_GRID,
          "hidden px-3 pb-2 text-[11px] font-medium tracking-wide text-muted uppercase xl:grid",
        )}
      >
        <span />
        <span>Product</span>
        <span>Variants</span>
        <span className="text-right">Price</span>
        <span className="text-right">Stock</span>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-3 py-12 text-center">
          <PackageSearch className="h-6 w-6 text-muted/60" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            No products match
          </p>
          <p className="text-xs text-muted">
            Try a different name, SKU or category.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {visible.map((product) => {
            const { min, max } = getPriceRange(product);
            const totalStock = getTotalStock(product);
            const lowVariants = getLowStockVariants(product);
            const outVariants = getOutOfStockVariants(product);
            // A dead SKU outranks a merely-low one, even when the product
            // as a whole still has plenty of units — matches how the
            // dashboard's Low Stock panel ranks the same variants.
            const hasOut = outVariants.length > 0;

            return (
              <li
                key={product.slug}
                className={cn(
                  ROW_GRID,
                  "group rounded-md px-3 py-3.5 transition-colors duration-[var(--duration-base)] hover:bg-background/70 xl:py-3",
                )}
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-background">
                  <Image
                    src={productImageSrc(product.image)}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-1 transition-transform duration-[var(--duration-base)] ease-out group-hover:scale-110"
                  />
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                  {/* Accent rail ties the row back to the blend's colour,
                      the same cue Top Products and Low Stock use. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-8 w-1 shrink-0 rounded-full",
                      accentRailClass[product.accent],
                    )}
                  />
                  <div className="min-w-0">
                    {/* Wraps on phones rather than truncating — product
                        names here are long enough that clipping them
                        ("Achaari Viras…") loses the variant identity. */}
                    <p className="text-sm font-medium text-foreground xl:truncate">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted xl:truncate">
                      {productCategoryLabel[product.category]}
                      <span className="xl:hidden">
                        {" · "}
                        {product.variants.length} variants
                      </span>
                    </p>
                    {/* Price gets its own line on phones. Appending it to
                        the category line left it wrapping onto a ragged
                        third line of its own anyway. */}
                    <p className="mt-0.5 text-xs tabular-nums text-muted xl:hidden">
                      {min === max
                        ? formatPrice(min)
                        : `${formatPrice(min)} – ${formatPrice(max)}`}
                    </p>
                  </div>
                </div>

                <div className="hidden min-w-0 xl:block">
                  <p className="truncate text-sm text-foreground/80">
                    {product.variants.map((v) => v.label).join(" · ")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {product.variants.length} variants
                  </p>
                </div>

                <p className="hidden text-right text-sm font-medium tabular-nums text-foreground xl:block">
                  {min === max ? (
                    formatPrice(min)
                  ) : (
                    <>
                      {formatPrice(min)}
                      <span className="text-muted"> – </span>
                      {formatPrice(max)}
                    </>
                  )}
                </p>

                <div className="flex flex-col items-end gap-1">
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {totalStock}
                    <span className="ml-1 text-xs font-normal text-muted">
                      units
                    </span>
                  </p>
                  {lowVariants.length > 0 ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
                        hasOut ? "bg-red/10 text-red" : "bg-gold/12 text-achaari",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          hasOut ? "bg-red" : "bg-gold",
                        )}
                      />
                      {/* One span, so the pill's `gap-1.5` applies only
                          between the dot and the label — a bare text node
                          plus a sibling span would each become flex items
                          and pick up that gap mid-sentence. Full wording
                          only where there's room; the short form keeps the
                          phone layout's name column from collapsing. */}
                      <span>
                        {hasOut ? (
                          <>
                            {outVariants.length} out
                            <span className="hidden xl:inline"> of stock</span>
                          </>
                        ) : (
                          `${lowVariants.length} low`
                        )}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-saumya/10 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-saumya">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-saumya"
                      />
                      In stock
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
