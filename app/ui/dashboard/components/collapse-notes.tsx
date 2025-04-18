'use client'

import Collapse from '@geist-ui/react/esm/collapse/collapse'
import Link from 'next/link'

export default function CollapseNotes() {

    return (
      <div>
        <Collapse shadow title="Notes and Known Issues" className='bg-gray-50'>
        <div>
          <p className="italic underline mb-4 text-md">
            Install as a Progressive Web App
          </p>
          <p className="mb-4 text-md">
            If you would like to install this as a Progressive Web App (PWA), you can do so by
          </p>
          <ul className="list-disc list-inside mb-4 text-md">
            <li>
              <b>iOS:</b> click the share button in Safari and select &quot;Add to Home Screen&quot;
            </li>
            <li>
              <b>Android:</b> click the three dots in the top right corner of Chrome and select &quot;Install App&quot;
              (I believe Firefox is the same)
            </li>
            <li>
              <b>Further information:</b> A useful guide to installing the app as a PWA can be found&nbsp;
              <Link href="https://www.cdc.gov/niosh/mining/tools/installpwa.html" className="text-blue-500 hover:underline">
              here</Link>.
            </li>
          </ul>
          <p className="italic underline mb-4 text-md">
            Looking for the log out button?
          </p>
          <p className="mb-4 text-md">
            You can find it, along with account management, in the top right corner of the page.
          </p>
          <p className="italic underline mb-4 text-md">
            Slow loading times?
          </p>
          <p className="mb-4 text-md">
            This app may be a little slow--I apologize for that. I am working on improving the performance of the app.
          </p>
          <p className="italic underline mb-4 text-md">
            Want notifications?
          </p>
          <p className="mb-4 text-md">
            Unfortunately, notifications are not supported at this time.
          </p>
          <p className="italic underline mb-4 text-md">
            Multiple strategies assigned in a single day?
          </p>
          <p className="mb-4 text-md">
            I have seen a bug where sometimes when you refresh the dashboard page, it assigns a new focus strategy every time.
            This is a bug that I am working on fixing. If you see this, please let me know. I can fix this on my end until I can
            get a more permanent fix in place.
          </p>
          {/* <p className="italic underline mb-4 text-md">
            Progressive Web App functionality and Notifications coming Soon!
          </p>
          <p className="mb-4 text-md">
            In the mean time, it will work just about as well in a web browser. Thank you for your patience!
          </p> */}
          <p className="hidden mb-4 text-md">
            While completely optional, you may install this app onto your device, such as a smartphone or computer,
            as a Progressive Web App (PWA) if you would like. A useful guide to installing the app as a PWA can be found&nbsp;
            <Link href="https://www.cdc.gov/niosh/mining/tools/installpwa.html" className="text-blue-500 hover:underline">
            here</Link>.
          </p>
        </div>
        </Collapse>
      </div>
    )
}