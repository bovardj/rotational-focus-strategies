# UI Audit — Remaining Work

Items to revisit for design, accessibility, and UX polish.

---

## Pages

### Strategies page (`/dashboard/strategies`)
- Review layout and information hierarchy
- Evaluate the strategies table — is a table the right component, or would cards/list work better?
- Check that individual strategy pages (`/dashboard/strategies/[slug]`) are consistent with the rest of the dashboard

### Landing page (`/`)
- Full design review — first impression for new users
- Ensure value proposition is clear and copy is compelling
- Check responsiveness and visual hierarchy

### Notifications page (`/dashboard/notifications`)
- Review the overall layout and UX of the notification scheduling form
- Evaluate whether the `PushNotificationManager` component (subscription setup) and the scheduling form should be more clearly separated or explained
- Consider adding confirmation feedback when a notification is successfully scheduled
- Check that the page is consistent with the rest of the dashboard design

### Auth flow pages (`/sign-in`, `/sign-up`, `/forgot-password`)
- Investigate custom Clerk auth pages (Clerk supports fully custom UI via `<SignIn>` component with `appearance` prop, or headless `useSignIn`/`useSignUp` hooks)
- Current pages likely use Clerk's default hosted UI — evaluate whether custom pages are worth the effort
- If going custom: ensure branding is consistent with the rest of the app

---

## Design Language Review

A cross-cutting audit to ensure the app has a coherent visual identity. Reference `STYLE_GUIDE.md` throughout.

### Typography
- Verify Lusitana is used consistently for all page `<h1>` headings and nowhere else
- Check that body text, labels, and secondary text use the correct gray scale (`text-gray-700` body, `text-gray-500` secondary) — no stray `text-gray-400` on meaningful text
- Audit for any remaining `text-md` (invalid in Tailwind v4), `<b>`, or `<i>` tags

### Color
- Confirm blue usage is consistent: `blue-600` for primary actions and links, `blue-700` for hover, `blue-50` for hover backgrounds — no `indigo`, `sky`, or other blue-adjacent colors leaking in
- Check that the left-border accent treatment on the Today's Strategy card (`border-l-4 border-blue-600 bg-gray-200/60`) isn't competing with or being duplicated by other elements
- Audit any remaining hardcoded colors or Tailwind classes that conflict with the palette in `STYLE_GUIDE.md`

### Spacing and layout
- Verify all dashboard pages use `max-w-2xl` (or `max-w-lg` for narrow forms) — no unconstrained full-width text blocks
- Check that section spacing is consistent (`gap-6` / `space-y-6` between major blocks, `space-y-4` within)
- Confirm the sidenav width and sticky behavior is consistent across all dashboard routes

### Component consistency
- Buttons: all primary actions use the `<Button>` component — no raw `<button>` elements with ad-hoc styling
- Links: all inline links use `text-blue-600 hover:text-blue-800 underline`; external links have `target="_blank" rel="noopener noreferrer"`
- Collapse blocks: all use `app/ui/components/collapse.tsx` — no one-off disclosure patterns
- Form inputs: all text inputs and textareas use `border border-gray-200 rounded-md px-3 py-2 text-sm` — no `border-gray-300`, `shadow-sm`, or `sm:text-sm` remnants from earlier iterations

### Icons
- Confirm all icons come from `@heroicons/react/24/outline` — no mixing of `solid` and `outline` variants without intent
- Check icon sizes are consistent (`w-6` for nav, `w-4`/`h-4` for inline)

---

## Global

### Footer
- Add a sitewide footer with:
  - Contact info / researcher email
  - Any required study disclosures or IRB info
  - Links to key pages (Dashboard, Survey, Strategies)
- Decide scope: dashboard only, or all pages including `/`

### Accessibility audit
- Run axe or Lighthouse accessibility audit on all major pages
- Check: color contrast (WCAG AA), keyboard navigation, focus states, screen reader labels on icon-only buttons
- Verify Likert scale tiles are keyboard-navigable (arrow keys between radio options)
- Check form error states are announced to screen readers

### Overall UX audit
- Walk through the full user journey: sign-up → onboarding → instructions → dashboard → survey → exit
- Check for confusing flows, missing states (loading, empty, error), and copy clarity
- Verify mobile experience at common breakpoints
- Review notification setup flow for clarity
