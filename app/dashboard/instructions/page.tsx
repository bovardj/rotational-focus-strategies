import { getDashboardCounts } from "@/app/dashboard/survey/_data";
import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import InstructionsNavrail from "./navrail";

export const metadata = {
  title: "RFS | Instructions",
  description: "Study instructions for Rotational Focus Strategies.",
};

export default async function InstructionsPage() {
  const counts = await getDashboardCounts();
  const baselineSurveysExpected = counts?.baselineSurveysExpected ?? 3;
  const dailySurveysExpected = counts?.dailySurveysExpected ?? 4;

  return (
    <main className="relative">
      <h1 className={`${lusitana.className} mb-6 text-2xl font-bold`}>
        Instructions
      </h1>
      <div className="flex gap-12">
        <div className="min-w-0 flex-1 max-w-2xl">
          <div className="flex flex-col gap-10">

            <section id="general">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">General</h2>
              <p className="mb-4 text-sm text-gray-700">
                Please read the instructions carefully. If you have any questions,
                please feel free to reach out at{" "}
                <a
                  href="mailto:john@johnbovard.dev"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  john@johnbovard.dev
                </a>
                .
              </p>
              <p className="mb-4 text-sm text-gray-700">
                <span className="font-semibold">Timing:</span>&nbsp;Please start the
                study as soon as you can. I understand that some days, such as
                weekends, may not be normal &quot;productive&quot; times, but
                that&apos;s okay. If it is a day like that, you can make a note of it
                in that day&apos;s survey if you&apos;d like.
              </p>
              <p className="mb-4 text-sm text-gray-700">
                The purpose of this project is to see if rotating focus strategies
                assists in a feeling of self-satisfaction and productivity. Once
                baseline measurements are recorded, you will be assigned a random
                focus strategy (from your selected strategies) to use each day. Then,
                at the end of the day, you will be asked to complete a survey about
                your experience with that strategy.
              </p>
              <p className="mb-4 text-sm text-gray-700">
                <span className="font-semibold">
                  If you forget to complete the survey at the end of the day, you can
                  still complete it later.
                </span>
                &nbsp;You only need to select what day the survey is for in the
                survey. Please try to complete the survey as soon as possible after
                the end of each day, though.
              </p>
              <p className="text-sm font-semibold italic underline mb-2">Two Important Notes:</p>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
                <li>
                  While you will only be assigned Focus Strategies from your
                  selection, it is not guaranteed that you will be assigned all of
                  your focus strategies. Additionally, it is possible that you will be
                  assigned the same Focus Strategy two days in a row.
                </li>
                <li>
                  Please note that new focus strategies are assigned at 1am MT (3am
                  ET) each day.
                </li>
              </ul>
            </section>

            <section id="baseline">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Baseline Days (first {baselineSurveysExpected} days)
              </h2>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
                <li>Go about your day as you normally would.</li>
                <li>
                  At the end of the day, complete a Baseline Survey about your day.
                  <span className="italic">
                    {" "}
                    (Accessible from the &quot;Surveys&quot; button.)
                  </span>
                </li>
              </ul>
            </section>

            <section id="focus-strategy-days">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Assigned Focus Strategy Days (for {dailySurveysExpected} days after baseline)
              </h2>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
                <li>Try to use your assigned focus strategy for the day.</li>
                <li>
                  At the end of the day, complete the Daily Survey about your experience.
                  <span className="italic">
                    {" "}
                    (Accessible from the &quot;Surveys&quot; button.)
                  </span>
                </li>
                <li>
                  When you submit your last Daily Survey, you will be redirected to a brief Exit Survey.
                  If you navigate away, simply click the &quot;Surveys&quot; button to access it.
                </li>
              </ul>
            </section>

            <section id="last-day">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Last Day</h2>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
                <li>
                  When you submit your last Daily Survey, you will be redirected to a brief Exit Survey.
                  If you navigate away, simply click the &quot;Surveys&quot; button to access it.
                </li>
                <li>
                  <p className="mb-2">
                    I will delete all of your data from the app&apos;s database within
                    one week of your Exit Survey submission. Associations to your
                    email address or other potentially identifying information will be
                    deleted and data transferred to an anonymized spreadsheet for
                    analysis and reporting purposes.
                  </p>
                  <p>
                    While you can continue to use the app and get assigned strategies
                    after your last survey, this will no longer be the case once I
                    delete your data from the database.
                  </p>
                </li>
              </ul>
            </section>

            <section id="notes">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Optional Features</h2>
              <div className="flex flex-col gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold mb-1">Install as a Progressive Web App</p>
                  <p className="mb-2">
                    You can install this as a Progressive Web App (PWA), which is similar to installing a native app.
                    This allows you to open it from your home screen or app drawer, and can also enable push notifications
                    (see below). Here are instructions for installing the PWA on different platforms:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><span className="font-semibold">iOS:</span> click the share button in Safari and select &quot;Add to Home Screen&quot;</li>
                    <li><span className="font-semibold">Android:</span> click the three dots in the top right corner of Chrome and select &quot;Install App&quot;</li>
                    <li>
                      <span className="font-semibold">Further information:</span> a useful guide can be found{" "}
                      <Link
                        href="https://www.cdc.gov/niosh/mining/tools/installpwa.html"
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </Link>
                      .
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Want notifications?</p>
                  <p className="italic mb-2">
                    This is currently limited since I am running this site on a free-tier hosting service.
                    You can still demo the notification scheduling feature and send a test notification to yourself,
                    but beyond this, notifications will not actually be sent.
                  </p>
                  <p>
                    You can enable push notifications from the{" "}
                    <Link
                      href="/dashboard/notifications"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Notifications
                    </Link>{" "}
                    page (also available from the account menu on the left (desktop) or top right (mobile)).
                    Please note that on mobile devices, notifications only work if you have the app installed as a PWA,
                    and on iOS, the app must be installed to your home screen as a PWA&mdash;notifications do not work 
                    in Safari directly. On desktop, notifications should work as long as you have allowed notifications
                    for this site in your browser settings.
                  </p>
                </div>
              </div>
            </section>

            <section id="help">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Questions, Bug Reporting &amp; Help</h2>
              <p className="mb-3 text-sm text-gray-700">
                Have questions? Found a bug? Need help? Send me an email at{" "}
                <a
                  href="mailto:john@johnbovard.dev"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  john@johnbovard.dev
                </a>
                .
              </p>
              <p className="mb-2 text-sm text-gray-700">For bug reports, please include the following if possible:</p>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                <li>A screenshot of the error or unexpected behavior</li>
                <li>What you were doing when the issue occurred</li>
                <li>Your browser and device (e.g., Chrome on Windows, Safari on iPhone)</li>
                <li>Any other relevant details</li>
              </ul>
              <p className="mt-3 text-sm text-gray-700">Thank you for your help in making this app better!</p>
            </section>

          </div>

          <div className="mt-10 flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Got it — go to Dashboard</Button>
            </Link>
          </div>
        </div>

        <InstructionsNavrail />
      </div>
    </main>
  );
}
