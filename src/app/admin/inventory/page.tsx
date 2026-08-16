import type { Metadata } from "next";
import { InventoryManager } from "@/components/admin/InventoryManager";
import { inventoryLines } from "@/features/admin/lib/mock-inventory";

export const metadata: Metadata = {
  title: "Inventory",
};

// Entrance stagger, top of the page downward — mirrors Overview and
// Products so moving between them feels like one surface.
const DELAY = {
  header: 0,
  stats: 60,
  statStep: 55,
  list: 300,
  log: 360,
} as const;

export default function AdminInventoryPage() {
  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <header
        style={{ animationDelay: `${DELAY.header}ms` }}
        className="animate-rise-in"
      >
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Inventory
        </h1>
        <p className="mt-2 text-sm text-muted">
          Stock on hand for every SKU, with restock targets. Adjust levels as
          batches arrive or stock is written off.
        </p>
      </header>

      {/* Totals and the table share one state owner — see InventoryManager. */}
      <InventoryManager initialLines={inventoryLines} delay={DELAY} />
    </main>
  );
}
