"use client";

import { useState } from "react";
import { scheduleTimeNotification } from "@/app/lib/actions/notifications";
import { useUser } from "@clerk/nextjs";

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
        setStatus("❌ User ID is missing");
        return;
      }

      await scheduleTimeNotification({
        user_id: userId,
        message,
        scheduled_at: time,
      });

      setStatus("✅ Scheduled!");
      setMessage("");
      setTime("");
    } catch {
      setStatus("❌ Failed to schedule");
    }
  };

  return (
    <main className="max-w-md mx-auto mt-12 p-4 border rounded shadow space-y-4">
      <h1 className="text-2xl font-bold">⏰ Daily Notification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Notification message"
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          type="time"
          className="w-full p-2 border rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Schedule
        </button>
      </form>
      {status && <p>{status}</p>}
    </main>
  );
}
