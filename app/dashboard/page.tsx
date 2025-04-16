import { Card } from '@/app/ui/dashboard/components/cards';
import { lusitana } from '@/app/ui/fonts';
import { getDailyStrategy } from '@/app//lib/actions';
import {
  getBaselineCompleted,
  getBaselineSurveysExpected,
  getBaselineSurveysCompleted,
  getDailySurveysCompleted,
  getDailySurveysExpected,
  getEndSurveyCompleted
} from '@/app/dashboard/survey/_data';
import CollapseInstructions from '@/app/ui/dashboard/components/collapse-instructions';
import CollapseNotes from '@/app/ui/dashboard/components/collapse-notes';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { fetchUserStrategies, fetchAssignedStrategies } from '@/app//lib/data';
import { strategyDictionary } from '@/app//lib/utils';
import CollapseStrategy from '@/app/ui/dashboard/components/collapse-strategy';
import CollapsePreviousStrategy from '@/app/ui/dashboard/components/collapse-previous-strategies';
import CollapseProgress from '@/app/ui/dashboard/components/collapse-progress';
import { parseDateString } from '@/app//lib/utils';
import { InstallPrompt, PushNotificationManager } from '@/app/components/pwaComponents';

export const metadata = {
  title: 'RFS | Dashboard',
  description: 'The dashboard is the main page of the app, where you can see your latest assigned strategies and link to other important pages.',
};

// A lazy little shortcut
const cssSettings = "grid gap-6 md:w-3/4 lg:w-2/3 xl:w-1/2";

export default async function Page() {
  const baselineCompleted = await getBaselineCompleted();
  const baselineSurveysExpected = await getBaselineSurveysExpected();
  const baselineSurveysCompleted = await getBaselineSurveysCompleted();
  const dailySurveysCompleted = await getDailySurveysCompleted();
  const dailySurveysExpected = await getDailySurveysExpected();
  const endSurveyCompleted = await getEndSurveyCompleted();

  const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      return <p className="text-center text-gray-500">Loading...</p>;
    }
    const userStrategies = await fetchUserStrategies();

    // Fetch the user's assigned strategies and filter them to only include those that are before today
    const userAssignedStrategies = await fetchAssignedStrategies();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filteredAssignedStrategies = userAssignedStrategies.filter((strategy) => {
      const convertedDate = parseDateString(strategy.date);
      return convertedDate < today;
    });
    
    const strategyList = strategyDictionary.map((strategy) => {
      const matchedStrategy = userStrategies.some(
        (userStrategy: string | string[]) =>
          userStrategy.includes(strategy.href)) ? strategy : null;
      return matchedStrategy ? {name: strategy.name, href: strategy.href} : null;
    }).filter((name) => name !== null);

  let latestStrategy = null;
  if (baselineCompleted) {
    latestStrategy = await getDailyStrategy();
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        Dashboard
      </h1>
      { baselineCompleted ? (
        <div className={`${cssSettings}`}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card
              title="Today's Focus Strategy" 
              value={latestStrategy?.strategy}
              date={latestStrategy?.date}
            />
          </div>
        </div>
      )
      : (
        <>
          <div className={`${cssSettings}`}>
            <p className="mb-4 ml-4">
              Focus Strategy assignments will begin once you have completed all <Link href={'/dashboard/survey'} className='underline'>Baseline Surveys</Link>.              
            </p>
          </div>
        </>
      )}
      <div className={`${cssSettings} text-center`}>
      <PushNotificationManager />
      <InstallPrompt />
      </div>
      <div className="grid gap-6 grid-cols-1 mt-6">
        <CollapseInstructions
          baselineSurveysExpected={baselineSurveysExpected}
          dailySurveysExpected={dailySurveysExpected}
        />
      </div>
      <div className="grid gap-6 grid-cols-1 mt-6">
        <CollapseProgress
          baselineSurveysCompleted={baselineSurveysCompleted}
          baselineSurveysExpected={baselineSurveysExpected}
          dailySurveysCompleted={dailySurveysCompleted}
          dailySurveysExpected={dailySurveysExpected}
          endSurveyCompleted={endSurveyCompleted}
        />
      </div>
      <div className="grid gap-6 grid-cols-1 mt-6">
        <CollapseStrategy strategyList={strategyList} />
      </div>
      <div className="grid gap-6 grid-cols-1 mt-6">
        <CollapsePreviousStrategy previousStrategyList={filteredAssignedStrategies} />
      </div>
      <div className="grid gap-6 grid-cols-1 mt-6">
        <CollapseNotes />
      </div>
      <div className="mt-6 pt-6 flex w-full items-center justify-between">
        <h2 className={`${lusitana.className} text-lg`}>Questions, Bug Reporting & Help</h2>
      </div>
      <div className="grid md:w-3/4 lg:w-2/3 xl:w-1/2">
        <p className="text-sm text-gray-500">
          Have questions? Find a bug? Need help? Send me an email at john.bovard@utah.edu. 
        </p>
        <p className="text-sm mt-4 text-gray-500">
          For bug reporting, please include the following information if possible:
        </p>
        <p className="text-sm text-gray-500">
          - A screenshot of the error message or page when you experienced the unexpected behavior
        </p>
        <p className="text-sm text-gray-500">
          - What you were doing when the error occurred
        </p>
        <p className="text-sm text-gray-500">
          - The web browser and device you are using (e.g., Chrome on Windows, Safari on iPhone)
        </p>
        <p className="text-sm text-gray-500">
          - Any other relevant details that might help me understand the issue
        </p>
        <p className="text-sm mt-2 text-gray-500">
          Thank you for your help in making this app better!
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}