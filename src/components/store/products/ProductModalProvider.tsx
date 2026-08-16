"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ProductDetailsModal } from "@/components/store/products/ProductDetailsModal";
import { PreorderModal } from "@/components/store/products/PreorderModal";
import { products, type ProductCard } from "@/components/store/products/products-data";
import { useLockBodyScroll } from "@/components/store/products/useLockBodyScroll";
import type { CatalogueEntry } from "@/features/products/lib/queries";

interface ProductModalContextValue {
  /** Opens the description sheet for a blend. */
  openDetails: (product: ProductCard) => void;
  /** Opens the reservation form for a blend. */
  openPreorder: (product: ProductCard) => void;
  /** Same, by slug — for callers that only hold a slug (the footer). */
  openDetailsBySlug: (slug: string) => void;
}

const ProductModalContext = createContext<ProductModalContextValue | null>(null);

export function useProductModal(): ProductModalContextValue {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error("useProductModal must be used within <ProductModalProvider>");
  }
  return context;
}

interface ProductModalProviderProps {
  /** Real variants per slug, fetched server-side in the store layout. */
  catalogue: CatalogueEntry[];
  children: ReactNode;
}

/**
 * Owns the product sheets for the whole storefront.
 *
 * They live here rather than inside ProductRange because the footer's
 * Shop column opens the same description sheet, and the footer is a
 * sibling of the page content in the layout — there is no component
 * lower down that contains both.
 */
export function ProductModalProvider({
  catalogue,
  children,
}: ProductModalProviderProps) {
  const [detailsProduct, setDetailsProduct] = useState<ProductCard | null>(null);
  const [preorderProduct, setPreorderProduct] = useState<ProductCard | null>(
    null,
  );

  const anyOpen = Boolean(detailsProduct ?? preorderProduct);
  useLockBodyScroll(anyOpen);

  // Escape closes one layer at a time, topmost first, so dismissing the
  // reservation form returns you to the description sheet you opened it
  // from rather than closing both.
  useEffect(() => {
    if (!anyOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (preorderProduct) setPreorderProduct(null);
      else setDetailsProduct(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [anyOpen, preorderProduct]);

  const value = useMemo<ProductModalContextValue>(
    () => ({
      openDetails: setDetailsProduct,
      openPreorder: setPreorderProduct,
      openDetailsBySlug: (slug) => {
        const match = products.find((product) => product.slug === slug);
        if (match) setDetailsProduct(match);
      },
    }),
    [],
  );

  const variantsFor = (slug: string) =>
    catalogue.find((entry) => entry.slug === slug)?.variants ?? [];

  return (
    <ProductModalContext.Provider value={value}>
      {children}

      {detailsProduct ? (
        <ProductDetailsModal
          product={detailsProduct}
          onClose={() => setDetailsProduct(null)}
          onPreorder={() => setPreorderProduct(detailsProduct)}
        />
      ) : null}

      {preorderProduct ? (
        <PreorderModal
          product={{
            name: preorderProduct.name,
            flavor: preorderProduct.flavor,
            accent: preorderProduct.detail.accent,
            image: preorderProduct.image,
          }}
          variants={variantsFor(preorderProduct.slug)}
          onClose={() => setPreorderProduct(null)}
        />
      ) : null}
    </ProductModalContext.Provider>
  );
}
