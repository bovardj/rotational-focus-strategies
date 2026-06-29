"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="w-28">
            <RFSLogo className="text-white" />
          </div>
          <nav aria-label="Main navigation" className="flex items-center gap-4">
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
              className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="min-h-screen overflow-x-hidden bg-blue-50">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="relative overflow-clip px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-800">
              Designing Digital Health Systems · Course Project
            </p>
            <h1 id="hero-heading" className={`${lusitana.className} mb-6 text-5xl font-bold text-gray-900`}>
              Rotational Focus<br />Strategies
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              A full-stack research web app designed to test whether randomly rotating focus strategies 
              improves daily productivity and satisfaction for people with ADHD. Preceded by a 
              3-day pilot using rapid iterative prototyping to refine the study design. 
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
                aria-label="Sign in to your account"
                className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section aria-labelledby="overview-heading" className="px-6 pb-16">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl shadow-blue-100/60">
            <h2 id="overview-heading" className={`${lusitana.className} mb-6 text-2xl font-bold text-gray-900`}>
              How the study worked
            </h2>

            {/* Phase timeline */}
            <div className="mb-6 flex flex-col overflow-hidden rounded-xl sm:flex-row">
              <div className="bg-blue-100/50 px-4 py-4 sm:flex-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                  Baseline · 3 days
                </p>
                <p className="text-sm text-gray-600">
                  Daily surveys with no assigned strategy. This established each participant&apos;s baseline.
                </p>
              </div>
              <div className="bg-blue-200/60 px-4 py-4 sm:flex-9">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                  Daily Focus · 4 days
                </p>
                <p className="text-sm text-gray-700">
                  Use a randomly assigned strategy each day (repeats allowed), then fill out end of day surveys. This tested whether strategy rotation improves outcomes.
                </p>
              </div>
              <div className="bg-blue-900 px-4 py-4 sm:flex-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-100">
                  Exit
                </p>
                <p className="text-sm text-blue-200">
                  A reflection survey along with demographic data collection.
                </p>
              </div>
            </div>

            {/* Screenshots */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src="/images/landing/rfs-dashboard-start.jpeg"
                  alt="RFS dashboard home screen"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src="/images/landing/rfs-dashboard-daily-1of4.jpeg"
                    alt="Dashboard during day 1 of the focus strategy phase"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src="/images/landing/rfs-survey-daily.jpeg"
                    alt="Daily survey form"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section aria-labelledby="features-heading" className="px-6 pb-16">
          <h2 id="features-heading" className="sr-only">Key features</h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60">
              <div className="mb-3 text-2xl" aria-hidden="true">🔄</div>
              <h3 className="mb-2 text-base font-bold text-gray-900">Rotation algorithm</h3>
              <p className="text-sm text-gray-600">
                Randomly assigns a focus strategy each day &mdash; designed to test whether 
                rotating strategies drives changes in productivity and satisfaction.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60">
              <div className="mb-3 text-2xl" aria-hidden="true">🔔</div>
              <h3 className="mb-2 text-base font-bold text-gray-900">Push notifications + PWA</h3>
              <p className="text-sm text-gray-600">
                Service worker, installable on mobile, with scheduled Web Push reminders to
                complete daily surveys.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60">
              <div className="mb-3 text-2xl" aria-hidden="true">🔐</div>
              <h3 className="mb-2 text-base font-bold text-gray-900">Clerk + Supabase RLS</h3>
              <p className="text-sm text-gray-600">
                Clerk JWTs injected as Supabase access tokens &mdash; row-level security enforces
                per-user data isolation without custom middleware.
              </p>
            </div>
          </div>
        </section>

        {/* Stack + CTA */}
        <section aria-labelledby="stack-heading" className="px-6 pb-16">
          <div className="mx-auto max-w-4xl rounded-2xl bg-blue-900 px-8 py-8">
            <p id="stack-heading" className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-200">
              Built with
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              {[
                "Next.js 16 App Router",
                "Tailwind v4",
                "Clerk Auth",
                "Supabase + RLS",
                "Web Push API",
                "PWA",
                "Vercel",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-blue-200">Want to explore the app?</p>
              <Link
                href="/sign-up"
                className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
              >
                Get started <ArrowRightIcon className="w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
