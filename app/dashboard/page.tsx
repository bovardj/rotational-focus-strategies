import {
    ClockIcon,
  } from '@heroicons/react/24/outline';
import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import { fetchUserStrategies, fetchAssignedStrategies, fetchLatestAssignedStrategy } from '@/app/lib/data';

export default async function Page() {
  const latestStrategy = await fetchLatestAssignedStrategy();
  console.log('Latest Strategy:', latestStrategy);
  const assignedStrategies = await fetchAssignedStrategies();
  const userStrategies = await fetchUserStrategies();
  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
          <div className="flex p-4">
            <ClockIcon className="h-5 w-5 text-gray-700" />
            <h3 className="ml-2 text-sm font-medium">Latest Strategy</h3>
          </div>
          <p
            className={`${lusitana.className}
              truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
          >
            {latestStrategy[0]?.strategy}
          </p>
        </div> */}
        <Card
          title="Latest Strategy" 
          value={latestStrategy[0]?.strategy as "background_sound" | "check_list" | "chunking" | "daily_planner" | "environmental_shift" | "pomodoro_timer" | "small_rewards" | "task_switching" | "work_partners"}
          date={latestStrategy[0]?.date}
        />
        {/* <Card title="Latest Strategy" value={latestStrategy[0]?.strategy} type="background_sound" /> */}

        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={latestStrategy} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}