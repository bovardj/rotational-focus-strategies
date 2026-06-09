# Onboarding Page Restyle

**Date:** 2026-06-08  
**Branch:** onboarding-redo  

## Goal

Bring the onboarding pages into visual consistency with the landing page and auth pages, which share a distinct `bg-blue-50` + glow decoration + white card language. The onboarding currently uses a plain white background, a `bg-blue-600` sidenav, and no card treatment on the content pane.

## Approach

Option C (selected): Full card treatment — `bg-blue-50` background with glow decorations across the whole layout, sidenav styled as a floating rounded panel, content pane wrapped in a white shadow card matching the auth shell.

## Changes

### `app/onboarding/layout.tsx`

- Outer wrapper: add `relative bg-blue-50` and the same three decorative glow divs used in `auth-shell.tsx` (center, top-right, bottom-left blur-3xl divs, `pointer-events-none absolute inset-0`).
- Add outer padding `p-4 md:p-6` to the flex container so both panels float above the background.
- Add `gap-4 md:gap-6` between sidenav and content columns.
- Sidenav wrapper: add `rounded-2xl overflow-hidden shadow-xl shadow-blue-100/60 border border-gray-100`. Change sticky offset from `md:top-0` to `md:top-6` and height from `md:h-screen` to `md:h-[calc(100vh-3rem)]` to respect the outer padding.
- Content wrapper: add an inner div with `rounded-2xl bg-white border border-gray-100 shadow-xl shadow-blue-100/60 flex-grow p-6 md:p-10` wrapping `{children}`. Remove the existing inner `p-6 md:p-12` padding div.

### `app/ui/onboarding/sidenav.tsx`

- Logo bar: `bg-blue-600` → `bg-blue-800`. Remove `rounded-md` (the layout wrapper's `overflow-hidden` now clips the corners).
- Step number circles: `bg-blue-600` → `bg-blue-800`.
- Remove outer padding from the sidenav root div (`px-3 py-4 md:px-2` → none, keep `flex h-full flex-col`) so the blue header sits flush against the card top edge.
- The `bg-gray-100` steps section and `UserNav` at the bottom remain unchanged.

## What Does Not Change

- Strategy card styling inside the content pane (`bg-gray-50`, `border-gray-200`, `border-blue-500` selected state) — these read well against white.
- The strategy detail pages under `/onboarding/strategies/*` inherit the layout automatically.
- Mobile stacking behavior (sidenav on top, content below) is preserved.

## Accessibility Notes

- Changing `bg-blue-600` → `bg-blue-800` on step number circles fixes a WCAG AAA compliance gap (the number text needs sufficient contrast against the circle background).
- No new interactive elements are introduced; existing focus ring and skip-link patterns are unaffected.
