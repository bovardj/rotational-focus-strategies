'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { SignUpButton, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
// import RFSLogo from '@/app/ui/rfs-logo';

export default function Page() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);
  return (
    <main className="flex flex-col items-center p-6">
      {/* <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52 md:px-60">
        <RFSLogo />
      </div> */}
      <div className="flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:px-20">
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Rotational Focus Strategies.</strong>
          </p>
          <p className={`${lusitana.className} text-gray-500 text-lg md:text-2xl md:leading-normal`}>
          Thank you for participating in my class project!
          </p>
          <SignInButton>
            <button className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
              <span>Sign in</span> <ArrowRightIcon className="w-5 md:w-6" />
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
              <span>Sign up</span> <ArrowRightIcon className="w-5 md:w-6" />
            </button>
          </SignUpButton>
        </div>
      </div>
    </main>
  );
}
