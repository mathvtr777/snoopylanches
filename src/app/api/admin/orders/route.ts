import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100').all();
    const formatted = orders.map((o: any) => ({
      ...o,
      address: o.address_json ? JSON.parse(o.address_json) : null,
      items: JSON.parse(o.items_json),
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao listar pedidos' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID e status são obrigatórios' }, { status: 400 });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    return NextResponse.json({ success: true, message: 'Status do pedido atualizado' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao alterar status do pedido' }, { status: 500 });
  }
}

