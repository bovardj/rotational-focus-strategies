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
        {/* sections go here */}
      </main>
    </>
  );
}
