import {
  IndianRupee,
  MessageCircle,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";
import { LowStockAlert } from "@/components/admin/LowStockAlert";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { SalesOverviewChart } from "@/components/admin/SalesOverviewChart";
import { StatCard } from "@/components/admin/StatCard";
import { TopProducts } from "@/components/admin/TopProducts";
import {
  getFormattedDate,
  getGreeting,
  lowStockLines,
  recentOrders,
  salesOverview,
  topProducts,
} from "@/features/admin/lib/mock-dashboard";

// Entrance stagger, top of the page downward. Kept here rather than
// inside each component so the whole cascade can be read — and retimed —
// in one place.
const DELAY = {
  header: 0,
  stats: 60,
  statStep: 55,
  chart: 300,
  topProducts: 360,
  orders: 430,
  lowStock: 490,
} as const;

export default function AdminDashboardPage() {
  const now = new Date();

  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <header
        style={{ animationDelay: `${DELAY.header}ms` }}
        className="animate-rise-in"
      >
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {getGreeting(now)}, Admin
        </h1>
        <p className="mt-2 text-sm text-muted">{getFormattedDate(now)}</p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value="₹8,94,600"
          icon={IndianRupee}
          tone="green"
          deltaPercent={12.4}
          deltaLabel="vs last month"
          delay={DELAY.stats}
        />
        <StatCard
          label="Total Orders"
          value="1,213"
          icon={ShoppingBag}
          tone="gold"
          deltaPercent={8.1}
          deltaLabel="vs last month"
          delay={DELAY.stats + DELAY.statStep}
        />
        <StatCard
          label="WhatsApp Orders"
          value="1,048"
          icon={MessageCircle}
          tone="saumya"
          deltaPercent={5.6}
          deltaLabel="vs last month"
          delay={DELAY.stats + DELAY.statStep * 2}
        />
        <StatCard
          label="Low Stock Items"
          value="4"
          icon={TriangleAlert}
          tone="red"
          deltaPercent={2.0}
          deltaLabel="needs restocking"
          invertDelta
          delay={DELAY.stats + DELAY.statStep * 3}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 lg:grid-cols-3">
        <SalesOverviewChart
          data={salesOverview}
          className="lg:col-span-2"
          delay={DELAY.chart}
        />
        <TopProducts products={topProducts} delay={DELAY.topProducts} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 lg:grid-cols-3">
        <RecentOrders
          orders={recentOrders}
          className="lg:col-span-2"
          delay={DELAY.orders}
        />
        <LowStockAlert lines={lowStockLines} delay={DELAY.lowStock} />
      </div>
    </main>
  );
}
