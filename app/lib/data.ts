'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || '',
    {
        async accessToken() {
            return (await auth()).getToken()
        }
    }
)

export async function fetchUserStrategies() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('No Logged In User')
  }

  const { data, error } = await supabase
    .from('user_strategies')
    .select('strategies')
    .eq('user_id', userId)
    .single()

  if (error) {
    throw new Error('Error fetching user strategies: ' + error.message)
  }

  return data?.strategies
}

export async function fetchLatestAssignedStrategy() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('No Logged In User')
  }
  const { data, error } = await supabase
    .from('assigned_strategies')
    .select('strategy, date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(1)
    .single()
  if (error) {
    throw new Error('Error fetching latest assigned strategy: ' + error.message)
  }
  return data
}

export async function fetchAssignedStrategies(limit: number = 10) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('No Logged In User')
  }
  const { data, error } = await supabase
    .from('assigned_strategies')
    .select('strategy, date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)
  if (error) {
    throw new Error('Error fetching assigned strategies: ' + error.message)
  }
  return data
}
