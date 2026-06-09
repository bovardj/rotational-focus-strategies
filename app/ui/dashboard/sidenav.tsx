import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import RFSLogo from "@/app/ui/rfs-logo";
import UserNav from "@/app/ui/dashboard/user-nav";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Logo bar — full-bleed flush to card edges */}
      <div className="relative mb-2 flex h-20 items-end justify-start bg-white/10 p-4 -mx-3 -mt-4 md:-mx-2 md:h-40">
        <Link href="/dashboard">
          <div className="w-32 text-white md:w-40">
            <RFSLogo />
          </div>
        </Link>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 md:hidden">
          <UserNav compact />
        </div>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex md:flex-col md:flex-grow md:space-y-2 mt-2">
        <NavLinks dark />
        <UserNav dark />
      </div>
    </div>
  );
}
