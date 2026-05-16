import Collapse from "@/app/ui/components/collapse";
import Link from "next/link";

export default function CollapseNotes() {
  return (
    <Collapse shadow title="Notes and Known Issues" className="bg-gray-50">
      <div>
        <p className="font-semibold mb-2">Install as a Progressive Web App</p>
        <p className="mb-4 text-sm">
          If you would like to install this as a Progressive Web App (PWA),
          you can do so by:
        </p>
        <ul className="list-disc list-inside mb-4 text-sm">
          <li>
            <span className="font-semibold">iOS:</span>&nbsp;click the share button in Safari and select &quot;Add
            to Home Screen&quot;
          </li>
          <li>
            <span className="font-semibold">Android:</span>&nbsp;click the three dots in the top right corner of
            Chrome and select &quot;Install App&quot; (I believe Firefox is
            the same)
          </li>
          <li>
            <span className="font-semibold">Further information:</span>&nbsp;A useful guide to installing the app
            as a PWA can be found&nbsp;
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
        <p className="font-semibold mb-2">Looking for the log out button?</p>
        <p className="mb-4 text-sm">
          You can find it, along with account management, in the top right
          corner of the page.
        </p>
        <p className="font-semibold mb-2">Slow loading times?</p>
        <p className="mb-4 text-sm">
          This app may be a little slow — I apologize for that. I am working on
          improving the performance of the app.
        </p>
        <p className="font-semibold mb-2">Want notifications?</p>
        <p className="text-sm">
          You can enable push notifications from the{" "}
          <Link
            href="/dashboard/notifications"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Notifications
          </Link>{" "}
          page.
        </p>
      </div>
    </Collapse>
  );
}
