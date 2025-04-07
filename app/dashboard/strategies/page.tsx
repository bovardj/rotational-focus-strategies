import Table from '@/app/ui/strategies/table';
import { lusitana } from '@/app/ui/fonts';
 
export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Strategies</h1>
        </div>
            <div className="hidden md:block mt-4 w-full">
                <Table />
            </div>
            <div className="block md:hidden mt-4 w-full">
                <Table />
            </div>



        {/* <div className="block md:hidden mt-4">
          <Table />
        </div> */}
      {/* </div> */}
      {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div> */}
       {/* <Suspense fallback={<InvoicesTableSkeleton />}> */}
        {/* <Table /> */}
      {/* </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}