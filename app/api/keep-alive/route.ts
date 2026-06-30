import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { error } = await supabase.from('users').select('id').limit(1);

  if (error) {
    const message = `Supabase keep-alive failed: ${error.message}`;
    console.error(message);

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'alerts@focusapp.dev',
      to: 'john@johnbovard.dev',
      subject: 'Supabase keep-alive failed',
      text: message,
    }).catch((err) => console.error('Failed to send alert email:', err));

    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
