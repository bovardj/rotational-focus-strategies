import Collapse from "@/app/ui/components/collapse";
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
    <Collapse shadow title="Your Progress" initialVisible className="bg-gray-50">
      <ul className="list-disc pl-6">
        <li className="mb-2">
          <Link href="./dashboard/survey" className="text-blue-600 hover:text-blue-800 underline">
            Baseline Surveys
          </Link>
          : {baselineSurveysCompleted} / {baselineSurveysExpected} completed.
        </li>
        <li className="mb-2">
          <Link href="./dashboard/survey" className="text-blue-600 hover:text-blue-800 underline">
            Daily Surveys
          </Link>
          &nbsp;(after baseline):&nbsp;{dailySurveysCompleted} / {dailySurveysExpected}&nbsp;completed.
        </li>
        <li className="mb-2">
          <Link href="./dashboard/survey" className="text-blue-600 hover:text-blue-800 underline">
            Exit Survey
          </Link>
          : {endSurveyCompleted ? "Completed" : "Not completed"}.
        </li>
      </ul>
    </Collapse>
  );
}
