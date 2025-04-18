import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const subscription = await req.json();

  // If you’re using Clerk/Auth helpers, pull user ID from session instead
  // const user_id = '<retrieve-user-id-here>';
  const { userId } = await auth();

  const { error } = await supabase
    .from('subscriptions')
    .upsert({ userId, subscription });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
