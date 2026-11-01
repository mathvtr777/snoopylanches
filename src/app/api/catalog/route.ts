import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Category, Neighborhood, Product, StoreSettings, CustomizationOption } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all() as Category[];
    const products = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      ORDER BY p.sort_order ASC, p.name ASC
    `).all() as Product[];

    const neighborhoods = db.prepare('SELECT * FROM neighborhoods ORDER BY name ASC').all() as Neighborhood[];
    const options = db.prepare('SELECT * FROM customization_options ORDER BY group_type ASC, name ASC').all() as CustomizationOption[];

    const settingsRows = db.prepare('SELECT key, value FROM store_settings').all() as { key: string; value: string }[];
    const settings: Partial<StoreSettings> = {};
    for (const row of settingsRows) {
      if (row.key !== 'admin_password') {
        settings[row.key as keyof StoreSettings] = row.value;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        categories,
        products,
        neighborhoods,
        options,
        settings,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar catálogo:', error);
    return NextResponse.json({ success: false, error: 'Falha ao carregar catálogo' }, { status: 500 });
  }
}

