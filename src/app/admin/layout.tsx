import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Maavitram Admin",
    template: "%s | Maavitram Admin",
  },
};

// Admin route group. This is the future home for the admin sidebar/topbar —
// the surface token distinguishes it from the storefront's cream background
// until that chrome is built.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">{children}</div>
  );
}
