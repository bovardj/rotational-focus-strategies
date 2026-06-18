import { CheckIcon } from "@heroicons/react/24/solid";

interface SurveyProgressProps {
  baselineDates: string[];
  dailyDates: string[];
  endSurveyCompleted: boolean;
}

interface DayBlob {
  date: string | null;
  done: boolean;
}

function Blob({ blob, dayNumber }: { blob: DayBlob; dayNumber: number }) {
  const shortLabel = blob.date
    ? new Date(blob.date + "T12:00:00").toLocaleDateString("en-US", { month: "numeric", day: "numeric" })
    : `D${dayNumber}`;
  const longLabel = blob.date
    ? new Date(blob.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : `Day ${dayNumber}`;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        aria-label={blob.done ? `Day ${dayNumber}, completed` : `Day ${dayNumber}, not yet completed`}
        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
          blob.done
            ? "border-blue-800 bg-blue-800 text-white"
            : "border-gray-300 bg-white text-gray-400"
        }`}
      >
        {blob.done ? (
          <CheckIcon aria-hidden="true" className="h-4 w-4" />
        ) : (
          <span aria-hidden="true" className="text-xs font-semibold">{dayNumber}</span>
        )}
      </div>
      <span className="sm:hidden text-[10px] text-gray-500">{shortLabel}</span>
      <span className="hidden sm:block text-xs text-gray-500">{longLabel}</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-start pt-1 px-1">
      <div className="w-px h-9 bg-gray-300" />
    </div>
  );
}

export default function SurveyProgress({ baselineDates, dailyDates, endSurveyCompleted }: SurveyProgressProps) {
  const allCompleted = [...baselineDates, ...dailyDates].sort();
  const startDate = allCompleted[0] ? new Date(allCompleted[0] + "T12:00:00") : null;

  const baselineSet = new Set(baselineDates);
  const dailySet = new Set(dailyDates);

  function extrapolateDate(dayOffset: number): string | null {
    if (!startDate) return null;
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayOffset);
    return d.toISOString().slice(0, 10);
  }

  const baselineBlobs: DayBlob[] = Array.from({ length: 3 }, (_, i) => {
    const date = extrapolateDate(i);
    return { date, done: date ? baselineSet.has(date) : false };
  });

  const dailyBlobs: DayBlob[] = Array.from({ length: 4 }, (_, i) => {
    const date = extrapolateDate(3 + i);
    return { date, done: date ? dailySet.has(date) : false };
  });

  const exitDate = extrapolateDate(7);

  return (
    <div className="mb-6 max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Your Progress
      </p>
      {!startDate && (
        <p className="mb-3 text-xs text-gray-400">Day 1 will be set upon your first submission.</p>
      )}
      <div className="flex flex-col w-full sm:w-auto sm:max-w-lg gap-2">
        <div className="flex w-full items-start">
          {baselineBlobs.map((blob, i) => (
            <div key={`baseline-${i}`} className="flex flex-1 justify-center">
              <Blob blob={blob} dayNumber={i + 1} />
            </div>
          ))}
          <Divider />
          {dailyBlobs.map((blob, i) => (
            <div key={`daily-${i}`} className="flex flex-1 justify-center">
              <Blob blob={blob} dayNumber={4 + i} />
            </div>
          ))}
          <Divider />
          <div className="flex flex-1 justify-center">
            <Blob blob={{ date: exitDate, done: endSurveyCompleted }} dayNumber={8} />
          </div>
        </div>
        <div className="flex w-full text-xs text-gray-600">
          <div className="flex flex-3 justify-center">Baseline</div>
          <div className="px-1 invisible">|</div>
          <div className="flex flex-4 justify-center">Daily</div>
          <div className="px-1 invisible">|</div>
          <div className="flex flex-1 justify-center">Exit</div>
        </div>
      </div>
    </div>
  );
}
