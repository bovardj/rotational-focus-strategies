import TableData from '@/app/ui/dashboard/table-data';
import { strategyDictionary } from '@/app/lib/utils';
import { fetchUserStrategies } from '@/app/lib/data';
import { currentUser } from '@clerk/nextjs/server';

export default async function StrategiesTable() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  const userStrategies = await fetchUserStrategies(userId);
  
  const strategyNames = strategyDictionary.map((strategy) => {
    const matchedStrategy = userStrategies.some(
      (userStrategy) =>
        userStrategy.includes(strategy.href)) ? strategy : null;
    return matchedStrategy ? strategy.name : null;
  }).filter((name) => name !== null);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0 grid gap-6 md:w-3/4 lg:w-2/3 xl:w-1/2">
            <div className='px-4 pt-4'>
            <p className="mb-4 text-lg md:text-xl underline">
              Your Focus Strategies
            </p>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-900">
              <tbody className="whitespace-nowrap px-3 py-3">
                {strategyNames?.map((strat, index) => (
                  <tr key={index} className="flex items-center justify-between">
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