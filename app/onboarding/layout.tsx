import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideNav from "@/app/ui/onboarding/sidenav";
import { syncUserToSupabase } from "@/app/onboarding/_actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/dashboard");
  }

  await syncUserToSupabase();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full flex-none md:sticky md:top-0 md:h-screen md:w-64 md:overflow-y-auto">
        <SideNav />
      </div>
      <div className="flex flex-col flex-grow">
<div className="p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
