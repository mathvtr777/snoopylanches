import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { hasAdminSession } from '@/lib/admin-auth';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { data, error } = await supabaseAdmin.from('products').select('*, categories(name, slug)').order('sort_order').order('name');
  if (error) return NextResponse.json({ success: false, error: 'Erro ao listar produtos' }, { status: 500 });
  const products = data.map((product) => {
    const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
    return { ...product, options_config: product.options_config ? JSON.stringify(product.options_config) : null, category_name: category?.name, category_slug: category?.slug } as Product;
  });
  return NextResponse.json({ success: true, data: products });
}

export async function POST(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const body = await req.json();
  const slug = body.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const { error } = await supabaseAdmin.from('products').insert({
    id: `prod-${Date.now()}`, category_id: body.category_id, name: body.name, slug,
    description: body.description || '', price: Number(body.price), original_price: body.original_price ? Number(body.original_price) : null,
    image_url: body.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    is_active: body.is_active === undefined ? 1 : Number(body.is_active), is_featured: body.is_featured ? 1 : 0,
    options_config: typeof body.options_config === 'string' ? JSON.parse(body.options_config) : body.options_config || null,
    sort_order: body.sort_order || 99,
  });
  if (error) return NextResponse.json({ success: false, error: 'Falha ao salvar produto' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Produto cadastrado com sucesso' });
}

export async function PUT(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ success: false, error: 'ID do produto é obrigatório' }, { status: 400 });
  const { error } = await supabaseAdmin.from('products').update({
    category_id: body.category_id, name: body.name, description: body.description || '', price: Number(body.price),
    original_price: body.original_price ? Number(body.original_price) : null, image_url: body.image_url,
    is_active: Number(body.is_active), is_featured: body.is_featured ? 1 : 0, sort_order: Number(body.sort_order) || 0,
  }).eq('id', body.id);
  if (error) return NextResponse.json({ success: false, error: 'Falha ao atualizar produto' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Produto atualizado com sucesso' });
}

export async function PATCH(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const { id, is_active } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
  const { error } = await supabaseAdmin.from('products').update({ is_active: Number(is_active) }).eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'Falha ao atualizar status' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Status alterado com sucesso' });
}

export async function DELETE(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: 'ID do produto não informado' }, { status: 400 });
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'Falha ao excluir produto' }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Produto excluído com sucesso' });
}
