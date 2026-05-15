import Collapse from "@/app/ui/components/collapse";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";

export default function CollapseStrategy({
  strategyList,
}: {
  strategyList: { name: string; href: string }[];
}) {
  return (
    <div>
      <Collapse shadow title="Your Focus Strategies" className="bg-gray-50">
        {strategyList.map((strategy, index) => (
          <Collapse key={index} shadow title={strategy.name} className="bg-gray-50">
            <StrategyDescriptions strategy={strategy.href} />
          </Collapse>
        ))}
      </Collapse>
    </div>
  );
}
