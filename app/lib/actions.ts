'use server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'

export async function authenticate() {
  const { userId } = await auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  return { message: 'Logged In User' }
}