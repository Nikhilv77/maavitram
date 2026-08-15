import { siteConfig } from "@/config/site";

// Central place for SEO/metadata copy. `app/layout.tsx` (and any route that
// wants to override a field) should read from here rather than hardcoding
// title/description/keyword strings, so every surface — <head> tags, OG
// cards, Twitter cards, JSON-LD — stays in sync with one source of truth.

/** OG locale format ("en-IN" -> "en_IN"), per the Open Graph spec. */
const ogLocale = siteConfig.locale.replace("-", "_");

export const seoConfig = {
  /** Used as `title.default` — the tab/share title for the homepage. */
  defaultTitle: `${siteConfig.name} | ${siteConfig.tagline}`,
  /** Used as `title.template` — applied to every page that sets its own title. */
  titleTemplate: `%s | ${siteConfig.name}`,
  description: siteConfig.description,
  // Keep this list scoped to what the brand actually sells — no invented
  // categories, no unrelated high-volume terms.
  keywords: [
    "Indian spices",
    "masala",
    "premium masala",
    "authentic Indian spices",
    "spice blends",
    "red chilli powder",
    "pickle masala",
    "Maavitram Tez",
    "Maavitram Saumya",
    "Maavitram Achaari Virasat",
    "Maavitram Lal Tadka",
  ],
  ogLocale,
  ogImage: {
    url: "/brand/logo.png",
    width: 1254,
    height: 1254,
    alt: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
} as const;

export type SeoConfig = typeof seoConfig;

/** schema.org Organization — hand-typed to avoid pulling in a schema-dts dependency. */
export interface OrganizationJsonLd {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  slogan: string;
  description: string;
}

export function getOrganizationJsonLd(): OrganizationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: new URL(seoConfig.ogImage.url, siteConfig.url).toString(),
    slogan: siteConfig.tagline,
    description: siteConfig.description,
  };
}
