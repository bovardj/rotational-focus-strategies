import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function CollapseStrategy({
  strategyList,
}: {
  strategyList: { name: string; href: string }[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">Your Focus Strategies</h2>
      {strategyList.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No strategies selected yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {strategyList.map((strategy) => (
            <Link
              key={strategy.href}
              href={`/dashboard/strategies/${strategy.href}`}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700 leading-tight">
                {strategy.name}
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-blue-500 ml-2" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
