"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface StrategyCardProps {
  name: string;
  href: string;
  description: string;
  isOwned?: boolean;
}

export default function StrategyCard({ name, href, description, isOwned = false }: StrategyCardProps) {
  const pathname = usePathname();
  const link = `/dashboard/strategies/${href}`;

  return (
    <Link
      href={link}
      className={clsx(
        "block rounded-lg border p-4 transition-colors",
        pathname === link
          ? "border-blue-800 bg-blue-50"
          : isOwned
          ? "border-gray-200 bg-gray-50 hover:bg-gray-100 border-l-4 border-l-blue-800"
          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
      )}
    >
      <p className="text-sm font-medium text-gray-900">{name}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}
