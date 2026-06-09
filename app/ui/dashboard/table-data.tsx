"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { strategyDictionary } from "@/app/lib/utils";

export default function TableData({ strategy }: { strategy: string }) {
  const pathname = usePathname();
  const link = `/dashboard/strategies/${
    strategyDictionary.find((link) => link.name === strategy)?.href || ""
  }`;

  return (
    <>
      <Link
        href={link}
        className={clsx(
          "flex h-[40px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-800 md:flex-none md:justify-start md:p-2 md:px-3",
          {
            "bg-blue-50 text-blue-800": pathname === link,
          }
        )}
      >
        <div className="w-2 h-2 rounded-full bg-black"></div>
        <p className="text-s sm:text-sm md:block">{strategy}</p>
      </Link>
    </>
  );
}
