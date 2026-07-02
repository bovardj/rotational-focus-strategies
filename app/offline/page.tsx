import Link from "next/link";
import { SignalSlashIcon } from "@heroicons/react/24/outline";
import RFSLogo from "@/app/ui/rfs-logo";
import { lusitana } from "@/app/ui/fonts";

export default function OfflinePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-blue-50 p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <RFSLogo className="text-blue-800" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-8 shadow-xl shadow-blue-100/60">
          <div className="flex flex-col items-center gap-3 text-center">
            <SignalSlashIcon className="w-10 text-gray-600" aria-hidden="true" />
            <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>You&apos;re offline</h1>
            <p className="text-sm text-gray-600">Check your connection and try again.</p>
            <Link
              href="/"
              className="mt-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
            >
              Try again
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
