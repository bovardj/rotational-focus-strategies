# v2.0.0 — Release Notes (In Progress)

This document describes UI/UX and performance improvements made since v1.0.0 (Study Release), targeting the v2.0.0 release.

---

## Visual Design & Branding

- **Open Graph image added.** `app/opengraph-image.tsx` renders a branded 1200×630px preview card (orbit mark + "Rotational Focus Strategies" + subtitle + URL on dark blue `#1e3a8a`) via `next/og` / `ImageResponse`. Wired in root layout with `openGraph` and `twitter` metadata fields. WCAG AAA compliant: title white (~10.4:1), subtitle/URL `#93c5fd` (~5.75:1 at large text sizes). Gracefully degrades if Google Fonts is unreachable.
- **Branded favicon and PWA icons.** `app/icon.svg` added — the RFS orbit mark (white on `#1e3a8a` dark blue rounded-square badge), served automatically by Next.js App Router as the browser tab icon. Five PNG sizes generated via `scripts/generate-favicons.js` (512×512, 192×192, 180×180, 32×32, 16×16) for PWA home screen and legacy browser support. PWA manifest `theme_color` corrected from `#3182ce` to `#1e3a8a`; icon list cleaned up (removed `.ico` entry, added all PNG sizes).
- **Unified design language across all pages.** Every surface — landing, auth, onboarding, dashboard — now shares the same visual system: `bg-blue-50` outer background with three decorative radial glow divs (`bg-blue-100/80`, `bg-indigo-100/50`, `bg-blue-200/40` blurred with `blur-3xl`), a `rounded-2xl` white card with `shadow-xl shadow-blue-100/60`, and the RFS logo above the card.
- **WCAG AAA color palette enforced.** The entire project was audited and locked to a AAA-compliant blue: `bg-blue-800` / `text-blue-800` for all interactive elements (~8.6:1 contrast ratio). `text-blue-600` was removed everywhere it appeared for text (~4.17:1, fails even AA). `text-gray-600` is the minimum for body text. `text-red-800` replaces red-500 for error text.
- **RFS logo introduced** (`app/ui/rfs-logo.tsx`). A custom SVG logo using `currentColor` so it inherits text color. Used on every page — landing, auth, onboarding sidenav, 404. Accepts a `className` prop: `text-blue-800` on light backgrounds, `text-white` (default) on the dark sidenav. The orbit path uses a `<mask>` ellipse to prevent the orbit ring and arrowhead from overlapping.
- **Style guide added.** An internal `/style-guide` page and `STYLE_GUIDE.md` at the repo root document the color palette, typography, and all UI patterns with interactive Tailwind examples and component demos.
- **Sticky global header removed.** The `<header>` element in `app/layout.tsx` (which contained the app name and Clerk's `UserButton`) was removed. Account management is now handled in-context by the custom `UserNav` component.

---

## Landing Page

- **Rebuilt as a full portfolio showcase.** The page was redesigned from a minimal sign-in portal into a multi-section portfolio page for recruiters: sticky `bg-blue-900` nav, hero section with glow orbs and CTAs, "How the study worked" overview card with phase timeline, feature highlights grid, and a "Built with" tech stack footer. Clerk modal buttons replaced with `<Link>` tags; skip link added; study participation copy removed.
- **Sticky nav bar** with RFS logo (links to `/`), GitHub repository link (with `sr-only` new-tab announcement), and Sign in button. Nav uses `aria-label="Main navigation"`.
- **Hero section** with three decorative radial glow divs (matching the auth shell), Lusitana heading, project description, and two CTAs: "Create account" (primary `bg-blue-800`) and "Sign in" (white border).
- **Overview card** (`rounded-2xl bg-white`) containing a three-phase timeline (Baseline · 3 days / Daily Focus · 4 days / Exit) with proportional flex cells and a screenshot gallery. The timeline stacks vertically on mobile and displays as a horizontal row on `sm+`.
- **Screenshot gallery with lightbox modal:**
  - Three screenshots displayed as unified thumbnail cards: `overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm`, image flush at top, caption in a `bg-gray-50 border-t` card body below.
  - Thumbnails use `<figure>`/`<figcaption>` markup; hover overlay reveals an expand icon.
  - Clicking a thumbnail opens a full-screen lightbox (`role="dialog" aria-modal="true"`) with the image at full resolution.
  - **Lightbox features:** scroll-wheel zoom, click-and-drag pan with clamped bounds, pinch-to-zoom (two-finger), swipe-to-navigate (single-finger horizontal swipe), left/right arrow buttons (desktop), keyboard navigation (Arrow keys, Escape), zoom in/out buttons with percentage display, image counter live region, caption bar below image.
  - Page scroll is locked (`document.documentElement.style.overflow = "hidden"`) while the lightbox is open.
  - Modal closes only when the pointer is both pressed and released on the backdrop (prevents accidental close on drag-release).
  - `animate-scale-in` CSS keyframe animation on open.
- **Feature highlights grid:** Three white `rounded-2xl` cards (Rotation algorithm, Push notifications + PWA, Clerk + Supabase RLS) in a `grid-cols-1 sm:grid-cols-3` responsive layout.
- **Stack + CTA footer:** Dark `bg-blue-900` card with tech chips (`<ul>`/`<li>` list) and a "Get started" CTA linking to `/sign-up`.
- **RFS logo on auth pages links to `/`** — the logo in `AuthShell` is wrapped in `<Link href="/">` so users can return to the landing page from sign-in/sign-up.

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
  - The verification code prompt now shows the specific email address the code was sent to (e.g. "Enter the verification code sent to **user@example.com**") rather than a generic "your email address" — making it easier to verify the correct inbox was used.
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
  - "Your Strategies" and "Previously Assigned Strategies" shown in `lg:grid-cols-2` side-by-side layout.
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

## Instructions Page (`/dashboard/instructions`)

- **Content corrected for consistency** — the wizard step copy was audited and updated to match the actual study flow and terminology used elsewhere in the app.

---

## Accessibility (WCAG)

- **Landing page WCAG AAA audit completed:**
  - `text-gray-500` (5.7:1, AA only) replaced with `text-gray-600` (7.4:1) in thumbnail figcaptions.
  - `text-white/80` (borderline) on the nav GitHub link replaced with `text-white`.
  - `<p>` used as "Built with" section heading replaced with `<h2>` (2.4.10 Section Headings).
  - Tech stack chips converted from `<span>` in a `<div>` to `<ul>`/`<li>` list elements.
  - GitHub nav link given a descriptive `aria-label="RFS GitHub repository (opens in new tab)"` (2.4.9 Link Purpose).
  - Lightbox dialog given `aria-describedby` referencing a visually hidden element explaining keyboard controls.
  - Screenshot counter given `aria-live="polite" aria-atomic="true"` so navigation is announced to screen readers.
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
- **Clerk API version updated** from `2024-10-01` to `2026-05-12`. Code change: `updateUser()` with `publicMetadata` replaced by `updateUserMetadata()` in `completeOnboarding()` (the old parameter is removed in the new API version). `ClerkProvider` moved inside `<body>` per Core 3 requirements. Clerk Backend API version updated in the Clerk Dashboard.
- **Resend integrated** for transactional email (`resend` package). Domain `focusapp.dev` verified in Resend. Used in `app/api/keep-alive/route.ts` to send failure alerts.
- **Tailwind v4 migration:** `tailwind.config.ts` removed; configuration moved to `@theme` blocks in `global.css`.
- **`middleware.ts` renamed to `proxy.ts`** per Next.js 16 convention.

---

## Bug Fixes

- **Lightbox image/caption layering fixed** — the caption overlaid the bottom of the image at minimum zoom; restructured so the caption renders in normal flow below the image container, with `overflow-hidden` on the container to clip the image when zoomed.
- **Lightbox pan clamping fixed** — pan bounds now use `naturalWidth`/`naturalHeight` to compute the actual rendered content size within the `object-contain` letterbox, preventing over-panning into empty background space.
- **Lightbox backdrop close fixed** — previously the modal could close when the user dragged from inside and released outside (or vice versa). Fixed with a `backdropPressedRef` that tracks whether the pointer was pressed on the backdrop; close only fires when both press and release are on the backdrop.
- **Blur bleed on landing page hero fixed** — `overflow: hidden` does not reliably clip `filter: blur()` paint in all browsers. Changed to `overflow: clip` (Tailwind `overflow-clip`) which cuts paint at the exact border edge including filter effects.
- **RFS logo sizing on landing page fixed** — wrapping `<RFSLogo>` in a `w-28` container constrained the internal flex row and distorted the SVG-to-text proportion. Wrapper removed; logo now renders at natural size matching auth and dashboard pages.
- **Survey page title edited** for clarity.
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
- **Supabase keep-alive improved** — schedule changed from weekly (Mondays only) to twice weekly (Monday + Thursday, `0 8 * * 1,4`) to provide buffer before Supabase's 7-day inactivity pause. Route now returns a proper 500 on failure and sends an email alert via Resend instead of silently returning 200.
- **`focus-visible:outline` lint warning fixed** in `Button` component — `outline-2` alone is sufficient; the bare `outline` was redundant.
- **Dashboard card grid breakpoints corrected** — "Your Strategies"/"Previously Assigned Strategies" and "Your Progress" phase cards used `md:` / `sm:` breakpoints (768px / 640px), which caused awkward wrapping at medium widths. Both changed to `lg:` (1024px) to give cards enough room before switching to multi-column.
