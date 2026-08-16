/**
 * Static marketing content for the homepage hero carousel — one slide per
 * product line. This is curated copy, not catalogue data, so it's kept
 * separate from the DB-backed product model in @/types/product.
 *
 * `accent` names a product-line color token already defined in
 * globals.css (`--tez`, `--saumya`, `--achaari`, `--lal-tadka`, all
 * registered as Tailwind colors via `@theme inline`) — used to tint each
 * slide's pagination dot without hardcoding a duplicate color.
 */

export type HeroAccent = "tez" | "saumya" | "achaari" | "lal-tadka";

export interface HeroSlide {
  id: string;
  accent: HeroAccent;
  image: {
    src: string;
    alt: string;
    className?: string;
  };
}

export const heroSlides: HeroSlide[] = [
  {
    id: "tez",
    accent: "tez",
    image: {
      src: "/images/hero/product-1-right.png",
      alt: "Maavitram Tez spicy masala blend surrounded by red chillies and whole spices",
    },
  },
  {
    id: "saumya",
    accent: "saumya",
    image: {
      src: "/images/hero/product-2-right.png",
      alt: "Maavitram Saumya mild masala blend surrounded by green chillies and fresh herbs",
    },
  },
  {
    id: "achaari-virasat",
    accent: "achaari",
    image: {
      src: "/images/hero/product-3-right.png",
      alt: "Maavitram Achaari Virasat pickle masala surrounded by pickled fruit and whole spices",
      className: "lg:scale-[1.06]",
    },
  },
  {
    id: "lal-tadka",
    accent: "lal-tadka",
    image: {
      src: "/images/hero/product-4-right.png",
      alt: "Maavitram Lal Tadka red chilli powder surrounded by dried red chillies",
      className: "lg:scale-[1.04]",
    },
  },
];

export const heroTrustPoints = [
  "100% Natural",
  "No Preservatives",
  "Premium Quality",
] as const;
