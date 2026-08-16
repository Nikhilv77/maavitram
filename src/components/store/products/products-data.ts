/**
 * The storefront's four blends.
 *
 * Curated marketing copy, deliberately separate from the Prisma
 * catalogue: `slug` is the join back to the real product row, which is
 * where variants and prices come from. Lives in its own module because
 * both the product grid and the footer's Shop column render it.
 */

export interface ProductCard {
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

export const products: ProductCard[] = [
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
