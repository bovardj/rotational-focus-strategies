import { Card } from "@/app/ui/dashboard/components/cards";
import { lusitana } from "@/app/ui/fonts";
import { getDailyStrategy } from "@/app/lib/actions/actions";
import { getDashboardCounts } from "@/app/dashboard/survey/_data";
import CollapseInstructions from "@/app/ui/dashboard/components/collapse-instructions";
import CollapseNotes from "@/app/ui/dashboard/components/collapse-notes";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUserStrategies, fetchAssignedStrategies } from "@/app//lib/data";
import { strategyDictionary } from "@/app//lib/utils";
import CollapseStrategy from "@/app/ui/dashboard/components/collapse-strategy";
import CollapsePreviousStrategy from "@/app/ui/dashboard/components/collapse-previous-strategies";
import CollapseProgress from "@/app/ui/dashboard/components/collapse-progress";
import { parseDateString } from "@/app//lib/utils";

export const metadata = {
  title: "RFS | Dashboard",
  description:
    "The dashboard is the main page of the app, where you can see your latest assigned strategies and link to other important pages.",
};

export default async function Page() {
  const [counts, user, userStrategies, userAssignedStrategies] = await Promise.all([
    getDashboardCounts(),
    currentUser(),
    fetchUserStrategies(),
    fetchAssignedStrategies(),
  ]);

  if (!counts || !user?.id) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const {
    baselineCompleted,
    baselineSurveysCompleted,
    baselineSurveysExpected,
    dailySurveysCompleted,
    dailySurveysExpected,
    endSurveyCompleted,
  } = counts;

  // Use the same date format as getDailyStrategy() so we can match against stored entries
  const todayStr = new Date().toLocaleDateString('en-us', { timeZone: 'America/Los_Angeles' });
  const todayAssigned = userAssignedStrategies?.find(s => s.date === todayStr) ?? null;

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const filteredAssignedStrategies = userAssignedStrategies.filter(
    (strategy) => {
      const convertedDate = parseDateString(strategy.date);
      return convertedDate < todayMidnight;
    }
  );

  const strategyList = strategyDictionary
    .map((strategy) => {
      const matchedStrategy = userStrategies.some(
        (userStrategy: string | string[]) =>
          userStrategy.includes(strategy.href)
      )
        ? strategy
        : null;
      return matchedStrategy
        ? { name: strategy.name, href: strategy.href }
        : null;
    })
    .filter((name) => name !== null);

  // todayAssigned is null on first visit of the day — getDailyStrategy() picks and stores one.
  // On repeat visits it's already in the fetched list, so we skip the extra query.
  let latestStrategy = null;
  if (baselineCompleted) {
    latestStrategy = todayAssigned ?? await getDailyStrategy();
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl font-bold`}>Dashboard</h1>
      <div className="max-w-2xl">
        {baselineCompleted ? (
          <Card
            title="Today's Focus Strategy"
            value={latestStrategy?.strategy}
            date={latestStrategy?.date}
          />
        ) : (
          <>
            <div>
              <p className="mb-4">
                Focus Strategy assignments will begin once you have completed
                all{" "}
                <Link href={"/dashboard/survey"} className="text-blue-600 hover:text-blue-800 underline">
                  Baseline Surveys
                </Link>
                .
              </p>
            </div>
          </>
        )}
        <div className="flex flex-col gap-6 mt-6">
          <CollapseInstructions
            baselineSurveysExpected={baselineSurveysExpected}
            dailySurveysExpected={dailySurveysExpected}
          />
          <CollapseProgress
            baselineSurveysCompleted={baselineSurveysCompleted}
            baselineSurveysExpected={baselineSurveysExpected}
            dailySurveysCompleted={dailySurveysCompleted}
            dailySurveysExpected={dailySurveysExpected}
            endSurveyCompleted={endSurveyCompleted}
          />
          <CollapseStrategy strategyList={strategyList} />
          <CollapsePreviousStrategy
            previousStrategyList={filteredAssignedStrategies}
          />
          <CollapseNotes />
        </div>
        <div className="mt-6 pt-6">
          <h2 className={`${lusitana.className} text-lg font-bold mb-3`}>
            Questions, Bug Reporting & Help
          </h2>
          <p className="text-sm text-gray-500">
            Have questions? Find a bug? Need help? Send me an email at{" "}
            <a href="mailto:john.bovard@utah.edu" className="text-blue-600 hover:text-blue-800 underline">
              john.bovard@utah.edu
            </a>
            .
          </p>
          <p className="text-sm mt-4 text-gray-500">
            For bug reporting, please include the following information if possible:
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm text-gray-500 space-y-1">
            <li>A screenshot of the error message or page when you experienced the unexpected behavior</li>
            <li>What you were doing when the error occurred</li>
            <li>The web browser and device you are using (e.g., Chrome on Windows, Safari on iPhone)</li>
            <li>Any other relevant details that might help me understand the issue</li>
          </ul>
          <p className="text-sm mt-4 text-gray-500">
            Thank you for your help in making this app better!
          </p>
        </div>
      </div>
    </main>
  );
}
