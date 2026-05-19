# Login Page Redesign

**Date:** 2026-05-19
**Branch:** performance-improvements-1

## Goal

Bring the sign-in, sign-up, and forgot-password pages into visual consistency with the style guide: fix border colors, remove redundant card nesting, correct label sizes, style error messages, fix the unstyled sign-up verification step, and add the app name above the form.

## Scope

Three page files and their associated form components:
- `app/sign-in/page.tsx` + `app/ui/signin-form.tsx`
- `app/sign-up/page.tsx` + `app/ui/signup-form.tsx`
- `app/forgot-password/page.tsx` + `app/ui/forgot-password-form.tsx`

## Design

### Page Wrapper (all 3 pages)

All three page files get the same layout structure. Replace the current `border-2 border-blue-400 rounded-lg bg-white shadow-md` outer card with a two-element stack:

```
<main className="flex min-h-screen items-center justify-center">
  <div className="mx-auto w-full max-w-[400px] space-y-4 px-4">

    {/* App name block */}
    <div className="text-center">
      <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
        Rotational Focus Strategies
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        A study on focus strategies for ADHD
      </p>
    </div>

    {/* Form card */}
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
      <Suspense><FormComponent /></Suspense>
    </div>

  </div>
</main>
```

**What changes:**
- `md:h-screen` → `min-h-screen` (works on mobile without truncation)
- `border-2 border-blue-400 bg-white` → `border border-gray-200 bg-gray-50` (style guide card pattern)
- `shadow-md` → `shadow-sm` (lighter, more consistent with dashboard cards)
- `md:-mt-32` negative margin offset removed (no longer needed with `min-h-screen` centering)
- App name + tagline added above the card

### Form Components (all 3 forms)

**Remove** the inner `flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8` wrapper div from each form — card styling now lives on the page. Form content renders directly inside the card.

**Heading** in each form:
- Add `font-bold mb-4` to existing `lusitana text-2xl`
- Shorten text: "Please sign in to continue." → "Sign in", "Please sign up to continue." → "Sign up", "Forgot Password?" stays as-is

**Labels:**
- `text-xs font-medium` → `text-sm font-medium text-gray-900`

**Error messages** (`signin-form.tsx`, `forgot-password-form.tsx`):
- `<p>{error}</p>` → `<p className="mt-2 text-sm text-red-600">{error}</p>`

**Keep unchanged:** All input fields, icon positioning, Button component, show/hide password toggle, caps lock warning, navigation links (sign up / sign in / reset password).

### Sign-up Verification Step (`signup-form.tsx`)

The `if (verifying)` branch is currently completely unstyled. Replace with:

```tsx
if (verifying) {
  return (
    <div>
      <h1 className={`${lusitana.className} text-2xl font-bold mb-4`}>
        Verify your email
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Enter the verification code sent to your email address.
      </p>
      <form onSubmit={handleVerify}>
        <label
          htmlFor="code"
          className="mb-3 block text-sm font-medium text-gray-900"
        >
          Verification code
        </label>
        <div className="relative">
          <input
            id="code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder="Enter verification code"
          />
          <ChevronDoubleRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        <Button className="mt-4 w-full">
          Verify <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </form>
    </div>
  );
}
```

Requires adding `ChevronDoubleRightIcon` and `ArrowRightIcon` to the imports in `signup-form.tsx`.

## What is NOT Changing

- Clerk API logic, handlers, and state management — purely visual
- Input field styles, icon positioning, show/hide password, caps lock warning
- Button component
- Navigation links between auth pages
- `forgot-password-form.tsx` heading text ("Forgot Password?")

## Acceptance Criteria

- All 3 auth pages show "Rotational Focus Strategies" + tagline above the form card
- Card border is `border border-gray-200` (not `border-2 border-blue-400`)
- Form labels use `text-sm font-medium text-gray-900`
- Form headings are bold
- Error messages are styled `text-sm text-red-600`
- Sign-up verification step is fully styled, matching other form inputs
- `pnpm lint` and `pnpm build` pass with no new errors
