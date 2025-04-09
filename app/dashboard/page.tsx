import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import StrategiesTable from '@/app/ui/dashboard/table';
import { getDailyStrategy } from '../lib/actions';

export const metadata = {
  title: 'Dashboard',
  description: 'The dashboard is the main page of the app, where you can see your latest assigned strategies and link to other important pages.',
};

export default async function Page() {
  const latestStrategy = await getDailyStrategy();
  // console.log('latestStrategy', latestStrategy);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Latest Strategy" 
          value={latestStrategy.strategy}
          date={latestStrategy.date}
        />
      </div>
      <div className="mt-6">
        <StrategiesTable />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}