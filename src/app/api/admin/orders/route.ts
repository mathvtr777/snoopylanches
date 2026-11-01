import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { hasAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { data, error } = await supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return NextResponse.json({ success: false, error: 'Erro ao listar pedidos' }, { status: 500 });
  return NextResponse.json({ success: true, data: data.map((order) => ({ ...order, address: order.address_json, items: order.items_json })) });
}

export async function PATCH(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ success: false, error: 'ID e status são obrigatórios' }, { status: 400 });
  const { error } = await supabaseAdmin.from('orders').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'Erro ao alterar status do pedido' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Status do pedido atualizado' });
}
