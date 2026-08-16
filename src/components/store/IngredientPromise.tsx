import { HandHeart, Leaf, ShieldCheck, Soup } from "lucide-react";
import { Container } from "@/components/ui/Container";

const promises = [
  {
    title: "100% Natural",
    copy: "Pure ingredients, no compromises.",
    icon: Leaf,
  },
  {
    title: "Authentic Taste",
    copy: "Traditional recipes, perfectly blended.",
    icon: Soup,
  },
  {
    title: "No Preservatives",
    copy: "Clean spices for a healthier you.",
    icon: ShieldCheck,
  },
  {
    title: "Made with Care",
    copy: "Blended in small batches with love.",
    icon: HandHeart,
  },
] as const;

export function IngredientPromise() {
  return (
    <section className="relative overflow-hidden bg-white pb-12 sm:pb-16 lg:pb-18">
      <Container>
        <div className="rounded-md border border-foreground/10 px-5 py-5 sm:px-6 lg:px-8">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {promises.map((promise) => {
              const Icon = promise.icon;

              return (
                <li
                  key={promise.title}
                  className="flex items-start gap-4 lg:px-6 [&:not(:first-child)]:lg:border-l [&:not(:first-child)]:lg:border-foreground/10"
                >
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center text-green">
                    <Icon className="h-8 w-8 stroke-[1.6]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm leading-5 font-semibold text-foreground">
                      {promise.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted">
                      {promise.copy}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
