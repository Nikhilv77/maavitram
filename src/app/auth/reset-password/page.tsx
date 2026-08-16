import type { Metadata } from "next";
import Link from "next/link";
import { LinkIcon } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { isResetTokenValid } from "@/features/auth/lib/password-reset";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/auth/reset-password">) {
  const { token } = await searchParams;
  const rawToken = typeof token === "string" ? token : "";

  // Checked before rendering so a dead link says so immediately, rather
  // than after the admin has typed a new password twice. The action
  // re-checks on submit regardless — the link can expire in between.
  const valid = rawToken ? await isResetTokenValid(rawToken) : false;

  return (
    <AuthSplitLayout
      imageSrc="/images/auth/signup-visual.png"
      imageAlt="Maavitram Mix Saumya spice pouch styled with fresh coriander, green chillies and whole spices"
    >
      {valid ? (
        <>
          <div className="mt-6 text-center">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
              Set a new password
            </h1>
            <p className="mt-3 text-base text-muted">
              Choose a password you haven&apos;t used before
            </p>
          </div>

          <div className="mt-10">
            <ResetPasswordForm token={rawToken} />
          </div>
        </>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red/10 text-red">
            <LinkIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Link no longer valid
          </h1>
          {/* One message for expired, already-used and unknown tokens —
              distinguishing them would confirm a token once existed. */}
          <p className="max-w-xs text-sm text-muted">
            This reset link has expired or has already been used. Reset links
            last 30 minutes and work once.
          </p>
          <Link
            href="/auth/forgot-password"
            className="btn btn-primary mt-3 h-11 px-5 text-xs"
          >
            Request a new link
          </Link>
        </div>
      )}
    </AuthSplitLayout>
  );
}
