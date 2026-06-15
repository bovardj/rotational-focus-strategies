# Strategies Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Strategies index and individual strategy detail pages into visual consistency with the Dashboard, following established style guide patterns.

**Architecture:** Replace the bare table-based strategy list with styled card components on the index page; fix each of the 8 detail pages to add a proper heading and card-wrapped prose. No new data fetching — all descriptions are static strings. Changes are purely presentational.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, Lusitana/Inter fonts from `next/font/google`

---

### Task 1: Rewrite `table.tsx` as a strategy cards component

**Files:**
- Modify: `app/ui/strategies/table.tsx` (full rewrite)
- Modify: `app/ui/strategies/table-data.tsx` (full rewrite)

- [ ] **Step 1: Rewrite `app/ui/strategies/table-data.tsx` as a single `StrategyCard` component**

Replace the entire file with:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface StrategyCardProps {
  name: string;
  href: string;
  description: string;
}

export default function StrategyCard({ name, href, description }: StrategyCardProps) {
  const pathname = usePathname();
  const link = `/dashboard/strategies/${href}`;

  return (
    <Link
      href={link}
      className={clsx(
        "block rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100",
        { "bg-sky-50 border-blue-200": pathname === link }
      )}
    >
      <p className="text-sm font-medium text-gray-900">{name}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}
```

- [ ] **Step 2: Rewrite `app/ui/strategies/table.tsx` as a `StrategyCards` component**

Replace the entire file with:

```tsx
import StrategyCard from "@/app/ui/strategies/table-data";
import { strategyDictionary } from "@/app/lib/utils";

const descriptions: Record<string, string> = {
  bg_sound: "Use ambient or instrumental audio in the background to create a productive sound environment.",
  check_list: "Break your work into a written list of tasks you can check off as you go.",
  chunking: "Divide large tasks into smaller, manageable pieces to reduce overwhelm.",
  environmental_shift: "Change your physical workspace or setting to reset your focus.",
  pomodoro: "Work in focused 25-minute sprints separated by short breaks.",
  small_rewards: "Motivate yourself with small treats or breaks tied to completing tasks.",
  task_switching: "Alternate between tasks to keep your mind fresh and sustain momentum.",
  work_partners: "Work near others — independently or collaboratively — to stay accountable.",
};

export default function StrategyCards() {
  return (
    <div className="mt-4 space-y-3">
      {strategyDictionary.map((strat) => (
        <StrategyCard
          key={strat.href}
          name={strat.name}
          href={strat.href}
          description={descriptions[strat.href] ?? ""}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update the strategies index page to use the new component**

Replace `app/dashboard/strategies/page.tsx` with:

```tsx
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
```

- [ ] **Step 4: Run lint and build to verify no errors**

```bash
pnpm lint && pnpm build
```

Expected: 0 errors, build completes successfully.

- [ ] **Step 5: Commit**

```bash
git add app/ui/strategies/table.tsx app/ui/strategies/table-data.tsx app/dashboard/strategies/page.tsx
git commit -m "feat: replace strategies table with styled card components"
```

---

### Task 2: Fix `strategy-descriptions.tsx` body text

**Files:**
- Modify: `app/ui/dashboard/strategy-descriptions.tsx`

- [ ] **Step 1: Replace all `text-md` with `text-sm text-gray-800` in `strategy-descriptions.tsx`**

`text-md` is not a valid Tailwind v4 token. Every `<p className="text-md">` and `<p className="text-md mt-4">` in the file needs to change.

Open `app/ui/dashboard/strategy-descriptions.tsx` and do a find-and-replace:
- `className="text-md"` → `className="text-sm text-gray-800"`
- `className="text-md mt-4"` → `className="text-sm text-gray-800 mt-4"`

There are approximately 18 paragraph elements across all strategy branches — apply to all of them.

- [ ] **Step 2: Verify no `text-md` remains**

```bash
grep -n "text-md" app/ui/dashboard/strategy-descriptions.tsx
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add app/ui/dashboard/strategy-descriptions.tsx
git commit -m "fix: replace invalid text-md token with text-sm text-gray-800"
```

---

### Task 3: Update all 8 individual strategy detail pages

Each of the 8 strategy detail pages needs the same three changes:
1. Add `max-w-2xl` wrapper
2. Add a Lusitana `h1` heading
3. Wrap `<StrategyDescriptions>` in a card `div`

**Files:**
- Modify: `app/dashboard/strategies/bg_sound/page.tsx`
- Modify: `app/dashboard/strategies/check_list/page.tsx`
- Modify: `app/dashboard/strategies/chunking/page.tsx`
- Modify: `app/dashboard/strategies/environmental_shift/page.tsx`
- Modify: `app/dashboard/strategies/pomodoro/page.tsx`
- Modify: `app/dashboard/strategies/small_rewards/page.tsx`
- Modify: `app/dashboard/strategies/task_switching/page.tsx`
- Modify: `app/dashboard/strategies/work_partners/page.tsx`

- [ ] **Step 1: Update `bg_sound/page.tsx`**

Replace the file with:

```tsx
import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "bg_sound";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Update `check_list/page.tsx`**

Same structure as Step 1, with `strategy = "check_list"`.

```tsx
import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "check_list";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Update `chunking/page.tsx`**

```tsx
import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "chunking";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Update `environmental_shift/page.tsx`**

```tsx
import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "environmental_shift";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Update `pomodoro/page.tsx`**

```tsx
import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "pomodoro";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Update `small_rewards/page.tsx`**

```tsx
import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "small_rewards";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Update `task_switching/page.tsx`**

```tsx
import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "task_switching";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Update `work_partners/page.tsx`**

```tsx
import Breadcrumbs from "@/app/ui/strategies/breadcrumbs";
import { strategyDictionary } from "@/app/lib/utils";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  const strategy = "work_partners";
  const formattedStrategy =
    strategyDictionary.find((strat) => strat.href === strategy)?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Focus Strategies", href: "/dashboard/strategies" },
          { label: formattedStrategy, href: `/dashboard/strategies/${strategy}/`, active: true },
        ]}
      />
      <div className="max-w-2xl">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>{formattedStrategy}</h1>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <StrategyDescriptions strategy={strategy} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 9: Run lint and build**

```bash
pnpm lint && pnpm build
```

Expected: 0 errors, build completes successfully.

- [ ] **Step 10: Commit**

```bash
git add app/dashboard/strategies/bg_sound/page.tsx \
        app/dashboard/strategies/check_list/page.tsx \
        app/dashboard/strategies/chunking/page.tsx \
        app/dashboard/strategies/environmental_shift/page.tsx \
        app/dashboard/strategies/pomodoro/page.tsx \
        app/dashboard/strategies/small_rewards/page.tsx \
        app/dashboard/strategies/task_switching/page.tsx \
        app/dashboard/strategies/work_partners/page.tsx
git commit -m "feat: add heading and card wrapper to all strategy detail pages"
```
