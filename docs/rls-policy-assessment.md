# RLS Policy Assessment

> **Status:** Proposals only — no changes applied.
>
> Assessed tables: `assigned_strategies`, `baseline_survey_responses`, `daily_survey_responses`, `days_completed`, `days_expected`, `end_survey_responses`, `onboarding`, `phone_numbers`, `scheduled_notifications`, `subscriptions`, `user_strategies`, `users`

---

## Background

### The problem

Each table currently has `USING (true)` or `WITH CHECK (true)` policies, meaning any authenticated user has unrestricted access to every row in every table. For an app where multiple participants are enrolled in a research study, this means one participant can read — or tamper with — any other participant's survey responses, strategy assignments, and demographic data.

### Auth context

Clerk issues a JWT when users sign in. Supabase can extract the Clerk user ID from it via `auth.jwt() ->> 'sub'`. The correct RLS condition for user-scoped rows is therefore:

```sql
user_id = auth.jwt() ->> 'sub'
```

### Three client patterns in use

Understanding which Supabase client each code path uses is essential — it determines what role RLS actually evaluates against.

| Pattern | Where used | Supabase role at query time |
|---|---|---|
| `createClient` + Clerk `accessToken()` hook | Most server actions | `authenticated` — `auth.jwt() ->> 'sub'` = Clerk user ID |
| Bare `createClient(url, anonKey)` — no token | `completeOnboarding`, `save-subscription` route, `SyncUserToSupabase` browser client | `anon` — no JWT, no user identity |
| `createClient(url, serviceRoleKey)` | `sendDueNotifications` only | Service role — bypasses RLS entirely |

The anon client pattern is what drives the "is anon INSERT intentional?" question for `users` and `user_strategies`. In both cases it appears to be an accidental omission — not a deliberate design choice — and both should be fixed at the code level before tightening RLS.

---

## Summary

| Table | Action | Anon access | Priority |
|---|---|---|---|
| `users` | Tighten — fix client code first | Accidental: fix `SyncUserToSupabase` | 🔴 High |
| `user_strategies` | Tighten — fix client code first | Accidental: fix `completeOnboarding` | 🔴 High |
| `baseline_survey_responses` | Tighten — research data | n/a | 🔴 Critical |
| `daily_survey_responses` | Tighten — research data | n/a | 🔴 Critical |
| `end_survey_responses` | Tighten — demographic data | n/a | 🔴 Critical |
| `subscriptions` | Tighten — fix `save-subscription` bug | Accidental: wrong client + wrong column name | 🔴 High |
| `assigned_strategies` | Tighten | n/a | 🟡 Medium |
| `days_completed` | Tighten | n/a | 🟡 Medium |
| `days_expected` | Tighten | n/a | 🟡 Medium |
| `scheduled_notifications` | Tighten user-facing policies only | n/a | 🟡 Medium |
| `onboarding` | n/a — table does not exist | — | — |
| `phone_numbers` | n/a — not referenced in code; drop or restrict | — | ⚪ Low |

---

## Table-by-table proposals

### `users`

**Risk:** `USING(true)` / `WITH CHECK(true)` on the anon role allows any unauthenticated visitor to enumerate or insert rows. `SyncUserToSupabase` runs in the browser using the public anon key with no Clerk token. A caller who knows another Clerk user ID could insert a row on their behalf.

**Is anon INSERT intentional?** No. The fix is to move user sync out of the client-side `SyncUserToSupabase` component into a server action that passes the Clerk JWT to Supabase. Once that is done, RLS can enforce identity.

**Proposed SQL** *(apply after fixing the client)*

```sql
-- Remove permissive policies
DROP POLICY IF EXISTS "anon insert" ON users;
DROP POLICY IF EXISTS "all access" ON users;

CREATE POLICY "users_insert_own"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "users_select_own"
  ON users FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- No UPDATE or DELETE: profile changes go through Clerk, not Supabase
```

---

### `user_strategies`

**Risk:** Same as `users`. `completeOnboarding` in `app/onboarding/_actions.ts` (lines 58–61) creates a fresh bare `createClient` call with no `accessToken` hook instead of reusing the module-level JWT client defined at the top of the same file. This is almost certainly a copy-paste mistake.

**Is anon INSERT intentional?** No. The fix is to remove the local `createClient` inside `completeOnboarding` and use the module-level `supabase` variable that already has Clerk JWT injection.

**Proposed SQL** *(apply after fixing the client)*

```sql
DROP POLICY IF EXISTS "anon insert" ON user_strategies;

CREATE POLICY "user_strategies_insert_own"
  ON user_strategies FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "user_strategies_select_own"
  ON user_strategies FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- No UPDATE or DELETE: strategy selection is immutable after onboarding
```

---

### `baseline_survey_responses`

**Risk:** Any authenticated participant can read every other participant's baseline survey responses — a direct research data privacy violation. Contains `satisfaction_score`, `productivity_score`, and open-ended text responses.

**Proposed SQL**

```sql
CREATE POLICY "baseline_survey_insert_own"
  ON baseline_survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "baseline_survey_select_own"
  ON baseline_survey_responses FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- No UPDATE or DELETE: survey responses are immutable research records
```

---

### `daily_survey_responses`

**Risk:** Same as `baseline_survey_responses`. Additionally exposes `used_strategy` and `strategy_response` — behavioral data that reveals which strategies each participant tried and how they rated them.

**Proposed SQL**

```sql
CREATE POLICY "daily_survey_insert_own"
  ON daily_survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "daily_survey_select_own"
  ON daily_survey_responses FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');
```

---

### `end_survey_responses`

**Risk:** Highest-sensitivity table in the schema. Stores `gender_identity` and `racial_identity` arrays plus free-text `_other` fields. With `USING(true)`, any authenticated participant can read every other participant's demographic data.

**Proposed SQL**

```sql
CREATE POLICY "end_survey_insert_own"
  ON end_survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "end_survey_select_own"
  ON end_survey_responses FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');
```

---

### `assigned_strategies`

**Risk:** Any authenticated user can read or write any other user's strategy assignment history. The `getDailyStrategy` rotation logic reads yesterday's assignment to avoid repeats — a malicious user could insert a fake yesterday row for another participant and manipulate their rotation.

**Proposed SQL**

```sql
CREATE POLICY "assigned_strategies_select_own"
  ON assigned_strategies FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "assigned_strategies_insert_own"
  ON assigned_strategies FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- No UPDATE or DELETE: assignments are immutable once written
```

---

### `days_expected`

**Risk:** Any authenticated user can read or overwrite another user's expected-day targets (`baseline_days: 3`, `daily_days: 4`). These are fixed constants written once at onboarding and read during survey gating — tampering would break study phase logic.

**Proposed SQL**

```sql
CREATE POLICY "days_expected_insert_own"
  ON days_expected FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "days_expected_select_own"
  ON days_expected FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- No UPDATE or DELETE: fixed at onboarding
```

---

### `days_completed`

**Risk:** Any authenticated user can increment another user's completion counters or flip their `baseline_completed`, `daily_completed`, or `end_survey_completed` boolean flags — effectively advancing or resetting another participant's study progress.

**Proposed SQL**

```sql
CREATE POLICY "days_completed_insert_own"
  ON days_completed FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "days_completed_select_own"
  ON days_completed FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "days_completed_update_own"
  ON days_completed FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub')
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- No DELETE: completion counts are permanent study records
```

---

### `subscriptions`

**Risk:** Two code paths write to this table with different auth contexts:

- `app/lib/actions/notifications.ts` — correctly uses the JWT client
- `app/api/save-subscription/route.ts` — uses a bare anon client **and** uses `userId` (camelCase) as the column key instead of `user_id` (snake\_case)

The `save-subscription` route is effectively broken: it runs as anon and likely stores data under the wrong column. It should be deleted or corrected to match the `notifications.ts` path. Tightening RLS to the JWT policy will not break `notifications.ts` and will also surface the `save-subscription` bug clearly.

**Proposed SQL**

```sql
CREATE POLICY "subscriptions_insert_own"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

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

### `scheduled_notifications`

**Risk:** Two code paths with different scopes:

- `scheduleTimeNotification` — JWT client; user inserts their own notification row
- `sendDueNotifications` — service role key; reads and updates across all users for the cron dispatcher

Because `sendDueNotifications` uses the service role, it bypasses RLS entirely. Tightening user-facing policies will not affect the cron path.

**Proposed SQL**

```sql
CREATE POLICY "scheduled_notifications_insert_own"
  ON scheduled_notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "scheduled_notifications_select_own"
  ON scheduled_notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- No user-facing UPDATE or DELETE policy: sendDueNotifications
-- writes sent_on via service role, which bypasses RLS
```

---

### `onboarding`

No Supabase table with this name exists. "Onboarding" appears only as a Next.js route directory and as a Clerk `publicMetadata` field (`onboardingComplete: true`). Nothing to assess.

---

### `phone_numbers`

No code in the repository references this table — no queries, inserts, type definitions, or seed data. If the table exists in Supabase, it is an unused exposed surface. Recommended action: either drop the table or, if retained for future use, ensure RLS is enabled with no permissive policies.

---

## Code fixes required before applying SQL

Two tables need application code changes before their RLS policies can be tightened.

### Fix 1 — `user_strategies`: use the module-level JWT client in `completeOnboarding`

`app/onboarding/_actions.ts` lines 58–61 create a bare anon client. Replace with the module-level `supabase` instance:

```diff
- const supabase = createClient(
-   process.env.SUPABASE_URL || '',
-   process.env.SUPABASE_ANON_KEY || ''
- )
-
  const { error } = await supabase
    .from('user_strategies')
    .insert({
```

### Fix 2 — `users`: replace `SyncUserToSupabase` with a server action

`app/components/SyncUserToSupabase.tsx` uses the browser anon client. The check-then-insert logic should move into a server action that uses `createClient` with the Clerk `accessToken()` hook, then the component simply calls that action.

### Fix 3 — `subscriptions`: delete or repair `save-subscription/route.ts`

`app/api/save-subscription/route.ts` has two bugs: it uses a bare anon client (no JWT), and it passes `userId` (camelCase JS variable name) as the column key instead of the actual column name `user_id`. The route is functionally superseded by `subscribeUser` in `notifications.ts`. It should either be deleted or rewritten to use the JWT-authenticated client and the correct column name.
