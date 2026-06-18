"use client";

import PageCard from "@/app/ui/dashboard/page-card";
import { useState } from "react";
import { lusitana } from "@/app/ui/fonts";

const QUESTION = "How satisfied are you with today?";
const SCALE: [string, string, string, string, string] = [
  "Very dissatisfied",
  "Somewhat dissatisfied",
  "Neutral",
  "Somewhat satisfied",
  "Very satisfied",
];

// ─── Option 1: Vertical radio list ───────────────────────────────────────────

function VerticalRadio() {
  const [value, setValue] = useState<number | null>(null);
  return (
    <fieldset>
      <legend className="sr-only">{QUESTION}</legend>
      <div className="space-y-2">
        {SCALE.map((label, i) => {
          const v = i + 1;
          const checked = value === v;
          return (
            <label
              key={i}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                checked
                  ? "bg-blue-50 border-blue-600"
                  : "bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              <input
                type="radio"
                name="vertical"
                value={v}
                checked={checked}
                onChange={() => setValue(v)}
                className="w-4 h-4 accent-blue-800 shrink-0"
              />
              <span className={`text-sm ${checked ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                {v} — {label}
              </span>
            </label>
          );
        })}
      </div>
      {value && (
        <p className="mt-2 text-xs text-gray-500 text-right">
          Selected: {value} ({SCALE[value - 1]})
        </p>
      )}
    </fieldset>
  );
}

// ─── Option 2: Slider with dynamic label ─────────────────────────────────────

function SliderScale() {
  const [value, setValue] = useState(3);
  const label = SCALE[value - 1];
  // const pct = ((value - 1) / 4) * 100;

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1 px-0.5">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={QUESTION}
        aria-valuetext={`${value} — ${label}`}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-800 bg-gray-200"
      />
      <div
        className="mt-3 rounded-lg px-4 py-2 text-center transition-colors"
        style={{ backgroundColor: `hsl(${(5 - value) * 30 + 190}, 70%, ${value >= 3 ? 92 : 95}%)` }}
      >
        <span className="text-2xl font-bold text-blue-700">{value}</span>
        <p className="text-sm font-medium text-blue-800 mt-0.5">{label}</p>
      </div>
      <p className="mt-1 text-xs text-gray-400 text-center">
        Drag or tap to select
      </p>
    </div>
  );
}

// ─── Option 3: Number buttons + endpoint labels ───────────────────────────────

function NumberButtons() {
  const [value, setValue] = useState<number | null>(null);
  return (
    <fieldset>
      <legend className="sr-only">{QUESTION}</legend>
      <div className="flex gap-2">
        {SCALE.map((label, i) => {
          const v = i + 1;
          const checked = value === v;
          return (
            <label key={i} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="numbers"
                value={v}
                checked={checked}
                onChange={() => setValue(v)}
                className="sr-only peer"
                aria-label={`${v} — ${label}`}
              />
              <div
                className={`rounded-md border text-center py-3 text-lg font-bold transition-colors select-none ${
                  checked
                    ? "bg-blue-800 text-white border-blue-800"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                {v}
              </div>
            </label>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500 leading-tight px-0.5">
        <span className="max-w-20">1 = {SCALE[0]}</span>
        <span className="max-w-20 text-right">5 = {SCALE[4]}</span>
      </div>
      {value && (
        <p className="mt-2 text-xs text-blue-700 text-center font-medium">
          {value} — {SCALE[value - 1]}
        </p>
      )}
    </fieldset>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Option = "vertical" | "slider" | "numbers";

const OPTIONS: { id: Option; label: string }[] = [//; note: string }[] = [
  {
    id: "vertical",
    label: "Option 1 — Vertical List",
    // note: "Most accessible. Full label always visible. Large touch targets. Best screen reader support. Uses more vertical space.",
  },
  {
    id: "slider",
    label: "Option 2 — Slider",
    // note: "Compact and native-feeling. Dynamic label updates on drag. Requires aria-valuetext for screen readers. Less precise on touch.",
  },
  {
    id: "numbers",
    label: "Option 3 — Number Buttons",
    // note: "Compact horizontal layout. Endpoint labels only. aria-label on each option covers screen readers. Selected value shown below.",
  },
];

export default function LikertComparePage() {
  const [open, setOpen] = useState<Option | null>("vertical");

  return (
    <PageCard>
      <main className="max-w-lg mx-auto">
      <h1 className={`${lusitana.className} text-2xl font-bold mb-1`}>
        Likert Scale Options
      </h1>
      {/* <p className="text-sm text-gray-500 mb-6">
        Tap each option to expand. Interact with each to evaluate feel on mobile.
      </p> */}

      <div className="space-y-3">
        {OPTIONS.map(({ id, label }) => (//, note }) => (
          <div key={id} className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpen(open === id ? null : id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white text-left"
              aria-expanded={open === id}
            >
              <span className="font-semibold text-sm text-gray-800">{label}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ml-2 ${open === id ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className="grid transition-all duration-300"
              style={{ gridTemplateRows: open === id ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 bg-white border-t border-gray-100">
                  {/* <p className="text-xs text-gray-500 mt-3 mb-4 leading-relaxed">{note}</p> */}

                  <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      {QUESTION}
                      <span className="text-red-500">*</span>
                    </p>
                    {id === "vertical" && <VerticalRadio />}
                    {id === "slider" && <SliderScale />}
                    {id === "numbers" && <NumberButtons />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </main>
    </PageCard>
  );
}
