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

  // TEMPORARY: email on every successful run too, to verify the cron is firing
  // on schedule. Remove this block (and the Resend import stays for the
  // failure path above) once confirmed reliable.
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'alerts@focusapp.dev',
    to: 'john@johnbovard.dev',
    subject: 'Supabase keep-alive succeeded',
    text: `Supabase keep-alive ran successfully at ${new Date().toISOString()}`,
  }).catch((err) => console.error('Failed to send success alert email:', err));

  return Response.json({ ok: true });
}
