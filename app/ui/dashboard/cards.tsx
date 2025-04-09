import {
  ClockIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { strategies } from '@/app/lib/utils';

export function Card({
  title,
  value,
  date,
}: {
  title: string;
  value: string;
  date?: string;
}) {
  const formatted_value = strategies.find(
    (strat) => strat.href === value,
  )?.name || value;

  // console.log('Formatted Value:', formatted_value);
  // console.log('Value:', value);
  // console.log('Date:', date);
  // console.log('Formatted date:', date ? new Date(date).toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // }) : 'No date available');

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
          className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {formatted_value}
        </p>
      </Link>
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
