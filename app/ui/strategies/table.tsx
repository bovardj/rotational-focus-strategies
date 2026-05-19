import StrategyCard from "@/app/ui/strategies/table-data";
import { strategyDictionary } from "@/app/lib/utils";

const descriptions: Record<string, string> = {
  bg_sound: "Use ambient or instrumental audio in the background to create a productive sound environment.",
  check_list: "Break your work into a written list of tasks you can check off as you go.",
  chunking: "Divide large tasks into smaller, manageable pieces to reduce overwhelm.",
  environmental_shift: "Change your physical workspace or setting to reset your focus.",
  pomodoro: "Work in focused 25-minute sprints separated by short breaks.",
  small_rewards: "Motivate yourself with small treats or breaks tied to completing tasks.",
  task_switching: "Alternate between tasks to keep your mind fresh and sustain momentum.",
  work_partners: "Work near others — independently or collaboratively — to stay accountable.",
};

export default function StrategyCards() {
  return (
    <div className="mt-4 space-y-3">
      {strategyDictionary.map((strat) => (
        <StrategyCard
          key={strat.href}
          name={strat.name}
          href={strat.href}
          description={descriptions[strat.href] ?? ""}
        />
      ))}
    </div>
  );
}
