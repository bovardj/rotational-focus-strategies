'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { strategies } from '@/app/lib/utils';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//     { name: "Background Sound", href: '/bg-sound' },
//     { name: "Check List", href: '/check-list' },
//     { name: "Chunking", href: '/chunking' },
//     { name: "Daily Planner", href: '/daily-planner' },
//     { name: "Environmental Shift", href: '/environmental-shift' },
//     { name: "Pomodoro Timer", href: '/pomodoro' },
//     { name: "Small Rewards", href: '/small-rewards' },
//     { name: "Task Switching", href: '/task-switching' },
//     { name: "Work Partners", href: '/work-partners' },
//   ]

export default function TableData({ strategy }: { strategy: string }) {
  const pathname = usePathname();
  const link = `/dashboard/strategies/${strategies.find(link => link.name === strategy)?.href || ''}`

  return (
    <>
      {/* {links.map((link) => {
        return ( */}
          {/* <tr key={link.href} className="flex items-center justify-between">
            <td className="flex items-center justify-start gap-2"> */}
              <Link
                // key={link.name}
                // href={link.href}
                href={link}
                className={clsx(
                  'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                  {
                    // 'bg-sky-100 text-blue-600': pathname === link.href,
                    // 'bg-sky-100 text-blue-600': pathname === `/dashboard/strategies/${strategy}`,
                    'bg-sky-100 text-blue-600': pathname === link,
                  },
                )}
              >
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <p className="text-s sm:text-sm md:block">{strategy}</p>
              </Link>
            {/* </td>
          </tr> */}
        {/* ); */}
      {/* })} */}
    </>
  );
}
