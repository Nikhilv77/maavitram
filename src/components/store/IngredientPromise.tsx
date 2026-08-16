import { HandHeart, Leaf, ShieldCheck, Sprout } from "lucide-react";
import { Container } from "@/components/ui/Container";

const promises = [
  {
    title: "Pure & Natural",
    copy: "Only the finest natural ingredients make it to your plate.",
    icon: Leaf,
  },
  {
    title: "Safe & Healthy",
    copy: "No preservatives, no artificial colors, just purity.",
    icon: ShieldCheck,
  },
  {
    title: "Crafted with Care",
    copy: "Blended in small batches to maintain freshness and aroma.",
    icon: HandHeart,
  },
  {
    title: "Farmers First",
    copy: "We support our farmers and sustainable practices.",
    icon: Sprout,
  },
] as const;

export function IngredientPromise() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-18">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-[10px] font-semibold tracking-[0.22em] text-foreground/55 uppercase sm:text-[11px]">
            <span className="h-px w-7 bg-foreground/18" />
            Our Values
            <Leaf className="h-3.5 w-3.5 text-green" aria-hidden="true" />
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-[1.04] font-semibold text-balance text-foreground sm:text-4xl lg:text-5xl">
            The Maavitram Promise
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 font-medium text-pretty text-muted">
            We don&rsquo;t just sell spices, we share our promise of purity and
            care.
          </p>
        </div>

        <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:mt-11 lg:grid-cols-4 lg:gap-0">
          {promises.map((promise) => {
            const Icon = promise.icon;

            return (
              <article
                key={promise.title}
                className="flex flex-col items-center text-center lg:px-8 [&:not(:first-child)]:lg:border-l [&:not(:first-child)]:lg:border-foreground/10"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green/[0.07] text-green sm:h-18 sm:w-18">
                  <Icon className="h-8 w-8 stroke-[1.65]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base leading-tight font-semibold text-foreground">
                  {promise.title}
                </h3>
                <p className="mt-3 max-w-44 text-sm leading-6 text-muted">
                  {promise.copy}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
