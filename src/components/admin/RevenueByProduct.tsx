import Image from "next/image";
import { Panel } from "@/components/admin/Panel";
import { productImageSrc } from "@/config/images";
import { accentBarClass } from "@/features/admin/lib/accents";
import { formatPrice } from "@/features/products/lib/pricing";
import type { ProductRevenueLine } from "@/features/admin/lib/mock-analytics";
import { cn } from "@/lib/utils";

interface RevenueByProductProps {
  lines: ProductRevenueLine[];
  rangeLabel: string;
  className?: string;
  delay?: number;
}

export function RevenueByProduct({
  lines,
  rangeLabel,
  className,
  delay,
}: RevenueByProductProps) {
  // Bars are scaled against the leader, not against 100% — at a 34% top
  // share every bar would otherwise sit in the left third of its track.
  const leader = Math.max(...lines.map((line) => line.share));

  return (
    <Panel
      title="Revenue by Product"
      description={`Share of revenue · last ${rangeLabel}`}
      className={className}
      delay={delay}
    >
      <ul className="flex flex-1 flex-col gap-1">
        {lines.map((line) => (
          <li
            key={line.name}
            className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-[var(--duration-base)] hover:bg-background/70"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-background">
              <Image
                src={productImageSrc(line.image)}
                alt=""
                fill
                sizes="40px"
                className="object-contain p-1 transition-transform duration-[var(--duration-base)] ease-out group-hover:scale-110"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  {line.name}
                </p>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                  {formatPrice(line.revenue)}
                </p>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-foreground/6">
                  <div
                    style={{ width: `${(line.share / leader) * 100}%` }}
                    className={cn(
                      "h-full origin-left rounded-full",
                      accentBarClass[line.accent],
                    )}
                  />
                </div>
                <p className="shrink-0 text-xs tabular-nums text-muted">
                  {(line.share * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
