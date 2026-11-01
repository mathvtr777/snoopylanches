import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { hasAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { data, error } = await supabaseAdmin.from('customization_options').select('*').order('group_type').order('name');
  if (error) return NextResponse.json({ success: false, error: 'Erro ao listar opções' }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const body = await req.json();
  if (!body.name || !body.group_type) return NextResponse.json({ success: false, error: 'Nome e grupo são obrigatórios' }, { status: 400 });
  const { error } = await supabaseAdmin.from('customization_options').insert({ id: `opt-${Date.now()}`, group_type: body.group_type, name: body.name.trim(), price: Number(body.price) || 0, is_active: 1 });
  if (error) return NextResponse.json({ success: false, error: 'Erro ao cadastrar opção' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Opção adicionada com sucesso' });
}

export async function PATCH(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { id, is_active } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
  const { error } = await supabaseAdmin.from('customization_options').update({ is_active: Number(is_active) }).eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'Erro ao atualizar opção' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Status alterado com sucesso' });
}

export async function DELETE(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: 'ID não informado' }, { status: 400 });
  const { error } = await supabaseAdmin.from('customization_options').delete().eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'Erro ao excluir opção' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Opção excluída com sucesso' });
}
