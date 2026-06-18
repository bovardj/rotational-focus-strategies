# v2.0.0 — Release Notes (In Progress)

This document describes UI/UX and performance improvements made since v1.0.0 (Study Release), targeting the v2.0.0 release.

---

## Visual Design & Branding

- **Unified design language across all pages.** Every surface — landing, auth, onboarding, dashboard — now shares the same visual system: `bg-blue-50` outer background with three decorative radial glow divs (`bg-blue-100/80`, `bg-indigo-100/50`, `bg-blue-200/40` blurred with `blur-3xl`), a `rounded-2xl` white card with `shadow-xl shadow-blue-100/60`, and the RFS logo above the card.
- **WCAG AAA color palette enforced.** The entire project was audited and locked to a AAA-compliant blue: `bg-blue-800` / `text-blue-800` for all interactive elements (~8.6:1 contrast ratio). `text-blue-600` was removed everywhere it appeared for text (~4.17:1, fails even AA). `text-gray-600` is the minimum for body text. `text-red-800` replaces red-500 for error text.
- **RFS logo introduced** (`app/ui/rfs-logo.tsx`). A custom SVG logo using `currentColor` so it inherits text color. Used on every page — landing, auth, onboarding sidenav, 404. Accepts a `className` prop: `text-blue-800` on light backgrounds, `text-white` (default) on the dark sidenav. The orbit path uses a `<mask>` ellipse to prevent the orbit ring and arrowhead from overlapping.
- **Style guide added.** An internal `/style-guide` page and `STYLE_GUIDE.md` at the repo root document the color palette, typography, and all UI patterns with interactive Tailwind examples and component demos.
- **Sticky global header removed.** The `<header>` element in `app/layout.tsx` (which contained the app name and Clerk's `UserButton`) was removed. Account management is now handled in-context by the custom `UserNav` component.

---

## Landing Page

- **Fully redesigned.** The previous gray card with left-aligned text and Clerk modal buttons was replaced with a centered layout matching the auth shell: `bg-blue-50` background, three glow divs, RFS logo above card, white `rounded-2xl` card.
- **CTA hierarchy clarified.** "Create account" is a filled `bg-blue-800` primary button; "Sign in" is a white border button — stacked vertically with consistent spacing.
- **Clerk modal buttons replaced.** `<SignInButton>` and `<SignUpButton>` from `@clerk/nextjs` (which opened a modal and bypassed the custom auth pages) replaced with `<Link href="/sign-in">` and `<Link href="/sign-up">`.
- **Skip link added** (`sr-only focus-visible:not-sr-only`) targeting `#main-content` for keyboard navigation.
- **Study participation thank-you note removed** from the page copy.

---

## Authentication Pages (`/sign-in`, `/sign-up`, `/forgot-password`)

- **`AuthShell` component created** (`app/ui/auth-shell.tsx`). A shared wrapper providing the `bg-blue-50` background, three glow divs, RFS logo, and white `rounded-2xl` card. All three auth pages use it — no duplicated layout markup.
- **Sign-in form:**
  - `autoComplete="email"` and `autoComplete="current-password"` attributes added.
  - CapsLock warning converted from an absolutely-positioned `text-red-500` div to an always-rendered `<div aria-live="polite">` with `text-red-800` (AAA-safe).
  - Decorative icons get `aria-hidden="true"`. Eye/password-toggle button gets `aria-label`.
  - Links to `/sign-up` and `/forgot-password` updated from `text-blue-600` to `text-blue-800`.
- **Sign-up form:**
  - When the email verification step appears, focus is programmatically shifted to the verification heading via `useRef` + `useEffect`, preventing the user's focus from being stranded on the now-hidden email/password inputs.
- **Forgot-password form:**
  - Focus shifts programmatically to the new-password field after successful email verification.
  - "Sign in instead" link added at the bottom.
  - CapsLock warning uses `aria-live="polite"`.

---

## Onboarding Flow (`/onboarding`)

- **Layout completely restyled.** The previous `h-screen overflow-hidden` layout was replaced with a `min-h-screen bg-blue-50 p-6` outer wrapper matching the rest of the site. Sidenav: dark `bg-blue-900 rounded-2xl` card, `md:sticky md:top-6`. Content: white `rounded-2xl` card capped at `max-w-3xl`.
- **Strategy selection UI rebuilt:**
  - Replaced `@geist-ui/react` third-party `<Collapse>` with a custom React-controlled accordion using `useState<Set<number>>`.
  - Strategy cards use `grid-template-rows: 0fr → 1fr` CSS transition for animated open/close (height-to-auto without JS measurement).
  - Each card is a styled `rounded-lg border-2` container; selected state changes border to `border-blue-500 bg-blue-50`.
  - Checkbox and accordion toggle are separate `<button>` elements — previously they were nested in a single click target.
  - A live "N of 3 selected" counter with `aria-live="polite"` and a checkmark icon (non-color indicator when valid) replaces the hidden error paragraph.
  - "Collapse" button added at the bottom of open accordion cards.
  - External strategy links open in a new tab with a `<span className="sr-only">(opens in new tab)</span>` announcement.
  - Welcome message personalised to include the user's email address.
- **Post-onboarding redirect** changed from `/` (public landing page) to `/dashboard/instructions`.
- **Onboarding sidenav:**
  - Now dark `bg-blue-900` with `text-white`. Logo bar bleeds flush to card edges via negative margins.
  - Custom `UserNav` added (replacing Clerk's `UserButton`).
  - `SyncUserToSupabase` client component removed; user sync moved to a server action in `layout.tsx`.
- **Unused strategy detail pages** under `/onboarding/strategies/` (8 pages) removed — they had incorrect breadcrumb URLs and were never linked from the onboarding flow.

---

## Dashboard

- **Layout restyled:**
  - Previous `h-screen flex-col md:flex-row md:overflow-hidden` replaced with `min-h-screen bg-blue-50 p-6 gap-6` matching the rest of the site.
  - Sidenav rendered as a `rounded-2xl bg-blue-900` sticky card.
  - `overflow-y-auto` removed from the content pane — it was creating a nested scroll container that caused the fixed mobile bottom nav bar to scroll away.
- **Mobile bottom nav bar added** as `position: fixed inset-x-0 bottom-0` with `env(safe-area-inset-bottom)` padding and `viewport-fit=cover` in the root viewport export. `pb-24` added to content cards to clear the fixed nav.
- **Sidenav:** Logo bar flushes to card edges. `NavLinks` uses `dark` prop for white-on-dark styling. Custom `UserNav` replaces Clerk's `UserButton`.
- **Nav links updated:** "Home" renamed to "Dashboard"; "Instructions" link added (`InformationCircleIcon`, `/dashboard/instructions`). `aria-current="page"` on active links.
- **`PageCard` component created.** A shared white `rounded-2xl border border-gray-100 bg-white shadow-xl shadow-blue-100/60` wrapper capped at `max-w-3xl`. All dashboard pages wrap their content in `<PageCard>`.
- **Dashboard home page:**
  - "Today's Focus Strategy" is now a clickable `<Link>` banner with a blue left border, strategy name in large `lusitana` font, clock icon with date, and a "View details →" affordance. Previously it was a small centered `bg-gray-50` card.
  - Progress cards redesigned from a single `<Collapse>` accordion into three inline `Phase` cards — Baseline, Daily, Exit — each with a `role="progressbar"` progress bar and completion count.
  - "Your Strategies" and "Previously Assigned Strategies" shown in `md:grid-cols-2` side-by-side layout.
  - `CollapseInstructions`, `CollapseNotes`, and "Questions, Bug Reporting & Help" removed from the dashboard; content moved to the new Instructions page.
- **`UserNav` component introduced** (`app/ui/dashboard/user-nav.tsx`). Fully custom dropdown replacing Clerk's `UserButton`. Features: initials avatar, full name display, `openUserProfile()` for Clerk account modal, notifications link (disabled until onboarding is complete), sign-out. Supports `compact` (mobile) and full-width (desktop sidenav) modes, plus `dark` prop. Dropdown uses `createPortal` to escape the `overflow-hidden` sidenav container.

---

## Instructions Page (`/dashboard/instructions`)

- **New page added.** Users are redirected here after completing onboarding.
- **Wizard-style layout:** Four steps rendered in a CSS grid with `[grid-area:1/1]` so all panels share the same cell, eliminating layout shift between steps. Inactive panels use `visibility:hidden` (not `display:none`) to stay in layout flow while removed from tab order. A `useRef(true)` first-render guard prevents focus from being yanked to the step heading on initial load.
- **Steps:** Welcome (3-bullet overview), General (contact email, key rules), Study Phases (numbered vertical timeline with pill badges for day counts), Optional & Help (PWA install instructions, troubleshooting, contact).
- **Right-side sticky navrail** (`lg+` only) with `IntersectionObserver` for active-section highlighting, distinct `aria-label="Page sections"`.

---

## Survey Experience

- **`SurveyProgress` component added.** A visual progress indicator showing all 7 study days (3 baseline + 4 daily) plus the exit survey as blob circles. Completion is determined by submission count — not date matching — so non-consecutive submissions are handled correctly. Phase labels (`flex-[3]` / `flex-[4]` / `flex-[1]`) mirror blob proportions. Shows actual submission dates once surveys start.
- **Likert scale form redesigned:**
  - Each option is now a full-width `rounded-lg border` row with a visible radio input and `has-checked:bg-blue-50 has-checked:border-blue-800` selection styling. Previously, options were a flat list with no visual container.
  - `<div>` used for the visual card; `<fieldset><legend className="sr-only">` inside for screen reader semantics (avoids the `<legend>` border-break bug when card styling is on `<fieldset>` directly).
  - All 5 scale labels shown (not just endpoint labels).
- **Survey form validation:** `window.alert()` replaced with an always-rendered `<div role="alert" aria-live="assertive">` showing errors inline. Submit button state resets correctly on validation failure.
- **Survey layout:** `max-w-2xl`, left-aligned (no `mx-auto`).

---

## Strategy Pages

- **Individual strategy pages refactored** into a single `[slug]` dynamic route (`app/dashboard/strategies/[slug]/page.tsx`). The 8 static page files were deleted. `generateStaticParams()` pre-renders all 8 at build time; `notFound()` handles unknown slugs.
- **Breadcrumbs added** to each strategy page.
- **Strategies list page** (`/dashboard/strategies`): HTML `<table>` replaced with `StrategyCards` component. Strategies split into "Your Strategies" and "Other Strategies" sections. User-owned strategies get a blue left border (`border-l-4 border-l-blue-800`). Each card shows strategy name and a short description.

---

## Notifications & PWA

- **Service worker expanded** (`public/sw.js`): Now precaches `/offline`, `/`, and icon assets on install. Adds stale-while-revalidate for navigation, and cache-first for `/_next/static/`, images, scripts, and styles.
- **Offline fallback page** (`/offline`) created.
- **`PushNotificationManager` redesigned:** Mounted guard prevents SSR hydration mismatch. Test notification button shows status feedback (`idle` / `sending` / `sent` / `error`). Styled with a `rounded-lg bg-gray-50 border border-gray-200` card.
- **Notifications page significantly expanded:**
  - `PushNotificationManager` embedded at the top.
  - **Timezone picker added:** detects the user's timezone via `Intl.DateTimeFormat`; dropdown shows common IANA timezone names. User-entered times are converted to UTC before storage, handling half-hour timezone offsets correctly.
  - **Scheduled notifications list** with per-item delete buttons.
  - **Warning banner** (`role="note"`) explaining Vercel free-plan cron limitations for scheduled push notifications.
  - Notifications link in `UserNav` disabled (grayed out) until onboarding is complete.
- **Cron schedule changed** from per-minute (`* * * * *`) to once-daily (`0 12 * * *`) to stay within Vercel Hobby plan limits.

---

## Accessibility (WCAG)

- **Skip links** added to landing, auth, onboarding, and dashboard layouts.
- **`aria-current="page"`** on all active nav links.
- **`aria-hidden="true"`** on all decorative icons across auth, dashboard, and survey forms.
- **`aria-label`** on icon-only buttons: eye/password-toggle, UserNav compact mode, accordion checkbox buttons.
- **`aria-live="polite"`** for CapsLock warnings (always-rendered, never conditionally mounted).
- **`role="alert" aria-live="assertive"`** for survey validation errors.
- **`<fieldset><legend className="sr-only">`** for all radio and checkbox question groups in survey forms.
- **`UserNav` dropdown:** `aria-expanded`, `aria-haspopup="menu"`, `aria-controls`, `role="menu"`, `role="menuitem"`. Escape key closes it; focus moves to first item on open.
- **`role="progressbar"`** with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` on all progress bars.
- **External links** in onboarding get `<span className="sr-only">(opens in new tab)</span>`.
- **Multi-step form focus management:** verification step in sign-up shifts focus to the step heading; forgot-password shifts focus to the new-password input after the code step. A `isFirstRender` ref guard prevents focus from being yanked on initial page load.
- **Multiple `<nav>` landmarks** given distinct `aria-label` values (`"Main navigation"`, `"Page sections"`).
- **`autocomplete` attributes** added to all auth form inputs.

---

## Performance & Code Quality

- **Dashboard data fetching parallelised:** 6 sequential Supabase calls on the dashboard page replaced with a `getDashboardCounts()` function running 2 queries in `Promise.all`.
- **`unstable_cache` applied** to `fetchUserStrategies()` and `getDaysExpected()` — both are immutable after onboarding and cached per-user with explicit cache tags.
- **`getDailyStrategy()` short-circuits** if today's assignment is already fetched — skips a Supabase round-trip on repeat visits.
- **`@geist-ui/react` removed.** Custom `Collapse` component (`app/ui/components/collapse.tsx`) using the `grid-template-rows: 0fr → 1fr` CSS transition replaces the third-party library. Optional `storageKey` prop persists open/closed state to `localStorage` (SSR-safe lazy initialiser).
- **`SyncUserToSupabase` client component removed.** Logic moved to a server action called in the onboarding `layout.tsx` server component.
- **Supabase client refactored** from module-level instantiation to a `getSupabase()` factory function — prevents stale auth tokens between requests.
- **`getServiceSupabase()`** added (service role key, bypasses RLS) for tables with INSERT-only RLS policies.
- **Dependency upgrades:** Next.js 15 → 16, React 19.1 → 19.2, Clerk 6 → 7, Supabase JS 2.49 → 2.105, TypeScript 5 → 6, ESLint 9 → 10, Tailwind 3 → 4, Zod 3 → 4.
- **Tailwind v4 migration:** `tailwind.config.ts` removed; configuration moved to `@theme` blocks in `global.css`.
- **`middleware.ts` renamed to `proxy.ts`** per Next.js 16 convention.

---

## Bug Fixes

- **Clerk modal buttons replaced** — `<SignInButton>`/`<SignUpButton>` were opening a modal and bypassing custom auth pages despite `NEXT_PUBLIC_CLERK_SIGN_IN_URL` being set.
- **`UserNav` hydration mismatch fixed** — `useUser()` returns `null` on first client render but has data during SSR; initials/name are now gated behind a `mounted` state.
- **`InstallPrompt` hydration mismatch fixed** — moved to `InstallPromptClient.tsx` with a mounted guard.
- **Likert scale horizontal overflow on mobile fixed** — overflow was causing `position: fixed` elements (mobile bottom nav) to detach from the visual viewport and scroll away.
- **Sidenav dropdown clipping fixed** — the `overflow-hidden` sidenav card clipped absolute-positioned dropdowns. Fixed via `createPortal` into `document.body` with `getBoundingClientRect()` coordinates.
- **Onboarding redirect fixed** — completion previously redirected to `/` (landing page) instead of `/dashboard/instructions`.
- **Onboarding writes made idempotent** to prevent duplicate database rows on double-submit.
- **`session_exists` error in sign-up** handled gracefully.
- **`border-gray-150`** (invalid Tailwind v4 token, renders as no border) replaced with `border-gray-200` throughout survey forms.
- **`Button` component text color workaround** — `text-white` is baked in and cannot be overridden; affected buttons now use plain `<button>` elements where a different color is needed.
- **Date input format fixed** — `toLocaleString("en-US")` produces `M/D/YYYY` (invalid for `<input type="date">`); replaced with `toLocaleDateString("en-CA")` which outputs `YYYY-MM-DD`.
- **React CVE patched** — Next.js upgraded to 15.2.6 to address the React Server Components (React2Shell) vulnerability.
- **Per-minute cron removed** — `* * * * *` cron on the Vercel Hobby plan silently blocked all subsequent builds on the branch; changed to `0 12 * * *`.
- **`focus-visible:outline` lint warning fixed** in `Button` component — `outline-2` alone is sufficient; the bare `outline` was redundant.
