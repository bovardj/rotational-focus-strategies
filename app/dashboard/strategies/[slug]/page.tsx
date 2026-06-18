import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return strategyDictionary.map((strat) => ({ slug: strat.href }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const match = strategyDictionary.find((strat) => strat.href === slug);

  if (!match) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: match.name, href: `/dashboard/strategies/${slug}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{match.name}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={slug} />
        </div>
      </div>
    </main>
  );
}
