import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { OrderData } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as OrderData;
  if (!body.customer_name || !body.customer_phone || !body.items?.length) {
    return NextResponse.json({ success: false, error: 'Dados incompletos do pedido' }, { status: 400 });
  }

  const { count, error: countError } = await supabaseAdmin.from('orders').select('*', { count: 'exact', head: true });
  if (countError) return NextResponse.json({ success: false, error: 'Falha ao salvar pedido no servidor' }, { status: 500 });
  const orderNumber = `SNP-${1001 + (count || 0)}`;
  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const { error } = await supabaseAdmin.from('orders').insert({
    id: orderId,
    order_number: orderNumber,
    customer_name: body.customer_name.trim(),
    customer_phone: body.customer_phone.trim(),
    order_type: body.order_type,
    address_json: body.address || null,
    items_json: body.items,
    subtotal: body.subtotal,
    delivery_fee: body.delivery_fee || 0,
    total: body.total,
    payment_method: body.payment_method,
    notes: body.notes || null,
    status: 'pending',
  });
  if (error) return NextResponse.json({ success: false, error: 'Falha ao salvar pedido no servidor' }, { status: 500 });
  return NextResponse.json({ success: true, data: { id: orderId, order_number: orderNumber } });
}
