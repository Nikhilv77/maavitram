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

export const storeNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Why Maavitram", href: "/why-maavitram" },
  { label: "Recipes", href: "/recipes" },
  { label: "Contact", href: "/contact" },
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
