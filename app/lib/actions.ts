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

// https://simonsc.medium.com/working-with-time-zones-in-javascript-1b57e716d273
const getYesterday = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-us', { timeZone: 'America/Los_Angeles' });
    // return d.toLocaleDateString('en-us', { timeZone: 'America/Denver' });
};

export async function getDailyStrategy() {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  // const today = new Date().toLocaleDateString('en-us', { timeZone: 'America/Denver' });
  const today = new Date().toLocaleDateString('en-us', { timeZone: 'America/Los_Angeles' });
  const yesterday = getYesterday(new Date());

//   Check today's assignment
  const { data: existing } = await supabase
    .from('assigned_strategies')
    .select('strategy, date')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (existing) {
    return existing;
  }

  // Get all assignments
  const { data: selectedStrategies } = await supabase
    .from('user_strategies')
    .select('strategies')
    .eq('user_id', userId)
    .single();

  const { data: assignedYesterday } = await supabase
  .from('assigned_strategies')
  .select('strategy')
  .eq('user_id', userId)
  .gte('date', yesterday);

  const yesterdaysStrategy = assignedYesterday?.map(a => a.strategy) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const available = (selectedStrategies?.strategies || []).filter((a: any) => 
    !yesterdaysStrategy.includes(a.strategy));

  if (available.length === 0) {
    throw new Error('No assignments left this week');
  }

  const chosen = available[Math.floor(Math.random() * available.length)];

  const { error } = await supabase.from('assigned_strategies').insert([
    {
        user_id: userId,
        strategy: chosen,
        date: today,
    },
  ]);

  if (error) {
    throw new Error(`Failed to insert strategy: ${error.message}`);
  } else {
  }

  const dailyStrategy = { "strategy": chosen, "date": today }
  return dailyStrategy;
}


// PWA related actions:

webpush.setVapidDetails(
  'mailto:johnbovard.dev@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
 
let subscription: {
  endpoint: string;
  expirationTime?: null | number;
  keys: {
    p256dh: string;
    auth: string;
  };
} | null = null;
 
export async function subscribeUser(sub: PushSubscription) {
  subscription = {
    endpoint: sub.endpoint,
    expirationTime: sub.expirationTime,
    keys: {
      p256dh: sub.getKey('p256dh') ? Buffer.from(sub.getKey('p256dh')!).toString('base64') : '',
      auth: sub.getKey('auth') ? Buffer.from(sub.getKey('auth')!).toString('base64') : '',
    },
  };
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true }
}
 
export async function unsubscribeUser() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}
 
export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }
 
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}