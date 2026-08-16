"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HeroSlideImage } from "@/components/store/hero/HeroSlideImage";
import { TrustPoints } from "@/components/store/hero/TrustPoints";
import { heroSlides } from "@/components/store/hero/hero-slides";
import { useHeroCarousel } from "@/components/store/hero/useHeroCarousel";

const heroCopy = {
  title: ["Rooted in Nature,", "Blended with Care"],
  description:
    "Pure ingredients and authentic blends elevate every meal beautifully.",
} as const;

/**
 * Homepage hero: an auto-advancing carousel of the four product lines.
 * Text stays fixed while the product artwork carousel changes, so the
 * brand message remains anchored and the layout never shifts between
 * slides.
 */
export function Hero() {
  const { index } = useHeroCarousel({
    slideCount: heroSlides.length,
    intervalMs: 3000,
  });

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured Maavitram products"
      className="store-hero relative overflow-hidden"
    >
      <div aria-hidden="true" className="hero-copy-wash" />
      <HeroGradientPatches />

      <div className="relative lg:min-h-[470px] xl:min-h-[500px]">
        <div className="relative h-[295px] overflow-hidden bg-[#f3e3c8] sm:h-[390px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[55%] lg:bg-transparent">
          <HeroSlideImage slides={heroSlides} activeIndex={index} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-[#fbf7ef]/80 via-[#fbf7ef]/30 to-transparent lg:hidden"
          />
        </div>

        <div className="relative z-10 lg:flex lg:min-h-[470px] lg:items-center xl:min-h-[500px]">
          <Container>
            <div className="max-w-xl pt-7 pb-8 sm:py-10 lg:w-[50%] lg:max-w-[660px] lg:py-14">
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-foreground/70 uppercase">
                <span className="h-px w-7 bg-foreground/30" />
                Pure spices. Timeless recipes.
                <Leaf className="h-3.5 w-3.5 text-green" aria-hidden="true" />
              </p>
              <h1 className="mt-3 min-h-[2.08em] font-serif text-[2.65rem] leading-[1.04] font-semibold tracking-normal text-foreground sm:text-5xl lg:text-[3.55rem] xl:text-[3.9rem]">
                {heroCopy.title.map((line) => (
                  <span key={line} className="block sm:text-nowrap">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-4 min-h-12 max-w-sm text-sm leading-7 font-medium text-muted sm:text-base">
                {heroCopy.description}
              </p>

              <div className="mt-6">
                <Link
                  href="/shop"
                  className="btn btn-primary min-h-11 gap-2 rounded-md px-6 text-xs shadow-sm"
                >
                  Explore Our Masalas
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-7">
                <TrustPoints />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

function HeroGradientPatches() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 z-[2] hidden w-[52%] overflow-hidden lg:block"
    >
      <span
        className="absolute top-[10%] left-[9%] h-32 w-52 -rotate-12 rounded-full opacity-16 blur-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(117,128,110,0.26) 0%, rgba(243,227,200,0.2) 56%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[31%] left-[38%] h-24 w-64 rotate-6 rounded-full opacity-18 blur-2xl"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, rgba(201,144,22,0.24) 42%, rgba(244,231,210,0.16) 74%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[63%] left-[12%] h-28 w-72 rotate-3 rounded-full opacity-16 blur-2xl"
        style={{
          background:
            "linear-gradient(125deg, rgba(243,227,200,0.34) 0%, rgba(201,144,22,0.12) 54%, transparent 100%)",
        }}
      />
      <span
        className="absolute top-[76%] left-[42%] h-20 w-40 -rotate-6 rounded-full opacity-12 blur-xl"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(201,144,22,0.2) 46%, rgba(243,227,200,0.14) 78%, transparent 100%)",
        }}
      />
    </div>
  );
}
