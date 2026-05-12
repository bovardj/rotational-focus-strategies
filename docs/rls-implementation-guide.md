# RLS Implementation Guide

> **Scope:** All changes needed to apply the policy proposals in `rls-policy-assessment.md`.
> Covers both application code changes and Supabase database changes, in the correct order.

---

## Order of operations

Applying RLS in the wrong order will break the app. Two tables (`users`, `user_strategies`) currently rely on an anon Supabase client that has no JWT — tightening those policies before fixing the code will break onboarding for new users. Follow the phases below in sequence.

```
Phase 1   ✓ COMPLETE   Database   Policies for tables already on the correct JWT client
Phase 1.5 ✓ COMPLETE   Database   Policy for subscriptions (no code change required)
Phase 2   ✓ COMPLETE   Code       Fix the three broken client patterns
Phase 3   ✓ COMPLETE   Deploy     Push Phase 2 changes to production
Phase 4   ✓ COMPLETE   Database   Policies for tables that depended on Phase 2
Phase 5   ✓ COMPLETE   Cleanup    Restrict or drop unused tables

Verification Checklist            Clerk needs updated first
```

---

## How to apply SQL in Supabase

All SQL blocks below are run in the **Supabase dashboard SQL editor**:
`Project → SQL Editor → New query → paste → Run`

Before creating any new policy on a table, first **delete existing permissive policies** for that table:
`Project → Authentication → Policies → select the table → click the trash icon on each existing policy`

---

## Phase 1 — Database changes ✓ COMPLETE

The following seven tables use the JWT-authenticated Supabase client throughout the codebase and had their policies applied in Phase 1: `assigned_strategies`, `days_expected`, `days_completed`, `baseline_survey_responses`, `daily_survey_responses`, `end_survey_responses`, `scheduled_notifications`.

> The cron dispatcher for `scheduled_notifications` (`sendDueNotifications`) uses the Supabase service role key, which bypasses RLS entirely — the user-facing policies applied here do not affect it.

---

## Phase 1.5 — Database changes (safe to apply now)

`subscriptions` was originally grouped with Phase 4 because the broken `save-subscription/route.ts` used an anon client. That route is dead code — no frontend code calls it. The actual write path (`subscribeUser` / `unsubscribeUser` in `app/lib/actions/notifications.ts`) already uses the JWT client correctly, so these policies can be applied without any code changes first.

---

### `subscriptions`

```sql
CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "subscriptions_insert_own"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "subscriptions_update_own"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub')
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "subscriptions_delete_own"
  ON subscriptions FOR DELETE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');
```

---

## Phase 2 — Code changes

Three places in the codebase use a bare anon Supabase client instead of the JWT-authenticated one. Each is a distinct fix.

---

### Fix 1 — `app/onboarding/_actions.ts`: remove the local anon client in `completeOnboarding`

**The problem:** `completeOnboarding` creates a fresh `createClient` call at lines 58–61 with no `accessToken` hook, so the `user_strategies` insert runs as the anon role. The correctly configured JWT client (`supabase`) is already defined at the top of the same file and is used by every other function in the file.

**What to change:** Delete the four lines that create the local client inside `completeOnboarding` so the function uses the module-level `supabase` variable instead.

**Before:**
```typescript
export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth()
  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const selectedStrategies = formData.getAll('strategy') as string[]
  const supabase = createClient(           // ← these four lines
    process.env.SUPABASE_URL || '',        //   shadow the module-level
    process.env.SUPABASE_ANON_KEY || ''   //   supabase variable with
  )                                        //   an unauthenticated client

  const { error } = await supabase
    .from('user_strategies')
    ...
```

**After:**
```typescript
export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth()
  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const selectedStrategies = formData.getAll('strategy') as string[]

  const { error } = await supabase          // ← uses the JWT client
    .from('user_strategies')                //   defined at the top of the file
    ...
```

---

### Fix 2 — `app/onboarding/layout.tsx` + `app/components/SyncUserToSupabase.tsx`: move user sync to the server

**The problem:** `SyncUserToSupabase` is a client component that uses the browser anon Supabase client (`app/lib/supabase/client.ts`) — no Clerk JWT is passed, so the `users` table check and insert run as the anon role. The onboarding layout that renders it (`app/onboarding/layout.tsx`) is already a Server Component with access to `auth()`, which means the sync can happen there directly with no client component involved.

**Step A — Add a `syncUserToSupabase` function to `app/onboarding/_actions.ts`**

Add the following function to the existing `_actions.ts` file. It uses the module-level JWT `supabase` client already present in that file.

```typescript
export const syncUserToSupabase = async () => {
  const { userId } = await auth()
  if (!userId) return

  const { data: existingUser } = await supabase
    .from('users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existingUser) {
    const { error } = await supabase
      .from('users')
      .insert({ user_id: userId })
    if (error) throw new Error('Error syncing user to Supabase: ' + error.message)
  }
}
```

> **Note:** The `email` field that `SyncUserToSupabase` was inserting via `user.primaryEmailAddress?.emailAddress` is not available server-side from `auth()` — only `userId` is. If storing email in the `users` table is important, you can retrieve it from Clerk with `(await clerkClient()).users.getUser(userId)` and include it in the insert. If the `users` table is only used as a presence check for RLS join purposes, `user_id` alone is sufficient.

**Step B — Call it from `app/onboarding/layout.tsx`**

Replace the `<SyncUserToSupabase />` component render with a direct call to the server function:

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideNav from "@/app/ui/onboarding/sidenav";
import { syncUserToSupabase } from "@/app/onboarding/_actions";   // ← add this import

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }

  await syncUserToSupabase();   // ← replace <SyncUserToSupabase /> with this

  return (
    <>
      {/* SyncUserToSupabase removed */}
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        ...
      </div>
    </>
  );
}
```

**Step C — Delete `app/components/SyncUserToSupabase.tsx`**

Once the layout no longer imports it, the component file is unused and can be deleted.

---

### Fix 3 — Delete `app/api/save-subscription/route.ts`

**The problem:** This route has two bugs — it uses a bare anon client (no JWT) and passes `userId` as the column key (camelCase) instead of the actual column name `user_id`. More importantly, it is never called by any frontend code: `app/components/pwaComponents.tsx` calls `subscribeUser` from `app/lib/actions/notifications.ts` directly (a server action), not this API route.

**What to do:** Delete the file `app/api/save-subscription/route.ts`. The `subscribeUser` and `unsubscribeUser` server actions in `notifications.ts` are the correct path and will continue to work.

---

## Phase 3 — Deploy

Deploy the Phase 2 code changes to production before proceeding. The Phase 4 database changes will block the anon client paths — if old code is still live when you apply Phase 4, new user signups and onboarding completions will fail.

---

## Phase 4 — Database changes (after Phase 3 is live)

`users` and `user_strategies` cannot have scoped policies until the Phase 2 code fixes are deployed. If policies on these tables were deleted before the code is fixed and the app needs to stay functional in the meantime, apply the temporary stopgap for each table first, then replace it with the final scoped policies once Phase 3 is live.

---

### `users`

**Temporary stopgap** *(apply now if the table has no policies and the app is broken; remove after Phase 3 is live)*

```sql
CREATE POLICY "users_temp_open"
  ON users FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

**Final scoped policies** *(drop the stopgap first, then run these after Phase 3 is live)*

```sql
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "users_insert_own"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');
```

---

### `user_strategies`

**Temporary stopgap** *(apply now if the table has no policies and the app is broken; remove after Phase 3 is live)*

```sql
CREATE POLICY "user_strategies_temp_open"
  ON user_strategies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

**Final scoped policies** *(drop the stopgap first, then run these after Phase 3 is live)*

```sql
CREATE POLICY "user_strategies_select_own"
  ON user_strategies FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "user_strategies_insert_own"
  ON user_strategies FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');
```

---

## Phase 5 — Cleanup

### `phone_numbers`

This table has no references anywhere in the codebase. With RLS enabled and no policies, it is already in a correct default-deny state. Confirm RLS is on, then choose one of the following:

```sql
-- Confirm RLS is enabled (safe to run regardless)
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
```

- **Preferred:** Drop the table entirely if it holds no data you want to keep.
  ```sql
  DROP TABLE IF EXISTS phone_numbers;
  ```
- **Alternative:** Leave it as-is — RLS enabled with no policies means no access is granted until explicitly added.

### `onboarding`

> **Correction from earlier analysis:** this table does exist. Schema: `user_id` (text, Primary Key), `onboarding_complete` (bool), `created_at` (timestamptz).

No application code reads from or writes to this table — the app manages onboarding state entirely through Clerk `publicMetadata` and separate Supabase tables (`days_expected`, `days_completed`). The table appears to be a vestige of an earlier design.

**Confirm RLS is enabled and remove any permissive policies:**

```sql
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;
```

Then in the Supabase dashboard, navigate to `Authentication → Policies → onboarding` and delete any existing policies. With RLS on and no policies, Supabase defaults to deny-all — no application or user can access rows until a policy explicitly permits it.

- **Preferred:** If the table holds no meaningful data, drop it.
  ```sql
  DROP TABLE IF EXISTS onboarding;
  ```
- **Alternative:** Leave it in default-deny state. If a future feature needs it, add scoped policies at that point using the same `user_id = auth.jwt() ->> 'sub'` pattern.

---

## Verification checklist

After completing all phases, test the following flows end-to-end:

- [ ] **New user sign-up and onboarding** — completes without error; a row appears in `users`, `user_strategies`, `days_expected`, and `days_completed` for that user only
- [ ] **Dashboard loads** — today's strategy appears; history table shows only the current user's assignments
- [ ] **Survey submission** — baseline, daily, and exit surveys submit successfully; rows appear in the correct response tables
- [ ] **Push notification subscribe/unsubscribe** — works via the notifications page; a row is upserted/deleted in `subscriptions`
- [ ] **Cross-user isolation** — logged in as User A, confirm you cannot query User B's rows by testing a direct Supabase query with User A's JWT against User B's `user_id`
