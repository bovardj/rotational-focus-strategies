import RFSLogo from "@/app/ui/rfs-logo";
import { UserButton } from "@clerk/nextjs";

const steps = [
  { label: "Choose 3 focus strategies" },
  { label: "Complete 3 days of baseline surveys" },
  { label: "Use a new strategy each day for 4 days" },
  { label: "Complete a short exit survey" },
];

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="relative mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
        <div className="w-32 text-white md:w-40">
          <RFSLogo />
        </div>
        <div className="absolute top-3 right-3 md:hidden">
          <UserButton />
        </div>
      </div>
      <div className="mt-2 flex flex-col flex-grow rounded-md bg-gray-50 px-4 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          How it works
        </p>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700">{step.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
