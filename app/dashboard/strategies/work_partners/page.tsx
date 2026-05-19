import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "work_partners";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
