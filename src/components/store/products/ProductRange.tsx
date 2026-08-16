"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LeafPattern } from "@/components/ui/LeafPattern";
import { useProductModal } from "@/components/store/products/ProductModalProvider";
import { products } from "@/components/store/products/products-data";
import { productImageSrc } from "@/config/images";

export function ProductRange() {
  const { openDetails, openPreorder } = useProductModal();

  return (
    <section
      id="products"
      className="relative scroll-mt-4 overflow-hidden bg-white py-12 sm:py-16 lg:py-18"
    >
      <div className="absolute inset-0 opacity-45">
        <LeafPattern id="product-range-leaves" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-[10px] font-semibold tracking-[0.22em] text-foreground/55 uppercase sm:text-[11px]">
            <span className="h-px w-7 bg-foreground/18" />
            Our Masala Range
            <span className="h-px w-7 bg-foreground/18" />
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-[1.04] font-semibold text-balance text-foreground sm:text-4xl lg:text-5xl">
            <span className="block sm:inline">Crafted for</span>{" "}
            <span className="block sm:inline">Every Taste</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[21rem] text-sm leading-6 font-normal text-pretty text-muted sm:max-w-xl">
            Four unique blends, made with pure ingredients and generations of
            trust.
          </p>
        </div>

        <div className="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:mt-11 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${product.name}`}
              onClick={() => openDetails(product)}
              onKeyDown={(event) => {
                if (event.currentTarget !== event.target) {
                  return;
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openDetails(product);
                }
              }}
              className="group flex min-w-0 cursor-pointer flex-col text-center transition-opacity duration-[var(--duration-fast)] outline-none hover:opacity-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-white"
            >
              <div className="relative mx-auto flex aspect-[4/4.2] w-full max-w-[18.5rem] items-end justify-center overflow-hidden">
                <Image
                  src={productImageSrc(product.image.src)}
                  alt={product.image.alt}
                  width={product.image.width}
                  height={product.image.height}
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
                  className="h-full w-full object-contain transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-[1.025]"
                />
              </div>

              <div className="mx-auto mt-5 flex w-full max-w-[17rem] flex-1 flex-col border-t border-foreground/10 px-2 pt-5">
                <h3 className="text-base leading-tight font-semibold tracking-normal text-foreground sm:text-lg">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-xs leading-5 font-medium text-foreground/62">
                  {product.flavor}
                </p>
                <p className="mx-auto mt-3 max-w-[13.5rem] flex-1 text-sm leading-6 font-normal text-muted">
                  {product.description}
                </p>

                <button
                  type="button"
                  aria-label={`Preorder ${product.name}`}
                  onClick={(event) => {
                    // The whole card opens the details sheet; this button
                    // must not also trigger that.
                    event.stopPropagation();
                    openPreorder(product);
                  }}
                  className="btn btn-primary mx-auto mt-5 min-h-10 gap-2 rounded-md px-6 text-xs"
                >
                  Buy Now
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
