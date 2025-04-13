import { Card } from '@/app/ui/dashboard/components/cards';
import { lusitana } from '@/app/ui/fonts';
import { getDailyStrategy } from '@/app//lib/actions';
import {
  getBaselineCompleted,
  getBaselineSurveysExpected,
  getBaselineSurveysCompleted,
  getDailySurveysCompleted,
  getDailySurveysExpected
} from '@/app/dashboard/survey/_data';
import CollapseInstructions from '@/app/ui/dashboard/components/collapse-instructions';
import CollapseNotes from '@/app/ui/dashboard/components/collapse-notes';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { fetchUserStrategies } from '@/app//lib/data';
import { strategyDictionary } from '@/app//lib/utils';
import CollapseStrategy from '@/app/ui/dashboard/components/collapse-strategy';
import CollapseProgress from '@/app/ui/dashboard/components/collapse-progress';

export const metadata = {
  title: 'Dashboard',
  description: 'The dashboard is the main page of the app, where you can see your latest assigned strategies and link to other important pages.',
};

// A lazy little shortcut
const cssSettings = "grid gap-6 md:w-3/4 lg:w-2/3 xl:w-1/2";

export default async function Page() {
  const baselineCompleted = await getBaselineCompleted();
  const baselineSurveysExpected = await getBaselineSurveysExpected();
  const baselineSurveysCompleted = await getBaselineSurveysCompleted();
  const dailyCompleted = await getDailySurveysCompleted();
  const dailyExpected = await getDailySurveysExpected();
  
  const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      return <p className="text-center text-gray-500">Loading...</p>;
    }
    const userStrategies = await fetchUserStrategies(userId);
    
    const strategyList = strategyDictionary.map((strategy) => {
      const matchedStrategy = userStrategies.some(
        (userStrategy) =>
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
              Focus Strategy assignments will begin once you have completed all <Link href={'/dashboard/survey'} className='underline'>baseline surveys</Link>.              
            </p>
          </div>
        </>
      )}
      <div className="grid gap-6 grid-cols-1 mt-6">
        <CollapseInstructions />
      </div>
      <div className="grid gap-6 grid-cols-1 mt-6">
        <CollapseProgress
          baselineSurveysCompleted={baselineSurveysCompleted}
          baselineSurveysExpected={baselineSurveysExpected}
          dailyCompleted={dailyCompleted}
          dailyExpected={dailyExpected}
        />
      </div>
      <div className="mt-6">
        <CollapseStrategy strategyList={strategyList} />
      </div>
      <div className="grid gap-6 grid-cols-1 mt-6">
        <CollapseNotes />
      </div>
      <div className="mt-6 pt-6 flex w-full items-center justify-between">
        <h2 className={`${lusitana.className} text-lg`}>Questions, Bug Reporting & Help</h2>
      </div>
      <div className={`${cssSettings}`}>
        <p className="text-sm text-gray-500">
          Have questions? Find a bug? Need help? Send me an email at john.bovard@utah.edu
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}