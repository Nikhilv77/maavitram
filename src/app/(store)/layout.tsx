import { SiteHeader } from "@/components/store/SiteHeader";

// Storefront route group. Footer is still the future home for that piece
// of chrome — header (announcement bar + nav) is now wired in.
export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      {children}
    </div>
  );
}
