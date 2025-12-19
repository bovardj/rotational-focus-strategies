import SigninForm from "@/app/ui/signin-form";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SigninPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 md:-mt-32 border-2 border-blue-400 rounded-lg bg-white shadow-md">
        <Suspense>
          <SigninForm />
        </Suspense>
      </div>
    </main>
  );
}
