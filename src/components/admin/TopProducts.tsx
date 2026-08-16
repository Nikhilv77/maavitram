import Image from "next/image";
import { Panel } from "@/components/admin/Panel";
import { productImageSrc } from "@/config/images";
import { formatPrice } from "@/features/products/lib/pricing";
import type { TopProduct } from "@/features/admin/lib/mock-dashboard";
import { accentBarClass } from "@/features/admin/lib/accents";
import { cn } from "@/lib/utils";

interface TopProductsProps {
  products: TopProduct[];
  className?: string;
  delay?: number;
}

export function TopProducts({ products, className, delay }: TopProductsProps) {
  const leader = Math.max(...products.map((product) => product.unitsSold));

  return (
    <Panel
      title="Top Products"
      description="By units sold this month"
      className={className}
      delay={delay}
    >
      <ul className="flex flex-1 flex-col gap-1">
        {products.map((product, i) => (
          <li
            key={product.name}
            className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-[var(--duration-base)] hover:bg-background/70"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-background">
              <Image
                src={productImageSrc(product.image)}
                alt=""
                fill
                sizes="44px"
                className="object-contain p-1 transition-transform duration-[var(--duration-base)] ease-out group-hover:scale-110"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  {product.name}
                </p>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                  {formatPrice(product.revenue)}
                </p>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-foreground/6">
                  <div
                    style={{
                      width: `${(product.unitsSold / leader) * 100}%`,
                      // Trails the panel's own entrance so the bars fill
                      // after the card has settled, not during it.
                      animationDelay: `${(delay ?? 0) + 180 + i * 90}ms`,
                    }}
                    className={cn(
                      "animate-grow-x h-full origin-left rounded-full",
                      accentBarClass[product.accent],
                    )}
                  />
                </div>
                <p className="shrink-0 text-xs tabular-nums text-muted">
                  {product.unitsSold} units
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
