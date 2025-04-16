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
      <div>
        <Collapse shadow title="Instructions" initialVisible className='bg-gray-50'>
          <p className="mb-4">
            The purpose of this project is to see if rotating focus strategies assists in a feeling of
            self-satisfaction and productivity. Once baseline measurements are recorded, you will be
            assigned a random focus strategy (from your selected strategies) to use each day. Then, at
            the end of the day, you will be asked to complete a survey about your experience with that
            strategy.
          </p>
          <p className='mb-4'>
            <b>If you forget to complete the survey at the end of the day, you can still complete it later.</b>
            You only need to select what day the survey is for in the survey. Please try to complete the
            survey as soon as possible after the end of each day, though.
          </p>
          <p className="italic underline">
            <b>Two Important Notes:</b>
          </p>
          <ul className='list-disc pl-6'>
            <li>
              While you will only be assigned Focus Strategies from your selection, it is not guaranteed that 
              you will be assigned all of your focus strategies. Additionally, it is possible that you will be
              assigned the same Focus Strategy two days in a row.
            </li>
            <li>
              Please note that new focus strategies are assigned at 1am MDT (3am EDT) each day.
            </li>
          </ul>
          {/* NOTE TO SELF: This is where the PWA installation instructions are. Remove "hidden" when PWA functionality is implemented. */}
          <p className="hidden mb-4">
            While completely optional, you may install this app onto your device, such as a smartphone or computer,
            as a Progressive Web App (PWA) if you would like. A useful guide to installing the app as a PWA can be found&nbsp;
            <Link href="https://www.cdc.gov/niosh/mining/tools/installpwa.html" className="text-blue-500 hover:underline">
            here</Link>.
          </p>
          <Collapse shadow title={`Baseline Days (first ${baselineSurveysExpected} days)`} className='bg-gray-50'>
          <ul className="list-disc pl-6">
              <li className="mb-2">
                Go about your day as you normally would.
              </li>
              <li>
                At the end of the day, complete a Baseline <Link href='./dashboard/survey' className='underline'>Survey</Link> about your day.
                <span className='italic'> (Also accessible from the &apos;Surveys&apos; button on the dashboard.)</span>
              </li>
          </ul>
          </Collapse>
          <Collapse shadow title={`Assigned Focus Strategy Days (for ${dailySurveysExpected} days after baseline)`} className='bg-gray-50'>
          <ul className="list-disc pl-6">
              <li className="mb-2">
                Use your assigned focus strategy for the day.
              </li>
              <li className="mb-2">
                At the end of the day, complete the Daily <Link href='./dashboard/survey' className='underline'>
                Survey</Link> about your experience with that strategy.
                <span className='italic'> (Also accessible from the &apos;Surveys&apos; button on the dashboard.)</span>
              </li>
              <li>
                When you submit your last Daily (post-Basline) Survey, you will be redirected to a brief
                Exit <Link href='./dashboard/survey' className='underline'>Survey</Link>. If you return to this page,
                simply click on either the &apos;Surveys&apos; button to access it.
              </li>
          </ul>
          </Collapse>
          <Collapse shadow title='Last Day' className='bg-gray-50'>
          <ul className="list-disc pl-6">
              <li className='mb-2'>
                When you submit your last Daily (post-Basline) Survey, you will be redirected to a brief
                Exit <Link href='./dashboard/survey' className='underline'>Survey</Link>. If you return to this page,
                simply click on either the &apos;Surveys&apos; button to access it.
              </li>
              <li>
                <p className='mb-2'>
                  I will delete all of your data from the apps database within one week of your Exit Survey submission.
                  Associations to your email address or other potentially identifying information will be deleted and 
                  data transfered to an anonymized spreadsheet for analysis and reporting purposes.
                </p>
                <p>
                  While you can continue to use the app and get assigned strategies after your last survey, this will
                  no longer be the case once I delete your data from the database.
                </p>
              </li>
          </ul>
          </Collapse>
        </Collapse>
      </div>
    )
}