# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Rotational Focus Strategies (RFS) is a Next.js 16 web app for people with ADHD. It assigns users a rotating daily focus strategy (Pomodoro, chunking, background sound, etc.), collects survey data across three study phases (baseline → daily → exit), and analyzes effectiveness. Deployed at [focusapp.dev](https://www.focusapp.dev).

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm lint         # ESLint
pnpm start        # Run production build locally
```

No test suite is configured.

## Architecture

**Auth:** Clerk handles authentication. `middleware.ts` enforces route protection and redirects unauthenticated users to `/sign-in`, and authenticated users without `onboardingComplete: true` in Clerk `publicMetadata` to `/onboarding`.

**Database:** Supabase. The Clerk JWT is passed as the Supabase `accessToken` so Supabase RLS policies can enforce per-user data access. There are two Supabase client patterns in use:
- `app/lib/data.ts` and `app/lib/actions/` — direct `createClient` from `@supabase/supabase-js` with Clerk token injection (used for most server actions)
- `app/lib/supabase/server.ts` — SSR-aware client via `@supabase/ssr` with cookie handling (used for session-sensitive contexts)

**Key Supabase tables:** `user_strategies`, `assigned_strategies`, `days_expected`, `days_completed`, `baseline_survey_responses`, `daily_survey_responses`, `end_survey_responses`, `subscriptions`, `scheduled_notifications`

**User flow:**
1. Sign up → onboarding (select strategies, stored in `user_strategies`, sets `onboardingComplete` in Clerk metadata)
2. Baseline phase: 3 days of surveys without strategy assignment
3. Daily phase: 4 days, each day `getDailyStrategy()` randomly picks a strategy not assigned yesterday and writes to `assigned_strategies`
4. Exit survey → study complete

**Strategy rotation logic** (`app/lib/actions/actions.ts:getDailyStrategy`): Checks if today already has an assignment; if not, picks randomly from the user's selected strategies excluding yesterday's assignment.

**Push notifications:** Service worker at `public/sw.js`. Subscriptions managed via server actions in `app/lib/actions/notifications.ts` (`subscribeUser`, `unsubscribeUser`, `scheduleTimeNotification`), stored in `subscriptions` and `scheduled_notifications` Supabase tables. Notifications sent via `app/api/send-due/route.ts` using `web-push`. The app is a PWA: manifest at `app/manifest.ts`, install prompt at `app/components/InstallPromptClient.tsx`, offline fallback at `/offline`.

**Route structure:**
- `/` — public landing page
- `/sign-in`, `/sign-up`, `/forgot-password` — public auth pages
- `/onboarding/**` — strategy selection flow (8 strategy detail pages + final selection)
- `/dashboard` — main app (today's strategy, history table, survey, notifications, individual strategy pages)
- `/dashboard/survey` — daily/baseline/exit survey
- `/dashboard/notifications` — notification scheduling
- `/dashboard/strategies/**` — 8 individual strategy detail pages
- `/offline` — PWA offline fallback
- `/style-guide` — internal design reference (see also `STYLE_GUIDE.md` at repo root)

**UI:** Tailwind CSS + `@heroicons/react`. Survey forms live in `app/ui/dashboard/survey/question-forms/` with `likertScale-form.tsx` and `checkBox-form.tsx` question types.

## UI Patterns

**Animated accordion (onboarding page):** Strategy cards use a React-controlled disclosure pattern instead of native `<details>/<summary>`. State is `useState<Set<number>>` tracking open indices. The open/close animation uses the `grid-template-rows: 0fr → 1fr` CSS transition trick — the outer div transitions between these values while an inner `overflow-hidden` wrapper clips content during the transition. This approach animates height from 0 to auto without knowing content height in advance. See `app/onboarding/page.tsx`.

**Onboarding layout:** Uses `min-h-screen` (not `h-screen`) on the outer wrapper so the content pane expands naturally as strategy cards open. The sidenav is `md:sticky md:top-0 md:h-screen md:overflow-y-auto` so it stays fixed on desktop while the page scrolls. Avoid adding `overflow-hidden` or `overflow-y-auto` to the content pane — this creates a nested scrollbar that narrows the card width when content overflows. See `app/onboarding/layout.tsx`.

**WCAG AA contrast — onboarding:** The custom `--color-blue-600` (#2F6FEB) has a contrast ratio of ~4.17:1 against white, which is below the 4.5:1 AA threshold for normal text. Selected-state text uses `text-blue-900` (sufficient contrast). The "N of 3 selected" counter uses `text-blue-700` + a checkmark icon (non-color indicator) when valid. `text-gray-500` (~7:1) and `text-gray-600` (~5.7:1) are safe for body text; avoid `text-gray-400` (#9CA3AF, ~2.9:1) for meaningful text.

**Dashboard layout:** Uses `min-h-screen flex-col md:flex-row` with a sticky sidenav (`md:sticky md:top-0 md:h-screen md:overflow-y-auto`). On mobile, a `position: fixed` bottom nav bar (`md:hidden`) renders in `app/dashboard/layout.tsx` with `env(safe-area-inset-bottom)` padding and `viewport-fit=cover` in the root viewport export. Content has `pb-24` on mobile to clear the fixed nav. Do NOT use `overflow-y-auto` on the content pane or `h-dvh` on the outer wrapper — both create a nested scroll container that makes the fixed nav scroll away. The sidenav uses a custom `UserNav` component (`app/ui/dashboard/user-nav.tsx`) instead of Clerk's `UserButton` — it calls `useClerk().openUserProfile()` to open the account modal and `signOut()` for sign-out. `UserNav` is also used in the onboarding sidenav (`app/ui/onboarding/sidenav.tsx`). Do NOT re-introduce `UserButton` from Clerk anywhere in the app.

**Collapse component (`app/ui/components/collapse.tsx`):** Custom animated accordion using the `grid-template-rows: 0fr → 1fr` CSS transition trick (same as onboarding). Accepts an optional `storageKey` prop — when provided, open/closed state is persisted to `localStorage` via a lazy `useState` initializer (safe for SSR). Uses a `peer`-style chevron rotation for the toggle indicator.

**Survey form layout:** The survey form (`app/ui/dashboard/survey/survey-form.tsx`) uses `max-w-2xl` (left-aligned, no `mx-auto`) with no outer card — questions sit as individual `rounded-lg bg-gray-50 border border-gray-200` blocks with `space-y-4` between them. The Likert scale component (`likertScale-form.tsx`) renders a vertical radio list — each option is a full-width `rounded-lg` row with a visible radio input and `peer-checked:` label styling. Uses `<div>` for the visual card with `<fieldset><legend className="sr-only">` inside for screen reader semantics (do NOT put the card styling on `<fieldset>` directly — `<legend>` causes the border to visually break at the top). Do not use `border-gray-150` — it doesn't exist in Tailwind v4 and renders as no border.

**Survey progress indicator** (`app/ui/dashboard/survey/survey-progress.tsx`): Shows all 7 study days (3 baseline + 4 daily) plus the exit survey as blobs. Completion is determined by count (Nth blob done if N surveys submitted), not by date matching — this handles non-consecutive submissions correctly. Phase labels use `flex-[3]`, `flex-[4]`, `flex-[1]` to mirror blob widths. Container is `w-full` on mobile with `flex-1` cells, capped at `sm:w-auto sm:max-w-lg` on desktop.

**Instructions page (`app/dashboard/instructions/`):** Standalone page with prose sections (General, Baseline Days, Focus Strategy Days, Last Day) and a right-side sticky navrail (`navrail.tsx`) visible on `lg+` screens. The navrail uses `IntersectionObserver` with `document.getElementById` (not refs) to avoid the `react-hooks/rules-of-hooks` lint error from accessing refs in effects. New users are redirected here after onboarding (`router.push("/dashboard/instructions")`); the page is always accessible from the sidenav.

**Tailwind v4 note:** This project uses Tailwind v4 (`@import "tailwindcss"` in `global.css`). Class names and theme customisation differ from v3 — theme values use CSS custom properties (`--color-*`, `--container-*`) and are set via `@theme` blocks, not `tailwind.config.js`.

## Known Issues / Gotchas

**`position: fixed` and horizontal overflow:** If any content causes horizontal overflow, `position: fixed` elements anchor to the wider layout viewport instead of the visual viewport and will scroll away horizontally. The fix is always to eliminate the overflow — most commonly by adding `min-w-0` to flex children (flex items default to `min-width: auto`, preventing them from shrinking below content width). This was the root cause of the mobile bottom nav not being sticky on the survey page (Likert scale tiles overflowed).

**Timezone hardcoding:** All date logic in `getDailyStrategy()` and related functions uses `America/Los_Angeles` via `toLocaleDateString('en-us', { timeZone: 'America/Los_Angeles' })`. "Today" is always Pacific time. If you add server-side date logic outside these helpers, use the same locale string or dates will be off by one for non-Pacific deployments.

**Button component text color:** The `Button` component (`app/ui/button.tsx`) has `text-white` baked in and cannot be overridden with Tailwind utility classes due to CSS specificity. Use a plain `<button>` element when a different text color is needed.

**Supabase RLS — missing SELECT policies:** Some tables (e.g. `scheduled_notifications`) have INSERT but no SELECT RLS policies — reads will silently return empty arrays with no error. Fix: use `getServiceSupabase()` with an explicit `.eq('user_id', userId)` filter instead of the anon client.

**Hydration mismatches on client pages:** Components that return `null` before mount (e.g. `PushNotificationManager` with its `mounted` guard) shift React's reconciliation of subsequent siblings, causing hydration mismatches. Guard dynamic sections in the same page with a local `mounted` state initialized in `useEffect`.

**Date input default value format:** `toLocaleString("en-US").split(",")[0]` produces `M/D/YYYY` which is invalid for `<input type="date">`. Use `toLocaleDateString("en-CA", { timeZone: "..." })` which outputs the required `YYYY-MM-DD` format.

**Scheduled notifications timezone:** Times in `scheduled_notifications.scheduled_at` are stored and compared in UTC in `sendDueNotifications()`. Convert user-entered local times to UTC before storing — use `Intl.DateTimeFormat` with the user's timezone to calculate the offset accurately (handles half-hour offsets).

**Vercel cron plan limits:** Per-minute crons (`* * * * *`) require Pro plan. Free plan is limited to once-daily crons. The `/api/send-due` route requires a `CRON_SECRET` bearer token for auth.

**Supabase Performance Advisor — `auth_rls_initplan` false positive:** All RLS policies use `(SELECT auth.jwt() ->> 'sub')` which is the correct optimised form (evaluated once per query, not per row). The advisor still flags these because its pattern matcher looks for `auth.uid()`, not `auth.jwt()`. Do NOT switch to `auth.uid()` to fix the warning — `auth.uid()` returns a `uuid` type and will return `NULL` for Clerk users (whose IDs are strings like `user_abc123`, not UUIDs), breaking all data access. The advisor warning is a known false positive for Clerk + Supabase setups and can be ignored.

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — used in all server actions and SSR client. The `NEXT_PUBLIC_` prefix is required; non-prefixed `SUPABASE_URL` / `SUPABASE_ANON_KEY` are not present and will cause a `supabaseUrl is required` error at runtime.
- Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, etc.)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — for web push notifications
- `SUPABASE_SECRET_KEY` — service role key (bypasses RLS); used in `getServiceSupabase()` in `data.ts` and all API routes
- `CRON_SECRET` — bearer token checked by `GET /api/keep-alive` to authenticate cron caller
