import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Account",
    template: "%s | Maavitram",
  },
  // robots.ts already disallows /auth — this is belt-and-suspenders for
  // already-linked URLs, same approach as the admin layout.
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return <>{children}</>;
}
