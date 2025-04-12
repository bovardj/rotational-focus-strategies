import TableData from '@/app/ui/strategies/table-data';
import { strategyDictionary } from '@/app/lib/utils';

export default async function StrategiesTable() {

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-900">
              <tbody className="whitespace-nowrap px-3 py-3">
                {strategyDictionary?.map((strat) => (
                  <tr key={strat.name} className="flex items-center justify-between">
                    <td className="flex items-center justify-start gap-2">
                      <TableData strategy={strat.name} />
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
