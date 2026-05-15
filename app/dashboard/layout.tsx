import SideNav from "@/app/ui/dashboard/sidenav";
import { UserButton } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex flex-col flex-grow md:overflow-y-auto">
        <div className="hidden md:flex justify-end items-center px-6 py-3 border-b border-gray-100">
          <UserButton />
        </div>
        <div className="p-6 md:p-12">{children}</div>
      </div>
    </div>
  );
}
