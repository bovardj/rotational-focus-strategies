# RFS Style Guide

Design tokens, component patterns, and usage guidelines for the Rotational Focus Strategies application.

A live interactive version of this guide is available at `/style-guide` in the app.

---

## Colors

Custom blue values are defined in `app/ui/global.css` inside an `@theme` block. All other colors use Tailwind v4 defaults. WCAG contrast ratios are measured against white (#FFFFFF).

### Brand Blues

| Name | Hex | Tailwind Class | WCAG vs White | Usage |
|------|-----|---------------|---------------|-------|
| Blue 400 | `#2589FE` | `bg-blue-400` / `text-blue-400` | 3.0:1 ⚠️ AA-Large | Button hover state |
| Blue 500 | `#0070F3` | `bg-blue-500` / `text-blue-500` | 4.1:1 ⚠️ AA-Large | Primary button fill |
| Blue 600 | `#2F6FEB` | `bg-blue-600` / `text-blue-600` | 4.17:1 ⚠️ AA-Large | Sidenav header, numbered circles, link text |
| Blue 700 | ~`#1D4ED8` | `text-blue-700` | ~6.2:1 ✅ AA | Valid counter, high-contrast link text |
| Blue 900 | ~`#1E3A8A` | `text-blue-900` | ~11.5:1 ✅ AA | Selected card text |
| Blue 50 | ~`#EFF6FF` | `bg-blue-50` | 1.05:1 — | Selected card background (not for text) |

> **Note on Blue 400–600:** These custom blues fall below the 4.5:1 AA threshold for normal-sized text against white. Use them for large text (≥18pt / ≥14pt bold), UI components, or graphical objects — or pair with a non-color indicator (icon, border) to compensate. For body text, prefer `text-blue-700` or `text-blue-900`.

### Neutrals

| Name | Hex | Tailwind Class | WCAG vs White | Usage |
|------|-----|---------------|---------------|-------|
| White | `#FFFFFF` | `bg-white` | 1.0:1 — | Page background |
| Gray 50 | `#F9FAFB` | `bg-gray-50` | 1.02:1 — | Dashboard sidenav fill |
| Gray 100 | `#F3F4F6` | `bg-gray-100` | 1.1:1 — | Section backgrounds, onboarding sidenav |
| Gray 200 | `#E5E7EB` | `border-gray-200` | 1.3:1 — | Card borders, dividers |
| Gray 500 | `#6B7280` | `text-gray-500` | 4.63:1 ✅ AA | Captions, icons, unselected chevrons |
| Gray 600 | `#4B5563` | `text-gray-600` | 7.0:1 ✅ AA | Secondary labels, sidenav section label |
| Gray 800 | `#1F2937` | `text-gray-800` | 12.6:1 ✅ AA | Body text, step labels |
| Gray 900 | `#111827` | `text-gray-900` | 16.1:1 ✅ AA | Headings, primary text |

> **Avoid `text-gray-400` (#9CA3AF, ~2.9:1) for meaningful text** — it fails WCAG AA at all sizes.

---

## Typography

Two typefaces imported via `next/font/google` in `app/ui/fonts.ts`.

### Lusitana — Display

Used for page titles and major headings via the `lusitana.className` utility.

```tsx
import { lusitana } from "@/app/ui/fonts";

<h1 className={`${lusitana.className} text-2xl md:text-4xl font-bold text-gray-900`}>
  Focus Strategies
</h1>
```

| Scale | Usage |
|-------|-------|
| `text-4xl font-bold` | Page title (style guide, major landing headings) |
| `text-2xl font-bold` | Section title on onboarding page |
| `text-xl font-bold` | Sub-section headings |

### Inter — UI / Body

The default font for all UI text. Applied via the `inter.className` at the root layout.

| Class | Usage |
|-------|-------|
| `text-lg font-semibold text-gray-900` | Card/section subheadings (e.g., "Select 3 focus strategies") |
| `text-sm font-medium text-gray-900` | Card titles, nav links |
| `text-sm text-gray-800` | Body text, step labels |
| `text-sm text-gray-500` | Helper text, captions, instructions |
| `text-xs font-semibold uppercase tracking-wider text-gray-600` | Section labels (e.g., "STUDY OVERVIEW") |
| `font-mono text-xs text-gray-500` | Code references, tokens |

---

## Spacing

Tailwind's default 4px base scale. Common values used in this app:

| Token | px | Common uses |
|-------|----|-------------|
| `1` | 4px | Tight icon gaps |
| `2` | 8px | Button padding, small gaps |
| `3` | 12px | List item gap (`gap-3`), section padding |
| `4` | 16px | Card padding (`px-4 py-3`), standard spacing |
| `6` | 24px | Page padding mobile (`p-6`) |
| `8` | 32px | — |
| `12` | 48px | Page padding desktop (`md:p-12`) |

---

## Components

### Button

Defined in `app/ui/button.tsx`. One variant with hover, active, focus, and disabled states.

```tsx
import { Button } from "@/app/ui/button";

<Button>Submit</Button>
<Button disabled className="opacity-50 cursor-not-allowed">Submit</Button>
```

**Full class list:**
```
flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white
transition-colors hover:bg-blue-400 active:bg-blue-600
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
aria-disabled:cursor-not-allowed aria-disabled:opacity-50
```

---

### Strategy Accordion

Used on the onboarding page (`app/onboarding/page.tsx`) for strategy selection. Supports three visual states.

**Visual states:**

| State | Border | Background | Text |
|-------|--------|------------|------|
| Default | `border-gray-200` | `bg-gray-50` | `text-gray-900` |
| Selected | `border-blue-500` | `bg-blue-50` | `text-blue-900` |
| Disabled | `border-gray-200 opacity-50` | `bg-gray-50` | `text-gray-900` |

**State logic:**
```tsx
const [selectedItems, setSelectedItems] = useState<string[]>([]);
const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

const isSelected = selectedItems.includes(strategy.href);
const isDisabled = selectedItems.length >= requiredStrategies && !isSelected;
const isOpen = openIndices.has(index);
```

**Animation — height 0 → auto:**
```tsx
{/* Outer div transitions grid-template-rows */}
<div className={`grid transition-[grid-template-rows] duration-200 ease-in-out
  ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>

  {/* Inner clips content during transition */}
  <div className="overflow-hidden">
    <div className="border-t px-4 py-3 text-sm">
      {content}
    </div>
  </div>
</div>
```

> CSS cannot animate `height: auto`. The `grid-template-rows: 0fr → 1fr` trick collapses a grid row to zero height without needing to know the content's explicit height. The inner `overflow-hidden` wrapper clips content while the transition is in progress.

**Chevron rotation:**
```tsx
<svg className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>
  <path d="M9 5l7 7-7 7" />
</svg>
```

---

### Collapse

General-purpose disclosure component in `app/ui/components/collapse.tsx`. Uses native `<details>/<summary>` — no CSS transition. For animated disclosure, use the Accordion pattern above.

```tsx
import Collapse from "@/app/ui/components/collapse";

<Collapse title="Strategy details" shadow>
  Content goes here.
</Collapse>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Summary/trigger text |
| `children` | `ReactNode` | — | Expanded content |
| `initialVisible` | `boolean` | `false` | Start expanded |
| `shadow` | `boolean` | `false` | Adds `shadow-sm` |
| `className` | `string` | `''` | Extra classes on `<details>` |

---

### Study Overview Sidenav

Used in the onboarding layout (`app/ui/onboarding/sidenav.tsx`). Responsive: collapsible on mobile via `<details>`, always visible on desktop.

**Step labels** (keep short to avoid text-wrapping height inconsistency across items):
```tsx
const steps = [
  { label: "Choose 3 focus strategies" },
  { label: "Complete 3 baseline surveys" },
  { label: "Use a random strategy each day (4 days)" },
  { label: "Complete the exit survey" },
];
```

**Numbered circle:**
```tsx
<span className="flex h-5 w-5 flex-shrink-0 items-center justify-center
  rounded-full bg-blue-600 text-[10px] font-bold text-white">
  {i + 1}
</span>
```

---

### Form Elements

Styled via the `@tailwindcss/forms` plugin.

**Custom circular checkbox** (onboarding strategy selector — rendered as a `div`, not `<input type="checkbox">`):

```tsx
{/* Visual indicator */}
<div
  onClick={(e) => { e.stopPropagation(); if (!isDisabled) handleCheckboxChange(id); }}
  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2
    transition-colors cursor-pointer
    ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-500 bg-white"}
    ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
>
  {isSelected && (
    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )}
</div>

{/* Hidden real checkbox for form submission */}
<input type="checkbox" name="strategy" value={id}
  checked={isSelected} onChange={() => handleCheckboxChange(id)}
  className="sr-only" />
```

---

## Layout Patterns

### Onboarding Layout

`app/onboarding/layout.tsx` — content expands naturally; sidenav sticks on desktop.

```tsx
<div className="flex min-h-screen flex-col md:flex-row">
  {/* Sticky sidenav — desktop only */}
  <div className="w-full flex-none md:sticky md:top-0 md:h-screen md:w-64 md:overflow-y-auto">
    <SideNav />
  </div>
  {/* Content pane — expands with content, no overflow constraints */}
  <div className="flex flex-col flex-grow">
    <div className="p-6 md:p-12">{children}</div>
  </div>
</div>
```

> **Do not add `overflow-hidden` or `overflow-y-auto` to the content pane.** Doing so creates a nested scrollbar that narrows card widths when content overflows (the scrollbar consumes space from the layout).

### Max-width Capping

Use `max-w-*` (not `w-*` or `lg:w-1/2`) to cap content width without a sudden jump at a breakpoint. The onboarding page uses `max-w-2xl` (672px).

```tsx
<div className="max-w-2xl ...">
  {/* Grows freely up to 672px, then stops */}
</div>
```

---

## Motion

All animations are CSS-only via Tailwind transition utilities.

| Interaction | Classes | Property |
|------------|---------|----------|
| Accordion open/close | `transition-[grid-template-rows] duration-200 ease-in-out` | `grid-template-rows` |
| Chevron rotate | `transition-transform duration-200` | `transform` |
| Button color change | `transition-colors` | `background-color` |
| Card selected state | `transition-colors duration-150` | `border-color`, `background-color` |

---

## Accessibility

- **WCAG AA target:** 4.5:1 for normal text, 3.0:1 for large text and UI components.
- **Non-color indicators:** Always pair color changes with a secondary indicator (icon, border, shape change). The valid counter uses both `text-blue-700` color AND a checkmark icon.
- **`scrollbar-gutter: stable`** is set globally in `app/ui/global.css` to prevent layout shift when a scrollbar appears.
- **External links** must include `target="_blank" rel="noopener noreferrer"`.
- **Screen reader checkboxes:** The onboarding selector uses visible `div` indicators with `sr-only` hidden inputs so the form still submits correctly.
