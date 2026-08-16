import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
        search: "?v=2026-08-16-2020",
      },
      // Next.js 16: configuring `localPatterns` at all switches next/image
      // to an allowlist. Brand assets do not use a version query.
      { pathname: "/brand/**", search: "" },
    ],
  },
};

export default nextConfig;
