import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { OrderData } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderData;

    if (!body.customer_name || !body.customer_phone || !body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Dados incompletos do pedido' }, { status: 400 });
    }

    // Gerar número de pedido sequencial amigável: ex SNP-1024
    const countRow = db.prepare('SELECT count(*) as count FROM orders').get() as { count: number };
    const orderNumber = `SNP-${1001 + countRow.count}`;
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const stmt = db.prepare(`
      INSERT INTO orders (
        id, order_number, customer_name, customer_phone, order_type, 
        address_json, items_json, subtotal, delivery_fee, total, 
        payment_method, notes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    stmt.run(
      orderId,
      orderNumber,
      body.customer_name.trim(),
      body.customer_phone.trim(),
      body.order_type,
      body.address ? JSON.stringify(body.address) : null,
      JSON.stringify(body.items),
      body.subtotal,
      body.delivery_fee || 0,
      body.total,
      body.payment_method,
      body.notes || null,
      'pending'
    );

    return NextResponse.json({
      success: true,
      data: {
        id: orderId,
        order_number: orderNumber,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    return NextResponse.json({ success: false, error: 'Falha ao salvar pedido no servidor' }, { status: 500 });
  }
}

