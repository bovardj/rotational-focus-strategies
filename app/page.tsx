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

      <header className="sticky top-0 z-10 bg-blue-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="w-28">
            <RFSLogo className="text-white" />
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bovardj/rotational-focus-strategies"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              GitHub<span className="sr-only"> (opens in new tab)</span>
            </a>
            <Link
              href="/sign-in"
              className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="min-h-screen bg-blue-50">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-800">
              CS 6968 · ADHD Research Study
            </p>
            <h1 id="hero-heading" className={`${lusitana.className} mb-6 text-5xl font-bold text-gray-900`}>
              Rotational Focus<br />Strategies
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              A full-stack research web app that ran a 4-week study assigning rotating daily focus
              strategies to participants with ADHD. Built to measure which strategies actually
              improve productivity — deployed at{" "}
              <a
                href="https://focusapp.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded text-blue-800 underline underline-offset-2 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
              >
                focusapp.dev<span className="sr-only"> (opens in new tab)</span>
              </a>
              .
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 rounded-lg bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
              >
                Create account <ArrowRightIcon className="w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/sign-in"
                className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
