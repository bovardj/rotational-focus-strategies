"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Strategies",
    href: "/dashboard/strategies",
    icon: DocumentDuplicateIcon,
  },
  { name: "Surveys", href: "/dashboard/survey", icon: UserGroupIcon },
  {
    name: "Instructions",
    href: "/dashboard/instructions",
    icon: InformationCircleIcon,
  },
];

export default function NavLinks({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "flex h-16 basis-0 grow flex-col items-center justify-center gap-1 rounded-md p-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 md:h-[48px] md:flex-none md:flex-row md:justify-start md:gap-2 md:px-3",
              dark
                ? isActive
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
                : isActive
                  ? "bg-blue-50 text-blue-800"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-800"
            )}
          >
            <LinkIcon aria-hidden="true" className="w-6" />
            <p className="text-xs md:text-sm md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
