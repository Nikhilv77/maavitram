import type { Metadata } from "next";
import { Boxes, Layers, Package, Plus, TriangleAlert } from "lucide-react";
import { ProductsExplorer } from "@/components/admin/ProductsExplorer";
import { StatCard } from "@/components/admin/StatCard";
import {
  adminProducts,
  getLowStockVariants,
  getTotalStock,
} from "@/features/admin/lib/mock-products";

export const metadata: Metadata = {
  title: "Products",
};

// Entrance stagger, top of the page downward — mirrors the Overview
// screen so moving between the two feels like one surface.
const DELAY = {
  header: 0,
  stats: 60,
  statStep: 55,
  list: 300,
} as const;

export default function AdminProductsPage() {
  const totalVariants = adminProducts.reduce(
    (total, product) => total + product.variants.length,
    0,
  );
  const totalUnits = adminProducts.reduce(
    (total, product) => total + getTotalStock(product),
    0,
  );
  const lowStockVariants = adminProducts.reduce(
    (total, product) => total + getLowStockVariants(product).length,
    0,
  );
  const activeCount = adminProducts.filter((product) => product.isActive).length;

  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <header
        style={{ animationDelay: `${DELAY.header}ms` }}
        className="animate-rise-in flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage the Maavitram catalogue, variants and pricing.
          </p>
        </div>

        <button type="button" className="btn btn-primary h-10 gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Product
        </button>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={String(adminProducts.length)}
          icon={Package}
          tone="green"
          hint={`${activeCount} active`}
          delay={DELAY.stats}
        />
        <StatCard
          label="Total Variants"
          value={String(totalVariants)}
          icon={Layers}
          tone="gold"
          hint="Across all blends"
          delay={DELAY.stats + DELAY.statStep}
        />
        <StatCard
          label="Units in Stock"
          value={totalUnits.toLocaleString("en-IN")}
          icon={Boxes}
          tone="saumya"
          hint="On hand right now"
          delay={DELAY.stats + DELAY.statStep * 2}
        />
        <StatCard
          label="Low Stock Variants"
          value={String(lowStockVariants)}
          icon={TriangleAlert}
          tone="red"
          hint="At or below threshold"
          delay={DELAY.stats + DELAY.statStep * 3}
        />
      </div>

      <div className="mt-4 sm:mt-5">
        <ProductsExplorer products={adminProducts} delay={DELAY.list} />
      </div>
    </main>
  );
}
