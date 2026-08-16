import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { SendResetLinkButton } from "@/components/admin/SendResetLinkButton";
import { logout } from "@/features/auth/lib/actions";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Settings",
};

const DELAY = { header: 0, password: 60, session: 120 } as const;

export default async function AdminSettingsPage() {
  // The layout already guards this route; re-reading the session here is
  // what gives us the admin's id to resolve their email from Neon.
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const admin = await db.adminUser.findUnique({
    where: { id: session.user.id },
    select: { email: true, updatedAt: true },
  });
  if (!admin) redirect("/auth/login");

  const passwordChanged = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(admin.updatedAt);

  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <header
        style={{ animationDelay: `${DELAY.header}ms` }}
        className="animate-rise-in"
      >
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted">
          The Maavitram admin account.
        </p>
      </header>

      {/* Constrained: two short forms read badly stretched across a
          dashboard-width column. */}
      <div className="mt-8 flex max-w-2xl flex-col gap-4 sm:gap-5">
        <Panel
          title="Password"
          description="Sent to your account email — never to an address typed here"
          delay={DELAY.password}
        >
          <dl className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">Account email</dt>
              <dd className="mt-1 text-sm font-medium break-all text-foreground">
                {admin.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Last account change</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {passwordChanged}
              </dd>
            </div>
          </dl>

          <SendResetLinkButton />
        </Panel>

        <Panel
          title="Session"
          description="Sign out of this device"
          delay={DELAY.session}
        >
          {/* `logout` is a server action, so a plain form is enough — no
              client component needed for this one. */}
          <form action={logout}>
            <button
              type="submit"
              className="btn btn-secondary h-10 w-fit gap-2 px-4 text-xs text-red hover:border-red hover:bg-red/5"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </form>
        </Panel>
      </div>
    </main>
  );
}
