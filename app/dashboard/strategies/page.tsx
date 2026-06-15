import StrategyCards from "@/app/ui/strategies/table";
import { lusitana } from "@/app/ui/fonts";

export const metadata = {
  title: "RFS | Focus Strategies",
  description: "A page listing all supported focus strategies",
};

export default async function Page() {
  return (
    <main>
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold`}>Focus Strategies</h1>
        <StrategyCards />
      </div>
    </main>
  );
}
