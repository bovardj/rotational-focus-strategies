"use client";

import { useState } from "react";
import { scheduleTimeNotification } from "@/app/lib/actions/notifications";
import { useUser } from "@clerk/nextjs";
import { PushNotificationManager } from "@/app/components/pwaComponents";
import { lusitana } from "@/app/ui/fonts";
import { Button } from "@/app/ui/button";

export default function NotificationsPage() {
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const { user } = useUser();
  const userId = user?.id;

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
        scheduled_at: time,
      });

      setStatus("Scheduled!");
      setMessage("");
      setTime("");
    } catch {
      setStatus("Failed to schedule");
    }
  };

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl font-bold`}>
        Daily Notification
      </h1>
      <div className="max-w-sm space-y-4">
        <PushNotificationManager />
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit">Schedule</Button>
        </form>
        {status && <p className="text-sm text-gray-500">{status}</p>}

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Notifications not working?</p>
          <ul className="space-y-1.5 text-sm text-gray-600 list-disc pl-4">
            <li>Make sure you&apos;ve subscribed using the button above.</li>
            <li>Check that notifications are enabled for this site in your browser settings.</li>
            <li>On iOS, the app must be installed to your home screen as a PWA — notifications do not work in Safari directly.</li>
            <li>Try unsubscribing and resubscribing, then send a test notification to confirm it&apos;s working.</li>
            <li>If issues persist, reach out at{" "}
              <a href="mailto:john.bovard@utah.edu" className="text-blue-600 hover:text-blue-800 underline">
                john.bovard@utah.edu
              </a>.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
