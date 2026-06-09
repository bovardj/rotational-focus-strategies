"use client";

import PageCard from "@/app/ui/dashboard/page-card";
import { useState, useEffect, useCallback } from "react";
import { scheduleTimeNotification, getScheduledNotifications, deleteScheduledNotification } from "@/app/lib/actions/notifications";
import { useUser } from "@clerk/nextjs";
import { PushNotificationManager } from "@/app/components/pwaComponents";
import { lusitana } from "@/app/ui/fonts";
import { Button } from "@/app/ui/button";

const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
];

function utcTimeToLocal(utcTime: string, timezone: string): string {
  const [hours, minutes] = utcTime.split(":").map(Number);
  const date = new Date();
  date.setUTCHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function localTimeToUTC(localTime: string, timezone: string): string {
  const [hours, minutes] = localTime.split(":").map(Number);
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const tzHour = parseInt(parts.find((p) => p.type === "hour")!.value);
  const tzMinute = parseInt(parts.find((p) => p.type === "minute")!.value);
  const offsetMinutes = now.getUTCHours() * 60 + now.getUTCMinutes() - (tzHour * 60 + tzMinute);
  const totalMinutes = hours * 60 + minutes + offsetMinutes;
  const utcTotal = ((totalMinutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(utcTotal / 60)).padStart(2, "0")}:${String(utcTotal % 60).padStart(2, "0")}`;
}

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState("");
  const [showTzPicker, setShowTzPicker] = useState(false);
  const [status, setStatus] = useState("");
  const [scheduled, setScheduled] = useState<{ id: string; message: string; scheduled_at: string }[]>([]);
  const { user } = useUser();
  const userId = user?.id;

  const loadScheduled = useCallback(async () => {
    try {
      const data = await getScheduledNotifications();
      setScheduled(data);
    } catch (e) {
      console.error("Failed to load scheduled notifications:", e);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    loadScheduled();
  }, [loadScheduled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!userId) {
        setStatus("User ID is missing");
        return;
      }

      await scheduleTimeNotification({
        user_id: userId,
        message,
        scheduled_at: localTimeToUTC(time, timezone),
      });

      setStatus("Scheduled!");
      setMessage("");
      setTime("");
      await loadScheduled();
    } catch {
      setStatus("Failed to schedule");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteScheduledNotification(id);
      setScheduled((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // silently fail
    }
  };

  return (
    <PageCard>
      <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl font-bold`}>
        Daily Notifications
      </h1>
      <div className="max-w-sm space-y-4">
        <PushNotificationManager />
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Notification message"
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <input
            type="time"
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          {mounted && (
            <div className="text-xs text-gray-500">
              {showTzPicker ? (
                <div className="flex items-center gap-2">
                  <label className="shrink-0">Timezone:</label>
                  <select
                    value={timezone}
                    onChange={(e) => { setTimezone(e.target.value); setShowTzPicker(false); }}
                    className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  >
                    {COMMON_TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span>
                  Time zone: <span className="font-medium text-gray-700">{timezone}</span>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setShowTzPicker(true)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Change
                  </button>
                </span>
              )}
            </div>
          )}
          <div className="flex justify-center">
            <Button type="submit" className="px-6">
              Schedule
            </Button>
          </div>
        </form>
        {status && <p className="text-sm text-gray-500">{status}</p>}

        {mounted && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Scheduled Notifications</p>
            {scheduled.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No notifications scheduled.</p>
            ) : (
              <ul className="space-y-2">
                {scheduled.map((n) => (
                  <li key={n.id} className="flex items-center justify-between gap-3 rounded-md bg-white border border-gray-200 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{n.message}</p>
                      <p className="text-xs text-gray-400">{utcTimeToLocal(n.scheduled_at, timezone)} · {timezone}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(n.id)}
                      aria-label="Delete notification"
                      className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Notifications not working?</p>
          <ul className="space-y-1.5 text-sm text-gray-600 list-disc pl-4">
            <li>Make sure you&apos;ve subscribed using the button above.</li>
            <li>Check that notifications are enabled for this site in your browser settings.</li>
            <li>On iOS, the app must be installed to your home screen as a PWA — notifications do not work in Safari directly.</li>
            <li>Try unsubscribing and resubscribing, then send a test notification to confirm it&apos;s working.</li>
            <li>If issues persist, reach out at{" "}
              <a href="mailto:john@johnbovard.dev" className="text-blue-600 hover:text-blue-800 underline">
                john@johnbovard.dev
              </a>.
            </li>
          </ul>
        </div>
      </div>
      </main>
    </PageCard>
  );
}
