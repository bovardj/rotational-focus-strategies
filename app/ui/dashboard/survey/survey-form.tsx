"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getBaselineSurveysExpected,
  getBaselineSurveysCompleted,
  getDailySurveysCompleted,
  getDailySurveysExpected,
  getDaysCompleted,
  getEndSurveyCompleted,
} from "@/app/dashboard/survey/_data";
import {
  insertBaselineSurvey,
  setBaselineSurveysCompleted,
  setBaselineCompleted,
  insertDailySurvey,
  setDailySurveysCompleted,
  setDailyCompleted,
  insertEndSurvey,
  setEndSurveyCompleted,
} from "@/app/dashboard/survey/_actions";
import LikertScaleForm from "@/app/ui/dashboard/survey/question-forms/likertScale-form";
import CheckboxForm from "@/app/ui/dashboard/survey/question-forms/checkBox-form";
import { Button } from "@/app/ui/button";

interface SurveyFormProps {
  dailyCompleted: boolean;
  baselineCompleted: boolean;
}

export default function SurveyForm({
  dailyCompleted,
  baselineCompleted,
}: SurveyFormProps) {
  const router = useRouter();
  const [validationError, setValidationError] = useState("");

  const handleNoRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    radio_id: string,
    input_id: string
  ) => {
    const noRadio = document.getElementById(radio_id) as HTMLInputElement;
    const noInput = document.getElementById(input_id) as HTMLInputElement;
    if (noRadio.checked) {
      noInput.required = true;
    } else {
      noInput?.removeAttribute("required");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setValidationError("");
    const submitButton = document.getElementById(
      "form_submit_button"
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.innerText = "Submitting...";
      submitButton.disabled = true;
      submitButton.classList.add("opacity-50");
    }

    const resetSubmit = () => {
      if (submitButton) {
        submitButton.innerText = "Submit";
        submitButton.disabled = false;
        submitButton.classList.remove("opacity-50");
      }
    };

    if (dailyCompleted) {
      const checkedGenders = formData.getAll("gender_identity");
      if (checkedGenders.length === 0) {
        setValidationError("Please select at least one gender identity.");
        resetSubmit();
        return;
      }
      const checkedRaces = formData.getAll("racial_identity");
      if (checkedRaces.length === 0) {
        setValidationError("Please select at least one racial identity.");
        resetSubmit();
        return;
      }
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
        if (baselineSurveysCompleted + 1 >= baselineSurveysExpected) {
          await setBaselineCompleted();
        }
      }
    } else if (!dailyCompleted) {
      const res = await insertDailySurvey(formData);
      if (res?.message) {
        await setDailySurveysCompleted(
          dailySurveysCompleted + 1,
          daysCompleted + 1
        );
        if (dailySurveysCompleted + 1 >= dailySurveysExpected) {
          await setDailyCompleted();
          settingDailyCompleted = true;
        }
      }
    } else {
      const res = await insertEndSurvey(formData);
      if (res?.message) {
        await setEndSurveyCompleted();
      }
    }

    if (settingDailyCompleted && !endSurveyCompleted) {
      submitButton.innerText = "Submit";
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-50");
      router.push("/dashboard/survey");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form action={handleSubmit}>
      <div className="max-w-2xl space-y-4">
        {(!baselineCompleted || !dailyCompleted) && (
          <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-200">
            <label
              htmlFor="submission_date"
              className="block text-sm font-medium text-gray-700"
            >
              What day is this for?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="submission_date"
              name="submission_date"
              defaultValue={new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" })}
              className="mt-2 block w-full text-sm border border-gray-200 rounded-md px-3 py-2"
              required
            />
          </div>
        )}
        {/* Satisfaction radio button question */}
        <LikertScaleForm
          inputName="satisfaction_score"
          likertScale={[
            "Very dissatisfied",
            "Somewhat dissatisfied",
            "Neutral",
            "Somewhat satisfied",
            "Very satisfied",
          ]}
          question="How satisfied are you with today?"
          questionAlt="How satisfied have you been with your days while using Rotational Focus Strategies?"
          condition={dailyCompleted}
        />

        {/* Productivity radio button question */}
        <LikertScaleForm
          inputName="productivity_score"
          likertScale={[
            "Very unproductive",
            "Somewhat unproductive",
            "Neutral",
            "Somewhat productive",
            "Very productive",
          ]}
          question="How productive did you feel today?"
          questionAlt="How productive did you feel while using Rotational Focus Strategies?"
          condition={dailyCompleted}
        />
        {/* Usefulness radio button question */}
        {baselineCompleted && dailyCompleted && (
          <LikertScaleForm
            inputName="usefulness_score"
            likertScale={[
              "Very useless",
              "Somewhat useless",
              "Neutral",
              "Somewhat useful",
              "Very useful",
            ]}
            question="How useful did you feel that rotating focus strategies was?"
          />
        )}
        {baselineCompleted && !dailyCompleted && (
          <>
            <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-200">
              <label
                htmlFor="used_strategy"
                className="block text-sm font-medium text-gray-700"
              >
                Did you use the assigned focus strategy today?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <label className="flex items-center">
                  <input
                    id="yes_used_strategy"
                    type="radio"
                    name="used_strategy"
                    value="yes"
                    className="form-radio text-blue-800"
                    required
                  />
                  <span className="ml-2 text-sm">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    id="no_used_strategy"
                    type="radio"
                    name="used_strategy"
                    value="no"
                    className="form-radio text-blue-800"
                    onChange={(e) =>
                      handleNoRadioChange(
                        e,
                        "no_used_strategy",
                        "strategy_response"
                      )
                    }
                  />
                  <span className="ml-2 text-sm">No</span>
                </label>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-200">
              <label
                htmlFor="strategy_response"
                className="block text-sm font-medium text-gray-700"
              >
                If you didn&apos;t use the focus strategy, why not?{" "}
                <span className="italic"> (required if no is selected)</span>
              </label>
              <textarea
                id="strategy_response"
                name="strategy_response"
                rows={4}
                maxLength={500}
                className="mt-2 block w-full text-sm border border-gray-200 rounded-md px-3 py-2"
                placeholder="Write your response here (max 500 characters)..."
              ></textarea>
            </div>
          </>
        )}
        {dailyCompleted && (
          <>
            <CheckboxForm
              inputName="gender_identity"
              options={[
                "Woman",
                "Man",
                "Nonbinary",
                "Transgender",
                "Prefer not to say",
              ]}
              addOther={true}
              otherPlaceholder="Specify your gender identity"
              question="What is your gender identity? (Select all that apply)"
            />

            <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-200">
              <label
                htmlFor="ethnicity"
                className="block text-sm font-medium text-gray-700"
              >
                What is your ethnicity? <span className="text-red-500">*</span>
              </label>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ethnicity"
                    value="hispanic_or_latino"
                    className="form-radio text-blue-800"
                    required
                  />
                  <span className="ml-2 text-sm">Hispanic or Latino</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ethnicity"
                    value="not_hispanic_or_latino"
                    className="form-radio text-blue-800"
                  />
                  <span className="ml-2 text-sm">Not Hispanic or Latino</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ethnicity"
                    value="prefer_not_to_say"
                    className="form-radio text-blue-800"
                  />
                  <span className="ml-2 text-sm">Prefer not to say</span>
                </label>
              </div>
            </div>

            <CheckboxForm
              inputName="racial_identity"
              options={[
                "American Indian or Alaska Native",
                "Asian",
                "Black or African American",
                "Native Hawaiian or Other Pacific Islander",
                "White",
                "Prefer not to say",
              ]}
              addOther={true}
              otherPlaceholder="Specify your racial identity"
              question="What is your racial identity? (Select all that apply)"
            />
          </>
        )}
        <div className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-200">
          <label
            htmlFor="open_response"
            className="block text-sm font-medium text-gray-700"
          >
            Is there anything else you would like to add?{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="open_response"
            name="open_response"
            rows={4}
            maxLength={500}
            className="mt-2 block w-full text-sm border border-gray-200 rounded-md px-3 py-2"
            placeholder="Write your response here (max 500 characters)..."
          ></textarea>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          To ensure your submission is recorded, please do not close this page
          or navigate away after clicking submit. Your responses will be saved
          and you will be redirected when submission is complete.
        </p>
        <div role="alert" aria-live="assertive" className="text-sm text-red-800 min-h-[1.25rem] text-center">
          {validationError}
        </div>
        <Button
          type="submit"
          id="form_submit_button"
          className="flex mx-auto px-12"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
