import { Navbar } from "@/components/store/Navbar";

/** Storefront chrome: sticky main nav. */
export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <Navbar />
    </div>
  );
}
