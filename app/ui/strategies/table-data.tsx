"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface StrategyCardProps {
  name: string;
  href: string;
  description: string;
}

export default function StrategyCard({ name, href, description }: StrategyCardProps) {
  const pathname = usePathname();
  const link = `/dashboard/strategies/${href}`;

  return (
    <Link
      href={link}
      className={clsx(
        "block rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100",
        { "bg-sky-50 border-blue-200": pathname === link }
      )}
    >
      <p className="text-sm font-medium text-gray-900">{name}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}
