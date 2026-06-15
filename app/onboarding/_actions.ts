'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
    {
      async accessToken() {
        return (await auth()).getToken()
      }
    }
  )
}

export const initializeDaysExpected = async () => {
  const { userId } = await auth()
  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const { error } = await getSupabase()
    .from('days_expected')
    .upsert({ user_id: userId, baseline_days: 3, daily_days: 4 }, { onConflict: 'user_id', ignoreDuplicates: true })
  if (error) {
    throw new Error('Error updating days_expected in Supabase: ' + error.message)
  }
  revalidateTag(`days-expected-${userId}`, {})
  return { message: 'Days expected initialized' }
}

export const initializeDaysCompleted = async () => {
  const { userId } = await auth()
  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const { error } = await getSupabase()
    .from('days_completed')
    .upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true })
  if (error) {
    throw new Error('Error updating days_completed in Supabase: ' + error.message)
  }
  return { message: 'Days completed initialized' }
}

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const selectedStrategies = formData.getAll('strategy') as string[]

  const { error } = await getSupabase()
    .from('user_strategies')
    .upsert({ user_id: userId, strategies: selectedStrategies }, { onConflict: 'user_id' })

  if (error) {
    throw new Error('Error inserting strategies into Supabase: ' + error.message)
  }
  revalidateTag(`user-strategies-${userId}`, {})

  const client = await clerkClient()

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        applicationName: formData.get('applicationName'),
        applicationType: formData.get('applicationType'),
      },
    })
    return { message: res.publicMetadata }
  } catch (err) { // eslint-disable-line
    return { error: 'There was an error updating the user metadata.' }
  }
}

export const syncUserToSupabase = async () => {
  const { userId } = await auth()
  if (!userId) return

  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId)
  const email = clerkUser.primaryEmailAddress?.emailAddress ?? null

  const { error } = await getSupabase()
    .from('users')
    .upsert({ user_id: userId, email }, { onConflict: 'user_id', ignoreDuplicates: true })
  if (error) throw new Error('Error syncing user to Supabase: ' + error.message)
}
