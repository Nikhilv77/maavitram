"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LeafPattern } from "@/components/ui/LeafPattern";
import { PreorderModal } from "@/components/store/products/PreorderModal";
import { productImageSrc } from "@/config/images";
import type { CatalogueEntry } from "@/features/products/lib/queries";

interface ProductCard {
  /** Matches Product.slug in the database — how a card finds its real
      variants and prices for the preorder modal. */
  slug: string;
  name: string;
  flavor: string;
  description: string;
  detail: {
    short: string;
    notes: string[];
    bestFor: string;
    accent: string;
  };
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

const products: ProductCard[] = [
  {
    slug: "maavitram-tez",
    name: "Maavitram Mix Tez",
    flavor: "Spicy / तीखा",
    description: "Fiery blend for those who love bold flavours.",
    detail: {
      short:
        "A bold red masala built for heat, aroma, and that unmistakable home-style punch.",
      notes: [
        "Deep chilli warmth",
        "Roasted spice aroma",
        "Bright finishing heat",
      ],
      bestFor:
        "Curries, marinades, tadka, spicy snacks, and street-style dishes.",
      accent: "var(--tez)",
    },
    image: {
      src: "/images/products/1.png",
      alt: "Maavitram Mix Tez spicy masala pouch with red chillies and spice powder",
      width: 1199,
      height: 1312,
    },
  },
  {
    slug: "maavitram-saumya",
    name: "Maavitram Mix Saumya",
    flavor: "Mild / सौम्य",
    description: "Perfectly balanced blend for everyday dishes.",
    detail: {
      short:
        "A gentle, rounded blend for daily cooking where flavour matters more than fire.",
      notes: [
        "Balanced spice profile",
        "Comforting everyday taste",
        "Mild aromatic lift",
      ],
      bestFor: "Sabzis, dals, breakfast dishes, gravies, and family meals.",
      accent: "var(--saumya)",
    },
    image: {
      src: "/images/products/2.png",
      alt: "Maavitram Mix Saumya mild masala pouch with green chillies and herbs",
      width: 1122,
      height: 1402,
    },
  },
  {
    slug: "maavitram-achaari-virasat",
    name: "Maavitram Achaari Virasat",
    flavor: "Pickle Masala / अचार मसाला",
    description: "Traditional taste that brings your pickles to life.",
    detail: {
      short:
        "A heritage-style achaari blend with tang, warmth, and the richness of whole spices.",
      notes: [
        "Classic pickle character",
        "Warm mustard-style depth",
        "Rich savoury finish",
      ],
      bestFor:
        "Homemade pickles, achaari sabzi, paratha stuffing, and quick masala tosses.",
      accent: "var(--achaari)",
    },
    image: {
      src: "/images/products/3.png",
      alt: "Maavitram Achaari Virasat pickle masala pouch with pickle and whole spices",
      width: 1122,
      height: 1402,
    },
  },
  {
    slug: "maavitram-lal-tadka",
    name: "Maavitram Lal Tadka",
    flavor: "Red Chilli Powder / लाल मिर्च पाउडर",
    description: "Pure, vibrant and rich in natural heat.",
    detail: {
      short:
        "A vibrant chilli powder made to add natural color, clean heat, and a lively tadka finish.",
      notes: ["Vivid red color", "Clean natural heat", "Smooth chilli aroma"],
      bestFor: "Tadka, chutneys, spice mixes, gravies, and finishing oil.",
      accent: "var(--lal-tadka)",
    },
    image: {
      src: "/images/products/4.png",
      alt: "Maavitram Lal Tadka red chilli powder pouch with chillies and chilli powder",
      width: 1122,
      height: 1402,
    },
  },
];

interface ProductRangeProps {
  /** Real variants per product slug, fetched server-side in the page. */
  catalogue: CatalogueEntry[];
}

export function ProductRange({ catalogue }: ProductRangeProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(
    null,
  );
  const [preorderProduct, setPreorderProduct] = useState<ProductCard | null>(
    null,
  );

  const variantsFor = (slug: string) =>
    catalogue.find((entry) => entry.slug === slug)?.variants ?? [];

  // Both sheets share this: the scroll lock has to stay on while either is
  // open, otherwise opening the preorder modal from the details modal
  // would release the page behind them.
  const anyModalOpen = Boolean(selectedProduct ?? preorderProduct);

  useEffect(() => {
    if (!anyModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Topmost first, so Escape peels one layer at a time.
      setPreorderProduct((current) => {
        if (current) return null;
        setSelectedProduct(null);
        return current;
      });
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [anyModalOpen]);

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-18">
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
              onClick={() => setSelectedProduct(product)}
              onKeyDown={(event) => {
                if (event.currentTarget !== event.target) {
                  return;
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedProduct(product);
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
                    setPreorderProduct(product);
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

      {selectedProduct ? (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onPreorder={() => {
            setPreorderProduct(selectedProduct);
            setSelectedProduct(null);
          }}
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
    </section>
  );
}

interface ProductDetailsModalProps {
  product: ProductCard;
  onClose: () => void;
  onPreorder: () => void;
}

function ProductDetailsModal({
  product,
  onClose,
  onPreorder,
}: ProductDetailsModalProps) {
  const modalPatternId = `modal-leaves-${product.name
    .toLowerCase()
    .replaceAll(" ", "-")}`;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/30 p-3 backdrop-blur-[3px] sm:items-center sm:p-6"
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
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-black/[0.06] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
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
          className="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/[0.06] bg-white/95 text-foreground/50 shadow-sm backdrop-blur transition-colors hover:text-green"
        >
          <X className="h-4.5 w-4.5" aria-hidden="true" />
        </button>

        {/* Product Visual */}
        <div
          className="relative flex h-[20rem] items-end justify-center overflow-hidden rounded-t-xl border-b border-black/[0.05] sm:h-[23rem]"
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
                  className="flex items-center gap-3 rounded-lg border border-black/[0.06] bg-white px-4 py-3.5 transition-colors hover:bg-[#fdfcf9]"
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
          <div className="mt-7 rounded-xl border border-black/[0.06] bg-[#fdfcf9] p-5 sm:p-6">
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
    </div>
  );
}
