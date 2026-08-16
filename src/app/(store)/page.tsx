import { AboutStory } from "@/components/store/AboutStory";
import { ContactUsSection } from "@/components/store/ContactUsSection";
import { Hero } from "@/components/store/hero/Hero";
import { IngredientPromise } from "@/components/store/IngredientPromise";
import { ProductRange } from "@/components/store/products/ProductRange";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <ProductRange />
      <AboutStory />
      <IngredientPromise />
      <ContactUsSection />
    </main>
  );
}
