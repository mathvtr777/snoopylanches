import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Neighborhood } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const neighborhoods = db.prepare('SELECT * FROM neighborhoods ORDER BY name ASC').all() as Neighborhood[];
    return NextResponse.json({ success: true, data: neighborhoods });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao listar bairros' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || body.fee === undefined) {
      return NextResponse.json({ success: false, error: 'Nome e taxa são obrigatórios' }, { status: 400 });
    }

    const id = `bairro-${Date.now()}`;
    const stmt = db.prepare('INSERT INTO neighborhoods (id, name, fee, is_active, estimated_time) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, body.name.trim(), Number(body.fee), 1, body.estimated_time || '30-45 min');

    return NextResponse.json({ success: true, message: 'Bairro cadastrado com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao cadastrar bairro' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.name || body.fee === undefined) {
      return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE neighborhoods SET name = ?, fee = ?, is_active = ?, estimated_time = ? WHERE id = ?');
    stmt.run(body.name.trim(), Number(body.fee), Number(body.is_active), body.estimated_time || '30-45 min', body.id);

    return NextResponse.json({ success: true, message: 'Bairro atualizado com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar bairro' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, is_active } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }

    db.prepare('UPDATE neighborhoods SET is_active = ? WHERE id = ?').run(Number(is_active), id);
    return NextResponse.json({ success: true, message: 'Status do bairro atualizado' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao alterar status do bairro' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID não informado' }, { status: 400 });
    }

    db.prepare('DELETE FROM neighborhoods WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Bairro removido com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao remover bairro' }, { status: 500 });
  }
}

