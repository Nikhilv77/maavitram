import type { OrderStatus } from "@/types/order";

/**
 * Pill styling for order statuses, shared by the dashboard's Recent
 * Orders panel and the Orders screen so a status never looks like two
 * different things depending on where you're standing.
 *
 * Static maps, not template strings — Tailwind's scanner only sees class
 * names it can read literally in the source.
 */
export const orderStatusStyle: Record<
  OrderStatus,
  { pill: string; dot: string }
> = {
  pending: { pill: "bg-gold/12 text-achaari", dot: "bg-gold" },
  confirmed: { pill: "bg-green/10 text-green", dot: "bg-green" },
  fulfilled: { pill: "bg-foreground/5 text-muted", dot: "bg-muted" },
  cancelled: { pill: "bg-red/10 text-red", dot: "bg-red" },
};
