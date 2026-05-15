# Performance Improvements — 2026-05-15

## What Was Done

Three changes were made to reduce page load time on the dashboard, which was making 9+ sequential Supabase queries on every render.

---

### 1. Consolidate and parallelize dashboard queries

**Problem:** `dashboard/page.tsx` made 9 sequential `await` calls — each one blocked the next. Total latency was the *sum* of all round trips.

**Fix:** Grouped the 6 count-related queries into a single `getDashboardCounts()` function (`app/dashboard/survey/_data.ts`) that fires 2 parallel `Promise.all` queries. The top-level page fetches are then wrapped in a second `Promise.all` so all independent data loads start simultaneously.

```ts
// Before: 9 sequential awaits (~900ms+ of serial latency)
const a = await queryA()
const b = await queryB()
// ...

// After: all independent fetches in parallel
const [counts, user, strategies, assignedStrategies] = await Promise.all([
  getDashboardCounts(),
  currentUser(),
  fetchUserStrategies(),
  fetchAssignedStrategies(),
])
```

**Files changed:** `app/dashboard/page.tsx`, `app/dashboard/survey/_data.ts`

---

### 2. Skip redundant strategy assignment query

**Problem:** `getDailyStrategy()` always ran a database write (or read-then-write) even when the dashboard had already fetched `assigned_strategies` and today's assignment was in the result.

**Fix:** Check the already-fetched `assigned_strategies` list for today's date before calling `getDailyStrategy()`. If today's assignment exists, use it directly and skip the extra query.

```ts
const todayStr = new Date().toLocaleDateString('en-us', { timeZone: 'America/Los_Angeles' })
const todayAssigned = userAssignedStrategies?.find(s => s.date === todayStr) ?? null
let latestStrategy = null
if (baselineCompleted) {
  latestStrategy = todayAssigned ?? await getDailyStrategy()
}
```

**Files changed:** `app/dashboard/page.tsx`

---

### 3. Replace @geist-ui/react Collapse with native `<details>`

**Problem:** `@geist-ui/react` and its peer `@geist-ui/core` were imported only for the `<Collapse>` accordion component. This added ~100KB of JavaScript to the client bundle and required `"use client"` on several components that were otherwise pure server components.

**Fix:** Replaced with a 35-line native `<details>`/`<summary>` component at `app/ui/components/collapse.tsx`. It uses Tailwind's `group-open:` variant for the chevron animation and has no JavaScript at all. All five dashboard collapse wrapper components and the onboarding page were updated to use the new component and are now server components where applicable.

**Bundle impact:** Removed two packages (`@geist-ui/react`, `@geist-ui/core`) from the production bundle.

**Files changed:**
- Created: `app/ui/components/collapse.tsx`
- Removed `"use client"`: `collapse-instructions.tsx`, `collapse-notes.tsx`, `collapse-previous-strategies.tsx`, `collapse-progress.tsx`, `collapse-strategy.tsx`
- Updated import: `app/onboarding/page.tsx`
- Removed Geist-specific CSS: `app/ui/global.css`

---

### 4. Cache stable post-onboarding data with `unstable_cache`

**Problem:** `user_strategies` and `days_expected` are written once during onboarding and never change afterward, but they were fetched fresh from Supabase on every dashboard load.

**Fix:** Wrapped `fetchUserStrategies()` (`app/lib/data.ts`) and the `days_expected` query (`app/dashboard/survey/_data.ts`) in Next.js `unstable_cache` with `revalidate: false`. The cache is keyed per user and tagged so it can be invalidated if needed.

The Clerk JWT can't be used inside the cache closure (it's request-scoped), so these cached fetches use the Supabase service role key (`SUPABASE_SECRET_KEY`) with an explicit `user_id` filter — the service role key bypasses RLS, but the `eq('user_id', userId)` predicate enforces the same row-level restriction.

`revalidateTag` calls were added to `completeOnboarding()` and `initializeDaysExpected()` in `app/onboarding/_actions.ts` so the cache is correctly busted if a user ever re-onboards.

```ts
// app/lib/data.ts
export async function fetchUserStrategies() {
  const { userId } = await auth()
  if (!userId) throw new Error('No Logged In User')

  return unstable_cache(
    async () => {
      const { data, error } = await getServiceSupabase()
        .from('user_strategies')
        .select('strategies')
        .eq('user_id', userId)
        .single()
      if (error) throw new Error('Error fetching user strategies: ' + error.message)
      return data?.strategies
    },
    [userId, 'user-strategies'],
    { revalidate: false, tags: [`user-strategies-${userId}`] }
  )()
}
```

**Files changed:** `app/lib/data.ts`, `app/dashboard/survey/_data.ts`, `app/onboarding/_actions.ts`

---

## Key Constraints to Keep in Mind

- **Do not use `auth.uid()` in Supabase queries** — it returns `uuid` type and is always `NULL` for Clerk users (whose IDs are strings like `user_abc123`). Always use `auth.jwt() ->> 'sub'` in RLS policies. The service role key bypasses RLS entirely, so this constraint only applies to RLS policy SQL, not application code using the service role key.
- **`unstable_cache` cannot call `auth()` or use Clerk tokens** — Clerk tokens are request-scoped and unavailable in the cache closure. Use the service role key with an explicit user filter instead.
- **`revalidateTag` in Next.js 16 requires a second argument** — the signature is `revalidateTag(tag: string, profile: string | CacheLifeConfig)`. Pass `{}` to purge without setting a new expiry.
