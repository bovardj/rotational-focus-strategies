"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFoundBackButton() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const parent = segments.length > 1 ? "/" + segments.slice(0, -1).join("/") : "/dashboard";

  return (
    <Link
      href={parent}
      className="mt-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
    >
      Go Back
    </Link>
  );
}
