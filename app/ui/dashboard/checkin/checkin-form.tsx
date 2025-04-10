'use client';

import { useRouter } from 'next/navigation';
import {
    getBaselineSurveysExpected,
    getBaselineSurveysCompleted,
    getDailySurveysCompleted,
    getDailySurveysExpected,
    getDaysCompleted
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
import LikertScaleForm from '@/app/ui/dashboard/checkin/question-forms/likertScale-form';
import CheckboxForm from '@/app/ui/dashboard/checkin/question-forms/checkBox-form';
import { get } from 'http';
// import { useEffect } from 'react';

interface CheckInFormProps {
  dailyCompleted: boolean;
  baselineCompleted: boolean;
}

// const handleCheckboxRequirement = (checkboxName: string) => useEffect(() => {
//   const form = document.querySelector('form');
//   const errorDiv = document.getElementById(`${checkboxName}_error`);
//   const handleFormSubmit = (e: Event) => {
//       const checkboxes = document.querySelectorAll(`input[name="${checkboxName}"]:checked`);
//       if (checkboxes.length === 0) {
//           e.preventDefault();
//           if (errorDiv) errorDiv.style.display = 'block';
//       } else {
//           if (errorDiv) errorDiv.style.display = 'none';
//       }
//   };
//   if (form) {
//       form.addEventListener('submit', handleFormSubmit);
//   }
//   return () => {
//       if (form) {
//           form.removeEventListener('submit', handleFormSubmit);
//       }
//   };
// }, []);

// handleCheckboxRequirement('racial_identity');
// handleCheckboxRequirement('gender_identity');



export default function CheckInForm({ dailyCompleted, baselineCompleted }: CheckInFormProps) {
  const router = useRouter();

  // const handleOtherCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checkbox_id: string, input_id: string) => {
  //   const otherCheckbox = document.getElementById(checkbox_id) as HTMLInputElement;
  //   const otherInput = document.getElementById(input_id) as HTMLInputElement;
  //   if (otherCheckbox.checked) {
  //     otherInput.required = true;
  //   } else {
  //     otherInput?.removeAttribute('required');
  //   }
  // }

  // const handleClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const selectedRaces = formData.getAll('racial_identity');
  //   console.log(selectedRaces);
  // }

  // const handleSubmit = async (formData: FormData) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const formData = new FormData(form);
    const checkedGenders = formData.getAll('gender_identity');
    if (checkedGenders.length === 0) {
      e.preventDefault();
      alert('Please select at least one gender identity.');
      return;
    }
    const checkedRaces = formData.getAll('racial_identity');
    if (checkedRaces.length === 0) {
      e.preventDefault();
      alert('Please select at least one racial identity.');
      return;
    }

    const submitButton = document.getElementById('form_submit_button') as HTMLButtonElement;
    if (submitButton) {
      submitButton.innerText = 'Submitting...';
      submitButton.disabled = true;
      submitButton.classList.add('opacity-50');
    }

    const baselineSurveysExpected = await getBaselineSurveysExpected();
    const baselineSurveysCompleted = await getBaselineSurveysCompleted();
    const dailySurveysExpected = await getDailySurveysExpected();
    const dailySurveysCompleted = await getDailySurveysCompleted();
    const daysCompleted = await getDaysCompleted();
    const endSurveyCompleted = await getEndSurveyCompleted();
    let settingDailyCompleted = false;


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
      console.log('Submitting end survey');
      const res = await insertEndSurvey(formData);
      if (res?.message) {
        await setEndSurveyCompleted();
        console.log('End survey submitted successfully');
      }
    }

    if (settingDailyCompleted && !endSurveyCompleted) {
      router.push('/dashboard/checkin');
    } else {
      router.push('/dashboard')
    }
  }

  return (
    // <form action={handleSubmit}>
    <form onSubmit={handleSubmit}>
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
        {/* Satisfaction radio button question */}
        <LikertScaleForm
          inputName='satisfaction_score'
          likertScale={['Very dissatisfied', 'Somewhat dissatisfied', 'Neutral', 'Somewhat satisfied', 'Very satisfied']}
          question='How satisfied are you with today?'
          questionAlt='How satisfied have you been with your days while using Rotational Focus Strategies?'
          condition={dailyCompleted}
          />

        {/* Productivity radio button question */}
        <LikertScaleForm
          inputName='productivity_score'
          likertScale={['Very unproductive', 'Somewhat unproductive', 'Neutral', 'Somewhat productive', 'Very productive']}
          question='How productive did you feel today?'
          questionAlt='How productive did you feel while using Rotational Focus Strategies?'
          condition={dailyCompleted}
        />
        {/* Usefulness radio button question */}
        { baselineCompleted && dailyCompleted && (
        <LikertScaleForm
          inputName='usefulness_score'
          likertScale={['Very useless', 'Somewhat useless', 'Neutral', 'Somewhat useful', 'Very useful']}
          question='How useful did you feel that rotating focus strategies was?'
        />
        )}
      { baselineCompleted && !dailyCompleted && (
        <>
          <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
            <label htmlFor="used_strategy" className="block text-sm font-medium text-gray-700">
              Did you use the assigned focus strategy today? <span className="text-red-500">*</span>
            </label>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="used_strategy"
                  value="yes"
                  className="form-radio text-indigo-600"
                  required
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
          <div className="rounded-lg bg-gray-50 p-4 md:pt-0">
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
      { dailyCompleted && (
        <>
          <CheckboxForm
            inputName='gender_identity'
            options={['Woman', 'Man', 'Non-binary', 'Transgender', 'Prefer not to say']}
            addOther={true}
            otherPlaceholder='Specify your gender identity'
            question='What is your gender identity? (Select all that apply)'
          />

          <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
            <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700">
                What is your ethnicity? <span className="text-red-500">*</span>
            </label>
            <div className="mt-4 grid grid-cols-1 gap-4">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="ethnicity"
                        value="hispanic_or_latino"
                        className="form-radio text-indigo-600"
                        required
                    />
                    <span className="ml-2 text-sm">Hispanic or Latino</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="ethnicity"
                        value="not_hispanic_or_latino"
                        className="form-radio text-indigo-600"
                    />
                    <span className="ml-2 text-sm">Not Hispanic or Latino</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="ethnicity"
                        value="prefer_not_to_say"
                        className="form-radio text-indigo-600"
                    />
                    <span className="ml-2 text-sm">Prefer not to say</span>
                </label>
            </div>
          </div>

          <CheckboxForm
            inputName='racial_identity'
            options={[
              'American Indian or Alaska Native',
              'Asian', 'Black or African American',
              'Native Hawaiian or Other Pacific Islander',
              'White',
              'Prefer not to say'
            ]}
            addOther={true}
            otherPlaceholder='Specify your racial identity'
            question='What is your racial identity? (Select all that apply)'
          />
        </>
      )}
        <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
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
          id="form_submit_button"
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );  
}  