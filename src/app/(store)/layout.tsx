// Storefront route group. This is the future home for the site header,
// nav and footer — kept as a plain pass-through flex column until that
// chrome is built.
export default function StoreLayout({ children }: LayoutProps<"/">) {
  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
