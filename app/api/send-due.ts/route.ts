import { sendDueNotifications } from '@/app/lib/actions/notifications';
import { NextResponse } from 'next/server';

export async function GET() {
  await sendDueNotifications();
  return NextResponse.json({ sent: true });
}
