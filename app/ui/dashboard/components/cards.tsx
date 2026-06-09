import { ClockIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";
import { strategyDictionary } from "@/app/lib/utils";

export function Card({
  title,
  value,
  date,
}: {
  title: string;
  value: string;
  date?: string;
}) {
  const formatted_value =
    strategyDictionary.find((strat) => strat.href === value)?.name || value;

  const dateStr = date
    ? new Date().toLocaleDateString("en-us", { timeZone: "America/Denver" }) + " MDT"
    : null;

  return (
    <Link
      href={`dashboard/strategies/${value}`}
      className="group block rounded-xl border-l-4 border-blue-800 bg-gray-200/50 p-6 shadow-md transition-colors hover:bg-gray-200/80"
    >
      <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
        {title}
      </p>
      <p className={`${lusitana.className} text-3xl font-bold text-gray-900 transition-colors group-hover:text-blue-800`}>
        {formatted_value}
      </p>
      <div className="mt-5 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm text-gray-600">
          <ClockIcon aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
          {dateStr ?? "No date available"}
        </p>
        <span className="flex items-center gap-1 text-sm text-gray-600 transition-colors group-hover:text-blue-800">
          View details
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
