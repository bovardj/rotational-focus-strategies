'use client';

import { useRouter } from 'next/navigation';
import {
    getBaselineSurveysExpected,
    getBaselineSurveysCompleted,
    getDailySurveysCompleted,
    getDailySurveysExpected,
    getDaysCompleted,
    getEndSurveyCompleted
  } from '@/app/dashboard/checkin/_data';
import {
  insertBaselineSurvey,
  setBaselineSurveysCompleted,
  setBaselineCompleted,
  insertDailySurvey,
  setDailySurveysCompleted,
  setDailyCompleted,
  insertEndSurvey,
  setEndSurveyCompleted
} from '@/app/dashboard/checkin/_actions';

interface CheckInFormProps {
  dailyCompleted: boolean;
  baselineCompleted: boolean;
}

export default function CheckInForm({ dailyCompleted, baselineCompleted }: CheckInFormProps) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const submissionDate = formData.get('submission_date') || new Date().toISOString().split('T')[0];
    const satisfactionResponse = formData.get('satisfaction_score');
    const productivityResponse = formData.get('productivity_score');
    const usedStrategyBool = formData.get('used_strategy');
    const usedStrategyText = formData.get('strategy_response');
    const openResponse = formData.get('open_response');
    const baselineSurveysExpected = await getBaselineSurveysExpected();
    const baselineSurveysCompleted = await getBaselineSurveysCompleted();
    const dailySurveysExpected = await getDailySurveysExpected();
    const dailySurveysCompleted = await getDailySurveysCompleted();
    const daysCompleted = await getDaysCompleted();
    let settingDailyCompleted = false;

    // Handle the form submission logic here
    console.log({
      submissionDate,
      satisfactionResponse,
      productivityResponse,
      usedStrategyBool,
      usedStrategyText,
      openResponse,
    });

    if (!baselineCompleted) {
      const res = await insertBaselineSurvey(formData);
      if (res?.message) {
        await setBaselineSurveysCompleted(
          baselineSurveysCompleted + 1,
          daysCompleted + 1
        );
        if ((baselineSurveysCompleted + 1) >= baselineSurveysExpected) {
          await setBaselineCompleted();
        }
        console.log('Baseline survey submitted successfully');
      }
    } else if (!dailyCompleted) {
      const res = await insertDailySurvey(formData);
      if (res?.message) {
        await setDailySurveysCompleted(
          dailySurveysCompleted + 1,
          daysCompleted + 1
        );
        if ((dailySurveysCompleted + 1) >= dailySurveysExpected) {
          await setDailyCompleted();
          settingDailyCompleted = true;
        }
        console.log('Daily survey submitted successfully');
      }
    }
    else {
      const res = await insertEndSurvey(formData);
      if (res?.message) {
        await setEndSurveyCompleted();
        console.log('End survey submitted successfully');
      }
    }

    if (settingDailyCompleted) {
      router.push('/dashboard/checkin');
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md" style={{ maxWidth: '400px' }}>
        { (!baselineCompleted || !dailyCompleted) && (
          <div className="mb-6">
            <label htmlFor="submission_date" className="block text-sm font-medium text-gray-700">
              What day is this for?
            </label>
            <input
              type="date"
              id="submission_date"
              name="submission_date"
              defaultValue={new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0]}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        )}
      <div>
        <label htmlFor="satisfaction_score" className="block text-sm font-medium text-gray-700">
          { dailyCompleted ? "How satisfied have you been with your days while using Rotational Focus Strategies?" : "How satisfied are you with today?" }
        </label>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="satisfaction_score"
              value="1"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-sm">1 - Very dissatisfied</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="satisfaction_score"
              value="2"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-sm">2 - Somewhat dissatisfied</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="satisfaction_score"
              value="3"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-sm">3 - Neutral</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="satisfaction_score"
              value="4"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-sm">4 - Somewhat satisfied</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="satisfaction_score"
              value="5"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-sm">5 - Very satisfied</span>
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="productivity_score" className="block text-sm font-medium text-gray-700">
          { dailyCompleted ? "How productive did you feel while using Rotational Focus Strategies?" : "How productive did you feel today?" }
        </label>
        <div className="mt-4 grid grid-cols-1 gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="productivity_score"
            value="1"
            className="form-radio text-indigo-600"
          />
          <span className="ml-2 text-sm">1 - Very unproductive</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="productivity_score"
            value="2"
            className="form-radio text-indigo-600"
          />
          <span className="ml-2 text-sm">2 - Somewhat unproductive</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="productivity_score"
            value="3"
            className="form-radio text-indigo-600"
          />
          <span className="ml-2 text-sm">3 - Neutral</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="productivity_score"
            value="4"
            className="form-radio text-indigo-600"
          />
          <span className="ml-2 text-sm">4 - Somewhat productive</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="productivity_score"
            value="5"
            className="form-radio text-indigo-600"
          />
          <span className="ml-2 text-sm">5 - Very productive</span>
        </label>
        </div>
        </div>
        { baselineCompleted && !dailyCompleted && (
          <>
            <div>
              <label htmlFor="used_strategy" className="block text-sm font-medium text-gray-700">
                Did you use the assigned focus strategy today?
              </label>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="used_strategy"
                    value="yes"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-sm">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="used_strategy"
                    value="no"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-sm">No</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="strategy_response" className="block text-sm font-medium text-gray-700">
                If you didn&apos;t use the focus strategy, why not?
              </label>
              <textarea
                id="strategy_response"
                name="strategy_response"
                rows={4}
                maxLength={500}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Write your response here (max 500 characters)..."
              ></textarea>
            </div>
          </>
        )}
        <div>
          <label htmlFor="open_response" className="block text-sm font-medium text-gray-700">
            Is there anything else you would like to add?
          </label>
          <textarea
            id="open_response"
            name="open_response"
            rows={4}
            maxLength={500}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Write your response here (max 500 characters)..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );  
}  