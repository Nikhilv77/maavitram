"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Fraction of the element that must be visible before it counts. */
  threshold?: number;
  /** Shrinks the viewport so the reveal starts slightly before the edge. */
  rootMargin?: string;
}

/**
 * Fires once when an element first scrolls into view.
 *
 * Sections below the fold need this rather than an on-mount animation:
 * a mount-triggered reveal plays while the visitor is still reading the
 * hero, so by the time they scroll down everything has already settled
 * and the motion is never seen.
 *
 * The observer disconnects after the first hit — these are entrances,
 * not scroll-linked effects, and they should not replay on the way back
 * up.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
