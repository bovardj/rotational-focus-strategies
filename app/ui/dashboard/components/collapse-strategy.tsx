"use client";

import { Collapse } from "@geist-ui/react";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";

export default function CollapseStrategy({
  strategyList: strategyList,
}: {
  strategyList: { name: string; href: string }[];
}) {
  return (
    <>
      <div>
        <Collapse shadow title="Your Focus Strategies" className="bg-gray-50">
          {strategyList.map((strategy, index) => (
            <div key={index} className="flex items-center">
              <Collapse shadow title={strategy.name} className="bg-gray-50">
                <StrategyDescriptions strategy={strategy.href} />
              </Collapse>
            </div>
          ))}
        </Collapse>
      </div>
    </>
  );
}
