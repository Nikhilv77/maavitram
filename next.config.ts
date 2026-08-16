import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    localPatterns: [
      {
        pathname: "/images/products/**",
        search: "?v=2026-08-16-0314",
      },
      // Next.js 16: configuring `localPatterns` at all switches
      // next/image to an allowlist for every local src — these entries
      // cover the other local image directories actually referenced
      // (brand lockup/logo, hero slides, auth/about/contact visuals), none
      // of which use a query string, hence the empty `search`.
      { pathname: "/brand/**", search: "" },
      { pathname: "/images/hero/**", search: "" },
      { pathname: "/images/auth/**", search: "" },
      { pathname: "/images/about-us/**", search: "" },
      { pathname: "/images/contact-us/**", search: "" },
    ],
  },
};

export default nextConfig;
