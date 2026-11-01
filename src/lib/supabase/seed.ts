import 'server-only';
import { getSeedData } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase/server';

let seedPromise: Promise<void> | undefined;

export async function ensureSupabaseSeed() {
  seedPromise ??= seedDefaults();
  return seedPromise;
}

async function seedDefaults() {
  const { count, error } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true });
  if (error) throw error;
  if (count) return;

  const seed = getSeedData();
  for (const table of ['categories', 'products', 'neighborhoods', 'customization_options', 'store_settings'] as const) {
    const rows = seed[table] as Array<Record<string, unknown>>;
    const result = await supabaseAdmin.from(table).upsert(rows);
    if (result.error) throw result.error;
  }
}
