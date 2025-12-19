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
          "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-md font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
          {
            "bg-sky-100 text-blue-600": pathname === link,
          }
        )}
      >
        <div className="w-2 h-2 rounded-full bg-black"></div>
        <p className="text-md md:block">{strategy}</p>
      </Link>
    </>
  );
}
