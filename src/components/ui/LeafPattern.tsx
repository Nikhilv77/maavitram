import { cn } from "@/lib/utils";

interface LeafPatternProps {
  className?: string;
  /**
   * SVG `id`s are document-global, so two instances on one page would
   * collide on the `fill="url(#…)"` reference. Override this when a page
   * renders more than one.
   */
  id?: string;
}

/**
 * Extremely low-opacity repeating botanical line motif — echoes the leaf
 * mark in the Maavitram logo so large cream areas read as intentional
 * rather than empty, without competing with the content on top. Shared
 * by the auth screens, the storefront product range and the admin
 * dashboard.
 *
 * Decorative only: aria-hidden, non-interactive, and positioned by the
 * caller (it defaults to filling its nearest positioned ancestor).
 */
export function LeafPattern({
  className,
  id = "leaf-pattern",
}: LeafPatternProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-green opacity-[0.05]",
        className,
      )}
    >
      <pattern
        id={id}
        width="120"
        height="120"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(8)"
      >
        <path
          d="M14 110 Q26 65 14 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M14 78 Q28 72 34 56 Q20 60 14 78Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M14 46 Q0 40 -6 24 Q6 30 14 46Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
