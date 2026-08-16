import { siteConfig } from "@/config/site";
import {
  currentMonthTopProducts,
  salesOverview as analyticsSalesOverview,
} from "@/features/admin/lib/mock-analytics";
import { adminOrders } from "@/features/admin/lib/mock-orders";
import type { ProductAccent } from "@/features/admin/lib/accents";
import type { OrderStatus } from "@/types/order";

/**
 * Placeholder dashboard data. Everything here is shaped like what the
 * real queries will return (same field names, same `OrderStatus` union,
 * prices as paise-free whole rupees like the Prisma schema) so wiring
 * the database later is a swap of this module's exports, not a rewrite
 * of the components that read them.
 */

export type { ProductAccent } from "@/features/admin/lib/accents";

export interface SalesPoint {
  /** Short month label, e.g. "Mar". */
  month: string;
  revenue: number;
}

export interface TopProduct {
  name: string;
  accent: ProductAccent;
  image: string;
  unitsSold: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  /** Bare 10 digits, as the checkout schema stores them. */
  customerPhone: string;
  itemSummary: string;
  totalAmount: number;
  status: OrderStatus;
  /** Relative, human-facing — the real one will be derived from createdAt. */
  placedAt: string;
}

export interface LowStockLine {
  productName: string;
  sku: string;
  variantLabel: string;
  stockQuantity: number;
}

/** Re-exported from analytics, which owns the revenue series. */
export const salesOverview: SalesPoint[] = analyticsSalesOverview;

/**
 * Derived from the analytics split for the most recent month, so the
 * panel agrees with the Analytics screen instead of carrying its own
 * figures.
 */
export const topProducts: TopProduct[] = currentMonthTopProducts.map(
  (line) => ({
    name: line.name,
    accent: line.accent,
    image: line.image,
    unitsSold: line.units,
    revenue: line.revenue,
  }),
);

/**
 * Derived from the order book rather than declared again, so the panel
 * can never disagree with the Orders screen about a total or a status.
 */
export const recentOrders: RecentOrder[] = adminOrders
  .slice(0, 5)
  .map((order) => ({
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    itemSummary: order.itemSummary,
    totalAmount: order.totalAmount,
    status: order.status,
    placedAt: order.placedAt,
  }));

export const lowStockLines: LowStockLine[] = [
  {
    productName: "Maavitram Lal Tadka",
    sku: "MAV-LAL-250",
    variantLabel: "250 g",
    stockQuantity: 0,
  },
  {
    productName: "Maavitram Achaari Virasat",
    sku: "MAV-ACH-250",
    variantLabel: "250 g",
    stockQuantity: 3,
  },
  {
    productName: "Maavitram Saumya",
    sku: "MAV-SAU-500",
    variantLabel: "500 g",
    stockQuantity: 6,
  },
  {
    productName: "Maavitram Tez",
    sku: "MAV-TEZ-500",
    variantLabel: "500 g",
    stockQuantity: 9,
  },
];

/**
 * Formatted server-side against the brand's own locale and timezone
 * rather than the runtime's. That keeps the greeting correct for the
 * admin no matter where this is deployed (a UTC serverless region would
 * otherwise say "Good evening" at 3pm IST), and — because the value is
 * deterministic for a given instant — it also avoids a server/client
 * hydration mismatch.
 */
const TIME_ZONE = "Asia/Kolkata";

export function getGreeting(now: Date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: TIME_ZONE,
    }).format(now),
  );

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getFormattedDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(now);
}
