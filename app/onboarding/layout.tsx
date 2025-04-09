import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import SideNav from '@/app/ui/onboarding/sidenav'
import SyncUserToSupabase from '@/app/components/SyncUserToSupabase'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect('/')
  }

  return (
    <>
      <SyncUserToSupabase />
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
    </>
  )
}