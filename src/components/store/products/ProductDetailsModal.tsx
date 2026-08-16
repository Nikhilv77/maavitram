"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { LeafPattern } from "@/components/ui/LeafPattern";
import { productImageSrc } from "@/config/images";
import type { ProductCard } from "@/components/store/products/products-data";

interface ProductDetailsModalProps {
  product: ProductCard;
  onClose: () => void;
  onPreorder: () => void;
}

export function ProductDetailsModal({
  product,
  onClose,
  onPreorder,
}: ProductDetailsModalProps) {
  const modalPatternId = `modal-leaves-${product.name
    .toLowerCase()
    .replaceAll(" ", "-")}`;

  // Portalled to <body> for the same reason as the preorder sheet: a
  // `transform`/`filter`/`overflow` on any ancestor would otherwise
  // contain this fixed overlay instead of letting it cover the viewport.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      className="animate-fade-in fixed inset-0 z-[80] flex items-end justify-center bg-black/30 p-3 backdrop-blur-[3px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        className="animate-modal-in scrollbar-none relative max-h-[92vh] w-full max-w-[52rem] overflow-y-auto rounded-xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
        style={
          {
            "--product-accent": product.detail.accent,
          } as React.CSSProperties
        }
      >
        {/* Close */}
        <button
          type="button"
          aria-label="Close product details"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center text-foreground/45 transition-colors duration-[var(--duration-fast)] hover:text-green"
        >
          <X className="h-4.5 w-4.5" aria-hidden="true" />
        </button>

        {/* Product Visual */}
        <div
          className="relative flex h-[20rem] items-end justify-center overflow-hidden rounded-t-xl sm:h-[23rem]"
          style={{
            background:
              "radial-gradient(circle at 50% 95%, color-mix(in srgb, var(--product-accent) 8%, transparent), transparent 56%), #fffefa",
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <LeafPattern id={modalPatternId} />
          </div>

          <Image
            src={productImageSrc(product.image.src)}
            alt={product.image.alt}
            width={product.image.width}
            height={product.image.height}
            sizes="(min-width: 768px) 620px, 90vw"
            className="relative z-10 h-auto max-h-[19rem] w-[74%] object-contain drop-shadow-[0_18px_28px_rgba(31,39,29,0.10)] sm:max-h-[22rem] sm:w-auto"
          />
        </div>

        {/* Content */}
        <div className="bg-white px-6 py-7 sm:px-10 sm:py-9">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase"
              style={{ backgroundColor: product.detail.accent }}
            >
              {product.flavor}
            </span>

            <span className="text-xs font-medium text-foreground/45">
              100g pouch
            </span>
          </div>

          {/* Header */}
          <div className="mt-5">
            <h3
              id="product-details-title"
              className="font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.01em] text-foreground sm:text-[2.75rem]"
            >
              {product.name}
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/58 sm:text-[15px]">
              {product.detail.short}
            </p>
          </div>

          <div className="my-7 h-px bg-black/[0.06]" />

          {/* Blend Notes */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-foreground/40 uppercase">
              Blend Notes
            </p>

            <div className="mt-4 space-y-2.5">
              {product.detail.notes.map((note) => (
                <div
                  key={note}
                  className="flex items-center gap-3 rounded-lg bg-[#fffefa] px-4 py-3.5 transition-colors duration-[var(--duration-fast)] hover:bg-[#fdfaf3]"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: product.detail.accent }}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>

                  <span className="text-sm font-medium text-foreground/68">
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div className="mt-7">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-foreground/40 uppercase">
              Best For
            </p>

            <p className="mt-3 text-sm leading-7 text-foreground/60">
              {product.detail.bestFor}
            </p>
          </div>

          {/* Usage */}
          <div className="mt-7 rounded-xl bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-foreground/40 uppercase">
              Made for Everyday Cooking
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/58">
              Made for Indian kitchens that want dependable flavour without
              fuss. Add a little for everyday depth or build richer flavour in
              curries, marinades and tadkas.
            </p>
          </div>

          {/* Preorder CTA */}
          <div className="mt-7">
            <button
              type="button"
              onClick={onPreorder}
              className="btn btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold"
            >
              Reserve My Order
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-foreground/40">
              Reserve your pack today. We&apos;ll personally reach out with
              availability and next steps.
            </p>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
