import Table from '@/app/ui/strategies/table';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/button';
 
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
      <div className="mt-5 flex w-full justify-center">
        <form action="/onboarding" method="GET">
          <Button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Continue onboarding
          </Button>
        </form>
      </div>
    </div>
  );
}