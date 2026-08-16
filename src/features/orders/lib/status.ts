import type { OrderStatus } from "@/types/order";

/** Human-readable names for the `OrderStatus` enum. */
export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

/**
 * Where an order can go from where it is.
 *
 * The flow only ever moves forward — pending → confirmed → fulfilled —
 * and anything not yet fulfilled can be cancelled. `fulfilled` and
 * `cancelled` are terminal: reopening a completed order would leave the
 * inventory it consumed unaccounted for, so it isn't offered.
 */
export const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["fulfilled", "cancelled"],
  fulfilled: [],
  cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return allowedTransitions[from].includes(to);
}

export function isTerminal(status: OrderStatus): boolean {
  return allowedTransitions[status].length === 0;
}

/** Statuses that still need the admin to do something. */
export const openStatuses: OrderStatus[] = ["pending", "confirmed"];
