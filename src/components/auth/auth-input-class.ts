/**
 * Shared text/password input styling for auth forms — kept as one
 * constant so signup/signin fields never drift out of sync. Flat by
 * design: no border, no focus ring/border-color change, no focus
 * outline — definition comes from the `bg-surface` fill against the
 * page's `bg-background` alone.
 *
 * `focus:outline-none` deliberately overrides the site's global gold
 * `:focus-visible` ring (globals.css) for just these fields. It's
 * scoped here rather than changed globally — Tailwind utilities live
 * in `@layer utilities`, which already outranks the global rule's
 * `@layer base`, so this wins without touching the shared file or any
 * other input/button on the site.
 */
export const authInputClass =
  "h-13 w-full rounded-lg bg-surface px-4 text-base text-foreground placeholder:text-muted/60 focus:outline-none";
