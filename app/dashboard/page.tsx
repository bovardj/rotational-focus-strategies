import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import StrategiesTable from '@/app/ui/dashboard/table';
import { getDailyStrategy } from '../lib/actions';
import {
  getBaselineCompleted,
  getBaselineSurveysExpected,
  getBaselineSurveysCompleted
} from '@/app/dashboard/checkin/_data';

export const metadata = {
  title: 'Dashboard',
  description: 'The dashboard is the main page of the app, where you can see your latest assigned strategies and link to other important pages.',
};

export default async function Page() {
  const baselineCompleted = await getBaselineCompleted();
  const baselineSurveysExpected = await getBaselineSurveysExpected();
  const baselineSurveysCompleted = await getBaselineSurveysCompleted();

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
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
          {/* <div className="mt-4 w-full"> */}
            <p>
              Focus Strategy assignments will begin once you have completed all baseline surveys.
              You have completed {baselineSurveysCompleted} out of {baselineSurveysExpected} baseline surveys.
            </p>
          {/* </div> */}
          {/* <div className="mt-4 w-full"> */}
            {/* <p>You have completed {baselineSurveysCompleted} out of {baselineSurveysExpected} baseline surveys.</p> */}
          {/* </div> */}
        </div>
      )}
      <div className="mt-6">
        <StrategiesTable />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
      <div className="mt-6 flex w-full items-center justify-between">
        <h2 className={`${lusitana.className} text-lg`}>Questions & Help</h2>
      </div>
      {/* <div className="hidden md:block mt-4 w-full"> */}
      <div className="mt-4 w-full">
        <p className="text-sm text-gray-500">
          Have questions? Find a bug? Need help? Send me an email at john.bovard@utah.edu
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}