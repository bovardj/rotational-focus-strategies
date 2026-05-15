# Clerk + Supabase Integration

## How it works

All authentication is handled by Clerk. Supabase never issues its own JWTs. Instead, the Clerk session token is passed directly to the Supabase client via the `accessToken` callback in `@supabase/supabase-js`:

```ts
createClient(url, key, {
  async accessToken() {
    return (await auth()).getToken()
  }
})
```

On every request, `@supabase/supabase-js` calls this callback, gets the Clerk JWT, and sends it as `Authorization: Bearer <token>`. Supabase verifies the token against Clerk's JWKS before executing the query. RLS policies then use `auth.jwt() ->> 'sub'` to identify the requesting user by their Clerk user ID.

## JWKS configuration (Option B)

The Supabase project is configured to trust Clerk JWTs via JWKS — no JWT template is needed in Clerk. This is set up in the Supabase dashboard under **Authentication → Third-party auth providers**.

Clerk's session tokens are RS256-signed. The JWKS URL to use is:

```
https://<your_clerk_frontend_api>/.well-known/jwks.json
```

Find your Clerk frontend API URL in the Clerk dashboard under **API Keys**.

### Dev and production instances both need to be added

Clerk has separate **development** and **production** instances with different signing keys. Both must be added as trusted providers in Supabase or users from the unconfigured instance will get:

```
Error: No suitable key or wrong key type
```

This error means Supabase received an RS256 JWT but couldn't find a matching key in its configured JWKS — almost always because the wrong Clerk instance's keys are configured.

**Current configuration:** both the production and development Clerk instances are added as trusted providers in the `rfs-psql` Supabase project.

## `accessToken` and supabase-js version history

The `accessToken` callback option was introduced in `@supabase/supabase-js` **v2.69.0**. In earlier versions (including the v2.49.4 this project used before the May 2026 update), the option was silently ignored and all requests went out with just the anon key. After upgrading to v2.105+, the callback is active and Clerk JWTs are sent on every request.

If you ever roll back `@supabase/supabase-js` below v2.69, authenticated queries will silently stop sending user identity and RLS will block all data access without errors.

## Onboarding state desync

The middleware checks `sessionClaims.metadata.onboardingComplete` in Clerk to decide whether to redirect a user to `/onboarding`. If a user has this flag set to `true` in Clerk but has no rows in Supabase (e.g. after migrating to a new Supabase project), they will reach the dashboard and hit a 500 error because `.single()` finds no data.

**Symptoms:** `Error: Cannot coerce the result to a single JSON object` on dashboard load for a specific user.

**Fix:** In the Clerk dashboard, find the user → edit Public Metadata → remove `onboardingComplete` (or set it to `false`). The middleware will redirect them to `/onboarding` on next load, which recreates all their Supabase rows.

## RLS returning 0 rows → `.single()` crash

Any query that uses `.single()` will throw `Cannot coerce the result to a single JSON object` if RLS blocks all rows (returning an empty result set instead of an error). This surfaces as a dashboard 500 even though the query itself is syntactically valid.

Common triggers:
- Supabase receiving the anon key instead of a user JWT (e.g. `accessToken` callback not firing — see version history above)
- User exists in Clerk but has no rows in the relevant Supabase table (see onboarding state desync above)
- JWKS misconfiguration causing token verification to fail silently, falling back to anon access

When debugging a `.single()` crash, verify: (1) the JWT is actually being sent (`Authorization` header present), (2) the JWKS URL matches the Clerk instance the user belongs to, (3) the user has rows in the queried table.
