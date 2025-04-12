import {
  ClockIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { strategyDictionary } from '@/app/lib/utils';
import clsx from 'clsx';

export function Card({
  title,
  value,
  date,
}: {
  title: string;
  value: string;
  date?: string;
}) {
  const formatted_value = strategyDictionary.find(
    (strat) => strat.href === value,
  )?.name || value;

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:col-span-2 lg:col-span-4 max-w-md mx-auto">
      <div className="flex p-4">
        <LightBulbIcon className="h-5 w-5 text-gray-700" />
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <Link 
        key={formatted_value}
        href={`dashboard/strategies/${value}`}>
        <p
          className={clsx(
            `${lusitana.className} truncate text-center gap-2 rounded-xl bg-white px-4 py-8 text-2xl hover:bg-sky-100 hover:text-blue-600`
          )}
        >
          {formatted_value}
        </p>
      </Link>
      <p className="text-center text-sm py-2 text-gray-500">
        {date ? (
          <span>
          <ClockIcon className="h-4 w-4 inline-block mr-1" />
          {new Date().toLocaleDateString('en-us', { timeZone: 'America/Denver' }) + ' MDT'}
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
