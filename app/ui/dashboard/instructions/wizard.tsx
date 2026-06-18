"use client";

import { useState } from "react";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";

interface WizardProps {
  baselineSurveysExpected: number;
  dailySurveysExpected: number;
}

const STEP_TITLES = ["Welcome", "General", "Study Phases", "Optional & Help"];

function WelcomeStep() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        This app is part of a research study on focus strategies for people with ADHD.
        Here&apos;s what to expect over the next 7 days.
      </p>
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-blue-800 text-white text-xs flex items-center justify-center font-bold">1</span>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Days 1–3 — Baseline:</span> Go about your day normally and complete a short survey at the end of each day.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-blue-800 text-white text-xs flex items-center justify-center font-bold">2</span>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Days 4–7 — Strategies:</span> Use your assigned focus strategy for the day, then complete the daily survey.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-blue-800 text-white text-xs flex items-center justify-center font-bold">✓</span>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Day 7 — Exit Survey:</span> A short final survey, then you&apos;re done!
          </p>
        </div>
      </div>
    </div>
  );
}

function GeneralStep() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Questions? Email{" "}
        <a href="mailto:john@johnbovard.dev" className="text-blue-800 underline hover:text-blue-900">
          john@johnbovard.dev
        </a>
        .
      </p>
      <p className="text-sm text-gray-600">
        This study rotates focus strategies to measure their effect on productivity and self-satisfaction.
        Start as soon as you can — weekends count, but feel free to note unusual days in the survey.
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Missed a survey?</span> You can still submit it — just select
        the correct date. Completing it soon after each day keeps your responses accurate.
      </p>
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-1.5">
        <p className="text-xs font-semibold text-blue-900 mb-2">Keep in mind:</p>
        <p className="text-sm text-gray-700">· You may not receive every strategy you selected.</p>
        <p className="text-sm text-gray-700">· The same strategy can repeat on back-to-back days.</p>
        <p className="text-sm text-gray-700">· New strategies are assigned at 1am MT (3am ET).</p>
      </div>
    </div>
  );
}

function PhasesStep({ baseline, daily }: { baseline: number; daily: number }) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-px bg-blue-200" aria-hidden="true" />
      <div>
        <div className="flex gap-4 pb-7">
          <div className="h-10 w-10 rounded-full bg-blue-800 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 relative z-10">
            1
          </div>
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="font-semibold text-gray-900 text-sm">Baseline Days</p>
              <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-2 py-0.5 font-medium">
                {baseline} days
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Go about your day as normal. Complete a{" "}
              <span className="font-medium text-gray-800">Baseline Survey</span> at the end of each day.
            </p>
          </div>
        </div>

        <div className="flex gap-4 pb-7">
          <div className="h-10 w-10 rounded-full bg-blue-800 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 relative z-10">
            2
          </div>
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="font-semibold text-gray-900 text-sm">Assigned Strategy Days</p>
              <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-2 py-0.5 font-medium">
                {daily} days
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Use your assigned focus strategy for the day. Complete the{" "}
              <span className="font-medium text-gray-800">Daily Survey</span> in the evening.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-green-700 text-white flex items-center justify-center text-base flex-shrink-0 relative z-10">
            ✓
          </div>
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="font-semibold text-gray-900 text-sm">Exit Survey</p>
              <span className="text-xs bg-green-50 text-green-800 border border-green-200 rounded-full px-2 py-0.5 font-medium">
                You&apos;re done!
              </span>
            </div>
            <p className="text-sm text-gray-600">
              After your final daily survey, complete the short{" "}
              <span className="font-medium text-gray-800">Exit Survey</span>. Your data will be
              anonymized within one week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionalStep() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-2">Install as a Progressive Web App</p>
        <p className="text-sm text-gray-600 mb-3">
          Installing the app lets you open it from your home screen and enables push notifications on mobile.
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li>
            <span className="font-medium text-gray-800">iOS:</span> Safari → Share → Add to Home Screen
          </li>
          <li>
            <span className="font-medium text-gray-800">Android:</span> Chrome → ⋮ → Install App
          </li>
          <li>
            <span className="font-medium text-gray-800">Further information:</span>{" "}
            <Link
              href="https://www.cdc.gov/niosh/mining/tools/installpwa.html"
              className="text-blue-800 underline hover:text-blue-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              a useful installation guide
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900 mb-2">Push Notifications</p>
        <p className="text-sm text-gray-600 mb-2 italic">
          Currently limited — you can demo the feature and send a test notification, but scheduled
          notifications are not active on the free-tier hosting plan.
        </p>
        <p className="text-sm text-gray-600">
          Enable from the{" "}
          <Link href="/dashboard/notifications" className="text-blue-800 underline hover:text-blue-900">
            Notifications
          </Link>{" "}
          page. Requires PWA install on mobile; on iOS the app must be added to your home screen.
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900 mb-2">Questions, Bugs &amp; Help</p>
        <p className="text-sm text-gray-600">
          Email{" "}
          <a href="mailto:john@johnbovard.dev" className="text-blue-800 underline hover:text-blue-900">
            john@johnbovard.dev
          </a>
          . For bugs, include a screenshot, what you were doing, and your browser and device. Thank you!
        </p>
      </div>
    </div>
  );
}

export default function InstructionsWizard({ baselineSurveysExpected, dailySurveysExpected }: WizardProps) {
  const [step, setStep] = useState(0);
  const total = STEP_TITLES.length;

  return (
    <div>
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-8" role="tablist" aria-label="Step progress">
        {STEP_TITLES.map((title, i) => (
          <div
            key={i}
            role="tab"
            aria-selected={i === step}
            aria-label={title}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === step
                ? "w-6 bg-blue-800"
                : i < step
                ? "w-2 bg-blue-400"
                : "w-2 bg-gray-200"
            }`}
          />
        ))}
        <span className="ml-auto text-xs text-gray-600">{step + 1} of {total}</span>
      </div>

      {/* Step content */}
      <div className="min-h-52">
        <h2 className={`${lusitana.className} text-xl font-bold text-gray-900 mb-5`}>
          {STEP_TITLES[step]}
        </h2>
        {step === 0 && <WelcomeStep />}
        {step === 1 && <GeneralStep />}
        {step === 2 && (
          <PhasesStep
            baseline={baselineSurveysExpected}
            daily={dailySurveysExpected}
          />
        )}
        {step === 3 && <OptionalStep />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            step === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
          }`}
        >
          ← Back
        </button>
        {step < total - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="text-sm font-medium px-5 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
          >
            Next →
          </button>
        ) : (
          <Link
            href="/dashboard"
            className="text-sm font-medium px-5 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
          >
            Got it — go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
