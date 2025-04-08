'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

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