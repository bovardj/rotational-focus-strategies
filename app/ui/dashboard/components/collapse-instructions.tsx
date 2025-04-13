'use client'

import Collapse from '@geist-ui/react/esm/collapse/collapse'
import Link from 'next/link'

interface CollapseInstructionsProps {
  baselineSurveysExpected: number;
  dailySurveysExpected: number;
}

export default function CollapseInstructions(
  { baselineSurveysExpected,
    dailySurveysExpected }: CollapseInstructionsProps) {

    return (
      <div className="grid gap-6 grid-cols-1 md:w-3/4 lg:w-2/3 xl:w-1/2">
        <Collapse shadow title="Instructions" initialVisible className='bg-gray-50'>
          <p className="mb-4 text-md md:text-md">
            The purpose of this project is to see if rotating focus strategies assists in a feeling of
            self-satisfaction and productivity. Once baseline measurements are recorded, you will be
            assigned a random focus strategy (from your selected strategies) to use each day. Then, at
            the end of the day, you will be asked to complete a survey about your experience with that
            strategy.
          </p>
          <p>
            If you forget to complete the survey at the end of the day, you can still complete it later.
            You only need to select what day the survey is for in the survey. Please try to complete the
            survey as soon as possible after the end of each day, though.
          </p>
          <Collapse shadow title={`Baseline Days (first ${baselineSurveysExpected} days)`} className='bg-gray-50'>
          <ul className="list-disc pl-6">
              <li className="mb-2">
                Go about your day as you normally would.
              </li>
              <li className="mb-2">
                At the end of the day, complete the <Link href='./dashboard/survey' className='underline'>survey</Link> about your day.
                <span className='italic'> (Also accessible from the &apos;End of Day Survey&apos; button on the dashboard.)</span>
              </li>
          </ul>
          </Collapse>
          <Collapse shadow title={`Assigned Focus Strategy Days (for ${dailySurveysExpected} days after baseline)`} className='bg-gray-50'>
          <ul className="list-disc pl-6">
              <li className="mb-2">
                Use your assigned focus strategy for the day.
              </li>
              <li className="mb-2">
                At the end of the day, complete the <Link href='./dashboard/survey' className='underline'>survey</Link> about your experience with that strategy.
                <span className='italic'> (Also accessible from the &apos;End of Day Survey&apos; button on the dashboard.)</span>
              </li>
              <li className="mb-2">
                When you submit your last end of day survey, you will be directed to a brief exit <Link href='./dashboard/survey' className='underline'>survey</Link>. 
              </li>
          </ul>
          </Collapse>
        </Collapse>
      </div>
    )
}