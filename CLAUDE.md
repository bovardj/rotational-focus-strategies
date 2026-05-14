# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Rotational Focus Strategies (RFS) is a Next.js 15 web app for people with ADHD. It assigns users a rotating daily focus strategy (Pomodoro, chunking, background sound, etc.), collects survey data across three study phases (baseline → daily → exit), and analyzes effectiveness. Deployed at [focusapp.dev](https://www.focusapp.dev).

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

**Key Supabase tables:** `user_strategies`, `assigned_strategies`, `days_expected`, `days_completed`, `baseline_survey_responses`, `daily_survey_responses`, `end_survey_responses`, `subscriptions`

**User flow:**
1. Sign up → onboarding (select strategies, stored in `user_strategies`, sets `onboardingComplete` in Clerk metadata)
2. Baseline phase: 3 days of surveys without strategy assignment
3. Daily phase: 4 days, each day `getDailyStrategy()` randomly picks a strategy not assigned yesterday and writes to `assigned_strategies`
4. Exit survey → study complete

**Strategy rotation logic** (`app/lib/actions/actions.ts:getDailyStrategy`): Checks if today already has an assignment; if not, picks randomly from the user's selected strategies excluding yesterday's assignment.

**Push notifications:** Service worker at `public/sw.js`, subscription saved via `POST /api/save-subscription`, notifications sent via `app/api/send-due.ts/route.ts` using the `web-push` package.

**Route structure:**
- `/` — public landing page
- `/sign-in`, `/sign-up`, `/forgot-password` — public auth pages
- `/onboarding/**` — strategy selection flow (8 strategy detail pages + final selection)
- `/dashboard` — main app (today's strategy, history table, survey, notifications, individual strategy pages)

**UI:** Tailwind CSS + `@geist-ui/core` component library + `@heroicons/react`. Survey forms live in `app/ui/dashboard/survey/` with `likertScale-form.tsx` and `checkBox-form.tsx` question types.

## Environment Variables

Required in `.env`:
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` — used in server actions with Clerk JWT auth
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — used in SSR client
- Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, etc.)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — for web push notifications
