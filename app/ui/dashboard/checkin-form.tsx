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
import { useEffect } from 'react';

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

  const handleOtherCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checkbox_id: string, input_id: string) => {
    const otherCheckbox = document.getElementById(checkbox_id) as HTMLInputElement;
    const otherInput = document.getElementById(input_id) as HTMLInputElement;
    if (otherCheckbox.checked) {
      otherInput.required = true;
    } else {
      otherInput?.removeAttribute('required');
    }
  }

  const handleSubmit = async (formData: FormData) => {
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
      <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
        <label htmlFor="satisfaction_score" className="block text-sm font-medium text-gray-700">
          { dailyCompleted ?
            "How satisfied have you been with your days while using Rotational Focus Strategies?" :
            "How satisfied are you with today?" }
          <span className="text-red-500">*</span>
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
      <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
        <label htmlFor="productivity_score" className="block text-sm font-medium text-gray-700">
          {dailyCompleted ?
            "How productive did you feel while using Rotational Focus Strategies?" :
            "How productive did you feel today?" }
          <span className="text-red-500">*</span>
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
          <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
            <label htmlFor="gender_identity" className="block text-sm font-medium text-gray-700">
                What is your gender identity? <span className="text-red-500">*</span>
            </label> 
            <div className="mt-4 grid grid-cols-1 gap-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="gender_identity"
                        value="male"
                        className="form-checkbox text-indigo-600"
                    />
                    <span className="ml-2 text-sm">Male</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="gender_identity"
                        value="female"
                        className="form-checkbox text-indigo-600"
                    />
                    <span className="ml-2 text-sm">Female</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="gender_identity"
                        value="non_binary"
                        className="form-checkbox text-indigo-600"
                    />
                    <span className="ml-2 text-sm">Non-binary</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="gender_identity"
                        value="Transgender"
                        className="form-checkbox text-indigo-600"
                    />
                    <span className="ml-2 text-sm">Transgender</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="gender_identity"
                        value="prefer_not_to_say"
                        className="form-checkbox text-indigo-600"
                    />
                    <span className="ml-2 text-sm">Prefer not to say</span>
                </label>
                <label className="items-center inline-block">
                    <input
                        type="checkbox"
                        id="gender_identity_other_checkbox"
                        name="gender_identity"
                        value="other"
                        className="form-checkbox text-indigo-600"
                        onChange={(e) => handleOtherCheckboxChange(e, 'gender_identity_other_checkbox', 'gender_identity_other_input')}
                    />
                    <span className="ml-2 text-sm">Other</span>
                    <div className="mt-2">
                      <label htmlFor="gender_identity_other" className="ml-4 inline-block text-sm font-medium text-gray-700">
                        If other, please specify:
                        <input
                          type="text"
                          id="gender_identity_other_input"
                          name="gender_identity_other"
                          className="mr-2 mt-1 inline-block w-full shadow-sm text-sm border-gray-300 rounded-md"
                          placeholder="Specify your gender identity"
                        />
                      </label>
                    </div>
                </label>
            </div>
        </div>
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
        <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-150">
            <label htmlFor="racial_identity" className="block text-sm font-medium text-gray-700">
            What is your racial identity? (Select all that apply) <span className="text-red-500">*</span>
            </label>
            <div className="text-red-500 text-sm" id="racial_identity_error" style={{ display: 'none' }}>
              Please select at least one option.
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="flex items-center">
                <input
                type="checkbox"
                name="racial_identity"
                value="american_indian_or_alaska_native"
                className="form-checkbox text-indigo-600"
                />
                <span className="ml-2 text-sm">American Indian or Alaska Native</span>
            </label>
            <label className="flex items-center">
                <input
                type="checkbox"
                name="racial_identity"
                value="asian"
                className="form-checkbox text-indigo-600"
                />
                <span className="ml-2 text-sm">Asian</span>
            </label>
            <label className="flex items-center">
                <input
                type="checkbox"
                name="racial_identity"
                value="black_or_african_american"
                className="form-checkbox text-indigo-600"
                />
                <span className="ml-2 text-sm">Black or African American</span>
            </label>
            <label className="flex items-center">
                <input
                type="checkbox"
                name="racial_identity"
                value="native_hawaiian_or_other_pacific_islander"
                className="form-checkbox text-indigo-600"
                />
                <span className="ml-2 text-sm">Native Hawaiian or Other Pacific Islander</span>
            </label>
            <label className="flex items-center">
                <input
                type="checkbox"
                name="racial_identity"
                value="white"
                className="form-checkbox text-indigo-600"
                />
                <span className="ml-2 text-sm">White</span>
            </label>
            <label className="flex items-center">
                <input
                type="checkbox"
                name="racial_identity"
                value="prefer_not_to_say"
                className="form-checkbox text-indigo-600"
                />
                <span className="ml-2 text-sm">Prefer not to say</span>
            </label>
            <label className="items-center inline-block">
                <input
                type="checkbox"
                id="racial_identity_other_checkbox"
                name="racial_identity"
                value="other"
                className="form-checkbox text-indigo-600"
                onChange={(e) => handleOtherCheckboxChange(e, 'racial_identity_other_checkbox', 'racial_identity_other_input')}
                />
                <span className="ml-2 text-sm">Other</span>
                <div className="mt-2">
                  <label htmlFor="racial_identity_other" className="ml-4 inline-block text-sm font-medium text-gray-700">
                    If other, please specify:
                      <input
                        type="text"
                        id="racial_identity_other_input"
                        name="racial_identity_other"
                        className="mr-2 mt-1 inline-block w-full shadow-sm text-sm border-gray-300 rounded-md"
                        placeholder="Specify your racial identity"
                      />
                  </label>
                </div>
            </label>
          </div>
        </div>
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