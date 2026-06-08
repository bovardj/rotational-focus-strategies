import { strategyDictionary, parseDateString } from "@/app/lib/utils";

interface CollapsePreviousStrategyProps {
  previousStrategyList: {
    strategy: string;
    date: string;
  }[];
}

export default function CollapsePreviousStrategy({
  previousStrategyList,
}: CollapsePreviousStrategyProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">Previously Assigned Focus Strategies</h2>
      {previousStrategyList.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No strategies have been assigned yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {previousStrategyList.map((strategy, index) => {
            const name = strategyDictionary.find((s) => s.href === strategy.strategy)?.name ?? strategy.strategy;
            const date = parseDateString(strategy.date).toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <div
                key={index}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  index !== previousStrategyList.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <span className="font-medium text-gray-800">{name}</span>
                <span className="text-gray-400 tabular-nums">{date}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
