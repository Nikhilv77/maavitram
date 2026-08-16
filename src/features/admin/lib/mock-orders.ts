import { adminProducts } from "@/features/admin/lib/mock-products";
import type { ProductAccent } from "@/features/admin/lib/accents";
import type { OrderStatus } from "@/types/order";

/**
 * Placeholder order book for the admin Orders screen.
 *
 * Line items reference real SKUs and are priced from the products mock
 * rather than carrying their own numbers, so totals can't drift from the
 * catalogue. The five most recent orders are what the dashboard's Recent
 * Orders panel renders — see `mock-dashboard.ts`.
 */

export interface AdminOrderItem {
  sku: string;
  quantity: number;
}

/** A line item with its product details and pricing resolved. */
export interface ResolvedOrderItem extends AdminOrderItem {
  productName: string;
  variantLabel: string;
  accent: ProductAccent;
  image: string;
  unitPrice: number;
  lineTotal: number;
}

interface AdminOrderSeed {
  id: string;
  customerName: string;
  /** Bare 10 digits, as the checkout schema stores them. */
  customerPhone: string;
  address?: string;
  notes?: string;
  status: OrderStatus;
  placedAt: string;
  items: AdminOrderItem[];
}

export interface AdminOrder extends Omit<AdminOrderSeed, "items"> {
  items: ResolvedOrderItem[];
  totalAmount: number;
  itemCount: number;
  /** "Tez 250 g × 2, Saumya 100 g" — the one-line summary for tables. */
  itemSummary: string;
}

const seeds: AdminOrderSeed[] = [
  {
    id: "MAV-2418",
    customerName: "Ananya Iyer",
    customerPhone: "9845112207",
    address: "12 Rosewood Apartments, Indiranagar, Bengaluru 560038",
    notes: "Please pack the Tez separately.",
    status: "pending",
    placedAt: "12 min ago",
    items: [
      { sku: "MAV-TEZ-250", quantity: 2 },
      { sku: "MAV-SAU-100", quantity: 1 },
    ],
  },
  {
    id: "MAV-2417",
    customerName: "Rohit Deshmukh",
    customerPhone: "9820456713",
    address: "Flat 7B, Sea Breeze, Bandra West, Mumbai 400050",
    status: "confirmed",
    placedAt: "1 hr ago",
    items: [{ sku: "MAV-ACH-250", quantity: 1 }],
  },
  {
    id: "MAV-2416",
    customerName: "Meera Nair",
    customerPhone: "9739028841",
    address: "23 Palm Grove, Kochi 682016",
    status: "fulfilled",
    placedAt: "3 hr ago",
    items: [
      { sku: "MAV-LAL-100", quantity: 1 },
      { sku: "MAV-TEZ-100", quantity: 1 },
      { sku: "MAV-SAU-250", quantity: 1 },
    ],
  },
  {
    id: "MAV-2415",
    customerName: "Kabir Shah",
    customerPhone: "8877340192",
    address: "301 Gulmohar Residency, Ahmedabad 380015",
    status: "fulfilled",
    placedAt: "5 hr ago",
    items: [{ sku: "MAV-SAU-500", quantity: 2 }],
  },
  {
    id: "MAV-2414",
    customerName: "Priya Raghavan",
    customerPhone: "7012668534",
    status: "cancelled",
    placedAt: "Yesterday",
    notes: "Customer asked to cancel — ordering a larger pack instead.",
    items: [{ sku: "MAV-TEZ-100", quantity: 1 }],
  },
  {
    id: "MAV-2413",
    customerName: "Devika Menon",
    customerPhone: "9611203387",
    address: "5 Lakeview Road, Pune 411001",
    status: "pending",
    placedAt: "Yesterday",
    items: [
      { sku: "MAV-ACH-100", quantity: 2 },
      { sku: "MAV-LAL-250", quantity: 1 },
    ],
  },
  {
    id: "MAV-2412",
    customerName: "Arjun Pillai",
    customerPhone: "9900781245",
    address: "88 Residency Road, Bengaluru 560025",
    status: "confirmed",
    placedAt: "2 days ago",
    items: [
      { sku: "MAV-TEZ-500", quantity: 1 },
      { sku: "MAV-SAU-500", quantity: 1 },
    ],
  },
  {
    id: "MAV-2411",
    customerName: "Sneha Kulkarni",
    customerPhone: "9145560032",
    address: "14 Shanti Nagar, Nagpur 440010",
    status: "fulfilled",
    placedAt: "3 days ago",
    items: [{ sku: "MAV-ACH-250", quantity: 3 }],
  },
];

// Flat SKU lookup built once from the catalogue mock.
const variantBySku = new Map(
  adminProducts.flatMap((product) =>
    product.variants.map((variant) => [
      variant.sku,
      {
        productName: product.name,
        variantLabel: variant.label,
        accent: product.accent,
        image: product.image,
        unitPrice: variant.price,
      },
    ]),
  ),
);

/** Short form used in list rows: "Tez 250 g × 2, Saumya 100 g". */
function summarise(items: ResolvedOrderItem[]): string {
  return items
    .map((item) => {
      // The "Maavitram" prefix is redundant in a Maavitram admin.
      const shortName = item.productName.replace(/^Maavitram\s+/, "");
      const quantity = item.quantity > 1 ? ` × ${item.quantity}` : "";
      return `${shortName} ${item.variantLabel}${quantity}`;
    })
    .join(", ");
}

function resolve(seed: AdminOrderSeed): AdminOrder {
  const items: ResolvedOrderItem[] = seed.items.map((item) => {
    const variant = variantBySku.get(item.sku);
    if (!variant) throw new Error(`Unknown SKU in order mock: ${item.sku}`);
    return {
      ...item,
      ...variant,
      lineTotal: variant.unitPrice * item.quantity,
    };
  });

  return {
    ...seed,
    items,
    totalAmount: items.reduce((total, item) => total + item.lineTotal, 0),
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    itemSummary: summarise(items),
  };
}

export const adminOrders: AdminOrder[] = seeds.map(resolve);
