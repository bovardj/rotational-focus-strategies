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

**Auth:** Clerk handles authentication. `proxy.ts` enforces route protection and redirects unauthenticated users to `/sign-in`, and authenticated users without `onboardingComplete: true` in Clerk `publicMetadata` to `/onboarding`. **Client-side onboarding gate:** To disable/hide features until onboarding is complete, read `user?.publicMetadata?.onboardingComplete === true` from Clerk's `useUser()` hook. Example: `const onboardingComplete = user?.publicMetadata?.onboardingComplete === true;` **Clerk sign-in/sign-up buttons:** Do NOT use `<SignInButton>` or `<SignUpButton>` from `@clerk/nextjs` — they open Clerk's hosted modal/page and bypass the custom `/sign-in` and `/sign-up` pages even when `NEXT_PUBLIC_CLERK_SIGN_IN_URL` is set. Use `<Link href="/sign-in">` and `<Link href="/sign-up">` instead.

**Database:** Supabase. The Clerk JWT is passed as the Supabase `accessToken` so Supabase RLS policies can enforce per-user data access. There are two Supabase client patterns in use:
- `app/lib/data.ts` and `app/lib/actions/` — direct `createClient` from `@supabase/supabase-js` with Clerk token injection (used for most server actions)
- `app/lib/supabase/server.ts` — SSR-aware client via `@supabase/ssr` with cookie handling (used for session-sensitive contexts)

**Key Supabase tables:** `user_strategies`, `assigned_strategies`, `days_expected`, `days_completed`, `baseline_survey_responses`, `daily_survey_responses`, `end_survey_responses`, `subscriptions`, `scheduled_notifications`

**RFS logo (`app/ui/rfs-logo.tsx`):** Uses the custom SVG from `app/ui/rfs-logo.svg` inlined with `currentColor` so it inherits text color. Accepts an optional `className` prop (defaults to `text-white` for use on blue sidenav backgrounds). The landing page and auth pages pass `className="text-blue-800"`. The orbit path uses a `<mask id="orbitMask">` with an ellipse to create a gap between the orbit and arrowhead — adjust the ellipse `cx`/`cy`/`r` if logo sizing changes cause them to overlap again.

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

**Onboarding layout (`app/onboarding/layout.tsx`):** Uses the same visual language as the auth shell — `bg-blue-50` outer background with three decorative glow divs. Sidenav: `bg-blue-900 rounded-2xl overflow-hidden shadow-xl md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-64` (dark card, sticky offset to match outer `md:p-6` padding). Content card: `rounded-2xl bg-white border border-gray-100 p-6 md:p-10 max-w-3xl` — capped at `max-w-3xl` to prevent white expanse on wide screens. Logo bar uses negative margins (`-mx-3 -mt-4 md:-mx-2`) to bleed flush to the sidenav card edges while the root padding governs other content. Do NOT add `overflow-y-auto` to the content pane. The onboarding sidenav passes `<UserNav dark />` for white-on-dark styling.

**WCAG AA contrast — onboarding:** The custom `--color-blue-600` (#2F6FEB) has a contrast ratio of ~4.17:1 against white, which is below the 4.5:1 AA threshold for normal text. Selected-state text uses `text-blue-900` (sufficient contrast). The "N of 3 selected" counter uses `text-blue-700` + a checkmark icon (non-color indicator) when valid. `text-gray-600` (~7.4:1) and `text-gray-700` (~10.7:1) are safe for AAA body text; `text-gray-500` (~5.7:1) passes AA only; avoid `text-gray-400` (#9CA3AF, ~2.9:1) for meaningful text.

**Dashboard layout:** Uses `min-h-screen flex-col md:flex-row` with a sticky sidenav (`md:sticky md:top-0 md:h-screen md:overflow-y-auto`). On mobile, a `position: fixed` bottom nav bar (`md:hidden`) renders in `app/dashboard/layout.tsx` with `env(safe-area-inset-bottom)` padding and `viewport-fit=cover` in the root viewport export. Content has `pb-24` on mobile to clear the fixed nav. Do NOT use `overflow-y-auto` on the content pane or `h-dvh` on the outer wrapper — both create a nested scroll container that makes the fixed nav scroll away. The sidenav uses a custom `UserNav` component (`app/ui/dashboard/user-nav.tsx`) instead of Clerk's `UserButton` — it calls `useClerk().openUserProfile()` to open the account modal and `signOut()` for sign-out. `UserNav` is also used in the onboarding sidenav (`app/ui/onboarding/sidenav.tsx`). Do NOT re-introduce `UserButton` from Clerk anywhere in the app. **`UserNav` accepts a `dark` prop** — when `true`, renders with `bg-white/10 hover:bg-white/20 text-white` for use on dark (`bg-blue-900`) backgrounds; the onboarding sidenav passes `<UserNav dark />`.

**Collapse component (`app/ui/components/collapse.tsx`):** Custom animated accordion using the `grid-template-rows: 0fr → 1fr` CSS transition trick (same as onboarding). Accepts an optional `storageKey` prop — when provided, open/closed state is persisted to `localStorage` via a lazy `useState` initializer (safe for SSR). Uses a `peer`-style chevron rotation for the toggle indicator.

**Survey form layout:** The survey form (`app/ui/dashboard/survey/survey-form.tsx`) uses `max-w-2xl` (left-aligned, no `mx-auto`) with no outer card — questions sit as individual `rounded-lg bg-gray-50 border border-gray-200` blocks with `space-y-4` between them. The Likert scale component (`likertScale-form.tsx`) renders a vertical radio list — each option is a full-width `rounded-lg` row with a visible radio input and `peer-checked:` label styling. Uses `<div>` for the visual card with `<fieldset><legend className="sr-only">` inside for screen reader semantics (do NOT put the card styling on `<fieldset>` directly — `<legend>` causes the border to visually break at the top). Do not use `border-gray-150` — it doesn't exist in Tailwind v4 and renders as no border.

**Survey progress indicator** (`app/ui/dashboard/survey/survey-progress.tsx`): Shows all 7 study days (3 baseline + 4 daily) plus the exit survey as blobs. Completion is determined by count (Nth blob done if N surveys submitted), not by date matching — this handles non-consecutive submissions correctly. Phase labels use `flex-[3]`, `flex-[4]`, `flex-[1]` to mirror blob widths. Container is `w-full` on mobile with `flex-1` cells, capped at `sm:w-auto sm:max-w-lg` on desktop.

**Dashboard visual language (`app/dashboard/`):** Uses `bg-blue-50` outer background with decorative glow divs (matching auth/landing), a dark `bg-blue-900` sidenav card, and white `PageCard` content cards. The `PageCard` shared component (`app/ui/dashboard/page-card.tsx`) provides the white card with shadow, capped at `max-w-3xl` by default. Pages needing a different width (e.g. instructions with an external navrail) create a nested `layout.tsx` with a custom max-width instead.

**Instructions page (`app/dashboard/instructions/`):** Standalone page with prose sections (General, Baseline Days, Focus Strategy Days, Last Day) and a right-side sticky navrail (`navrail.tsx`) visible on `lg+` screens. The navrail uses `IntersectionObserver` with `document.getElementById` (not refs) to avoid the `react-hooks/rules-of-hooks` lint error from accessing refs in effects. New users are redirected here after onboarding (`router.push("/dashboard/instructions")`); the page is always accessible from the sidenav.

**Auth shell (`app/ui/auth-shell.tsx`):** Shared wrapper for all auth pages (`/sign-in`, `/sign-up`, `/forgot-password`). Provides the `bg-blue-50` background, decorative glow divs, RFS logo, and white card. Add new auth pages by wrapping content in `<AuthShell>`.

**WCAG AAA color palette:** This project targets WCAG AAA (7:1 contrast). Safe values — primary buttons: `bg-blue-800 hover:bg-blue-900 text-white` (~8.6:1); inline links: `text-blue-800` (~8.6:1); body text minimum: `text-gray-600` (~7.4:1); error/warning text: `text-red-800` (~8.1:1); placeholder text: `placeholder:text-gray-600` (~7.4:1). Do NOT use `text-blue-600` (#2F6FEB, ~4.17:1) for text — it fails even AA. Do NOT use any shade below `blue-800` for any interactive or meaningful purpose — this includes hover/active states, borders, form accents (`accent-*`), progress bars, icons, and decorative accents. `blue-800` is the only interactive blue in this project.

**Accessibility patterns in use:** Skip links use `sr-only focus-visible:not-sr-only` targeting `id="main-content"` on `<main>`. Dynamic status messages (e.g. CapsLock warnings) use always-rendered `<div aria-live="polite">` — never conditionally render live regions or they won't be announced. Icon-only buttons require `aria-label`. Decorative icons (heroicons inside labeled buttons/links) get `aria-hidden="true"`. All form inputs need `autocomplete` attributes. Focus rings on interactive elements: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2`. When a form step changes (e.g. email → verify), shift focus programmatically via `useRef` + `useEffect`. Multiple `<nav>` landmarks on one page each need a distinct `aria-label` (e.g. `"Main navigation"`, `"Page sections"`) — without labels, screen readers list them all as "navigation" with no distinction. Dropdown menus: trigger gets `aria-haspopup="menu"` + `aria-controls="id"` + `aria-expanded`; menu div gets `role="menu"` + matching `id`; each item gets `role="menuitem"`; add Escape-to-close + focus-first-item-on-open via `useEffect`. Never use `window.alert()` for validation — use an always-rendered `<div role="alert" aria-live="assertive">`. Active nav links need `aria-current="page"`. Progress bars need `role="progressbar" aria-valuenow aria-valuemin aria-valuemax aria-label`. Checkbox groups (multiple inputs under one question) use `<fieldset><legend>` — NOT `<label htmlFor>`, which only links to one input. See `likertScale-form.tsx` and `checkBox-form.tsx` for the established pattern.

**Tailwind v4 note:** This project uses Tailwind v4 (`@import "tailwindcss"` in `global.css`). Class names and theme customisation differ from v3 — theme values use CSS custom properties (`--color-*`, `--container-*`) and are set via `@theme` blocks, not `tailwind.config.js`.

## Known Issues / Gotchas

**`position: fixed` and horizontal overflow:** If any content causes horizontal overflow, `position: fixed` elements anchor to the wider layout viewport instead of the visual viewport and will scroll away horizontally. The fix is always to eliminate the overflow — most commonly by adding `min-w-0` to flex children (flex items default to `min-width: auto`, preventing them from shrinking below content width). This was the root cause of the mobile bottom nav not being sticky on the survey page (Likert scale tiles overflowed).

**`flex items-start` breaks `position: sticky`:** `items-start` collapses each flex child to its content height — a `sticky` element inside has no extra height to scroll within. Remove `items-start` so the default `align-items: stretch` lets all columns grow to the row's full height. Affected: `app/dashboard/instructions/layout.tsx` (navrail sibling to white card).

**Timezone hardcoding:** All date logic in `getDailyStrategy()` and related functions uses `America/Los_Angeles` via `toLocaleDateString('en-us', { timeZone: 'America/Los_Angeles' })`. "Today" is always Pacific time. If you add server-side date logic outside these helpers, use the same locale string or dates will be off by one for non-Pacific deployments.

**Button component text color:** The `Button` component (`app/ui/button.tsx`) has `text-white` baked in and cannot be overridden with Tailwind utility classes due to CSS specificity. Use a plain `<button>` element when a different text color is needed.

**Supabase RLS — missing SELECT policies:** Some tables (e.g. `scheduled_notifications`) have INSERT but no SELECT RLS policies — reads will silently return empty arrays with no error. Fix: use `getServiceSupabase()` with an explicit `.eq('user_id', userId)` filter instead of the anon client.

**Hydration mismatches on client pages:** Components that return `null` before mount (e.g. `PushNotificationManager` with its `mounted` guard) shift React's reconciliation of subsequent siblings, causing hydration mismatches. Guard dynamic sections in the same page with a local `mounted` state initialized in `useEffect`. **Clerk `useUser()` specific case:** `useUser()` populates user data during SSR but returns `null` on initial client render, so any component that renders user-derived content (initials, name, email) will mismatch. Fix: add `const [mounted, setMounted] = useState(false)` + `// eslint-disable-next-line react-hooks/set-state-in-effect` + `useEffect(() => setMounted(true), [])`, then gate all user-data JSX with `mounted ? value : ""`. This is already applied in `UserNav`.

**Date input default value format:** `toLocaleString("en-US").split(",")[0]` produces `M/D/YYYY` which is invalid for `<input type="date">`. Use `toLocaleDateString("en-CA", { timeZone: "..." })` which outputs the required `YYYY-MM-DD` format.

**Scheduled notifications timezone:** Times in `scheduled_notifications.scheduled_at` are stored and compared in UTC in `sendDueNotifications()`. Convert user-entered local times to UTC before storing — use `Intl.DateTimeFormat` with the user's timezone to calculate the offset accurately (handles half-hour offsets).

**Vercel cron plan limits:** Per-minute crons (`* * * * *`) require Pro plan. Free plan is limited to once-daily crons (`0 12 * * *`). Violating this causes Vercel to silently reject *all* subsequent builds on the branch — not just the cron route. The `/api/send-due` route requires a `CRON_SECRET` bearer token for auth.

**Supabase Performance Advisor — `auth_rls_initplan` false positive:** All RLS policies use `(SELECT auth.jwt() ->> 'sub')` which is the correct optimised form (evaluated once per query, not per row). The advisor still flags these because its pattern matcher looks for `auth.uid()`, not `auth.jwt()`. Do NOT switch to `auth.uid()` to fix the warning — `auth.uid()` returns a `uuid` type and will return `NULL` for Clerk users (whose IDs are strings like `user_abc123`, not UUIDs), breaking all data access. The advisor warning is a known false positive for Clerk + Supabase setups and can be ignored.

**ESLint — custom rules in use:** `react-hooks/static-components` flags component definitions inside render functions — always hoist helper components to module scope. `react-hooks/set-state-in-effect` flags synchronous `setState` in `useEffect` bodies; add `// eslint-disable-next-line react-hooks/set-state-in-effect` for intentional SSR hydration guards like `setMounted(true)`.

**Turbopack HMR failure on significant component changes:** When a client component gains new props or new static attributes (ARIA, classnames), Turbopack sometimes fails to update the client-side bundle via hot reload. Symptom: hydration errors where props that should be static (e.g. `aria-expanded`, `className` from a new conditional prop) differ between server and client. Fix: stop and restart the dev server (`pnpm dev`).

**pnpm build script approvals:** If Vercel warns about "ignored build scripts" for a package, add it to `pnpm.onlyBuiltDependencies` in `package.json` (e.g. `"pnpm": { "onlyBuiltDependencies": ["bufferutil", "utf-8-validate"] }`). Do not run `pnpm approve-builds` interactively — it won't persist to CI.

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — used in all server actions and SSR client. The `NEXT_PUBLIC_` prefix is required; non-prefixed `SUPABASE_URL` / `SUPABASE_ANON_KEY` are not present and will cause a `supabaseUrl is required` error at runtime.
- Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, etc.)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — for web push notifications
- `SUPABASE_SECRET_KEY` — service role key (bypasses RLS); used in `getServiceSupabase()` in `data.ts` and all API routes
- `CRON_SECRET` — bearer token checked by `GET /api/keep-alive` to authenticate cron caller
