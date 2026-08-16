import { adminOrders } from "@/features/admin/lib/mock-orders";
import { adminProducts } from "@/features/admin/lib/mock-products";
import type { ProductAccent } from "@/features/admin/lib/accents";
import type { OrderStatus } from "@/types/order";

/**
 * Analytics owns the revenue series for the whole admin — the dashboard's
 * Sales Overview chart and Top Products panel both read from here, so
 * there is one set of numbers rather than two that can disagree.
 *
 * Everything below either is the base series or is derived from it, which
 * is what keeps the range totals, the per-product split and the chart
 * adding up to the same figures.
 */

export interface MonthlyPoint {
  /** Short month label, e.g. "Mar". */
  month: string;
  revenue: number;
  orders: number;
  units: number;
}

/** Twelve months of revenue, oldest first. The base everything derives from. */
const monthlyRevenue: { month: string; revenue: number }[] = [
  { month: "Sep", revenue: 42_500 },
  { month: "Oct", revenue: 51_200 },
  { month: "Nov", revenue: 68_400 },
  { month: "Dec", revenue: 84_900 },
  { month: "Jan", revenue: 61_300 },
  { month: "Feb", revenue: 72_800 },
  { month: "Mar", revenue: 79_600 },
  { month: "Apr", revenue: 66_100 },
  { month: "May", revenue: 88_200 },
  { month: "Jun", revenue: 94_700 },
  { month: "Jul", revenue: 81_400 },
  { month: "Aug", revenue: 103_500 },
];

/**
 * Average order value per month, cycling through a small spread so the
 * derived order counts aren't a flat division of revenue. Deterministic
 * — a random factor would differ between server and client render.
 */
const AOV_CYCLE = [520, 545, 560, 535, 575];
/** Average units per order, used to derive the units figure. */
const UNITS_PER_ORDER = 2.6;

export const monthlySeries: MonthlyPoint[] = monthlyRevenue.map(
  (point, index) => {
    const orders = Math.round(point.revenue / AOV_CYCLE[index % AOV_CYCLE.length]);
    return {
      month: point.month,
      revenue: point.revenue,
      orders,
      units: Math.round(orders * UNITS_PER_ORDER),
    };
  },
);

/** Chart-shaped view of the same series, for the dashboard panel. */
export const salesOverview = monthlySeries.map(({ month, revenue }) => ({
  month,
  revenue,
}));

/**
 * Share of revenue per blend. Fixed rather than per-month so the split
 * stays stable across ranges; the shares are applied to whatever slice
 * is selected.
 */
const productShare: { slug: string; accent: ProductAccent; share: number }[] = [
  { slug: "maavitram-tez", accent: "tez", share: 0.34 },
  { slug: "maavitram-saumya", accent: "saumya", share: 0.28 },
  { slug: "maavitram-achaari-virasat", accent: "achaari", share: 0.22 },
  { slug: "maavitram-lal-tadka", accent: "lal-tadka", share: 0.16 },
];

/**
 * Splits a total by share with the remainder absorbed by the last part,
 * so the parts always sum back to exactly the total — plain rounding
 * would leave the breakdown a rupee or two off the headline figure.
 */
function splitByShare(total: number, shares: number[]): number[] {
  const parts = shares.slice(0, -1).map((share) => Math.round(total * share));
  const allocated = parts.reduce((sum, part) => sum + part, 0);
  return [...parts, total - allocated];
}

export interface AnalyticsRange {
  key: "3m" | "6m" | "12m";
  label: string;
  months: number;
}

export const analyticsRanges: AnalyticsRange[] = [
  { key: "3m", label: "3 months", months: 3 },
  { key: "6m", label: "6 months", months: 6 },
  { key: "12m", label: "12 months", months: 12 },
];

export interface RangeSummary {
  points: MonthlyPoint[];
  revenue: number;
  orders: number;
  units: number;
  averageOrderValue: number;
  /**
   * Percentage change against the preceding window of equal length, or
   * null when the series doesn't reach back far enough to compare — a
   * 12-month view has no prior 12 months here.
   */
  deltas: {
    revenue: number | null;
    orders: number | null;
    units: number | null;
    averageOrderValue: number | null;
  };
}

function totals(points: MonthlyPoint[]) {
  const revenue = points.reduce((sum, point) => sum + point.revenue, 0);
  const orders = points.reduce((sum, point) => sum + point.orders, 0);
  const units = points.reduce((sum, point) => sum + point.units, 0);
  return {
    revenue,
    orders,
    units,
    averageOrderValue: orders ? Math.round(revenue / orders) : 0,
  };
}

function percentChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function getRangeSummary(months: number): RangeSummary {
  const points = monthlySeries.slice(-months);
  const current = totals(points);

  // Only compare when a full previous window exists.
  const previousPoints =
    monthlySeries.length >= months * 2
      ? monthlySeries.slice(-months * 2, -months)
      : null;
  const previous = previousPoints ? totals(previousPoints) : null;

  return {
    points,
    ...current,
    deltas: {
      revenue: previous ? percentChange(current.revenue, previous.revenue) : null,
      orders: previous ? percentChange(current.orders, previous.orders) : null,
      units: previous ? percentChange(current.units, previous.units) : null,
      averageOrderValue: previous
        ? percentChange(current.averageOrderValue, previous.averageOrderValue)
        : null,
    },
  };
}

export interface ProductRevenueLine {
  name: string;
  accent: ProductAccent;
  image: string;
  revenue: number;
  units: number;
  /** Fraction of the range's revenue, 0–1. */
  share: number;
}

export function getProductRevenue(months: number): ProductRevenueLine[] {
  const { revenue, units } = getRangeSummary(months);
  const shares = productShare.map((entry) => entry.share);
  const revenueParts = splitByShare(revenue, shares);
  const unitParts = splitByShare(units, shares);

  return productShare.map((entry, index) => {
    const product = adminProducts.find((item) => item.slug === entry.slug);
    return {
      name: product?.name ?? entry.slug,
      accent: entry.accent,
      image: product?.image ?? "",
      revenue: revenueParts[index],
      units: unitParts[index],
      share: revenue ? revenueParts[index] / revenue : 0,
    };
  });
}

/** Top products for the dashboard panel — the most recent month. */
export const currentMonthTopProducts = getProductRevenue(1);

export interface StatusBreakdownLine {
  status: OrderStatus;
  count: number;
  revenue: number;
  share: number;
}

/**
 * Counted from the live order book rather than the revenue series — this
 * describes the orders currently on the Orders screen, not the 12-month
 * trend, and the panel says so.
 */
export function getStatusBreakdown(): StatusBreakdownLine[] {
  const order: OrderStatus[] = [
    "pending",
    "confirmed",
    "fulfilled",
    "cancelled",
  ];
  const total = adminOrders.length;

  return order.map((status) => {
    const matching = adminOrders.filter((entry) => entry.status === status);
    return {
      status,
      count: matching.length,
      revenue: matching.reduce((sum, entry) => sum + entry.totalAmount, 0),
      share: total ? matching.length / total : 0,
    };
  });
}
