# Strategies Page Redesign

**Date:** 2026-05-19
**Branch:** performance-improvements-1

## Goal

Bring the Strategies index and individual strategy detail pages into visual consistency with the Dashboard page, following the patterns established in `STYLE_GUIDE.md`.

## Scope

Two surfaces:
1. `/dashboard/strategies` — the strategies index page
2. `/dashboard/strategies/[strategy]` — the 8 individual strategy detail pages

## Design

### Strategies Index Page

**Shell:**
- Wrap content in `<main>` (matches dashboard)
- Constrain to `max-w-2xl` (matches dashboard)
- Heading: Lusitana `text-2xl font-bold mb-4` — no change needed

**Strategy list:**
- Replace the existing `<Table>` / `<TableData>` components with a new `StrategyCard` component
- Each card is a `<Link>` wrapping a `rounded-lg bg-gray-50 border border-gray-200 p-4 hover:bg-gray-100 transition-colors` block
- Inside each card:
  - Strategy name: `text-sm font-medium text-gray-900`
  - One-line description: `text-sm text-gray-500`
- Cards stacked vertically with `space-y-3`
- Short descriptions (one per strategy) defined as a static map in the card component — no new data fetching

**Files changed:**
- `app/dashboard/strategies/page.tsx` — add `<main>`, `max-w-2xl`, swap `<Table>` for new cards
- `app/ui/strategies/table.tsx` — replace with `StrategyCards` component (or rename/rewrite in place)
- `app/ui/strategies/table-data.tsx` — replace with `StrategyCard` component

### Individual Strategy Detail Pages

**Shell:**
- Add `max-w-2xl` wrapper below breadcrumbs
- Add Lusitana `h1` (`text-2xl font-bold mb-4`) showing the formatted strategy name — currently missing, name only appears in breadcrumb trail

**Description content:**
- Wrap `<StrategyDescriptions>` in a `rounded-lg bg-gray-50 border border-gray-200 p-4` card
- Fix body text in `strategy-descriptions.tsx`: change `text-md` (invalid Tailwind v4 token) to `text-sm text-gray-800`
- Paragraph spacing (`mt-4`) unchanged

**Files changed:**
- All 8 `app/dashboard/strategies/[strategy]/page.tsx` files — add `max-w-2xl`, `h1` heading, card wrapper
- `app/ui/dashboard/strategy-descriptions.tsx` — fix `text-md` → `text-sm text-gray-800`

### What is NOT changing

- `app/ui/strategies/breadcrumbs.tsx` — already correct (Lusitana, correct gray colors)
- Strategy description prose content — prose-only, no structured tip boxes or metadata added
- Routing or data fetching — purely visual changes

## Acceptance Criteria

- Strategies index shows 8 strategy cards with name + one-line description, styled consistently with dashboard cards
- Each strategy card links correctly to its detail page
- Detail pages show a Lusitana `h1` heading below breadcrumbs
- Detail page prose is wrapped in a card and uses `text-sm text-gray-800`
- No `text-md` tokens remain in strategies UI components
- `pnpm lint` and `pnpm build` pass with no new errors
