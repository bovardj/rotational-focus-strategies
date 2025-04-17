import ForgotPasswordForm from '@/app/ui/forgot-password-form';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 md:-mt-32 border-2 border-blue-400 rounded-lg bg-white shadow-md">
        {/* <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
        </div> */}
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}