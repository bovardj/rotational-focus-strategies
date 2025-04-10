import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import StrategiesTable from '@/app/ui/dashboard/table';
import { getDailyStrategy } from '../lib/actions';
import {
  getBaselineCompleted,
  getBaselineSurveysExpected,
  getBaselineSurveysCompleted,
  getDailySurveysCompleted,
  getDailySurveysExpected
} from '@/app/dashboard/checkin/_data';
import CollapseInstructions from '../ui/dashboard/collapse-instructions';

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

  let latestStrategy = null;
  if (baselineCompleted) {
    latestStrategy = await getDailyStrategy();

  }
  // console.log('latestStrategy', latestStrategy);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 grid-cols-1">
        <CollapseInstructions />
      </div>
      <div className='mt-6 flex w-full items-center justify-between' />
      { baselineCompleted ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            title="Today's Focus Strategy" 
            value={latestStrategy?.strategy}
            date={latestStrategy?.date}
          />
        </div>
      )
      : (
        <>
          <div className={`${cssSettings}`}>
            {/* <div className="mt-4 w-full"> */}
            <p>
              Focus Strategy assignments will begin once you have completed all baseline surveys.
            </p>
          </div>
            {/* </div> */}
            {/* <div className="mt-4 w-full"> */}
              {/* <p>You have completed {baselineSurveysCompleted} out of {baselineSurveysExpected} baseline surveys.</p> */}
            {/* </div> */}
        </>
      )}
      {/* <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3"> */}
      <div className={`${cssSettings}`}>
        <div className="mt-4 list-disc pl-6 *:rounded-md">
          <li className="mb-2">
            You have completed {baselineSurveysCompleted} out of {baselineSurveysExpected} baseline surveys.
          </li>
          <li className="mb-2">
            You have completed {dailyCompleted} out of {dailyExpected} daily (post-baseline) surveys.
          </li>
        </div>
      </div>
      <div className="mt-6">
        <StrategiesTable />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
      <div className="mt-6 flex w-full items-center justify-between">
        <h2 className={`${lusitana.className} text-lg`}>Questions & Help</h2>
      </div>
      {/* <div className="hidden md:block mt-4 w-full"> */}
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