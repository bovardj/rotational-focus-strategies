import Breadcrumbs from '@/app/ui/strategies/breadcrumbs';
import { Metadata } from 'next';
import { strategies } from '@/app/lib/utils';
import StrategyDescriptions from '@/app/ui/dashboard/strategy-descriptions';

export async function generateMetadata({
  params,
}: {
  params: { strategy: string };
}): Promise<Metadata> {
  const strategy = params.strategy;

  const formattedStrategy =
    strategies.find((strat) => strat.href === strategy)?.name || strategy;

  return {
    title: `Strategies | ${formattedStrategy}`,
    description: `Strategies | ${formattedStrategy}`,
  };
}

export default async function Page(props: { params: { strategy: string } }) {
  const params = props.params;
  const strategy = params.strategy;

  const formattedStrategy = strategies.find(
    (strat) => strat.href === strategy,
  )?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Focus Strategies', href: '/dashboard/strategies' },
          {
            label: formattedStrategy,
            href: `/dashboard/strategies/${strategy}/`,
            active: true,
          },
        ]}
      />
      <div className="flex w-full items-center justify-between">
        <StrategyDescriptions strategy={strategy} />
      </div>
    </main>
  );
}