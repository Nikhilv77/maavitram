interface StatCardProps {
  label: string;
  value: string;
}

/** A single labelled metric tile, used across admin dashboard/analytics screens. */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
