/**
 * The four blend accent colours, defined as tokens in globals.css.
 *
 * Lives in its own module (rather than alongside one screen's mock data)
 * so every admin surface can reach it without importing another screen's
 * module — and so the class maps below exist once instead of being
 * copy-pasted per table.
 */
export type ProductAccent = "tez" | "saumya" | "achaari" | "lal-tadka";

// Static maps, not template strings — Tailwind's scanner only sees class
// names it can read literally in the source.

/** Vertical rail beside a product name. */
export const accentRailClass: Record<ProductAccent, string> = {
  tez: "bg-tez",
  saumya: "bg-saumya",
  achaari: "bg-achaari",
  "lal-tadka": "bg-lal-tadka",
};

/** Progress/quantity bar fill. */
export const accentBarClass: Record<ProductAccent, string> = accentRailClass;

/** Tinted avatar/chip background with a matching foreground. */
export const accentChipClass: Record<ProductAccent, string> = {
  tez: "bg-tez/12 text-tez",
  saumya: "bg-saumya/14 text-saumya",
  achaari: "bg-achaari/15 text-achaari",
  "lal-tadka": "bg-lal-tadka/12 text-lal-tadka",
};
