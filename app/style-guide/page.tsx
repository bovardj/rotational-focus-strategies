"use client";

import { lusitana } from "@/app/ui/fonts";
import { Button } from "@/app/ui/button";
import { useState, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "accordion", label: "Accordion" },
  { id: "collapse", label: "Collapse" },
  { id: "forms", label: "Form Elements" },
  { id: "spacing", label: "Spacing" },
  { id: "motion", label: "Motion" },
];

const BRAND_COLORS = [
  {
    swatch: "bg-blue-400",
    hex: "#2589FE",
    name: "Blue 400",
    cls: "bg-blue-400\ntext-blue-400\nhover:bg-blue-400",
    wcag: 3.0,
    usage: "Button hover state",
    light: false,
  },
  {
    swatch: "bg-blue-500",
    hex: "#0070F3",
    name: "Blue 500",
    cls: "bg-blue-500\ntext-blue-500",
    wcag: 4.1,
    usage: "Primary button fill",
    light: false,
  },
  {
    swatch: "bg-blue-600",
    hex: "#2F6FEB",
    name: "Blue 600",
    cls: "bg-blue-600\ntext-blue-600",
    wcag: 4.17,
    usage: "Sidenav header · numbered circles · link text",
    light: false,
  },
  {
    swatch: "bg-blue-700",
    hex: "~#1D4ED8",
    name: "Blue 700",
    cls: "text-blue-700",
    wcag: 6.2,
    usage: "Valid counter · high-contrast link text",
    light: false,
  },
  {
    swatch: "bg-blue-900",
    hex: "~#1E3A8A",
    name: "Blue 900",
    cls: "text-blue-900",
    wcag: 11.5,
    usage: "Selected card text",
    light: false,
  },
  {
    swatch: "bg-blue-50",
    hex: "~#EFF6FF",
    name: "Blue 50",
    cls: "bg-blue-50",
    wcag: 1.05,
    usage: "Selected card background",
    light: true,
  },
];

const NEUTRAL_COLORS = [
  { swatch: "bg-white border border-gray-200", hex: "#FFFFFF", name: "White", cls: "bg-white", wcag: 1.0, usage: "Page background", light: true },
  { swatch: "bg-gray-50", hex: "#F9FAFB", name: "Gray 50", cls: "bg-gray-50", wcag: 1.02, usage: "Dashboard sidenav fill", light: true },
  { swatch: "bg-gray-100", hex: "#F3F4F6", name: "Gray 100", cls: "bg-gray-100", wcag: 1.1, usage: "Section backgrounds · onboarding sidenav", light: true },
  { swatch: "bg-gray-200", hex: "#E5E7EB", name: "Gray 200", cls: "border-gray-200", wcag: 1.3, usage: "Card borders · dividers", light: true },
  { swatch: "bg-gray-500", hex: "#6B7280", name: "Gray 500", cls: "text-gray-500", wcag: 4.63, usage: "Captions · icons · unselected chevrons", light: false },
  { swatch: "bg-gray-600", hex: "#4B5563", name: "Gray 600", cls: "text-gray-600", wcag: 7.0, usage: "Secondary labels · sidenav section label", light: false },
  { swatch: "bg-gray-800", hex: "#1F2937", name: "Gray 800", cls: "text-gray-800", wcag: 12.6, usage: "Body text · step labels", light: false },
  { swatch: "bg-gray-900", hex: "#111827", name: "Gray 900", cls: "text-gray-900", wcag: 16.1, usage: "Headings · primary text", light: false },
];

const SPACING = [
  { token: "1", px: "4px", cls: "p-1 / m-1 / gap-1" },
  { token: "2", px: "8px", cls: "p-2 / m-2 / gap-2" },
  { token: "3", px: "12px", cls: "p-3 / m-3 / gap-3" },
  { token: "4", px: "16px", cls: "p-4 / m-4 / gap-4" },
  { token: "6", px: "24px", cls: "p-6 / m-6 / gap-6" },
  { token: "8", px: "32px", cls: "p-8 / m-8 / gap-8" },
  { token: "10", px: "40px", cls: "p-10 / m-10" },
  { token: "12", px: "48px", cls: "p-12 / m-12" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ index, label }: { index: number; label: string }) {
  return (
    <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-600">
      {String(index).padStart(2, "0")} / {label}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={`${lusitana.className} mb-2 text-2xl font-bold text-gray-900`}>
      {children}
    </h2>
  );
}

function SectionDivider() {
  return <hr className="my-12 border-gray-100" />;
}

function WCAGBadge({ ratio }: { ratio: number }) {
  const aa = ratio >= 4.5;
  const aaLg = ratio >= 3.0;
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
        aa
          ? "bg-green-100 text-green-800"
          : aaLg
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {ratio.toFixed(1)}:1&nbsp;
      {aa ? "✓ AA" : aaLg ? "AA-Lg" : "✗ Fail"}
    </span>
  );
}

function ColorSwatch({
  swatch,
  hex,
  name,
  cls,
  wcag,
  usage,
}: Omit<(typeof BRAND_COLORS)[0], "light">) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
      <div className={`${swatch} h-20 w-full`} />
      <div className="space-y-1.5 bg-white p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900">{name}</span>
          <WCAGBadge ratio={wcag} />
        </div>
        <p className="font-mono text-xs text-gray-500">{hex}</p>
        <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-gray-400">
          {cls}
        </pre>
        <p className="text-[11px] text-gray-500">{usage}</p>
      </div>
    </div>
  );
}

function CollapseDemo({
  title,
  children,
  initialOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className="w-full rounded-md border border-gray-200 shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-medium text-gray-900"
      >
        <span>{title}</span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionDemo() {
  const strategies = [
    {
      name: "Pomodoro Technique",
      desc: "Work in 25-minute focused bursts followed by 5-minute breaks.",
    },
    {
      name: "Chunking",
      desc: "Break large tasks into smaller, clearly-scoped pieces.",
    },
    {
      name: "Background Sound",
      desc: "Ambient audio — white noise, lo-fi, nature — to mask distractions.",
    },
  ];

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set());

  const toggleOpen = (i: number) =>
    setOpenIdx((prev) => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); } else { next.add(i); }
      return next;
    });

  const toggleSelect = (i: number) =>
    setSelectedItems((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  return (
    <div className="flex flex-col gap-3">
      {strategies.map((s, i) => {
        const isSelected = selectedItems.includes(i);
        const isOpen = openIdx.has(i);
        return (
          <div
            key={i}
            className={`rounded-lg border-2 shadow-sm transition-colors duration-150 ${
              isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div
              className="flex cursor-pointer select-none items-center gap-3 px-4 py-3"
              onClick={() => toggleOpen(i)}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelect(i);
                }}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-500"
                    : "cursor-pointer border-gray-500 bg-white"
                }`}
              >
                {isSelected && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                className={`flex-1 text-sm font-medium ${
                  isSelected ? "text-blue-900" : "text-gray-900"
                }`}
              >
                {s.name}
              </span>
              <svg
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-90" : ""
                } ${isSelected ? "text-blue-500" : "text-gray-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`border-t px-4 py-3 text-sm text-gray-700 ${
                    isSelected ? "border-blue-200" : "border-gray-200"
                  }`}
                >
                  {s.desc}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StyleGuidePage() {
  const [activeSection, setActiveSection] = useState("colors");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="hidden w-52 flex-none md:block">
        <div className="sticky top-0 h-screen overflow-y-auto border-r border-gray-100 px-5 py-8">
          <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-600">
            RFS
          </p>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-gray-400">
            Style Guide
          </p>
          <nav className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`rounded px-2 py-1.5 text-left text-sm transition-colors ${
                  activeSection === s.id
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 py-10 md:px-12 md:py-14 max-w-4xl">

        {/* Header */}
        <div className="mb-14">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-blue-600">
            Rotational Focus Strategies
          </p>
          <h1 className={`${lusitana.className} text-4xl font-bold text-gray-900`}>
            Style Guide
          </h1>
          <p className="mt-3 max-w-lg text-gray-500">
            Design tokens, component patterns, and usage guidelines for the RFS
            research application.
          </p>
        </div>

        {/* ── Colors ─────────────────────────────────────────────── */}
        <section id="colors" className="scroll-mt-6">
          <SectionLabel index={1} label="Colors" />
          <SectionHeading>Color Palette</SectionHeading>
          <p className="mb-6 text-sm text-gray-500">
            WCAG contrast ratios are measured against white (#FFFFFF). AA requires
            4.5:1 for normal text, 3.0:1 for large text and UI components.
            Custom blue values are defined in{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              app/ui/global.css
            </code>{" "}
            via <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">@theme</code>.
          </p>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Brand
          </p>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BRAND_COLORS.map((c) => (
              <ColorSwatch key={c.name} {...c} />
            ))}
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Neutral
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {NEUTRAL_COLORS.map((c) => (
              <ColorSwatch key={c.name} {...c} />
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Typography ──────────────────────────────────────────── */}
        <section id="typography" className="scroll-mt-6">
          <SectionLabel index={2} label="Typography" />
          <SectionHeading>Typography</SectionHeading>
          <p className="mb-8 text-sm text-gray-500">
            Two typefaces: <strong>Lusitana</strong> (serif, Google Fonts) for display
            headings, and <strong>Inter</strong> (sans-serif) as the body/UI default.
            Imported in{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              app/ui/fonts.ts
            </code>
            .
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                Lusitana — Display
              </p>
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <span className="w-20 flex-none font-mono text-[10px] text-gray-400">text-4xl</span>
                  <p className={`${lusitana.className} text-4xl font-bold text-gray-900`}>
                    Focus Strategies
                  </p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-20 flex-none font-mono text-[10px] text-gray-400">text-2xl</span>
                  <p className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
                    Welcome to RFS
                  </p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-20 flex-none font-mono text-[10px] text-gray-400">text-xl</span>
                  <p className={`${lusitana.className} text-xl font-bold text-gray-900`}>
                    Section Heading
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                Inter — UI / Body
              </p>
              <div className="space-y-3">
                {[
                  { cls: "text-lg font-semibold text-gray-900", label: "text-lg semibold", sample: "Select 3 focus strategies" },
                  { cls: "text-base text-gray-900", label: "text-base", sample: "Body text — strategy descriptions and instructions" },
                  { cls: "text-sm text-gray-800", label: "text-sm", sample: "Step labels, card headings, form labels" },
                  { cls: "text-sm text-gray-500", label: "text-sm muted", sample: "Captions, helper text, secondary information" },
                  { cls: "text-xs font-semibold uppercase tracking-wider text-gray-600", label: "text-xs label", sample: "STUDY OVERVIEW" },
                  { cls: "font-mono text-xs text-gray-500", label: "mono xs", sample: "01 / SECTION — token values" },
                ].map(({ cls, label, sample }) => (
                  <div key={label} className="flex items-baseline gap-4">
                    <span className="w-32 flex-none font-mono text-[10px] text-gray-400">{label}</span>
                    <p className={cls}>{sample}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Buttons ─────────────────────────────────────────────── */}
        <section id="buttons" className="scroll-mt-6">
          <SectionLabel index={3} label="Buttons" />
          <SectionHeading>Buttons</SectionHeading>
          <p className="mb-6 text-sm text-gray-500">
            One button variant lives in{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              app/ui/button.tsx
            </code>
            . States are handled via Tailwind variants and the HTML{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">disabled</code>{" "}
            attribute.
          </p>

          <div className="rounded-xl border border-gray-100 p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col items-start gap-1.5">
                <Button>Submit</Button>
                <span className="font-mono text-[10px] text-gray-400">default</span>
              </div>
              <div className="flex flex-col items-start gap-1.5">
                <Button className="opacity-50 cursor-not-allowed" disabled>
                  Submit
                </Button>
                <span className="font-mono text-[10px] text-gray-400">disabled</span>
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-gray-50 px-4 py-3">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-gray-400">classes</p>
              <code className="block whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-gray-600">
                {`flex h-10 items-center rounded-lg bg-blue-800 px-4
text-sm font-medium text-white transition-colors
hover:bg-blue-900 active:bg-blue-900
focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-blue-800
aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
              </code>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Accordion ───────────────────────────────────────────── */}
        <section id="accordion" className="scroll-mt-6">
          <SectionLabel index={4} label="Accordion" />
          <SectionHeading>Strategy Accordion</SectionHeading>
          <p className="mb-6 text-sm text-gray-500">
            Used on the onboarding page for strategy selection. Supports three visual
            states: default, selected, and disabled. Open/close is animated via a{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              grid-template-rows: 0fr → 1fr
            </code>{" "}
            CSS transition. State is tracked with{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              useState&lt;Set&lt;number&gt;&gt;
            </code>
            . See{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              app/onboarding/page.tsx
            </code>
            .
          </p>

          <AccordionDemo />

          <div className="mt-5 rounded-xl bg-gray-50 px-4 py-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Animation pattern
            </p>
            <code className="block whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-gray-600">
              {`{/* Outer: transitions grid-template-rows */}
<div className={\`grid transition-[grid-template-rows]
  duration-200 ease-in-out
  \${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}\`}>

  {/* Inner: clips overflow during transition */}
  <div className="overflow-hidden">
    <div className="border-t px-4 py-3">
      {content}
    </div>
  </div>
</div>`}
            </code>
          </div>

          <div className="mt-3 rounded-xl bg-gray-50 px-4 py-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Visual states
            </p>
            <div className="space-y-1.5 text-sm">
              {[
                { label: "Default", border: "border-gray-200", bg: "bg-gray-50", text: "text-gray-900" },
                { label: "Selected", border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-900" },
                { label: "Disabled (3 selected)", border: "border-gray-200 opacity-50", bg: "bg-gray-50", text: "text-gray-900" },
              ].map(({ label, border, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`h-6 w-24 flex-none rounded border-2 ${border} ${bg}`} />
                  <span className="font-mono text-[11px] text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Collapse ────────────────────────────────────────────── */}
        <section id="collapse" className="scroll-mt-6">
          <SectionLabel index={5} label="Collapse" />
          <SectionHeading>Collapse</SectionHeading>
          <p className="mb-6 text-sm text-gray-500">
            General-purpose disclosure component in{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              app/ui/components/collapse.tsx
            </code>
            . Used on the dashboard for strategy detail panels. Uses native{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              &lt;details&gt;
            </code>{" "}
            (no animation). For animated disclosure, use the Accordion pattern above.
          </p>

          <div className="flex max-w-xl flex-col gap-3">
            <CollapseDemo title="Collapse — default (closed)" initialOpen={false}>
              Content appears here when expanded. This component uses native{" "}
              <code className="rounded bg-gray-100 px-1">&lt;details&gt;</code> so it
              has no CSS transition.
            </CollapseDemo>
            <CollapseDemo title="Collapse — initially open" initialOpen={true}>
              Pass <code className="rounded bg-gray-100 px-1">initialVisible</code> to
              start expanded.
            </CollapseDemo>
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 px-4 py-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Props
            </p>
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-1.5 pr-4 font-semibold text-gray-600">prop</th>
                  <th className="py-1.5 pr-4 font-semibold text-gray-600">type</th>
                  <th className="py-1.5 text-gray-600">default</th>
                </tr>
              </thead>
              <tbody className="text-gray-500">
                {[
                  ["title", "string", "—"],
                  ["children", "ReactNode", "—"],
                  ["initialVisible", "boolean", "false"],
                  ["shadow", "boolean", "false"],
                  ["className", "string", "''"],
                ].map(([p, t, d]) => (
                  <tr key={p} className="border-b border-gray-100">
                    <td className="py-1.5 pr-4 text-blue-600">{p}</td>
                    <td className="py-1.5 pr-4">{t}</td>
                    <td className="py-1.5">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <SectionDivider />

        {/* ── Forms ───────────────────────────────────────────────── */}
        <section id="forms" className="scroll-mt-6">
          <SectionLabel index={6} label="Form Elements" />
          <SectionHeading>Form Elements</SectionHeading>
          <p className="mb-6 text-sm text-gray-500">
            Form styling comes from{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              @tailwindcss/forms
            </code>{" "}
            plugin. The onboarding page uses custom circular checkbox indicators
            (rendered as{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">div</code>s,
            with hidden{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              sr-only
            </code>{" "}
            checkbox inputs for form submission).
          </p>

          <div className="max-w-sm space-y-5 rounded-xl border border-gray-100 p-6">
            {/* Text input */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-800">
                Email address
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Circular checkbox — onboarding style */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-800">
                Strategy selector (custom)
              </p>
              <div className="flex flex-col gap-2">
                {["Unselected", "Selected"].map((label) => {
                  const sel = label === "Selected";
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          sel
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-500 bg-white"
                        }`}
                      >
                        {sel && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${sel ? "text-blue-900 font-medium" : "text-gray-900"}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Spacing ─────────────────────────────────────────────── */}
        <section id="spacing" className="scroll-mt-6">
          <SectionLabel index={7} label="Spacing" />
          <SectionHeading>Spacing Scale</SectionHeading>
          <p className="mb-6 text-sm text-gray-500">
            Tailwind&apos;s default 4px base scale. Common values used in this app.
          </p>

          <div className="space-y-2">
            {SPACING.map(({ token, px, cls }) => (
              <div key={token} className="flex items-center gap-4">
                <span className="w-6 flex-none font-mono text-xs font-semibold text-gray-500">
                  {token}
                </span>
                <div
                  className="flex-none rounded bg-blue-200"
                  style={{ width: parseInt(px) * 2, height: 16 }}
                />
                <span className="w-12 flex-none font-mono text-[11px] text-gray-400">{px}</span>
                <span className="font-mono text-[11px] text-gray-500">{cls}</span>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Motion ──────────────────────────────────────────────── */}
        <section id="motion" className="scroll-mt-6">
          <SectionLabel index={8} label="Motion" />
          <SectionHeading>Motion</SectionHeading>
          <p className="mb-6 text-sm text-gray-500">
            Animations are CSS-only via Tailwind transition utilities. Duration
            and easing are kept uniform across interactive components.
          </p>

          <div className="space-y-4">
            {[
              {
                name: "Accordion open/close",
                value: "duration-200 ease-in-out",
                property: "grid-template-rows",
                where: "Strategy cards, onboarding page",
              },
              {
                name: "Chevron rotate",
                value: "duration-200",
                property: "transform (rotate-90)",
                where: "All disclosure chevrons",
              },
              {
                name: "Button color",
                value: "transition-colors",
                property: "background-color",
                where: "Primary button hover/active",
              },
              {
                name: "Card border/bg",
                value: "duration-150",
                property: "border-color, background-color",
                where: "Strategy card selected state",
              },
            ].map(({ name, value, property, where }) => (
              <div key={name} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <code className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] text-blue-700">
                    {value}
                  </code>
                </div>
                <p className="mt-1 font-mono text-[11px] text-gray-400">
                  property: {property}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{where}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold text-amber-800">Note on animated height</p>
            <p className="mt-1 text-xs text-amber-700">
              CSS cannot transition <code className="rounded bg-amber-100 px-1">height: auto</code>.
              The{" "}
              <code className="rounded bg-amber-100 px-1">grid-template-rows: 0fr → 1fr</code>{" "}
              trick works by animating a grid row that collapses its content, paired with an{" "}
              inner <code className="rounded bg-amber-100 px-1">overflow-hidden</code> wrapper
              that clips during the transition.
            </p>
          </div>
        </section>

        <div className="mt-16 border-t border-gray-100 pt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-300">
            Rotational Focus Strategies · Design System
          </p>
        </div>
      </main>
    </div>
  );
}
