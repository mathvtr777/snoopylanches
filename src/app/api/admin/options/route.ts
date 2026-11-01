import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CustomizationOption } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const options = db.prepare('SELECT * FROM customization_options ORDER BY group_type ASC, name ASC').all() as CustomizationOption[];
    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao listar opções' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.group_type) {
      return NextResponse.json({ success: false, error: 'Nome e grupo são obrigatórios' }, { status: 400 });
    }

    const id = `opt-${Date.now()}`;
    const stmt = db.prepare('INSERT INTO customization_options (id, group_type, name, price, is_active) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, body.group_type, body.name.trim(), Number(body.price) || 0, 1);

    return NextResponse.json({ success: true, message: 'Opção adicionada com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao cadastrar opção' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, is_active } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }

    db.prepare('UPDATE customization_options SET is_active = ? WHERE id = ?').run(Number(is_active), id);
    return NextResponse.json({ success: true, message: 'Status alterado com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar opção' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID não informado' }, { status: 400 });
    }

    db.prepare('DELETE FROM customization_options WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Opção excluída com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao excluir opção' }, { status: 500 });
  }
}

