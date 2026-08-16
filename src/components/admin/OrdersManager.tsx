"use client";

import { useState } from "react";
import { ClipboardList, Clock, IndianRupee, Receipt } from "lucide-react";
import { OrderDetailDialog } from "@/components/admin/OrderDetailDialog";
import { OrdersExplorer } from "@/components/admin/OrdersExplorer";
import { StatCard } from "@/components/admin/StatCard";
import { formatPrice } from "@/features/products/lib/pricing";
import type { AdminOrder } from "@/features/admin/lib/mock-orders";
import type { OrderStatus } from "@/types/order";

interface OrdersManagerProps {
  initialOrders: AdminOrder[];
  delay: { stats: number; statStep: number; list: number };
}

/**
 * Owns the mutable order state for the screen.
 *
 * The stat cards live here rather than in the page's Server Component
 * because they're derived from the same orders the table mutates —
 * rendering them upstream would leave the counts stale the moment a
 * status changes.
 */
export function OrdersManager({ initialOrders, delay }: OrdersManagerProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Derived rather than held in state, so the dialog reflects a status
  // change immediately after applying one.
  const activeOrder = orders.find((order) => order.id === activeId) ?? null;

  // Cancelled orders are excluded from money: they were never collected,
  // so counting them would overstate both revenue and the average.
  const billable = orders.filter((order) => order.status !== "cancelled");
  const revenue = billable.reduce((total, order) => total + order.totalAmount, 0);
  const averageOrderValue = billable.length
    ? Math.round(revenue / billable.length)
    : 0;
  const pendingCount = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
    setActiveId(null);
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={String(orders.length)}
          icon={ClipboardList}
          tone="green"
          hint={`${billable.length} billable`}
          delay={delay.stats}
        />
        <StatCard
          label="Pending"
          value={String(pendingCount)}
          icon={Clock}
          tone="gold"
          hint="Awaiting confirmation"
          delay={delay.stats + delay.statStep}
        />
        <StatCard
          label="Revenue"
          value={formatPrice(revenue)}
          icon={IndianRupee}
          tone="saumya"
          hint="Excludes cancelled"
          delay={delay.stats + delay.statStep * 2}
        />
        <StatCard
          label="Avg Order Value"
          value={formatPrice(averageOrderValue)}
          icon={Receipt}
          tone="red"
          hint="Across billable orders"
          delay={delay.stats + delay.statStep * 3}
        />
      </div>

      <div className="mt-4 sm:mt-5">
        <OrdersExplorer
          orders={orders}
          onOpen={setActiveId}
          delay={delay.list}
        />
      </div>

      <OrderDetailDialog
        order={activeOrder}
        onClose={() => setActiveId(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
