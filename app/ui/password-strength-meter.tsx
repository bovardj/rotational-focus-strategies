"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type ZxcvbnFactoryInstance = InstanceType<
  typeof import("@zxcvbn-ts/core").ZxcvbnFactory
>;

let zxcvbnFactoryPromise: Promise<ZxcvbnFactoryInstance> | null = null;

function loadZxcvbn(): Promise<ZxcvbnFactoryInstance> {
  if (!zxcvbnFactoryPromise) {
    zxcvbnFactoryPromise = Promise.all([
      import("@zxcvbn-ts/core"),
      import("@zxcvbn-ts/language-common"),
      import("@zxcvbn-ts/language-en"),
    ]).then(([core, common, en]) => {
      return new core.ZxcvbnFactory({
        translations: en.translations,
        graphs: common.adjacencyGraphs,
        dictionary: {
          ...common.dictionary,
          ...en.dictionary,
        },
      });
    });
  }
  return zxcvbnFactoryPromise;
}

const STRENGTH_LEVELS = [
  { label: "Weak", barColor: "bg-red-800", textColor: "text-red-800" },
  { label: "Weak", barColor: "bg-red-800", textColor: "text-red-800" },
  { label: "Fair", barColor: "bg-amber-800", textColor: "text-amber-800" },
  { label: "Good", barColor: "bg-blue-800", textColor: "text-blue-800" },
  { label: "Strong", barColor: "bg-green-800", textColor: "text-green-800" },
] as const;

interface PasswordStrengthMeterProps {
  password: string;
  userInputs?: string[];
}

export default function PasswordStrengthMeter({
  password,
  userInputs,
}: PasswordStrengthMeterProps) {
  const [score, setScore] = useState<0 | 1 | 2 | 3 | 4 | null>(null);

  const computeScore = useDebouncedCallback(
    async (value: string, inputs: string[]) => {
      try {
        const zxcvbn = await loadZxcvbn();
        const result = await zxcvbn.checkAsync(value, inputs);
        setScore(result.score);
      } catch {
        setScore(null);
      }
    },
    200,
  );

  useEffect(() => {
    if (password === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScore(null);
      computeScore.cancel();
      return;
    }
    computeScore(password, userInputs ?? []);
  }, [password, userInputs, computeScore]);

  const level = score === null ? null : STRENGTH_LEVELS[score];
  // zxcvbn scores 0-4; scores 0 and 1 both map to "Weak" with 1 filled segment,
  // scores 2/3/4 map 1:1 to filled segments 2/3/4.
  const filledSegments = score === null ? 0 : Math.max(1, score);

  return (
    <div className="mt-2 min-h-8" role="status" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((segmentIndex) => (
          <div
            key={segmentIndex}
            className={`h-1.5 flex-1 rounded-full ${
              level && segmentIndex < filledSegments
                ? level.barColor
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {level && <p className={`mt-1 text-xs ${level.textColor}`}>{level.label}</p>}
    </div>
  );
}
