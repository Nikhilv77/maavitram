// NEXT_PUBLIC_* vars are inlined at build time and safe to read directly —
// see .env.example. Falls back to clearly-fake placeholders so local dev
// still runs before real values are set.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:999";
const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

export const siteConfig = {
  name: "Maavitram",
  tagline: "Rooted in Nature, Blended with Care.",
  description:
    "Maavitram is a premium Indian spice and masala brand — sun-dried, stone-ground and blended in small batches.",
  url: siteUrl,
  // Country code + number, digits only. Ordering runs entirely through
  // WhatsApp — there is no payment gateway or online checkout.
  whatsappNumber,
  currency: "INR",
  locale: "en-IN",
} as const;

export type SiteConfig = typeof siteConfig;
