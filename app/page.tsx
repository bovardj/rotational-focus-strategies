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
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-blue-50 p-6"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Logo above card */}
          <div className="mb-6 flex justify-center">
            <RFSLogo className="text-blue-800" />
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-100 bg-white px-8 py-8 shadow-xl shadow-blue-100/60">
            <h1 className={`${lusitana.className} mb-1 text-xl font-bold text-gray-900`}>
              Rotational Focus Strategies
            </h1>
            <p className="mb-8 text-sm text-gray-700">A focus strategy study for ADHD</p>

            <div className="flex flex-col gap-3">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
              >
                Create account <ArrowRightIcon className="w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
