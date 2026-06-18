import SideNav from "@/app/ui/dashboard/sidenav";
import NavLinks from "@/app/ui/dashboard/nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col gap-4 bg-blue-50 p-4 md:flex-row md:gap-6 md:p-6">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
      >
        Skip to main content
      </a>

      {/* Background glows — identical to auth-shell.tsx and onboarding layout */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      {/* Sidenav panel */}
      <div className="relative w-full flex-none overflow-hidden rounded-2xl bg-blue-900 shadow-xl shadow-blue-900/30 md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-64">
        <SideNav />
      </div>

      {/* Content panel */}
      <div id="main-content" className="relative min-w-0 flex grow flex-col">
        {children}
      </div>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex gap-2 px-3 py-2">
          <NavLinks />
        </div>
      </nav>
    </div>
  );
}
