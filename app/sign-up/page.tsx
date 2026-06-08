import SignupForm from "@/app/ui/signup-form";
import AuthShell from "@/app/ui/auth-shell";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to get started",
};

export default function SignupPage() {
  return (
    <AuthShell>
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
