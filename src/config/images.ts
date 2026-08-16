/**
 * Cache-busting query appended to the local product photos.
 *
 * This value is not free-form: Next 16's `images.localPatterns` in
 * next.config.ts pins `/images/products/**` to this exact `search`
 * string, so a mismatch here doesn't just skip the cache bust — it makes
 * next/image reject the src outright. Keep the two in sync.
 */
export const productImageVersion = "2026-08-16-0314";

/** `/images/products/1.png` -> `/images/products/1.png?v=<version>`. */
export function productImageSrc(src: string): string {
  return `${src}?v=${productImageVersion}`;
}
