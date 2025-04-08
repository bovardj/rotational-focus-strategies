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
  // const userStrategies = await fetchUserStrategies(userId);
  
  // console.log('User Strategies:', userStrategies);
  // console.log('Latest Strategy:', latestStrategy);
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
      <div className="mt-6">
        <StrategiesTable />
      </div>
      {/* <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Strategy</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {userStrategies.map((strategy, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{strategy}</td>
              <td className="border border-gray-300 px-4 py-2">{strategy}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
        {/* <Card
          title="Latest Strategy" 
          value={latestStrategy[0]?.strategy as "background_sound" | "check_list" | "chunking" | "daily_planner" | "environmental_shift" | "pomodoro_timer" | "small_rewards" | "task_switching" | "work_partners"}
        /> */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}