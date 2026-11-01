import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { adminSessionCookie, adminSessionLifetimeSeconds, createAdminSession, hasAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: hasAdminSession(req) });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const { data, error } = await supabaseAdmin.from('store_settings').select('value').eq('key', 'admin_password').maybeSingle();
  if (error) return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 });
  if (password !== (data?.value || 'snoopy123')) return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });

  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookie, createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/admin',
    maxAge: adminSessionLifetimeSeconds,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookie, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/admin', maxAge: 0 });
  return response;
}
