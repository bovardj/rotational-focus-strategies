'use server';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
  {
      async accessToken() {
          return (await auth()).getToken()
      }
  }
)

// Notification actions:

webpush.setVapidDetails(
  'mailto:johnbovard.dev@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

// I'm not sure where this came from
// let subscription: {
//   endpoint: string;
//   expirationTime?: null | number;
//   keys: {
//     p256dh: string;
//     auth: string;
//   };
// } | null = null;
 
export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
//   subscription = {
//     endpoint: sub.endpoint,
//     expirationTime: sub.expirationTime,
//     keys: {
//       p256dh: sub.getKey('p256dh') ? Buffer.from(sub.getKey('p256dh')!).toString('base64') : '',
//       auth: sub.getKey('auth') ? Buffer.from(sub.getKey('auth')!).toString('base64') : '',
//     },
//   };

  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase.from('subscriptions').upsert([
    {
      user_id: userId,
      subscription: subscription,
    //   subscription: sub,
    },
  ]);

  if (error) {
    throw new Error(`Failed to save subscription: ${error.message}`);
  }

  // I'm not sure where this came from

  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true }
}
 
export async function unsubscribeUser() {
  subscription = null

  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete subscription: ${error.message}`);
  }

  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}
 
// export async function sendNotification(message: string) {
//   if (!subscription) {
//     throw new Error('No subscription available')
//   }
 
//   try {
//     await webpush.sendNotification(
//       subscription,
//       JSON.stringify({
//         title: 'Test Notification',
//         body: message,
//         icon: '/icon.png',
//       })
//     )
//     return { success: true }
//   } catch (error) {
//     console.error('Error sending push notification:', error)
//     return { success: false, error: 'Failed to send notification' }
//   }
// }

export async function scheduleTimeNotification({
  user_id,
  message,
  scheduled_at,
}: {
  user_id: string
  message: string
  scheduled_at: string
}) {
  const { error } = await supabase
    .from('scheduled_notifications')
    .insert([
      {
        user_id,
        message,
        scheduled_at,
      },
    ])

  if (error) {
    console.log('Error scheduling notification:', error)
    throw new Error(`Failed to schedule notification: ${error.message}`)
  }

  return { success: true }
}

export async function sendDueNotifications() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

//   const now = new Date().toISOString();
  const now = new Date();
  const currentTime = now.toISOString().slice(11, 16); // Get the current time in HH:MM format

  const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000).toISOString().slice(11, 16);
  const oneMinuteAhead = new Date(now.getTime() + 1 * 60 * 1000).toISOString().slice(11, 16);  
  const { data: due } = await supabase
    .from('scheduled_notifications')
    .select('*')
    .gte('scheduled_at', oneMinuteAgo)
    .lte('scheduled_at', oneMinuteAhead);

//   if (!due) return;

  for (const notif of due ?? []) {
    // Check if the notification is already sent
    const today = now.toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
    const sentToday = notif.sent_on?.includes(today);
    if (sentToday) continue;

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('subscription')
      .eq('user_id', notif.user_id)
      .single();

    if (sub) {
      await webpush.sendNotification(
        sub.subscription,
        JSON.stringify({ title: '⏰ Daily Reminder', body: notif.message })
      );

      await supabase
        .from('scheduled_notifications')
        .update({ sent_on: [...(notif.sent_on ?? []), today] })
        .eq('id', notif.id);
    }
  }
}

