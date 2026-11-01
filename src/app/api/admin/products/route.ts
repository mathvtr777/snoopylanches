import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      ORDER BY p.sort_order ASC, p.name ASC
    `).all() as Product[];

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao listar produtos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = `prod-${Date.now()}`;
    const slug = body.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const stmt = db.prepare(`
      INSERT INTO products (
        id, category_id, name, slug, description, price, original_price, 
        image_url, is_active, is_featured, options_config, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.category_id,
      body.name,
      slug,
      body.description || '',
      Number(body.price),
      body.original_price ? Number(body.original_price) : null,
      body.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      body.is_active !== undefined ? Number(body.is_active) : 1,
      body.is_featured ? 1 : 0,
      body.options_config ? JSON.stringify(body.options_config) : null,
      body.sort_order || 99
    );

    return NextResponse.json({ success: true, message: 'Produto cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ success: false, error: 'Falha ao salvar produto' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    const stmt = db.prepare(`
      UPDATE products SET
        category_id = ?,
        name = ?,
        description = ?,
        price = ?,
        original_price = ?,
        image_url = ?,
        is_active = ?,
        is_featured = ?,
        sort_order = ?
      WHERE id = ?
    `);

    stmt.run(
      body.category_id,
      body.name,
      body.description || '',
      Number(body.price),
      body.original_price ? Number(body.original_price) : null,
      body.image_url,
      Number(body.is_active),
      body.is_featured ? 1 : 0,
      Number(body.sort_order) || 0,
      body.id
    );

    return NextResponse.json({ success: true, message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json({ success: false, error: 'Falha ao atualizar produto' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, is_active } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }

    db.prepare('UPDATE products SET is_active = ? WHERE id = ?').run(Number(is_active), id);

    return NextResponse.json({ success: true, message: 'Status alterado com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha ao atualizar status' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID do produto não informado' }, { status: 400 });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Produto excluído com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha ao excluir produto' }, { status: 500 });
  }
}

