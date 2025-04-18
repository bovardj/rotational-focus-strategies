'use client'

import Collapse from '@geist-ui/react/esm/collapse/collapse'
import Link from 'next/link';

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
      <div>
        <Collapse shadow title="Your Progress" initialVisible className='bg-gray-50'>
            <div className="list-disc pl-6 *:rounded-md">
            <ul className="list-disc pl-6">
                <li className="mb-2">
                  Baseline surveys: {baselineSurveysCompleted} / {baselineSurveysExpected} <Link href='./dashboard/survey' className='underline'>surveys</Link>.
                </li>
                <li className='mb-2'>
                  You have completed {dailySurveysCompleted} / {dailySurveysExpected} daily (post-baseline) <Link href='./dashboard/survey' className='underline'>surveys</Link>.
                </li>
                <li className='mb-2'>
                  You have completed {endSurveyCompleted ? 'the' : 'not completed the'} exit <Link href='./dashboard/survey' className='underline'>survey</Link>.
                </li>
            </ul>
            </div>
        </Collapse>
      </div>
    )
}
