'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_PUBLISHABLE_KEY || '',
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
    .insert({
      user_id: userId,
      baseline_days: 3,
      daily_days: 4
    });
  if (error) {
    throw new Error('Error updating days_expected in Supabase: ' + error.message)
  }
  return { message: 'Days expected initialized to 0' }
}

export const initializeDaysCompleted = async () => {
  const { userId } = await auth()
  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const { error } = await getSupabase()
    .from('days_completed')
    .insert({ user_id: userId });
  if (error) {
    throw new Error('Error updating days_completed in Supabase: ' + error.message)
  }
  return { message: 'Days completed initialized to 0' }
}

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const selectedStrategies = formData.getAll('strategy') as string[]

  const { error } = await getSupabase()
    .from('user_strategies')
    .insert({
      user_id: userId,
      strategies: selectedStrategies,
    })

  if (error) {
    throw new Error('Error inserting strategies into Supabase: ' + error.message)
  }

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

  const { data: existingUser, error: selectError } = await getSupabase()
    .from('users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (selectError) throw new Error('Error checking for existing user in Supabase: ' + selectError.message)

  if (!existingUser) {
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    const email = clerkUser.primaryEmailAddress?.emailAddress ?? null

    const { error } = await getSupabase()
      .from('users')
      .insert({ user_id: userId, email })
    if (error) throw new Error('Error syncing user to Supabase: ' + error.message)
  }
}
