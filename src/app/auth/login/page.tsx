import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/auth/login">) {
  // Set by the reset action's redirect once a new password is saved.
  const { reset } = await searchParams;
  const justReset = reset === "success";

  return (
    <AuthSplitLayout
      imageSrc="/images/auth/signup-visual.png"
      imageAlt="Maavitram Saumya spice pouch styled with fresh coriander, green chillies and whole spices"
    >
      <div className="mt-6 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
          Admin sign in
        </h1>
        <p className="mt-3 text-base text-muted">Sign in to manage Maavitram</p>
      </div>

      {justReset ? (
        <p
          role="status"
          className="mt-6 flex items-center justify-center gap-2 rounded-md bg-green/10 px-4 py-3 text-sm font-medium text-green-dark"
        >
          <CircleCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
          Password updated — sign in with your new password.
        </p>
      ) : null}

      <div className="mt-10">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link
          href="/auth/forgot-password"
          className="font-medium text-green transition-colors duration-[var(--duration-fast)] hover:text-green-dark hover:underline"
        >
          Forgot password?
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
