# Onboarding Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the onboarding layout to match the visual language of the landing and auth pages — `bg-blue-50` background with glow decorations, sidenav as a floating rounded panel, content pane as a white shadow card.

**Architecture:** Two files change: `app/onboarding/layout.tsx` gets the blue-50 background + glow divs + card wrappers around both panels; `app/ui/onboarding/sidenav.tsx` gets its logo bar color updated (`blue-600` → `blue-800`) and negative margins so the blue header bleeds flush to the card edge. No new components are introduced.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4

---

## Files

- Modify: `app/onboarding/layout.tsx`
- Modify: `app/ui/onboarding/sidenav.tsx`

---

## Task 1: Update `onboarding/layout.tsx`

**Files:**
- Modify: `app/onboarding/layout.tsx`

Replace the entire return JSX. The outer div gains `relative bg-blue-50` and outer padding so panels float. Three absolute glow divs (identical to `app/ui/auth-shell.tsx`) are added inside a `pointer-events-none absolute inset-0` container. The sidenav wrapper gains `overflow-hidden rounded-2xl border border-gray-100 shadow-xl shadow-blue-100/60` and the sticky offset changes from `top-0 h-screen` to `top-6 h-[calc(100vh-3rem)]`. The content wrapper gets a white card div replacing the previous padding-only div.

- [ ] **Step 1: Open the file and replace the return statement**

Replace everything from `return (` to the closing `);` with:

```tsx
  return (
    <div className="relative flex min-h-screen flex-col gap-4 bg-blue-50 p-4 md:flex-row md:gap-6 md:p-6">
      {/* Background glows — identical to auth-shell.tsx */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      {/* Sidenav panel */}
      <div className="relative w-full flex-none overflow-hidden rounded-2xl border border-gray-100 shadow-xl shadow-blue-100/60 md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-64">
        <SideNav />
      </div>

      {/* Content panel */}
      <div className="relative flex flex-grow flex-col">
        <div className="flex-grow rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
```

The full file after the edit:

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideNav from "@/app/ui/onboarding/sidenav";
import { syncUserToSupabase } from "@/app/onboarding/_actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/dashboard");
  }

  await syncUserToSupabase();

  return (
    <div className="relative flex min-h-screen flex-col gap-4 bg-blue-50 p-4 md:flex-row md:gap-6 md:p-6">
      {/* Background glows — identical to auth-shell.tsx */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      {/* Sidenav panel */}
      <div className="relative w-full flex-none overflow-hidden rounded-2xl border border-gray-100 shadow-xl shadow-blue-100/60 md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-64">
        <SideNav />
      </div>

      {/* Content panel */}
      <div className="relative flex flex-grow flex-col">
        <div className="flex-grow rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-100/60 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/onboarding/layout.tsx
git commit -m "feat: apply blue-50 background and card panels to onboarding layout"
```

---

## Task 2: Update `ui/onboarding/sidenav.tsx`

**Files:**
- Modify: `app/ui/onboarding/sidenav.tsx`

Two changes: (1) the logo bar color changes from `bg-blue-600` to `bg-blue-800` and gains negative margins (`-mx-3 -mt-4 md:-mx-2`) so it bleeds flush to the card edge set by the layout wrapper's `overflow-hidden rounded-2xl`; `rounded-md` is removed from the logo bar since the outer card handles rounding. (2) Step number circle color changes from `bg-blue-600` to `bg-blue-800` for WCAG AAA compliance.

- [ ] **Step 1: Update the logo bar div**

Find:
```tsx
      <div className="relative mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
```

Replace with:
```tsx
      <div className="relative mb-2 flex h-20 items-end justify-start bg-blue-800 p-4 -mx-3 -mt-4 md:-mx-2 md:h-40">
```

- [ ] **Step 2: Update the step number circle color**

Find:
```tsx
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
```

Replace with:
```tsx
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-800 text-[10px] font-bold text-white">
```

- [ ] **Step 3: Commit**

```bash
git add app/ui/onboarding/sidenav.tsx
git commit -m "feat: update sidenav colors to blue-800 and flush logo bar to card edge"
```

---

## Task 3: Visual verification

No automated test suite exists. Verify in the browser.

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/onboarding` (you must be signed in with a user whose `onboardingComplete` is not yet `true`, or temporarily remove the redirect in `layout.tsx`).

- [ ] **Step 2: Desktop check (≥768px viewport)**

Confirm:
- Page background is `bg-blue-50` with soft glow decorations visible
- Sidenav appears as a rounded panel on the left; the blue header is flush to the top-left corner (no gap/padding above or to the sides of the blue bar)
- Sidenav header is visibly darker than the previous blue (blue-800 vs blue-600)
- Step number circles match the header color (both blue-800)
- Content area appears as a white card with shadow, floating above the blue-50 background
- Sidenav stays sticky as you scroll the strategy cards open/closed

- [ ] **Step 3: Mobile check (<768px viewport)**

Confirm:
- Sidenav appears stacked above the content card
- Both panels have rounded corners and are separated by a gap
- Blue-50 background visible in the gap between panels and at page edges
- Study Overview collapsible still works

- [ ] **Step 4: Check strategy detail pages**

Navigate to `http://localhost:3000/onboarding/strategies/pomodoro` (or any strategy page). These share the same layout — confirm the same visual treatment applies.

- [ ] **Step 5: Commit if any fixups were made**

If you had to adjust anything during verification:
```bash
git add -p
git commit -m "fix: onboarding restyle adjustments after visual review"
```
