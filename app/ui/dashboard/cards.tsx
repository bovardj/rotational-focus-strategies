import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const strategyMap = {
  background_sound: "Background Sound",
  check_list: "Check List",
  chunking: "Chunking",
  daily_planner: "Daily Planner",
  environmental_shift: "Environmental Shift",
  pomodoro_timer: "Pomodoro Timer",
  small_rewards: "Small Rewards",
  task_switching: "Task Switching",
  work_partners: "Work Partners",
};

export default async function CardWrapper() {
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      /> */}
    </>
  );
}

export function Card({
  title,
  value,
  date,
  // type,
}: {
  title: string;
  value: keyof typeof strategyMap;
  date?: string;
  // type: 'background_sound' | 'check_list' | 'chunking' | 'daily_planner' | 'environmental_shift' | 
  // 'pomodoro_timer' | 'small_rewards' | 'task_switching' | 'work_partners';
}) {
  const value_formatted = strategyMap[value];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:col-span-2 lg:col-span-4 max-w-md mx-auto">
      <div className="flex p-4">
      <LightBulbIcon className="h-5 w-5 text-gray-700" />
      <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
      className={`${lusitana.className}
        truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
      {value_formatted}
      </p>
      <p className="text-center text-sm py-2 text-gray-500">
      {date ? (
        <span>
        <ClockIcon className="h-4 w-4 inline-block mr-1" />
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        </span>
      ) : (
        <span>
        <ClockIcon className="h-4 w-4 inline-block mr-1" />
        No date available
        </span>
      )}
      </p>
    </div>
  );
}
