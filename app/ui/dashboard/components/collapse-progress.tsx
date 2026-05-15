"use client";

import Collapse from "@geist-ui/react/esm/collapse/collapse";
import Link from "next/link";

interface CollapseProgressProps {
  baselineSurveysCompleted: number;
  baselineSurveysExpected: number;
  dailySurveysCompleted: number;
  dailySurveysExpected: number;
  endSurveyCompleted: boolean;
}

export default function CollapseProgress({
  baselineSurveysCompleted,
  baselineSurveysExpected,
  dailySurveysCompleted,
  dailySurveysExpected,
  endSurveyCompleted,
}: CollapseProgressProps) {
  return (
    <div>
      <Collapse
        shadow
        title="Your Progress"
        initialVisible
        className="bg-gray-50"
      >
        <div className="list-disc pl-6 *:rounded-md">
          <ul className="list-disc pl-6">
            <li className="mb-2">
              <Link href="./dashboard/survey" className="underline">
                Baseline Surveys
              </Link>
              : {baselineSurveysCompleted} /{" "}
              {baselineSurveysExpected}{" "}completed.
            </li>
            <li className="mb-2">
              <Link href="./dashboard/survey" className="underline">
                Daily Surveys
              </Link> (after baseline)
              :&nbsp;{dailySurveysCompleted} /{" "}
              {dailySurveysExpected}&nbsp;completed.
            </li>
            <li className="mb-2">
              <Link href="./dashboard/survey" className="underline">
                Exit Survey
              </Link>
              : {endSurveyCompleted ? "Completed" : "Not Completed"}.
            </li>
          </ul>
        </div>
      </Collapse>
    </div>
  );
}