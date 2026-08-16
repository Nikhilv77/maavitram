import { SiteHeader } from "@/components/store/SiteHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductModalProvider } from "@/components/store/products/ProductModalProvider";
import { getPreorderCatalogue } from "@/features/products/lib/queries";

// Storefront route group: shared customer-facing chrome around every
// public route.
export default async function StoreLayout({ children }: LayoutProps<"/">) {
  // Fetched at the layout rather than the page because the provider wraps
  // the footer too — its Shop column opens the same product sheets.
  const catalogue = await getPreorderCatalogue();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <ProductModalProvider catalogue={catalogue}>
        <SiteHeader />
        {children}
        <StoreFooter />
      </ProductModalProvider>
    </div>
  );
}
