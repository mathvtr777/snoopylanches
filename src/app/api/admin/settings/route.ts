import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { StoreSettings } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = db.prepare('SELECT key, value FROM store_settings').all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<StoreSettings>;
    const updateStmt = db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)');

    const allowedKeys: (keyof StoreSettings)[] = [
      'store_name',
      'slogan',
      'whatsapp_number',
      'address',
      'is_open',
      'opening_hours',
      'delivery_time',
      'min_order',
      'pix_key',
      'pix_key_type',
      'admin_password',
    ];

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        updateStmt.run(key, String(body[key]));
      }
    }

    return NextResponse.json({ success: true, message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}

