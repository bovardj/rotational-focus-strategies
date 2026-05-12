# RLS Phase 2 Code Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three places in the codebase that use an unauthenticated anon Supabase client, so that Phase 4 of the RLS implementation guide can be applied to lock down the `users` and `user_strategies` tables.

**Architecture:** Each fix either removes a wrong client instantiation (Fix 1), replaces a client-side component with a server action (Fix 2), or deletes unreachable dead code (Fix 3). No new abstractions are introduced — each change is surgical.

**Tech Stack:** Next.js 15 App Router, Supabase (`@supabase/supabase-js`), Clerk (`@clerk/nextjs/server`)

---

## File map

| Action | File | What changes |
|---|---|---|
| Modify | `app/onboarding/_actions.ts` | Remove local anon `createClient` in `completeOnboarding`; add `syncUserToSupabase` function |
| Modify | `app/onboarding/layout.tsx` | Replace `<SyncUserToSupabase />` with `await syncUserToSupabase()`; update imports |
| Delete | `app/components/SyncUserToSupabase.tsx` | Entire file — functionality moves to the server action above |
| Delete | `app/api/save-subscription/route.ts` | Entire file — dead code, never called by any frontend path |

---

## Task 1: Remove the local anon client from `completeOnboarding`

**Files:**
- Modify: `app/onboarding/_actions.ts:58–61`

The function currently creates a fresh `createClient` at line 58 with no `accessToken` hook, shadowing the module-level JWT-authenticated `supabase` variable. The four-line block must be removed so the `user_strategies` insert uses the authenticated client.

- [ ] **Step 1: Open `app/onboarding/_actions.ts` and delete lines 58–61**

Remove these four lines from inside `completeOnboarding`:

```typescript
  const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  )
```

The `const { error } = await supabase.from('user_strategies')...` call on the next line will now resolve to the module-level `supabase` instance defined at the top of the file, which already has the Clerk JWT `accessToken` hook.

- [ ] **Step 2: Verify the file still compiles**

```bash
pnpm build 2>&1 | head -40
```

Expected: no TypeScript errors related to `_actions.ts`. Build may fail on unrelated things; only errors in this file matter at this step.

- [ ] **Step 3: Run lint**

```bash
pnpm lint
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add app/onboarding/_actions.ts
git commit -m "fix: use JWT-authenticated supabase client in completeOnboarding"
```

---

## Task 2: Replace `SyncUserToSupabase` with a server action

**Files:**
- Modify: `app/onboarding/_actions.ts` — add `syncUserToSupabase` function
- Modify: `app/onboarding/layout.tsx` — call server function directly; remove component import
- Delete: `app/components/SyncUserToSupabase.tsx`

`SyncUserToSupabase` is a client component that calls the browser Supabase client (no JWT). The onboarding layout is already a Server Component, so user sync can happen there with the JWT-authenticated client.

- [ ] **Step 1: Add `syncUserToSupabase` to `app/onboarding/_actions.ts`**

Append the following function to the end of the file. It uses the module-level `supabase` variable (JWT-authenticated) already present at the top of the file. No new imports are needed — `auth` and `supabase` are already in scope.

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

> **Note on `email`:** The original `SyncUserToSupabase` component inserted `email` using `user.primaryEmailAddress?.emailAddress` from the Clerk `useUser()` hook. That field is not available from `auth()` on the server. If the `users` table has a non-nullable `email` column, retrieve it via `(await clerkClient()).users.getUser(userId)` and include it in the insert. `clerkClient` is already imported at the top of this file.

- [ ] **Step 2: Update `app/onboarding/layout.tsx`**

Replace the entire file with the following. The only changes are: add the `syncUserToSupabase` import, replace `<SyncUserToSupabase />` with `await syncUserToSupabase()`, and remove the `SyncUserToSupabase` import.

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideNav from "@/app/ui/onboarding/sidenav";
import { syncUserToSupabase } from "@/app/onboarding/_actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }

  await syncUserToSupabase();

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Delete `app/components/SyncUserToSupabase.tsx`**

```bash
rm app/components/SyncUserToSupabase.tsx
```

- [ ] **Step 4: Verify the build**

```bash
pnpm build 2>&1 | head -60
```

Expected: no errors referencing `SyncUserToSupabase`, `layout.tsx`, or `_actions.ts`.

- [ ] **Step 5: Run lint**

```bash
pnpm lint
```

Expected: clean.

- [ ] **Step 6: Smoke test the onboarding flow locally**

```bash
pnpm dev
```

Open a private/incognito browser window, sign up as a new user, and step through onboarding. Confirm:
- No console errors about Supabase
- Onboarding completes and redirects to the dashboard
- A row exists in the `users` table in the Supabase dashboard for the new user

- [ ] **Step 7: Commit**

```bash
git add app/onboarding/_actions.ts app/onboarding/layout.tsx
git commit -m "fix: move user sync to server action using JWT-authenticated Supabase client"
```

---

## Task 3: Delete `app/api/save-subscription/route.ts`

**Files:**
- Delete: `app/api/save-subscription/route.ts`

This route is dead code. `app/components/pwaComponents.tsx` calls `subscribeUser` from `app/lib/actions/notifications.ts` directly — it never calls this API route. Additionally the route has two bugs: it uses a bare anon client and passes `userId` (camelCase JS variable) as the column key instead of `user_id`.

- [ ] **Step 1: Confirm nothing calls this route**

```bash
grep -r "save-subscription" /Users/Stan/repos/CS6968_ddhs/RotationalFocusStrategies/app --include="*.tsx" --include="*.ts"
```

Expected: only `app/api/save-subscription/route.ts` itself appears. No callers.

- [ ] **Step 2: Delete the file**

```bash
rm app/api/save-subscription/route.ts
```

- [ ] **Step 3: Verify the build**

```bash
pnpm build 2>&1 | head -40
```

Expected: clean build, no errors about missing routes or imports.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: remove dead save-subscription route (broken anon client, never called)"
```

---

## Task 4: Deploy (Phase 3)

The Phase 4 database changes must not be applied until this deploy is live. Applying Phase 4 RLS policies before this deploy will block onboarding for new users.

- [ ] **Step 1: Push to your deployment branch**

```bash
git push origin update-2026-05-05
```

- [ ] **Step 2: Confirm the Vercel deploy succeeds**

Monitor the deploy in the Vercel dashboard or wait for the confirmation email. Check that the build log shows no errors.

- [ ] **Step 3: Smoke test production**

On the live site at focusapp.dev, sign up as a new test user and complete onboarding. Confirm:
- No errors in the browser console
- Onboarding completes successfully
- The new user row appears in the Supabase `users` table

---

## Task 5: Apply Phase 4 RLS policies

Only run this task after Task 4's production smoke test passes.

Run all SQL in the **Supabase dashboard SQL editor**: `Project → SQL Editor → New query`

- [ ] **Step 1: Drop the stopgap policy on `users` if one exists**

```sql
DROP POLICY IF EXISTS "users_temp_open" ON users;
```

- [ ] **Step 2: Apply scoped policies for `users`**

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

- [ ] **Step 3: Drop the stopgap policy on `user_strategies` if one exists**

```sql
DROP POLICY IF EXISTS "user_strategies_temp_open" ON user_strategies;
```

- [ ] **Step 4: Apply scoped policies for `user_strategies`**

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

- [ ] **Step 5: Smoke test onboarding again with the new policies live**

Sign up as another new test user on the live site. Confirm:
- Onboarding completes without error
- Dashboard loads and shows only that user's data

- [ ] **Step 6: Verify cross-user isolation**

In the Supabase SQL editor, run a query using User A's JWT against User B's `user_id`. Confirm it returns no rows:

```sql
-- Run this while impersonating User A in the Supabase Auth inspector,
-- substituting User B's actual user_id
SELECT * FROM users WHERE user_id = '<user-b-id>';
SELECT * FROM user_strategies WHERE user_id = '<user-b-id>';
```

Expected: empty result sets for both queries.
