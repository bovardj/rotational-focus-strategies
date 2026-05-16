"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "general", label: "General" },
  { id: "baseline", label: "Baseline Days" },
  { id: "focus-strategy-days", label: "Focus Strategy Days" },
  { id: "last-day", label: "Last Day" },
];

export default function InstructionsNavrail() {
  const [active, setActive] = useState<string>("general");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="hidden lg:block w-48 flex-shrink-0">
      <div className="sticky top-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          On this page
        </p>
        <ul className="space-y-1">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => scrollTo(id)}
                className={`w-full text-left text-sm transition-colors ${
                  active === id
                    ? "font-semibold text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
