# Performance & Maintenance To-Do List
_Update starting November 6, 2026_

## ✅ Already Done
- [x] Move Vercel functions to `pdx1`, next to Supabase in `us-west-2`
- [x] Add `app/dashboard/loading.tsx`
- [x] Combine the survey page reads into `getSurveyPageData()`
- [x] Remove `currentUser()` from the dashboard page
- [x] Add pending states to the sign-in and sign-up forms

---

## To Do

**[ ] 1. Measure logged-in page times**

On focusapp.dev, open DevTools → Network and turn on Fetch/XHR. Click Surveys, then Dashboard, then Surveys again, and note the Time column for the `survey` and `dashboard` requests. These are rough guides, not measured limits:

| Result | Likely meaning | Action |
|---|---|---|
| Only the first click is slow | Vercel cold start | Leave it alone |
| Every click takes more than ~500ms | Server still slow | Add timing to find the slow step |
| Under ~300ms | Server is fine | Look at browser rendering instead |

**[ ] 2. Test account creation on the live site**

The sign-up and email verification forms gained pending states in `56d7e0c`, but only sign-in has been tested. Try it once with a throwaway email, then delete the test account.

**[ ] 3. Reduce the server calls on survey submit**

`app/ui/dashboard/survey/survey-form.tsx:87-92` makes 6 server calls one after another before saving anything. Combine them into one parallel fetch. Estimate: about 15 minutes.

**[ ] 4. Add a pending state to `/forgot-password`**

`app/ui/forgot-password-form.tsx` has no pending state on either of its submit buttons (lines 167 and 246), so it likely has the same double-submit problem sign-in had. Match the sign-in form's pattern: `aria-disabled` on the button, progress text, and a guard in the handler.

**[ ] 5. Find out why `/dashboard/strategies` is dynamic**

It builds as a dynamic page even though `page.tsx` fetches no data. If nothing needs it to be dynamic, making it static would speed up that page.

---

## Dependencies & Tooling

**[ ] 6. Apply minor and patch updates**

Versions as of November 6, 2026. Run `pnpm build` and `pnpm lint` afterwards. Estimate: about 10 minutes.

| Package | Current | Latest |
|---|---|---|
| `next`, `eslint-config-next` | 16.4.3 | 16.4.5 |
| `@clerk/nextjs` | 7.9.22 | 7.9.25 |
| `@clerk/clerk-js` | 6.42.0 | 6.42.3 |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | 4.3.4 |
| `@supabase/supabase-js` | 2.118.0 | 2.119.0 |
| `resend` | 6.35.0 | 6.37.0 |
| `eslint` | 10.13.0 | 10.14.0 |
| `@types/react`, `@types/react-dom` | 19.2.x | 19.3.0 |

**[ ] 7. Re-check the `minimatch` advisory**

[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) (moderate) affects `minimatch` 10.2.6 and is fixed in 11.0.1. It only comes in through ESLint, so it never reaches production. Run `pnpm audit` after ESLint updates, and avoid forcing the major-version jump with an override.

**[ ] 8. Upgrade and log in to the Vercel CLI**

The CLI is at 59.11.2 (latest 65.12.1) and is logged out on this machine. Run `pnpm add -g vercel@latest`, then `vercel login`.

**[ ] 9. Decide on major-version updates**

None of these are security fixes, and each could break the build, so take them one at a time:
- `typescript` 6.0.3 → 7.0.2
- `@types/node` 25.8.0 → 26.6.6
- `@supabase/ssr` 0.10.3 → 0.12.7 (test auth afterwards)
- pnpm 11.25.0 → 12.18.0 (the move to pnpm 11 caused store and build-approval problems)

**[ ] 10. Decide whether to align Node versions**

Vercel builds with Node 22.x, and this machine runs Node 26.8.1. A build that passes locally may not behave the same on Vercel.

---

## Cleanup & Known Issues

**[ ] 11. Delete the stale worktree**

`.claude/worktrees/password-strength-meter` causes the one `pnpm lint` warning. Check it has no unmerged work before deleting it.

**[ ] 12. Make `/offline` and `/style-guide` public**

Neither is in `isPublicRoute` in `proxy.ts`, so signed-out visitors are redirected to `/sign-in`. That includes the PWA offline fallback.

**[ ] 13. Fix scheduled notifications**

`sendDueNotifications()` only matches within ±1 minute of the current time, but the cron runs once a day at 12:00 UTC, so notifications scheduled for any other time never send. Widen the window or add a time-of-day column.

**[ ] 14. Set `metadataBase`**

`pnpm build` warns that `metadataBase` isn't set, so social images resolve against `http://localhost:3000` in local builds. Check the Open Graph image URL in production, then set it to `https://www.focusapp.dev` in `app/layout.tsx`.
