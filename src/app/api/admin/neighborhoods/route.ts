import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { hasAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { data, error } = await supabaseAdmin.from('neighborhoods').select('*').order('name');
  if (error) return NextResponse.json({ success: false, error: 'Erro ao listar bairros' }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const body = await req.json();
  if (!body.name || body.fee === undefined) return NextResponse.json({ success: false, error: 'Nome e taxa são obrigatórios' }, { status: 400 });
  const { error } = await supabaseAdmin.from('neighborhoods').insert({ id: `bairro-${Date.now()}`, name: body.name.trim(), fee: Number(body.fee), is_active: 1, estimated_time: body.estimated_time || '30-45 min' });
  if (error) return NextResponse.json({ success: false, error: 'Erro ao cadastrar bairro' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Bairro cadastrado com sucesso' });
}

export async function PUT(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const body = await req.json();
  if (!body.id || !body.name || body.fee === undefined) return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
  const { error } = await supabaseAdmin.from('neighborhoods').update({ name: body.name.trim(), fee: Number(body.fee), is_active: Number(body.is_active), estimated_time: body.estimated_time || '30-45 min' }).eq('id', body.id);
  if (error) return NextResponse.json({ success: false, error: 'Erro ao atualizar bairro' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Bairro atualizado com sucesso' });
}

export async function PATCH(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { id, is_active } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
  const { error } = await supabaseAdmin.from('neighborhoods').update({ is_active: Number(is_active) }).eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'Erro ao alterar status do bairro' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Status do bairro atualizado' });
}

export async function DELETE(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: 'ID não informado' }, { status: 400 });
  const { error } = await supabaseAdmin.from('neighborhoods').delete().eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'Erro ao remover bairro' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Bairro removido com sucesso' });
}
