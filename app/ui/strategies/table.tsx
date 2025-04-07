import Image from 'next/image';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import TableData from '@/app/ui/strategies/table-data';

export default async function InvoicesTable() {
  const strategies = [
    "Background Sound",
    "Check List",
    "Chunking",
    "Daily Planner",
    "Environmental Shift",
    "Pomodoro Timer",
    "Small Rewards",
    "Task Switching",
    "Work Partners",
  ]
  const strategyMap = {
    background_sound: "Background Sound",
    check_list: "Check List",
    chunking: "Chunking",
    daily_planner: "Daily Planner",
    environmental_shift: "Environmental Shift",
    pomodoro_timer: "Pomodoro Timer",
    small_rewards: "Small Rewards",
    task_switching: "Task Switching",
    work_partners: "Work Partners",
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <p className="mb-4 text-xl md:text-2xl">Strategy</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-900">
              <tbody className="whitespace-nowrap px-3 py-3">

                {strategies?.map((strat) => (
                  <tr key={strat} className="flex items-center justify-between">
                    <td className="flex items-center justify-start gap-2">
                      <TableData strategy={strat} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
            {/* {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
              </div>
            ))} */}
          {/* </div>
          <table className="hidden min-w-full text-gray-900 md:table"> */}
            {/* <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead> */}
            {/* <tbody className="bg-white"> */}
            {/* <tbody className="whitespace-nowrap px-3 py-3">
              <NavLinks /> */}
              {/* <tr className="mb-4 text-xl md:text-2xl">
                <td>{strategies[0]}</td>
              </tr> */}



              {/* {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))} */}
            {/* </tbody> */}
          {/* </table>
        </div>
      </div>
    </div>
  );
} */}
