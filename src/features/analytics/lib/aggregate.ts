import type { OrderWithItems } from "@/types/order";
import type { SalesSummary, TopProduct } from "@/types/analytics";

export function computeSalesSummary(orders: OrderWithItems[]): SalesSummary {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalAmount,
    0,
  );
  const averageOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders;

  return { totalOrders, totalRevenue, averageOrderValue };
}

export function computeTopProducts(
  orders: OrderWithItems[],
  limit = 5,
): TopProduct[] {
  const totals = new Map<string, TopProduct>();

  for (const order of orders) {
    for (const item of order.items) {
      const revenue = item.unitPrice * item.quantity;
      const existing = totals.get(item.productId);

      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenue += revenue;
      } else {
        totals.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          unitsSold: item.quantity,
          revenue,
        });
      }
    }
  }

  return [...totals.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
