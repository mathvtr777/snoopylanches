import db from '@/lib/db';
import { Category, Product, Neighborhood, CustomizationOption, StoreSettings } from '@/types';
import { MenuClient } from '@/components/MenuClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Carrega catálogo diretamente do banco local
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

  return (
    <MenuClient
      categories={categories}
      products={products}
      neighborhoods={neighborhoods}
      options={options}
      settings={settings}
    />
  );
}
