import type { DefaultSession } from "next-auth";

// The single AdminUser's id, carried through the JWT and exposed on the
// session — Auth.js's default types don't include it.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
  }
}
