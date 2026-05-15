"use client";

import { Collapse } from "@geist-ui/react";
import { strategyDictionary } from "@/app/lib/utils";
import { parseDateString } from "@/app/lib/utils";

interface CollapsePreviousStrategyProps {
  previousStrategyList: {
    strategy: string;
    date: string;
  }[];
}

export default function CollapsePreviousStrategy({
  previousStrategyList,
}: CollapsePreviousStrategyProps) {
  return (
    <>
      <div>
        <Collapse
          shadow
          title="Previously Assigned Strategies"
          className="bg-gray-50"
        >
          <table className="min-w-full text-gray-900">
            <tbody className="whitespace-nowrap px-3 py-3">
              {previousStrategyList.map((strategy, index) => (
                <tr key={index} className="flex items-center justify-between">
                  <td className="flex items-center justify-start gap-2">
                    {
                      strategyDictionary.find(
                        (strat) => strat.href === strategy.strategy
                      )?.name
                    }
                  </td>
                  <td>{parseDateString(strategy.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {previousStrategyList.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              <i>No strategies have been assigned yet.</i>
            </p>
          )}
        </Collapse>
      </div>
    </>
  );
}
