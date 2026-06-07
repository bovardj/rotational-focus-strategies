import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import RFSLogo from "@/app/ui/rfs-logo";
import UserNav from "@/app/ui/dashboard/user-nav";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="relative mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
        <Link href="/dashboard">
          <div className="w-32 text-white md:w-40">
            <RFSLogo />
          </div>
        </Link>
      </div>
      <div className="hidden md:flex md:flex-col md:space-y-2">
        <NavLinks />
        <div className="h-auto w-full grow rounded-md bg-gray-100"></div>
        <UserNav />
      </div>
    </div>
  );
}
