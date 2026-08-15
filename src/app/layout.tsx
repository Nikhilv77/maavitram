import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getOrganizationJsonLd, seoConfig } from "@/config/seo";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.description,
  keywords: [...seoConfig.keywords],
  applicationName: siteConfig.name,
  alternates: {
    // Homepage default. Routes below this segment should set their own
    // `alternates.canonical` to override — this value is only correct
    // for "/".
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    locale: seoConfig.ogLocale,
    images: [
      {
        url: seoConfig.ogImage.url,
        width: seoConfig.ogImage.width,
        height: seoConfig.ogImage.height,
        alt: seoConfig.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    images: [seoConfig.ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/logo.png", type: "image/png", sizes: "1254x1254" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/brand/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <html lang="en" className={`${raleway.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        {children}
      </body>
    </html>
  );
}
