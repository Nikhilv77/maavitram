import { SiteHeader } from "@/components/store/SiteHeader";
import { StoreFooter } from "@/components/store/StoreFooter";

// Storefront route group: shared customer-facing chrome around every
// public route.
export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      {children}
      <StoreFooter />
    </div>
  );
}
