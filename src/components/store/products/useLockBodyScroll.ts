"use client";

import { useEffect } from "react";

/**
 * Freezes page scrolling while a sheet is open.
 *
 * Takes a single boolean rather than living inside one modal, because
 * two sheets can be stacked (details → preorder) and each unmounting one
 * would otherwise restore scrolling while the other is still up.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
