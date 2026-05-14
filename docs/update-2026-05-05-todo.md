# Database Recovery To-Do List & Guide
_Update starting May 5, 2026_

## ✅ Already Done
- [x] Create a new Supabase project

---

## Phase 1: Restore the Database

**[x] 1. Identify your extensions**
```bash
grep -i "create extension" your_backup.backup
```
Note every extension listed — you'll need to enable them before or during restore.

**[x] 2. Enable required extensions in the new Supabase project**

Go to **Database → Extensions** in your new Supabase dashboard and enable the following:

| Extension | Enable? | Reason |
|---|---|---|
| `pg_cron` | ⚠️ Maybe | Only if you have scheduled jobs running inside Postgres itself. Check your backup: `grep -i "cron.schedule" your_backup.backup` |
| `pgsodium` | ⚠️ Maybe | Used under the hood by `supabase_vault`. Enable if vault is needed. |
| `pg_graphql` | ❌ Skip | Default Supabase extension. Skip unless you're explicitly using the GraphQL API. |
| `pg_stat_statements` | ❌ Skip | Query performance monitoring. Not required for your app to function. |
| `pgcrypto` | ✅ Yes | Commonly used for hashing and crypto functions, likely referenced in your schema or RLS policies. |
| `pgjwt` | ❌ Skip | Deprecated, and irrelevant since Clerk handles JWTs. |
| `supabase_vault` | ✅ Yes | You used this. It is Supabase-managed and should already be present — verify with `SELECT * FROM pg_extension WHERE extname = 'supabase_vault';` in the SQL Editor. If missing, contact Supabase support. |
| `uuid-ossp` | ✅ Yes | Almost certainly needed for `uuid_generate_v4()` as default values on ID columns. |
| `wrappers` | ⚠️ Maybe | Used for Foreign Data Wrappers. Check your backup: `grep -i "wrappers\|fdw\|foreign data" your_backup.backup` |
| `pg_net` | ✅ Yes | Required for Database Webhooks. Confirmed present in your backup. |

> **Note:** `supabase_vault` secrets are **not** included in your backup — they are encrypted with a key tied to the original project. You will need to manually re-add any secrets you were storing in Vault via **Project Settings → Vault**.

**[x] 3. Restore the database**
```bash
psql -h db.<your-new-project-ref>.supabase.co -U postgres -d postgres -f your_backup.backup
```
- Find your connection details in **Settings → Database**
- Watch the output carefully for any errors — note them down but don't panic, some warnings are harmless

**[x] 4. Verify the restore**
- Go to **Database → Tables** in Supabase and confirm your tables and data are present
- Spot check a few rows to make sure data looks correct

---

## Phase 2: Reconnect Clerk

**[x] 5. Get your new Supabase JWT secret**
- Go to **Settings → API → JWT Settings** in your new Supabase project
- Copy the **JWT Secret**

**[x] 6. Update the Clerk JWT template**
- Go to your Clerk dashboard → **Configure → JWT Templates**
- Find your Supabase template and update it with the new JWT secret from step 5

**[x] 7. Verify RLS policies are intact**
- Go to **Authentication → Policies** in Supabase
- Confirm your policies are present and reference Clerk user IDs correctly (e.g. `auth.jwt() ->> 'sub'`)
- These should have been restored from the backup, but worth a visual check

---

## Phase 3: Reconnect Webhooks

**[ ] 8. Identify your webhook endpoints**
```bash
grep -i "pg_net" your_backup.backup
```
Note every URL being called — these are likely your Vercel API routes or external services.

**[x] 9. Recreate webhooks in Supabase** -- _There appear to be no webhooks_
- Go to **Database → Webhooks** in your new Supabase project
- Manually recreate each webhook found in step 8
- Double-check the table, event trigger (INSERT/UPDATE/DELETE), and endpoint URL for each

---

## Phase 4: Re-add Vault Secrets

**[x] 10. Re-add secrets to Supabase Vault** -- _Vault doesn't appear to have been used_
- Go to **Project Settings → Vault** in your new Supabase project
- Manually re-add every secret that was previously stored in Vault
- Update any references in your codebase or database functions if the secret names changed

---

## Phase 5: Update Vercel Environment Variables

**[x] 11. Update Supabase environment variables in Vercel**
- Go to your Vercel project → **Settings → Environment Variables**
- Update the following with values from your new Supabase project (**Settings → API**):

| Variable | Action |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Update |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Update |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Update (if used) |
| `DATABASE_URL` | ⚠️ Update (if used) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ No change needed |
| `CLERK_SECRET_KEY` | ✅ No change needed |

**[x] 12. Redeploy on Vercel**
- Trigger a manual redeploy so the new environment variables take effect
- **Deployments → Redeploy** on your latest deployment

---

## Phase 6: Test Everything

**[x] 13. Test authentication**
- Sign in via Clerk on your live site
- Confirm the session is established correctly

**[x] 14. Test database access**
- Confirm authenticated queries succeed (read from a protected table)
- Confirm unauthenticated requests are blocked by RLS

**[x] 15. Test webhooks**
- Trigger the relevant database events (INSERT/UPDATE/DELETE on the watched tables)
- Confirm the webhook endpoints are receiving calls correctly

**[x] 16. Test Vault**
- Confirm anything in your app that relies on Vault secrets is functioning correctly

---

## Phase 7: Set Up Keep-Alive

**[ ] 17. Create a keep-alive API route**

Create a simple endpoint in your project, e.g. `app/api/keep-alive/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from('your_table').select('id').limit(1);

  return Response.json({ ok: true });
}
```

Replace `your_table` with any table in your database.

**[x] 18. Add a Vercel Cron Job**

In your `vercel.json` (create it in the project root if it doesn't exist):

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 12 * * 1"
    }
  ]
}
```

This runs every Monday at noon UTC. Adjust the cron expression to your preference.

**[x] 19. Deploy and verify the cron job**
- Push the changes and deploy
- Go to your Vercel dashboard → **Settings → Crons** to confirm it's registered
- Trigger it manually there to test it works end-to-end

---

## Phase 8: Post-Recovery — Migrate to New Supabase API Key Format
 
> **Note:** Supabase has deprecated the legacy `anon` and `service_role` key format in favour of new `publishable` (`sb_publishable_xxx`) and `secret` (`sb_secret_xxx`) keys. The legacy keys will continue to work until end of 2026, so this is not urgent — complete it after the app is fully stable.
 
**[x] 20. Migrate environment variable references in code**
 
Use Claude Code to find and update all references:
```bash
claude "Migrate all Supabase environment variable references from the legacy key format (NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY) to the new Supabase key format (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY). Find all references, update them, and list every file changed."
```
 
**[x] 21. Get the new key values from Supabase**
- Go to **Settings → API Keys** in your Supabase project
- Click **Create new API Keys** if you don't have a publishable key yet
- Copy the **Publishable key** and **Secret key**
**[x] 22. Update Vercel environment variables with new keys**
- Go to your Vercel project → **Settings → Environment Variables**
- Add the new variables and remove the old ones:
| Old Variable | New Variable |
|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SECRET_KEY` |
 
**[x] 23. Redeploy and test**
- Trigger a manual redeploy on Vercel
- Run through the same tests as Phase 6 to confirm nothing broke

---

## Summary Order

1. Enable extensions → Restore DB → Verify tables
2. Update Clerk JWT → Verify RLS policies
3. Recreate webhooks
4. Re-add Vault secrets
5. Update Vercel env vars → Redeploy
6. Test auth, DB access, webhooks, and Vault
7. Set up keep-alive cron job
8. *(Post-recovery)* Migrate to new Supabase API key format