'use client'

import Collapse from '@geist-ui/react/esm/collapse/collapse'
import Link from 'next/link'

export default function CollapseNotes() {

    return (
      <div className="grid gap-6 grid-cols-1 md:w-3/4 lg:w-2/3 xl:w-1/2">
        <Collapse shadow title="Notes and Known Issues" className='bg-gray-50'>
        <div>
          <p className="italic underline mb-4 text-md">
            Looking for the log out button?
          </p>
          <p className="mb-4 text-md">
            You can find it, along with account management, in the top right corner of the page.
          </p>
          <p className="italic underline mb-4 text-md">
            Multiple strategies assigned in a single day?
          </p>
          <p className="mb-4 text-md">
            I have seen a bug where sometimes when you refresh the dashboard page, it assigns a new focus strategy every time.
            This is a bug that I am working on fixing. If you see this, please let me know. I can fix this on my end until I can
            get a more permanent fix in place.
          </p>
          <p className="italic underline mb-4 text-md">
            Progressive Web App functionality coming Soon!
          </p>
          <p className="mb-4 text-md">
            In the mean time, it will work just as well in a web browser. Thank you for your patience!
          </p>
          <p className="hidden mb-4 text-md">
            While completely optional, you may install this app onto your device, such as a smartphone or computer,
            as a Progressive Web App (PWA) if you would like. A useful guide to installing the app as a PWA can be found&nbsp;
            <Link href="https://www.cdc.gov/niosh/mining/tools/installpwa.html" className="text-blue-500 hover:underline">
            here</Link>.
          </p>
          <p className="mb-4 text-md">
            Known issues:
          </p>
          <ul className="list-disc pl-6">
            <li className="mb-2">
            Sometimes there is an bug which assigns a new focus strategy every time you load the dashboard page.
            </li>
          </ul>
        </div>
        </Collapse>
      </div>
    )
}