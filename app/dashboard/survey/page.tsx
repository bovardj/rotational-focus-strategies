import PageCard from "@/app/ui/dashboard/page-card";
import { lusitana } from "@/app/ui/fonts";
import SurveyForm from "@/app/ui/dashboard/survey/survey-form";
import SurveyProgress from "@/app/ui/dashboard/survey/survey-progress";
import {
  getBaselineCompleted,
  getDailyCompleted,
  getEndSurveyCompleted,
  getSurveySubmissionDates,
} from "@/app/dashboard/survey/_data";

export const metadata = {
  title: "RFS | Survey",
  description: "The survey page for submitting responses about your day.",
};

export default async function Page() {
  const baselineCompleted = await getBaselineCompleted();
  const dailyCompleted = await getDailyCompleted();
  const endSurveyCompleted = await getEndSurveyCompleted();
  const submissionDates = await getSurveySubmissionDates();

  return (
    <PageCard>
      <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl font-bold`}>
        {endSurveyCompleted
          ? "You've completed all surveys! Thank you!"
          : `${
              dailyCompleted
                ? "Exit Survey"
                : `End-of-Day Survey ${
                    baselineCompleted ? " - Focus Strategy Use" : " - Baseline"
                  }`
            }`}
      </h1>
      {endSurveyCompleted ? (
        <p className="mb-4 text-sm text-gray-500">
          Thank you for helping me with my project. You have completed all
          surveys.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">Please complete the survey below.</p>
          <SurveyProgress
            baselineDates={submissionDates.baseline}
            dailyDates={submissionDates.daily}
            endSurveyCompleted={endSurveyCompleted}
          />
          <SurveyForm
            dailyCompleted={dailyCompleted}
            baselineCompleted={baselineCompleted}
          />
        </>
      )}
      </main>
    </PageCard>
  );
}
