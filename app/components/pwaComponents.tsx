"use client";

import { useEffect, useState } from "react";
import { subscribeUser, unsubscribeUser, sendTestNotification } from "@/app/lib/actions/notifications";
import { Button } from "@/app/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ─── Push Notification Manager ────────────────────────────────────────────────

export function PushNotificationManager() {
  const [mounted, setMounted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    setIsSupported(true);
    (async () => {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    })();
  }, []);

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function handleTestNotification() {
    setTestStatus("sending");
    try {
      await sendTestNotification();
      setTestStatus("sent");
      setTimeout(() => setTestStatus("idle"), 3000);
    } catch {
      setTestStatus("error");
      setTimeout(() => setTestStatus("idle"), 3000);
    }
  }

  if (!mounted) return null;

  if (!isSupported) {
    return (
      <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
        <p className="text-sm text-gray-500">
          Push notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">Push Notifications</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {subscription
            ? "You're subscribed. You'll receive daily reminders."
            : "Subscribe to receive daily reminders."}
        </p>
      </div>
      {subscription ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={handleTestNotification}
            disabled={testStatus === "sending"}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-blue-50 border border-blue-200 px-4 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 active:bg-blue-200 disabled:opacity-50"
          >
            {testStatus === "sending" ? "Sending…" : testStatus === "sent" ? "Notification sent!" : testStatus === "error" ? "Failed — try again" : "Send test notification"}
          </button>
          <button
            onClick={unsubscribeFromPush}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-200 px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 active:bg-gray-400"
          >
            Unsubscribe
          </button>
        </div>
      ) : (
        <Button onClick={subscribeToPush} className="w-full justify-center">
          Subscribe to notifications
        </Button>
      )}
    </div>
  );
}

// ─── Install Prompt ───────────────────────────────────────────────────────────

export function InstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [env, setEnv] = useState({ isIOS: false, isStandalone: false });
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setDismissed(localStorage.getItem("pwa-install-dismissed") === "true");
    setEnv({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
      isStandalone: window.matchMedia("(display-mode: standalone)").matches,
    });

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
  }

  if (!mounted || env.isStandalone || dismissed || (!deferredPrompt && !env.isIOS)) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 z-[60] bg-white border-t border-gray-200 shadow-lg md:bottom-0"
      style={{
        bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight">Add RFS to your home screen</p>
          {env.isIOS ? (
            <p className="text-xs text-gray-500 mt-0.5">
              Tap the share button{" "}
              <svg className="inline w-3.5 h-3.5 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4m0 0L8 6m4-4v13" />
              </svg>
              {" "}then <strong className="text-gray-700">Add to Home Screen</strong>
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5">Install for a faster, app-like experience</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {deferredPrompt && (
            <Button onClick={handleInstall} className="h-8 px-3 text-xs">
              Install
            </Button>
          )}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
