import type { Metadata } from "next";
import { AnalyticsView } from "@/components/admin/AnalyticsView";
import { getStatusBreakdown } from "@/features/admin/lib/mock-analytics";

export const metadata: Metadata = {
  title: "Analytics",
};

// Entrance stagger, top of the page downward — mirrors the other admin
// screens so moving between them feels like one surface.
const DELAY = {
  header: 0,
  stats: 80,
  statStep: 55,
  chart: 320,
  products: 380,
  status: 440,
} as const;

export default function AdminAnalyticsPage() {
  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <header
        style={{ animationDelay: `${DELAY.header}ms` }}
        className="animate-rise-in"
      >
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-muted">
          How the blends are selling, and where the revenue is coming from.
        </p>
      </header>

      {/* The range selector drives every figure below it, so the whole
          view is one client component — see AnalyticsView. */}
      <AnalyticsView statusBreakdown={getStatusBreakdown()} delay={DELAY} />
    </main>
  );
}
