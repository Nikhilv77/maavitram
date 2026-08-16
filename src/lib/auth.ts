import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { loginSchema } from "@/schemas/auth";

// Single-admin auth: Credentials + JWT sessions, no adapter. There's
// exactly one AdminUser row (see prisma/schema.prisma) — no OAuth
// providers, no DB-backed session/account tables to sync, so the
// Prisma adapter would be pure overhead here.
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  // Auth.js validates the request's Host header against known values
  // unless told to trust it — needed for non-Vercel hosts (localhost:999
  // included).
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const admin = await db.adminUser.findUnique({
          where: { email: parsed.data.email },
        });
        if (!admin) return null;

        const passwordMatches = await compare(
          parsed.data.password,
          admin.passwordHash,
        );
        if (!passwordMatches) return null;

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
    // Consulted by `src/proxy.ts` (via `export { auth as proxy }`) on
    // every request to /admin/*: returning false here is what makes
    // Auth.js redirect unauthenticated visitors to `pages.signIn` above.
    authorized({ auth, request }) {
      const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
      return isOnAdmin ? Boolean(auth?.user) : true;
    },
  },
});
