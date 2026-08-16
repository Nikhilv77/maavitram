import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      imageSrc="/images/auth/signup-visual.png"
      imageAlt="Maavitram Saumya spice pouch styled with fresh coriander, green chillies and whole spices"
    >
      <div className="mt-6 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
          Forgot password
        </h1>
        <p className="mt-3 text-base text-muted">
          We&apos;ll email you a link to set a new one
        </p>
      </div>

      <div className="mt-10">
        <ForgotPasswordForm />
      </div>
    </AuthSplitLayout>
  );
}
