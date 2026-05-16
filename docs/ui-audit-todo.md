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

### Auth flow pages (`/sign-in`, `/sign-up`, `/forgot-password`)
- Investigate custom Clerk auth pages (Clerk supports fully custom UI via `<SignIn>` component with `appearance` prop, or headless `useSignIn`/`useSignUp` hooks)
- Current pages likely use Clerk's default hosted UI — evaluate whether custom pages are worth the effort
- If going custom: ensure branding is consistent with the rest of the app

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
