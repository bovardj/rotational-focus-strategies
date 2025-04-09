import { lusitana } from '@/app/ui/fonts';
import CheckInForm from '@/app/ui/dashboard/checkin-form';
import {
  getBaselineCompleted,
  getDailyCompleted,
  getEndSurveyCompleted
} from '@/app/dashboard/checkin/_data';

export default async function Page() {
  const baselineCompleted = await getBaselineCompleted();
  const dailyCompleted = await getDailyCompleted();
  const endSurveyCompleted = await getEndSurveyCompleted();
  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>
        { endSurveyCompleted ? "End of Project Survey" :
          `${ dailyCompleted ? "End of Project Survey" :
            `End of Day Check In ${ baselineCompleted ?
            " - Daily" : " - Baseline"}`
          }`
        }
        </h1>
      <div className="flex justify-center">
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <CheckInForm
            dailyCompleted={dailyCompleted}
            baselineCompleted={baselineCompleted}
          />
        </div>
      </div>
    </main>
  );
}