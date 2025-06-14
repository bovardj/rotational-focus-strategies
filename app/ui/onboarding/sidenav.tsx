'use client';

import Link from 'next/link';
// import NavLinks from '@/app/ui/dashboard/nav-links';
import RFSLogo from '@/app/ui/rfs-logo';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <RFSLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <Link
          key={"Onboarding"}
          href={'./onboarding'}
          className={clsx(
            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            {
              'bg-sky-100 text-blue-600': pathname === './onboarding',
            },
          )}
        >
            <p className="block md:block">{'Onboarding'}</p>
        </Link>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
    </div>
  );
}
