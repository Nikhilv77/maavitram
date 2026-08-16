import { Award, Leaf, ShieldCheck } from "lucide-react";
import { heroTrustPoints } from "@/components/store/hero/hero-slides";

const icons = [Leaf, ShieldCheck, Award] as const;

/** The trust badges shown under the hero CTA. */
export function TrustPoints() {
  return (
    <ul className="flex w-full max-w-[480px] flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7">
      {heroTrustPoints.map((point, i) => {
        const Icon = icons[i];
        return (
          <li
            key={point}
            className="inline-flex min-w-0 items-center gap-2.5 text-[11px] leading-none font-medium text-green/75 sm:text-sm"
          >
            <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">{point}</span>
          </li>
        );
      })}
    </ul>
  );
}
