import RFSLogo from "@/app/ui/rfs-logo";
import UserNav from "@/app/ui/dashboard/user-nav";

const steps = [
  { label: "Choose 3 focus strategies you would like to use during the study" },
  { label: "Complete 3 baseline surveys—do what you would normally do during this time" },
  { label: "Try your assigned strategy each day—the app assigns it to you each day (4 days)" },
  { label: "Complete the exit survey to finish the study" },
];

function StudyOverviewLabel() {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
      Study Overview
    </p>
  );
}

function StudyOverviewSteps() {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            {i + 1}
          </span>
          <span className="text-sm text-gray-800">{step.label}</span>
        </li>
      ))}
    </ol>
  );
}

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="relative mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
        <div className="w-32 text-white md:w-40">
          <RFSLogo />
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 md:hidden">
          <UserNav compact />
        </div>
      </div>
      <div className="mt-2 flex flex-col rounded-md bg-gray-100">
        {/* Mobile: collapsible */}
        <details className="group md:hidden">
          <summary className="flex cursor-pointer select-none list-none items-center justify-between px-4 py-3">
            <StudyOverviewLabel />
            <svg
              className="h-4 w-4 text-gray-500 transition-transform duration-200 group-open:rotate-90"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </summary>
          <div className="px-4 py-3">
            <StudyOverviewSteps />
          </div>
        </details>

        {/* Desktop: always visible */}
        <div className="hidden md:block px-4 py-3">
          <div className="mb-3">
            <StudyOverviewLabel />
          </div>
          <StudyOverviewSteps />
        </div>
      </div>
      <div className="hidden md:block pt-2">
        <UserNav />
      </div>
      <div className="hidden md:flex flex-grow mt-2 rounded-md bg-gray-100" />
    </div>
  );
}
