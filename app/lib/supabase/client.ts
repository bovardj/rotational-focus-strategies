// import { createBrowserClient } from '@supabase/ssr'

// export function createClient() {
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
// }


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;


// import { createClient } from '@supabase/supabase-js'
// import { Clerk } from '@clerk/clerk-js';

// const supabase = createClient('https://xyyzwllvdamnigavrctd.supabase.co', 'SUPABASE_ANON_KEY', {
//     accessToken: () => {
//       return Clerk.session?.getToken();
//     },
//   })

// 'use client';

// import { createBrowserClient } from '@supabase/ssr';

// export const supabase = createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
