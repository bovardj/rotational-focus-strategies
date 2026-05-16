import SideNav from "@/app/ui/dashboard/sidenav";
import { UserButton } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full flex-none md:sticky md:top-0 md:h-screen md:w-64 md:overflow-y-auto">
        <SideNav />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="hidden md:flex sticky top-0 z-10 bg-white justify-end items-center px-6 py-3 border-b border-gray-100">
          <UserButton />
        </div>
        <div className="p-6 md:p-12">{children}</div>
      </div>
    </div>
  );
}
