import { AboutStory } from "@/components/store/AboutStory";
import { Hero } from "@/components/store/hero/Hero";
import { IngredientPromise } from "@/components/store/IngredientPromise";
import { ProductRange } from "@/components/store/products/ProductRange";
import { getPreorderCatalogue } from "@/features/products/lib/queries";

export default async function Home() {
  // Fetched here rather than inside ProductRange: that component is a
  // Client Component (it owns the modal state), so the real variant ids
  // and prices have to be handed in from the server.
  const catalogue = await getPreorderCatalogue();

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <ProductRange catalogue={catalogue} />
      <IngredientPromise />
      <AboutStory />
    </main>
  );
}
