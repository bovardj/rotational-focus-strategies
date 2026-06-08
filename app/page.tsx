"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import RFSLogo from "@/app/ui/rfs-logo";

export default function Page() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-blue-50 p-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo above card */}
        <div className="mb-6 flex justify-center">
          <RFSLogo className="text-blue-600" />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-8 shadow-xl shadow-blue-100/60">
          <h1 className={`${lusitana.className} mb-1 text-xl font-bold text-gray-900`}>
            Rotational Focus Strategies
          </h1>
          <p className="mb-8 text-sm text-gray-400">A focus strategy study for ADHD</p>

          <div className="flex flex-col gap-3">
            <Link
              href="/sign-up"
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Create account <ArrowRightIcon className="w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
