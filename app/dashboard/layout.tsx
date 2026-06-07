import SideNav from "@/app/ui/dashboard/sidenav";
import NavLinks from "@/app/ui/dashboard/nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full flex-none md:sticky md:top-0 md:h-screen md:w-64 md:overflow-y-auto">
        <SideNav />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="p-6 pb-24 md:p-12">{children}</div>
      </div>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex gap-2 px-3 py-2">
          <NavLinks />
        </div>
      </nav>
    </div>
  );
}
