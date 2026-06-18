import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideNav from "@/app/ui/onboarding/sidenav";
import { syncUserToSupabase } from "@/app/onboarding/_actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/dashboard");
  }

  await syncUserToSupabase();

  return (
    <div className="relative flex min-h-screen flex-col gap-4 bg-blue-50 p-4 md:flex-row md:gap-6 md:p-6">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
      >
        Skip to main content
      </a>
      {/* Background glows — identical to auth-shell.tsx */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      {/* Sidenav panel */}
      <div className="relative w-full flex-none overflow-hidden rounded-2xl bg-blue-900 shadow-xl shadow-blue-900/30 md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-64">
        <SideNav />
      </div>

      {/* Content panel */}
      <div className="relative flex grow flex-col">
        <div className="grow max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
