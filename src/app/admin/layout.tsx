import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LeafPattern } from "@/components/ui/LeafPattern";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Maavitram Admin",
    template: "%s | Maavitram Admin",
  },
  // Belt-and-suspenders: robots.ts already disallows /admin, but a noindex
  // directive here also keeps already-linked admin URLs out of results.
  robots: {
    index: false,
    follow: false,
  },
};

// Admin shell: fixed sidebar rail on desktop, drawer on mobile.
//
// `src/proxy.ts` already redirects unauthenticated requests to /admin/*
// before this ever renders — this check is the second, required layer:
// proxy doesn't re-run on client-side navigations between already-loaded
// routes under this layout, so this is what actually closes that gap.
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-dvh bg-background">
      <AdminSidebar />
      <div className="lg:pl-64">
        {/* Same cream + botanical texture as the auth screens, so the
            dashboard's empty space reads as brand surface rather than a
            blank canvas. The min-height subtracts the mobile top bar so
            the pattern still covers a short page without introducing a
            scrollbar. */}
        <div className="relative min-h-[calc(100dvh-3.5rem)] lg:min-h-dvh">
          <LeafPattern id="admin-leaves" />
          {/* Positioned, and later in DOM order, so it paints above the
              absolutely-positioned pattern. */}
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}
