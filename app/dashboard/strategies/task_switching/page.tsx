import Breadcrumbs from '@/app/ui/strategies/breadcrumbs';
// import { Metadata } from 'next';
import { strategyDictionary } from '@/app/lib/utils';
import StrategyDescriptions from '@/app/ui/dashboard/strategy-descriptions';

export default async function Page() {
  const strategy = 'task_switching';
  const formattedStrategy = strategyDictionary.find(
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