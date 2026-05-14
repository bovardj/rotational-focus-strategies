# Dependency Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all outdated dependencies to their latest versions, fixing any breaking changes introduced by major version bumps.

**Architecture:** Update one group at a time (Clerk → Next/React → everything else), verifying with `pnpm lint` and `npx tsc --noEmit` after each group. Major version bumps require code changes; patch/minor bumps are install-only.

**Tech Stack:** Next.js 15 (App Router), Clerk auth, Supabase, Tailwind CSS 3, TypeScript 5, React 19

---

## Pre-flight

```bash
cd /Users/Stan/repos/CS6968_ddhs/RotationalFocusStrategies
```

Verification command used throughout:
```bash
pnpm lint && npx tsc --noEmit
```

---

## Full Dependency Delta

| Package | Current | Latest | Risk |
|---|---|---|---|
| `@clerk/clerk-js` | 5.84.0 | 6.11.0 | ⚠️ MAJOR |
| `@clerk/nextjs` | 6.31.0 | 7.3.4 | ⚠️ MAJOR |
| `@clerk/types` | 4.51.1 | deprecated | remove |
| `react` / `react-dom` | 19.1.0 | 19.2.6 | ✅ minor |
| `@types/react` / `@types/react-dom` | 19.0.7 / 19.0.3 | 19.2.14 / 19.2.3 | ✅ minor |
| `next` | 15.2.6 | 16.2.6 | ⚠️ MAJOR |
| `eslint-config-next` | 15.2.4 | 16.2.6 | follows next |
| `eslint` | 9.24.0 | 10.3.0 | ⚠️ MAJOR |
| `@supabase/supabase-js` | 2.49.4 | 2.105.4 | ✅ minor |
| `@supabase/ssr` | 0.6.1 | 0.10.3 | ✅ minor |
| `postcss` | 8.5.1 | 8.5.14 | ✅ patch |
| `postgres` | 3.4.5 | 3.4.9 | ✅ patch |
| `autoprefixer` | 10.4.20 | 10.5.0 | ✅ minor |
| `use-debounce` | 10.0.4 | 10.1.1 | ✅ minor |
| `@tailwindcss/forms` | 0.5.10 | 0.5.11 | ✅ patch |
| `tailwindcss` | 3.4.17 | 4.3.0 | 🔴 MAJOR (complete rewrite) |
| `typescript` | 5.7.3 | 6.0.3 | ⚠️ MAJOR |
| `bcrypt` | 5.1.1 | 6.0.0 | ⚠️ MAJOR |
| `@types/bcrypt` | 5.0.2 | 6.0.0 | follows bcrypt |
| `@types/node` | 22.10.7 | 25.8.0 | ⚠️ MAJOR |
| `zod` | 3.24.2 | 4.4.3 | ⚠️ MAJOR (not used in app code) |

---

## Task 1: Clerk packages

**Breaking changes in @clerk/nextjs v7:**
- `clerkClient()` is now async: `const client = await clerkClient()` instead of `clerkClient()`
- `auth()` return type may have changed — `getToken()` still exists but check usage
- `@clerk/types` is deprecated; types are now bundled in `@clerk/nextjs` and `@clerk/clerk-js`

**Files affected:**
- `middleware.ts`
- `app/lib/actions/actions.ts`
- `app/lib/actions/notifications.ts`
- `app/lib/data.ts`
- `app/lib/supabase/client.ts`
- `app/dashboard/survey/_actions.ts`
- `app/dashboard/survey/_data.ts`
- `app/onboarding/_actions.ts`

- [ ] **Step 1: Install updated Clerk packages**

```bash
pnpm add @clerk/nextjs@latest @clerk/clerk-js@latest
pnpm remove @clerk/types
```

- [ ] **Step 2: Run type check to surface breaking changes**

```bash
pnpm lint && npx tsc --noEmit 2>&1
```

Expected: errors related to `clerkClient` being async, type mismatches from removed `@clerk/types` exports.

- [ ] **Step 3: Fix clerkClient async call in app/onboarding/_actions.ts**

Open `app/onboarding/_actions.ts`. Find any call to `clerkClient()` and make it async:

```ts
// Before
const client = clerkClient()
await client.users.updateUserMetadata(...)

// After
const client = await clerkClient()
await client.users.updateUserMetadata(...)
```

- [ ] **Step 4: Fix any @clerk/types import errors**

If any file has `import { ... } from '@clerk/types'`, move those imports to `@clerk/nextjs` or `@clerk/clerk-js`. Run:

```bash
grep -rn "from '@clerk/types'" app/ middleware.ts
```

Remove or redirect any found imports. The types are now re-exported from `@clerk/nextjs`.

- [ ] **Step 5: Verify**

```bash
pnpm lint && npx tsc --noEmit
```

Expected: No errors. If new errors appear, read them carefully — they will name the file and line.

- [ ] **Step 6: Commit**

```bash
git add -p
git commit -m "chore: update @clerk/nextjs 6→7, @clerk/clerk-js 5→6, remove deprecated @clerk/types"
```

---

## Task 2: React and React types

No breaking changes expected in 19.x minor updates.

- [ ] **Step 1: Update React and type packages**

```bash
pnpm add react@latest react-dom@latest
pnpm add -D @types/react@latest @types/react-dom@latest
```

- [ ] **Step 2: Verify**

```bash
pnpm lint && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update react 19.1→19.2, @types/react and @types/react-dom"
```

---

## Task 3: Next.js patch update (15.x)

Update to the latest 15.x before considering the jump to 16.

- [ ] **Step 1: Update Next.js to latest 15.x patch**

```bash
pnpm add next@^15 eslint-config-next@^15
```

- [ ] **Step 2: Verify**

```bash
pnpm lint && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update next and eslint-config-next to latest 15.x"
```

---

## Task 4: Next.js 16 + ESLint 10 (MAJOR — HIGH RISK)

**⚠️ Breaking changes in Next.js 16:**
- `next/headers` cookies/headers API may be updated
- Turbopack is now stable and the default
- Some experimental features graduated or removed
- Check: https://nextjs.org/blog/next-16

**⚠️ Breaking changes in ESLint 10:**
- Some rule APIs changed
- Requires ESLint flat config (`eslint.config.js`) by default — check if this project has one

- [ ] **Step 1: Check for existing ESLint config**

```bash
ls /Users/Stan/repos/CS6968_ddhs/RotationalFocusStrategies/eslint* /Users/Stan/repos/CS6968_ddhs/RotationalFocusStrategies/.eslint* 2>/dev/null
```

- [ ] **Step 2: Update Next.js and ESLint**

```bash
pnpm add next@latest eslint-config-next@latest eslint@latest
```

- [ ] **Step 3: Run type check**

```bash
pnpm lint && npx tsc --noEmit
```

- [ ] **Step 4: Fix any Next.js 16 breaking changes**

Common issues:
- If `cookies()` or `headers()` from `next/headers` error: wrap in `await` (they became async in Next.js 15, should already be done)
- If ESLint fails on config format: Next.js's `eslint-config-next` handles flat config migration automatically for most cases

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update next 15→16, eslint 9→10, eslint-config-next 15→16"
```

---

## Task 5: Supabase packages

Minor version updates, no breaking changes expected within semver range.

- [ ] **Step 1: Update Supabase packages**

```bash
pnpm add @supabase/supabase-js@latest @supabase/ssr@latest
```

- [ ] **Step 2: Verify**

```bash
pnpm lint && npx tsc --noEmit
```

Expected: No errors. If `@supabase/ssr` has API changes, they will show as type errors — read and fix.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update @supabase/supabase-js 2.49→2.105, @supabase/ssr 0.6→0.10"
```

---

## Task 6: Small safe packages

All patch or minor bumps, no breaking changes expected.

- [ ] **Step 1: Update all safe packages**

```bash
pnpm add postcss@latest autoprefixer@latest postgres@latest use-debounce@latest @tailwindcss/forms@latest
```

- [ ] **Step 2: Verify**

```bash
pnpm lint && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update postcss, autoprefixer, postgres, use-debounce, @tailwindcss/forms to latest"
```

---

## Task 7: TypeScript 6 (MAJOR)

**⚠️ Breaking changes in TypeScript 6:**
- `--noImplicitOverride` is on by default in strict mode
- Some deprecated compiler options removed
- Stricter narrowing in some cases
- Check: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/

- [ ] **Step 1: Update TypeScript**

```bash
pnpm add typescript@latest
```

- [ ] **Step 2: Run type check — read all errors carefully**

```bash
npx tsc --noEmit 2>&1
```

- [ ] **Step 3: Fix any TypeScript 6 errors**

Common fixes:
- If `override` keyword is required: add it to class methods that override base class methods
- If deprecated `tsconfig` options error: remove them from `tsconfig.json`
- If narrowing errors: add explicit type guards

- [ ] **Step 4: Lint and verify**

```bash
pnpm lint && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json
git commit -m "chore: update typescript 5→6, fix any strict mode errors"
```

---

## Task 8: bcrypt + @types/bcrypt (MAJOR)

**Note:** `bcrypt` and `@types/bcrypt` are in `package.json` but no `import from 'bcrypt'` was found in the app code. The update is still worth doing to keep the lockfile clean, but there is no code to change.

**⚠️ Breaking changes in bcrypt 6:**
- Check: https://github.com/kelektiv/node.bcrypt.js/releases

- [ ] **Step 1: Update bcrypt**

```bash
pnpm add bcrypt@latest
pnpm add -D @types/bcrypt@latest
```

- [ ] **Step 2: Verify**

```bash
pnpm lint && npx tsc --noEmit
```

Expected: No errors (bcrypt is not imported anywhere in app code).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update bcrypt 5→6, @types/bcrypt 5→6"
```

---

## Task 9: @types/node (MAJOR)

`@types/node` 22→25 is a major jump but is generally additive. Breakage would only occur if Node.js APIs were removed, which is rare.

- [ ] **Step 1: Update @types/node**

```bash
pnpm add -D @types/node@latest
```

- [ ] **Step 2: Verify**

```bash
pnpm lint && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update @types/node 22→25"
```

---

## Task 10: Tailwind CSS 4 (MAJOR — COMPLETE REWRITE)

**🔴 This is the highest-risk update. Tailwind v4 is a complete rewrite:**
- CSS-first configuration: `tailwind.config.ts` is replaced by CSS variables in your CSS file
- `@tailwind base/components/utilities` → `@import "tailwindcss"`
- `postcss.config.js` must use `@tailwindcss/postcss` instead of `tailwindcss`
- `@tailwindcss/forms` has a v4-compatible version
- Many utility class names changed (e.g., `shadow` values, `ring` defaults, opacity modifiers)
- Custom colors/theme must move to CSS `@theme` block

**Files to change:**
- `app/ui/global.css` — replace directives
- `tailwind.config.ts` — migrate to CSS `@theme` block or keep a simplified v4 config
- `postcss.config.js` — update plugin reference

- [ ] **Step 1: Install Tailwind v4 and its PostCSS plugin**

```bash
pnpm add tailwindcss@latest @tailwindcss/postcss@latest @tailwindcss/forms@latest
```

- [ ] **Step 2: Update postcss.config.js**

```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 3: Update app/ui/global.css**

```css
/* Replace the three @tailwind directives with: */
@import "tailwindcss";

/* Keep the existing input[type='number'] rules below */
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
```

- [ ] **Step 4: Migrate tailwind.config.ts theme to CSS**

In Tailwind v4, custom theme values move to `@theme` in your CSS file. Add to `app/ui/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-blue-400: #2589FE;
  --color-blue-500: #0070F3;
  --color-blue-600: #2F6FEB;
  --grid-template-columns-13: repeat(13, minmax(0, 1fr));

  --animate-shimmer: shimmer 1s infinite;

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

/* existing input rules below */
```

- [ ] **Step 5: Update tailwind.config.ts for v4**

In v4, `tailwind.config.ts` is minimal or can be deleted. If kept, it only needs content paths (v4 auto-detects content, so even this is optional):

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
export default config;
```

- [ ] **Step 6: Handle @tailwindcss/forms in v4**

In Tailwind v4, `@tailwindcss/forms` is imported in CSS instead of as a plugin:

```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";
```

Remove the `plugins: [require('@tailwindcss/forms')]` from `tailwind.config.ts`.

- [ ] **Step 7: Start dev server and visually inspect**

```bash
pnpm dev
```

Open the app in a browser and check:
- Dashboard layout
- Onboarding flow
- Survey forms
- Sign-in / sign-up pages

Look for broken spacing, missing colors, layout shifts.

- [ ] **Step 8: Fix any broken classes**

Common Tailwind v4 class changes:
- `ring` now defaults to 1px (was 3px) — update `ring` to `ring-3` if needed
- `shadow` values changed — check dropdowns and cards
- `divide-*` and `space-*` may need adjustment

Run `pnpm build` to catch any CSS generation errors:

```bash
pnpm build 2>&1
```

- [ ] **Step 9: Commit**

```bash
git add app/ui/global.css tailwind.config.ts postcss.config.js package.json pnpm-lock.yaml
git commit -m "chore: migrate tailwindcss 3→4, update postcss config and CSS directives"
```

---

## Task 11: zod (MAJOR — safe, not used in app code)

`zod` is in `package.json` but `import from 'zod'` was not found anywhere in the app. Update is safe.

**⚠️ Breaking changes in zod 4 (for future reference when zod is used):**
- `z.object().partial()` behavior changed
- Error formatting API changed
- Some method names changed
- Check: https://zod.dev/v4

- [ ] **Step 1: Update zod**

```bash
pnpm add zod@latest
```

- [ ] **Step 2: Verify**

```bash
pnpm lint && npx tsc --noEmit
```

Expected: No errors (zod not imported in app code).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update zod 3→4 (not yet used in app code)"
```

---

## Final Verification

- [ ] **Full build**

```bash
pnpm build 2>&1
```

Expected: Successful build with no type errors or compilation failures.

- [ ] **Lint**

```bash
pnpm lint
```

Expected: No ESLint errors.

- [ ] **Check pnpm outdated**

```bash
pnpm outdated 2>&1
```

Expected: Empty (or only packages intentionally held back).
