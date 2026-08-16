import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LeafPattern } from "@/components/ui/LeafPattern";
import { siteConfig } from "@/config/site";

interface AuthSplitLayoutProps {
  /** Companion visual, shown large next to the form on large screens. */
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
}

/**
 * Shared shell for auth pages: logo + form on the left, a tall brand
 * visual on the right, the pair centered together as one composition
 * (not two independently-centered halves — that left a dead gap between
 * them on wide monitors). Deliberately has no navbar/footer — auth is a
 * focused surface of its own, not a storefront page.
 */
export function AuthSplitLayout({
  imageSrc,
  imageAlt,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="relative min-h-dvh bg-background">
      <LeafPattern />

      <Link
        href="/"
        className="group absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-[var(--duration-fast)] hover:text-green sm:top-8 sm:left-10 lg:top-10 lg:left-12"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-0.5" />
        Back to store
      </Link>

      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-12 px-6 py-20 sm:px-10 lg:flex-row lg:gap-16 lg:px-16 xl:gap-24">
        <div className="w-full max-w-md">
          <Link href="/" className="mx-auto flex w-fit items-center justify-center">
            <Image
              src="/brand/logo.png"
              alt={siteConfig.name}
              width={1254}
              height={1254}
              preload
              className="h-28 w-28 object-contain"
            />
          </Link>

          {children}
        </div>

        {/* Hidden on mobile rather than just visually collapsed, and not
            preloaded — it's decorative, and preloading would fetch it
            even on viewports where `hidden` never lets it render. No
            mat/border/shadow: just the photo itself, large, with only
            enough corner rounding to avoid a hard rectangle. */}
        <div className="relative hidden aspect-[2/3] h-[min(82vh,760px)] max-w-full overflow-hidden rounded-xl lg:block">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 520px, 0px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
