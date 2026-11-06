# Performance To-Do List
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
