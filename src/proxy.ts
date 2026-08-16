// Next.js 16 renamed `middleware.ts` to `proxy.ts` (same mechanism, same
// Node.js-runtime execution before rendering) — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
//
// This is the fast, optimistic check: it only reads the session cookie
// via the `authorized` callback in `@/lib/auth` (no DB hit) and redirects
// unauthenticated requests to /admin/* to /auth/login before any
// rendering happens. `src/app/admin/layout.tsx` still re-checks the
// session itself — proxy alone can't be the only guard, since it doesn't
// re-run on every client-side navigation between already-loaded routes.
export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
