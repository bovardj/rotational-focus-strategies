# Security Updates — 2026-10-29

## What Was Done

`pnpm audit` reported 74 vulnerabilities (6 critical, 42 high, 23 moderate, 3 low). All were resolved with minor/patch dependency updates — no major-version upgrades and no `overrides` were needed. `pnpm audit` now reports no known vulnerabilities; `pnpm build` and `pnpm lint` pass.

Commits: `5f5b62a`, `44ba0c2`.

---

### 1. Next.js 16.2.6 → 16.4.3

**Problem:** Five critical Next.js advisories, all remote code execution on the server:

| Advisory | Issue | Fixed in |
|---|---|---|
| GHSA-p293-qw3h-jr36 | RCE on Windows-hosted servers | 16.3.3 |
| GHSA-2xp9-vwfh-vxw4 | RCE in Image Optimization API (AVIF) | 16.3.3 |
| GHSA-vcvr-r3jv-pc5j | RCE in `next/og` `ImageResponse` | 16.3.6 |
| GHSA-2464-fhr4-w9xw | RCE in Image Optimization API (SVG) | 16.4.1 |
| GHSA-673q-mjm6-r5xr | RCE in `use cache` functions returning typed arrays | 16.4.1 |

The `next/og` advisory directly affects this app — `app/opengraph-image.tsx` uses `ImageResponse`.

**Fix:** `pnpm up next@^16.4.3 eslint-config-next@^16.4.3`. Because `react` and `react-dom` are pinned to `latest` in `package.json`, they moved 19.2.6 → 19.3.1 in the same install.

**Files changed:** `package.json`, `pnpm-lock.yaml`

---

### 2. Remaining dependencies (minor/patch only)

**Problem:** The other findings were transitive — mostly through `@clerk/clerk-js` (Solana/Coinbase wallet adapters pulling in `shell-quote`, `preact`, `lodash`, `ws`), the PostCSS/Tailwind chain (`postcss`, `nanoid`, `source-map-js`), and ESLint (`minimatch`, `flatted`, `brace-expansion`; dev-only).

**Fix:**

```bash
# Exact-pinned deps don't move with `pnpm update` — bump explicitly
pnpm up postcss@8.5.32 autoprefixer@10.6.2 tailwindcss@4.3.3

# Everything else within existing semver ranges
pnpm update

# Lingering transitive dep (ESLint → minimatch → brace-expansion 5.0.6)
pnpm update brace-expansion
```

| Package | Before | After |
|---|---|---|
| `@clerk/clerk-js` | 6.11.0 | 6.42.0 |
| `@clerk/nextjs` | 7.3.4 | 7.9.22 |
| `@supabase/supabase-js` | 2.105.4 | 2.118.0 |
| `tailwindcss` / `@tailwindcss/postcss` | 4.3.0 | 4.3.3 |
| `postcss` | 8.5.14 | 8.5.32 |
| `autoprefixer` | 10.5.0 | 10.6.2 |
| `zod` | 4.4.3 | 4.6.7 |
| `resend` | 6.16.0 | 6.35.0 |
| `eslint` (dev) | 10.4.0 | 10.13.0 |
| `sharp` (dev) | 0.35.2 | 0.35.5 |
| `@zxcvbn-ts/core` | 4.1.2 | 4.2.0 |
| `brace-expansion` (transitive) | 5.0.6 | 5.0.12 |

**Deliberately skipped** (major versions, no security fixes): TypeScript 6 → 7, `@types/node` 25 → 26, `@supabase/ssr` 0.10 → 0.12.

**Files changed:** `package.json`, `pnpm-lock.yaml`

---

### 3. pnpm 11 build-script approvals

**Problem:** Local pnpm is now 11.25.0, which no longer reads the `"pnpm"` field in `package.json`. The `pnpm.onlyBuiltDependencies` list there was silently ignored, and every pnpm command printed a warning.

**Fix:** Removed the `"pnpm"` block from `package.json`. Build approvals now live only in `pnpm-workspace.yaml`, in two forms so both pnpm 11 (local) and pnpm ≤10 (possibly Vercel) are covered:

```yaml
allowBuilds:            # pnpm 11
  '@clerk/shared': true
  bcrypt: true
  browser-tabs-lock: true
  bufferutil: true
  core-js: true
  sharp: true
  unrs-resolver: false  # napi-postinstall fallback; not needed
  utf-8-validate: true
onlyBuiltDependencies:  # pnpm ≤10
  - '@clerk/shared'
  - bcrypt
  - browser-tabs-lock
  - bufferutil
  - core-js
  - sharp
  - utf-8-validate
```

**Files changed:** `package.json`, `pnpm-workspace.yaml`

---

## Key Constraints to Keep in Mind

- **pnpm 10 → 11 store mismatch:** the first pnpm 11 command failed with `ERR_PNPM_UNEXPECTED_STORE` because `node_modules` was linked from the v10 store. Fix: `pnpm install --config.confirmModulesPurge=false` (the flag avoids an interactive prompt that aborts in non-TTY shells).
- **pnpm 11 writes placeholders** like `pkg: set this to true or false` into `allowBuilds` for newly seen packages with build scripts. Replace them with `true`/`false` — leaving the placeholder text blocks the build script.
- **First deploy after this change:** check the Vercel build log for "ignored build scripts". If it appears, Vercel is on a pnpm version that reads neither list as expected.
