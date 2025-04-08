import Breadcrumbs from '@/app/ui/strategies/breadcrumbs';
import { Metadata } from 'next';
import { strategies } from '@/app/lib/utils';

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
  };
}

export default async function Page(props: { params: Promise<{ strategy: string }> }) {
  const params = await props.params;
  const strategy = params.strategy;

  const formattedStrategy = strategies.find(
    (strat) => strat.href === strategy,
  )?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Strategies', href: '/dashboard/strategies' },
          {
            label: formattedStrategy,
            href: `/dashboard/strategies/${strategy}/`,
            active: true,
          },
        ]}
      />
    </main>
  );
}