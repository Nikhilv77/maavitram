import type { Metadata } from "next";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { adminOrders } from "@/features/admin/lib/mock-orders";

export const metadata: Metadata = {
  title: "Orders",
};

// Entrance stagger, top of the page downward — mirrors the other admin
// screens so moving between them feels like one surface.
const DELAY = {
  header: 0,
  stats: 60,
  statStep: 55,
  list: 300,
} as const;

export default function AdminOrdersPage() {
  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <header
        style={{ animationDelay: `${DELAY.header}ms` }}
        className="animate-rise-in"
      >
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Orders
        </h1>
        <p className="mt-2 text-sm text-muted">
          Every order placed over WhatsApp. Open one to see its items and move
          it along.
        </p>
      </header>

      {/* Totals and the table share one state owner — see OrdersManager. */}
      <OrdersManager initialOrders={adminOrders} delay={DELAY} />
    </main>
  );
}
