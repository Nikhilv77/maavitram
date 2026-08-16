import { AnnouncementBar } from "@/components/store/AnnouncementBar";
import { Navbar } from "@/components/store/Navbar";

/** Storefront chrome: announcement bar stacked above the main nav. */
export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <AnnouncementBar />
      <Navbar />
    </div>
  );
}
