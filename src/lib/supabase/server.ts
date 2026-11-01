import 'server-only';
import { createClient } from '@supabase/supabase-js';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Configure it in the local app environment and Vercel.');
}

export const supabaseAdmin = createClient(
  'https://ulnegzmixcibmdtmwdly.supabase.co',
  serviceRoleKey,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
