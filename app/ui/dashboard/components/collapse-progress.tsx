import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface CollapseProgressProps {
  baselineSurveysCompleted: number;
  baselineSurveysExpected: number;
  dailySurveysCompleted: number;
  dailySurveysExpected: number;
  endSurveyCompleted: boolean;
}

function Phase({
  number,
  label,
  completed,
  total,
  done,
}: {
  number: number;
  label: string;
  completed: number;
  total: number | null;
  done: boolean;
}) {
  const isComplete = done || (total !== null && completed >= total);
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Phase {number}
        </span>
        {isComplete && <CheckCircleIcon className="h-4 w-4 text-blue-800" />}
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
      {total !== null ? (
        <>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${label}: ${completed} of ${total} completed`}
              className={`h-1.5 rounded-full transition-all ${isComplete ? "bg-blue-800" : "bg-blue-300"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{completed} / {total} completed</p>
        </>
      ) : (
        <p className="text-xs text-gray-500">{done ? "Completed" : "Not yet started"}</p>
      )}
    </div>
  );
}

export default function CollapseProgress({
  baselineSurveysCompleted,
  baselineSurveysExpected,
  dailySurveysCompleted,
  dailySurveysExpected,
  endSurveyCompleted,
}: CollapseProgressProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">Your Progress</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Phase
          number={1}
          label="Baseline Surveys"
          completed={baselineSurveysCompleted}
          total={baselineSurveysExpected}
          done={false}
        />
        <Phase
          number={2}
          label="Daily Surveys"
          completed={dailySurveysCompleted}
          total={dailySurveysExpected}
          done={false}
        />
        <Phase
          number={3}
          label="Exit Survey"
          completed={0}
          total={null}
          done={endSurveyCompleted}
        />
      </div>
      {!endSurveyCompleted && (
        <div className="mt-3 flex justify-end">
          <Link
            href="/dashboard/survey"
            className="flex items-center gap-1.5 rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900"
          >
            Complete next survey
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
