import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import { useUser } from '@clerk/nextjs';
import { fetchLatestAssignedStrategy, fetchUserStrategies } from '@/app/lib/data';
import StrategiesTable from '@/app/ui/dashboard/table';

export const metadata = {
  title: 'Dashboard',
  description: 'The dashboard is the main page of the app, where you can see your latest assigned strategies and link to other important pages.',
};

export default async function Page() {
  const latestStrategy = await fetchLatestAssignedStrategy();

  return (
    <main>
      {/* <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}> */}
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Latest Strategy" 
          value={latestStrategy[0]?.strategy as "background_sound" | "check_list" | "chunking" | "daily_planner" | "environmental_shift" | "pomodoro_timer" | "small_rewards" | "task_switching" | "work_partners"}
          date={latestStrategy[0]?.date}
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