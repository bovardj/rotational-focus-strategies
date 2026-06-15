import ForgotPasswordForm from "@/app/ui/forgot-password-form";
import AuthShell from "@/app/ui/auth-shell";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
