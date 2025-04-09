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
  // const supabase = createClient(
  //   process.env.SUPABASE_URL || '',
  //   process.env.SUPABASE_ANON_KEY || ''
  // )
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
  // const supabase = createClient(
  //   process.env.SUPABASE_URL || '',
  //   process.env.SUPABASE_ANON_KEY || ''
  // )
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

  ////////////////////////////////////////////////////////////////////////////
  //// TODO: Check if this route actually works and make the db table for it
  // console.log('WAIT!!! This method is incomplete and not tested yet')
  // throw new Error('This method is incomplete and not tested yet')

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

    // .insert(
    //   selectedStrategies.map((strategy) => ({
    //     user_id: userId,
    //     strategy,
    //   }))
    // )
  ////////////////////////////////////////////////////////////////////////////

  if (error) {
    throw new Error('Error inserting strategies into Supabase: ' + error.message)
  }

  // const { error_onboarding } = await supabase
  //   .from('onboarding')
  //   .insert({
  //     user_id: userId,
  //     onboarding_complete: true,
  //   })

  // if (error) {
  //   throw new Error('Error inserting onboarding into Supabase: ' + error_onboarding.message)
  // }

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
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
}