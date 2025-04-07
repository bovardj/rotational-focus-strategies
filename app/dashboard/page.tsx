import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestAssignedStrategy } from '@/app/lib/data';

export default async function Page() {
  const latestStrategy = await fetchLatestAssignedStrategy();
  console.log('Latest Strategy:', latestStrategy);
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Latest Strategy" 
          value={latestStrategy[0]?.strategy as "background_sound" | "check_list" | "chunking" | "daily_planner" | "environmental_shift" | "pomodoro_timer" | "small_rewards" | "task_switching" | "work_partners"}
          date={latestStrategy[0]?.date}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}