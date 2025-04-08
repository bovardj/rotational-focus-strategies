'use server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'

export async function authenticate() {
  const { userId } = await auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  return { message: 'Logged In User' }
}

interface SaveUserPayload {
  user_id: string
  email?: string
  first_name?: string
  last_name?: string
}

export async function saveUser(data: SaveUserPayload) {
  const { userId } = await auth()
  // const body = await data.json()
  const { user_id, email, first_name, last_name } = data

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  )

  const { error } = await supabase
    .from('public.users')
    .insert({
      user_id: userId,
      email: email,
      first_name: first_name,
      last_name: last_name
    })

  if (error) {
    throw new Error('Error adding user into Supabase: ' + error.message)
  } else {
    return { message: 'User added to Supabase' }
  }
}

export async function completeSignup(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  )

  const { error } = await supabase
    .from('users')
    .insert({
      user_id: userId,
      email: formData.get('email'),
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName')
    })

  if (error) {
    throw new Error('Error adding user into Supabase: ' + error.message)
    // console.error('Error adding user into Supabase: ' + error.message)
    // return error
  } else {
    return { message: 'User added to Supabase' }
  }
}