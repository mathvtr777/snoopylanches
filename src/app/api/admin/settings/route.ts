import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { hasAdminSession } from '@/lib/admin-auth';
import { StoreSettings } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { data, error } = await supabaseAdmin.from('store_settings').select('key, value');
  if (error) return NextResponse.json({ success: false, error: 'Erro ao buscar configurações' }, { status: 500 });
  return NextResponse.json({ success: true, data: Object.fromEntries(data.map((row) => [row.key, row.value])) });
}

export async function POST(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const body = (await req.json()) as Partial<StoreSettings>;
  const allowedKeys: (keyof StoreSettings)[] = ['store_name', 'slogan', 'whatsapp_number', 'address', 'is_open', 'opening_hours', 'delivery_time', 'min_order', 'pix_key', 'pix_key_type', 'admin_password'];
  const rows = allowedKeys.filter((key) => body[key] !== undefined).map((key) => ({ key, value: String(body[key]) }));
  if (rows.length) {
    const { error } = await supabaseAdmin.from('store_settings').upsert(rows, { onConflict: 'key' });
    if (error) return NextResponse.json({ success: false, error: 'Erro ao salvar configurações' }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'Configurações atualizadas com sucesso' });
}
