import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/components/store/hero/hero-slides";

interface HeroSlideImageProps {
  slides: HeroSlide[];
  activeIndex: number;
}

/**
 * Stack of full-bleed slide images, crossfading via opacity + a small
 * horizontal nudge. Each slide's resting offset is derived from its
 * position relative to `activeIndex` (before = settled left, after =
 * waiting right) rather than tracked "direction" state — same result,
 * no extra state to get out of sync.
 */
export function HeroSlideImage({ slides, activeIndex }: HeroSlideImageProps) {
  return (
    <div className="absolute inset-0">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== activeIndex}
          className={cn(
            "absolute inset-0 transition-[opacity,translate] duration-[var(--duration-slow)] ease-out motion-reduce:transition-none",
            i === activeIndex
              ? "translate-x-0 opacity-100"
              : i < activeIndex
                ? "-translate-x-4 opacity-0"
                : "translate-x-4 opacity-0",
          )}
        >
          <div
            className={cn(
              "hero-slide-artwork absolute right-0 bottom-0 h-full w-full lg:aspect-[1254/887] lg:w-auto",
              slide.image.className,
            )}
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              preload={i === 0}
              sizes="(min-width: 1024px) 63vw, 100vw"
              className="object-cover object-center lg:object-contain lg:object-right-bottom"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
