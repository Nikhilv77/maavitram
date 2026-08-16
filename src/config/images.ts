/**
 * Cache-busting query appended to local images under /public/images.
 *
 * This value is not free-form: Next 16's `images.localPatterns` in
 * next.config.ts pins `/images/**` to this exact `search`
 * string, so a mismatch here doesn't just skip the cache bust — it makes
 * next/image reject the src outright. Keep the two in sync.
 */
export const localImageVersion = "2026-08-16-2020";

/** `/images/foo.png` -> `/images/foo.png?v=<version>`. */
export function localImageSrc(src: string): string {
  return src.startsWith("/images/") ? `${src}?v=${localImageVersion}` : src;
}

export const productImageSrc = localImageSrc;
