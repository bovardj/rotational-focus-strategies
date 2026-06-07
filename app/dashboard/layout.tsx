import SideNav from "@/app/ui/dashboard/sidenav";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { UserButton } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full flex-none md:sticky md:top-0 md:h-screen md:w-64 md:overflow-y-auto">
        <SideNav />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="hidden md:flex sticky top-0 z-10 justify-end items-center px-6 py-3">
          <UserButton />
        </div>
        <div className="px-6 pt-6 pb-28 md:p-12">{children}</div>
      </div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200">
        <div className="flex gap-2 px-3 py-2">
          <NavLinks />
        </div>
      </nav>
    </div>
  );
}
