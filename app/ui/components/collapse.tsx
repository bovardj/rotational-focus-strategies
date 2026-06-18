"use client";

import { useState, ReactNode } from "react";

interface CollapseProps {
  title: string;
  children: ReactNode;
  initialVisible?: boolean;
  shadow?: boolean;
  className?: string;
  storageKey?: string;
}

function getInitialOpen(storageKey: string | undefined, initialVisible: boolean): boolean {
  if (!storageKey) return initialVisible;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) return stored === "true";
  } catch {}
  return initialVisible;
}

export default function Collapse({
  title,
  children,
  initialVisible = false,
  shadow = false,
  className = "",
  storageKey,
}: CollapseProps) {
  const [open, setOpen] = useState(() => getInitialOpen(storageKey, initialVisible));

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (storageKey) {
        try { localStorage.setItem(storageKey, String(next)); } catch {}
      }
      return next;
    });
  };

  return (
    <div
      className={`w-full rounded-md border border-gray-200 ${shadow ? "shadow-sm" : ""} ${className}`}
    >
      <button
        type="button"
        onClick={toggle}
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
          <div className="border-t border-gray-200 px-4 py-3 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
