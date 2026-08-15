import { Container } from "@/components/ui/Container";
import { StatCard } from "@/components/admin/StatCard";
import { getAllProducts } from "@/features/products/lib/queries";
import { formatPrice } from "@/features/products/lib/pricing";
import {
  getStockStatus,
  getTotalInventoryValue,
} from "@/features/inventory/lib/stock";

export default async function AdminDashboardPage() {
  const products = await getAllProducts();
  const stockLines = products.flatMap((product) =>
    product.variants.map((variant) => ({
      price: variant.price,
      stockQuantity: variant.inventory?.stockQuantity ?? 0,
    })),
  );
  const attentionCount = stockLines.filter(
    (line) => getStockStatus(line.stockQuantity) !== "in-stock",
  ).length;

  return (
    <main className="flex-1">
      <Container className="py-16">
        <h1 className="text-3xl font-semibold text-foreground">
          Admin Dashboard
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Product, inventory, order and analytics management is coming soon.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Active products" value={String(products.length)} />
          <StatCard
            label="Variants needing attention"
            value={String(attentionCount)}
          />
          <StatCard
            label="Inventory value"
            value={formatPrice(getTotalInventoryValue(stockLines))}
          />
        </div>
      </Container>
    </main>
  );
}
