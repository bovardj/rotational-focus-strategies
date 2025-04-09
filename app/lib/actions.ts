'use server';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

// https://simonsc.medium.com/working-with-time-zones-in-javascript-1b57e716d273
const getYesterday = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-us', { timeZone: 'America/Denver' });
    // return d.toISOString().slice(0, 10);
};

// const getStartOfWeek = (date: Date) => {
//   const d = new Date(date);
//   const day = d.getDay();
//   const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
//   return new Date(d.setDate(diff)).toISOString().slice(0, 10);
// };

export async function getDailyStrategy() {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const today = new Date().toLocaleDateString('en-us', { timeZone: 'America/Denver' });
//   const today = new Date().toISOString().slice(0, 10);
  const yesterday = getYesterday(new Date());
//   const weekStart = getStartOfWeek(new Date());

  // console.log('Today:', today);
  // console.log('Yesterday:', yesterday);

//   Check today's assignment
  const { data: existing } = await supabase
    .from('assigned_strategies')
    .select('strategy, date')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  // console.log('User ID:', userId);
  // console.log('Existing Strategy:', existing);
  if (existing) {
    // console.log('Returning existing Strategy:', existing);
    return existing;
  }

  // Get all assignments
  const { data: selectedStrategies } = await supabase
    .from('user_strategies')
    .select('strategies')
    .eq('user_id', userId)
    .single();

    // console.log('Selected Strategies:', selectedStrategies?.strategies);

  // Get assignments used this week
//   const { data: assignedThisWeek } = await supabase
  const { data: assignedYesterday } = await supabase
  .from('assigned_strategies')
  .select('strategy')
  .eq('user_id', userId)
  .gte('date', yesterday);
//   .gte('date', weekStart);

//   const assignedStrategies = assignedThisWeek?.map(a => a.strategy) || [];
//   console.log('Assigned Strategies (all data):', assignedThisWeek);
//   console.log('Assigned Strategies:', assignedStrategies);
  const yesterdaysStrategy = assignedYesterday?.map(a => a.strategy) || [];
//   console.log('Assigned Strategies (yesterday):', assignedYesterday);
//   console.log('typeof(Assigned Strategies):', typeof(yesterdaysStrategy));
//   console.log('Assigned Strategies:', yesterdaysStrategy);

  const available = (selectedStrategies?.strategies || []).filter((a: any) => 
    // console.log('a.strategy:', a.strategy);
    !yesterdaysStrategy.includes(a.strategy));
    // !assignedStrategies.includes(a.strategy)});
//   console.log('Available Strategies:', available);

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
    // console.log('Strategy successfully inserted:', chosen);
  }

  // console.log('Newly assigned strategy:', chosen);
  const dailyStrategy = { "strategy": chosen, "date": today }
  return dailyStrategy;
}
