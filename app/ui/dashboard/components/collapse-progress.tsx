'use client'

import Collapse from '@geist-ui/react/esm/collapse/collapse'

interface CollapseProgressProps {
    baselineSurveysCompleted: number;
    baselineSurveysExpected: number;
    dailySurveysCompleted: number;
    dailySurveysExpected: number;
    endSurveyCompleted: boolean;
}

export default function CollapseProgress(
    { baselineSurveysCompleted,
      baselineSurveysExpected,
      dailySurveysCompleted,
      dailySurveysExpected,
      endSurveyCompleted }: CollapseProgressProps) {

    return (
      <div className="grid gap-6 grid-cols-1 md:w-3/4 lg:w-2/3 xl:w-1/2">
        <Collapse shadow title="Your Progress" initialVisible className='bg-gray-50'>
            <div className="list-disc pl-6 *:rounded-md">
            <ul className="list-disc pl-6">
                <li className="mb-2">
                  Baseline surveys: {baselineSurveysCompleted} / {baselineSurveysExpected} surveys
                </li>
                <li className='mb-2'>
                  You have completed {dailySurveysCompleted} / {dailySurveysExpected} daily (post-baseline) surveys.
                </li>
                <li className='mb-2'>
                  You have completed {endSurveyCompleted ? 'the' : 'not completed the'} exit survey.
                </li>
            </ul>
            </div>
        </Collapse>
      </div>
    )
}
