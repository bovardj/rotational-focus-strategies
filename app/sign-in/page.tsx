import SigninForm from "@/app/ui/signin-form";
import AuthShell from "@/app/ui/auth-shell";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SigninPage() {
  return (
    <AuthShell>
      <Suspense>
        <SigninForm />
      </Suspense>
    </AuthShell>
  );
}
