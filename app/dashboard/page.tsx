import PageCard from "@/app/ui/dashboard/page-card";
import { Card } from "@/app/ui/dashboard/components/cards";
import { lusitana } from "@/app/ui/fonts";
import { getDailyStrategy } from "@/app/lib/actions/actions";
import { getDashboardCounts } from "@/app/dashboard/survey/_data";
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
    <PageCard>
      <main>
      <h1 className={`${lusitana.className} mb-6 text-2xl font-bold`}>Dashboard</h1>
      <div className="flex max-w-3xl flex-col gap-6">
        {baselineCompleted ? (
          <Card
            title="Today's Focus Strategy"
            value={latestStrategy?.strategy}
            date={latestStrategy?.date}
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              Focus strategy assignments will begin once you have completed all{" "}
              <Link href="/dashboard/survey" className="text-blue-800 underline hover:text-blue-900">
                Baseline Surveys
              </Link>
              .
            </p>
          </div>
        )}
        <CollapseProgress
          baselineSurveysCompleted={baselineSurveysCompleted}
          baselineSurveysExpected={baselineSurveysExpected}
          dailySurveysCompleted={dailySurveysCompleted}
          dailySurveysExpected={dailySurveysExpected}
          endSurveyCompleted={endSurveyCompleted}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CollapseStrategy strategyList={strategyList} />
          <CollapsePreviousStrategy
            previousStrategyList={filteredAssignedStrategies}
          />
        </div>
      </div>
    </main>
    </PageCard>
  );
}
