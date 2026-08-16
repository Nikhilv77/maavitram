import type { LucideIcon } from "lucide-react";
import {
  ChartColumn,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Warehouse,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Storefront nav.
 *
 * Every entry points at a section that actually exists on the homepage —
 * the site is a single page today, so these are in-page anchors rather
 * than routes. "Recipes" was dropped along with the old /shop, /about,
 * /why-maavitram and /contact routes: none of them were ever built, so
 * they 404'd.
 */
export const storeNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/#products" },
  { label: "About Us", href: "/#about" },
  { label: "Why Maavitram", href: "/#why-maavitram" },
  { label: "Contact", href: "/#contact" },
];

export interface AdminNavItem extends NavItem {
  icon: LucideIcon;
}

export const adminNav: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Analytics", href: "/admin/analytics", icon: ChartColumn },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
