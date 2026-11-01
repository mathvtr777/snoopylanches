import { supabaseAdmin } from '@/lib/supabase/server';
import { ensureSupabaseSeed } from '@/lib/supabase/seed';
import { Category, Product, Neighborhood, CustomizationOption, StoreSettings } from '@/types';
import { MenuClient } from '@/components/MenuClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await ensureSupabaseSeed();
  const [categoryResult, productResult, neighborhoodResult, optionResult, settingsResult] = await Promise.all([
    supabaseAdmin.from('categories').select('*').order('sort_order'),
    supabaseAdmin.from('products').select('*, categories(name, slug)').order('sort_order').order('name'),
    supabaseAdmin.from('neighborhoods').select('*').order('name'),
    supabaseAdmin.from('customization_options').select('*').order('group_type').order('name'),
    supabaseAdmin.from('store_settings').select('key, value'),
  ]);

  const error = categoryResult.error || productResult.error || neighborhoodResult.error || optionResult.error || settingsResult.error;
  if (error) throw error;

  const categories = categoryResult.data as Category[];
  const products = productResult.data.map((product) => {
    const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
    return {
      ...product,
      options_config: product.options_config ? JSON.stringify(product.options_config) : null,
      category_name: category?.name,
      category_slug: category?.slug,
    } as Product;
  });
  const neighborhoods = neighborhoodResult.data as Neighborhood[];
  const options = optionResult.data as CustomizationOption[];
  const settings: Partial<StoreSettings> = {};
  for (const row of settingsResult.data) {
    if (row.key !== 'admin_password') settings[row.key as keyof StoreSettings] = row.value;
  }

  return <MenuClient categories={categories} products={products} neighborhoods={neighborhoods} options={options} settings={settings} />;
}
