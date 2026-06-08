# Auth Pages — Landing Page Style

**Date:** 2026-06-08
**Scope:** sign-in, sign-up, forgot-password pages

## Goal

Restyle the three auth pages to visually match the landing page: blue-50 background with decorative glows, RFS logo above the card, and the white rounded card style.

## New Component

**`app/ui/auth-shell.tsx`** — server component, accepts `children: React.ReactNode`.

Renders:
- `<main>` with `relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-blue-50 p-6`
- Three decorative glow divs (absolute, pointer-events-none, blurred circles — identical to landing page)
- `<RFSLogo className="text-blue-800" />` centered above the card in a `mb-6 flex justify-center` wrapper
- Card div: `rounded-2xl border border-gray-100 bg-white px-8 py-8 shadow-xl shadow-blue-100/60`
- `{children}` inside the card

Container width: `relative w-full max-w-sm` (matches landing page).

## Page Changes

All three pages apply the same transformation:

- Remove the outer text header (title + subtitle div) above the old card
- Remove the old card div (`rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm`)
- Wrap `<Suspense><Form /></Suspense>` in `<AuthShell>`
- Keep the page-level `metadata` export unchanged

## What Is Not Changed

- `SigninForm`, `SignupForm`, `ForgotPasswordForm` components — untouched
- `metadata` exports on each page
- All form logic, Clerk integration, routing

## Files Affected

| File | Change |
|------|--------|
| `app/ui/auth-shell.tsx` | Create |
| `app/sign-in/page.tsx` | Update shell |
| `app/sign-up/page.tsx` | Update shell |
| `app/forgot-password/page.tsx` | Update shell |
