# PWA Implementation Design

**Date:** 2026-05-15
**Status:** Approved

## Goal

Make the RFS app fully functional as a Progressive Web App: installable on home screen, push notifications working, and basic offline support (last-visited dashboard cached, offline fallback page).

## Approach

Manual implementation — extend the existing `public/sw.js` and fix/wire the existing PWA components. No new SW library or build plugin.

---

## Section 1: Service Worker (`public/sw.js`)

### Bug fix
`clients.openWindow('<https://www.focusapp.dev/>')` → `clients.openWindow('https://www.focusapp.dev/')` (remove angle brackets from URL string)

### New event handlers

**`install`**
Pre-cache the following into a versioned cache (e.g. `rfs-v1`):
- `/offline` (the new offline fallback page)
- `/` (landing page shell)
- `/android-chrome-192x192.png`
- `/android-chrome-512x512.png`
- `/apple-touch-icon.png`

Call `self.skipWaiting()` so the new SW activates immediately.

**`activate`**
Delete any caches whose key does not match the current cache version. Call `clients.claim()` so the active SW takes control of existing pages without a reload.

**`fetch`**
Two strategies based on request type:

- **Navigation requests** (`request.mode === 'navigate'`): network-first. Attempt the network; on failure, try the cache for that URL; if not cached, serve `/offline`.
- **Static asset requests** (`/_next/static/` chunks, images, scripts, styles — identified by URL path or `request.destination`): cache-first. Serve from cache if present; otherwise fetch from network and add to cache. Caching `/_next/static/` is required for the app shell (JS/CSS) to load offline.

All other requests (API calls, Clerk/Supabase) pass through without caching.

### Existing handlers retained
`push` and `notificationclick` handlers remain unchanged (aside from the URL bug fix above).

---

## Section 2: Offline Page (`app/offline/page.tsx`)

A server component. Shows a branded message indicating the user is offline and a reload link. No dynamic content — this page must be fully static so it renders from cache without a network request.

---

## Section 3: Push Notifications (`app/lib/actions/notifications.ts`)

**Install packages:**
```
pnpm add web-push
pnpm add -D @types/web-push
```

**Changes to `notifications.ts`:**
- Uncomment the `import webpush from 'web-push'` line
- Uncomment the `webpush.setVapidDetails(...)` call at module level
- Uncomment the full body of `sendDueNotifications()` — it reads subscriptions from Supabase and sends via `webpush.sendNotification`
- Remove the module-level `let subscription` variable and the `subscription = sub` assignment in `subscribeUser` — this variable is meaningless in a serverless context (value lost between invocations) and `sendDueNotifications` already reads subscriptions from Supabase directly

No changes to `subscribeUser` or `unsubscribeUser` logic beyond removing the stale variable.

---

## Section 4: Component Wiring

**`PushNotificationManager`** → `app/dashboard/notifications/page.tsx`
Add above the existing scheduling form. It handles SW registration on mount and shows subscribe/unsubscribe controls.

**`InstallPrompt`** → `app/layout.tsx`
Add inside the root layout body (below the header). Shows on all pages so users are prompted to install before they even sign in.

---

## Section 5: Fix `InstallPrompt` (`app/components/pwaComponents.tsx`)

The "Add to Home Screen" button currently has no click handler. Fix:

1. Add `deferredPrompt` state (`BeforeInstallPromptEvent | null`)
2. In `useEffect`, listen for the `beforeinstallprompt` event; when fired, call `e.preventDefault()` and store the event in state
3. On button click, call `deferredPrompt.prompt()`, await `deferredPrompt.userChoice`, then clear `deferredPrompt` from state
4. Hide the button once `deferredPrompt` is null (user responded or browser didn't fire the event)
5. iOS path is unchanged — shows manual "Share → Add to Home Screen" instructions

`BeforeInstallPromptEvent` is not in the standard TypeScript lib; declare it locally as a minimal interface with `prompt()` and `userChoice` properties.

---

## Files Changed

| File | Change |
|---|---|
| `public/sw.js` | Fix URL bug, add install/activate/fetch handlers |
| `app/offline/page.tsx` | New — static offline fallback page |
| `app/lib/actions/notifications.ts` | Re-enable web-push, remove stale variable |
| `app/components/pwaComponents.tsx` | Fix InstallPrompt with beforeinstallprompt handling |
| `app/dashboard/notifications/page.tsx` | Add PushNotificationManager |
| `app/layout.tsx` | Add InstallPrompt |
| `package.json` / `pnpm-lock.yaml` | Add web-push, @types/web-push |

---

## Out of Scope

- Background sync
- Periodic background fetch
- Workbox / serwist
- Offline support for routes beyond the cached pages
