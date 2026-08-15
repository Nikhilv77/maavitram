// Purely derived/internal shapes — computed from orders, never external
// input — so they don't need a runtime-validated schema counterpart.

export interface SalesSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}
