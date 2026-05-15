import Collapse from "@/app/ui/components/collapse";
import Link from "next/link";

export default function CollapseNotes() {
  return (
    <div>
      <Collapse shadow title="Notes and Known Issues" className="bg-gray-50">
        <div>
          <p className="italic underline mb-4 text-md">
            Install as a Progressive Web App
          </p>
          <p className="mb-4 text-md">
            If you would like to install this as a Progressive Web App (PWA),
            you can do so by
          </p>
          <ul className="list-disc list-inside mb-4 text-md">
            <li>
              <b>iOS:</b>&nbsp;click the share button in Safari and select &quot;Add
              to Home Screen&quot;
            </li>
            <li>
              <b>Android:</b>&nbsp;click the three dots in the top right corner of
              Chrome and select &quot;Install App&quot; (I believe Firefox is
              the same)
            </li>
            <li>
              <b>Further information:</b>&nbsp;A useful guide to installing the app
              as a PWA can be found&nbsp;
              <Link
                href="https://www.cdc.gov/niosh/mining/tools/installpwa.html"
                className="text-blue-500 hover:underline"
              >
                here
              </Link>
              .
            </li>
          </ul>
          <p className="italic underline mb-4 text-md">
            Looking for the log out button?
          </p>
          <p className="mb-4 text-md">
            You can find it, along with account management, in the top right
            corner of the page.
          </p>
          <p className="italic underline mb-4 text-md">Slow loading times?</p>
          <p className="mb-4 text-md">
            This app may be a little slow--I apologize for that. I am working on
            improving the performance of the app.
          </p>
          <p className="italic underline mb-4 text-md">Want notifications?</p>
          <p className="mb-4 text-md">
            You can enable push notifications from the{" "}
            <Link href="/dashboard/notifications" className="text-blue-500 hover:underline">
              Notifications
            </Link>{" "}
            page.
          </p>
        </div>
      </Collapse>
    </div>
  );
}
