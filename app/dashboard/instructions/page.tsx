import { getDashboardCounts } from "@/app/dashboard/survey/_data";
import { lusitana } from "@/app/ui/fonts";
import InstructionsWizard from "@/app/ui/dashboard/instructions/wizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RFS | Instructions",
  description: "Study instructions for Rotational Focus Strategies.",
};

export default async function InstructionsPage() {
  const counts = await getDashboardCounts();
  const baselineSurveysExpected = counts?.baselineSurveysExpected ?? 3;
  const dailySurveysExpected = counts?.dailySurveysExpected ?? 4;

  return (
    <main>
      <h1 className={`${lusitana.className} mb-6 text-2xl font-bold`}>Instructions</h1>
      <InstructionsWizard
        baselineSurveysExpected={baselineSurveysExpected}
        dailySurveysExpected={dailySurveysExpected}
      />
    </main>
  );
}
