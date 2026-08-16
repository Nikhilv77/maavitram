import { useCallback, useEffect, useState } from "react";

interface UseHeroCarouselOptions {
  slideCount: number;
  /** Autoplay interval in ms. */
  intervalMs?: number;
}

interface UseHeroCarouselResult {
  index: number;
}

/** Drives the hero carousel autoplay. */
export function useHeroCarousel({
  slideCount,
  intervalMs = 5000,
}: UseHeroCarouselOptions): UseHeroCarouselResult {
  const [index, setIndex] = useState(0);

  // Auto-advancing content is a known problem for vestibular disorders —
  // respect the OS-level preference and leave autoplay off entirely.
  // Lazy initializer (not a synchronous setState in the effect body) reads
  // the starting value; the effect only subscribes to future changes.
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slideCount),
    [slideCount],
  );
  useEffect(() => {
    if (reducedMotion || slideCount <= 1) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [reducedMotion, slideCount, intervalMs, next]);

  return {
    index,
  };
}
