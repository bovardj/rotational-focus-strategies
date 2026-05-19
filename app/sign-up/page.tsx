import SignupForm from "@/app/ui/signup-form";
import { Suspense } from "react";
import { Metadata } from "next";
import { lusitana } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to get started",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-4 px-4">
        <div className="text-center">
          <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
            Rotational Focus Strategies
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A study on focus strategies for ADHD
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
