'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

export const initializeDaysExpected = async () => {
  const { userId } = await auth()
  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const { error } = await supabase
    .from('days_expected')
    .insert({
      user_id: userId,
      baseline_days: 1,
      daily_days: 2
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

  const { error } = await supabase
    .from('days_completed')
    .insert({user_id: userId});
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
  const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  )

  const { error } = await supabase
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