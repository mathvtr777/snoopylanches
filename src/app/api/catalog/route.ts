import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { ensureSupabaseSeed } from '@/lib/supabase/seed';
import { Category, Neighborhood, Product, StoreSettings, CustomizationOption } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  await ensureSupabaseSeed();
  const [categoryResult, productResult, neighborhoodResult, optionResult, settingsResult] = await Promise.all([
    supabaseAdmin.from('categories').select('*').order('sort_order'),
    supabaseAdmin.from('products').select('*, categories(name, slug)').order('sort_order').order('name'),
    supabaseAdmin.from('neighborhoods').select('*').order('name'),
    supabaseAdmin.from('customization_options').select('*').order('group_type').order('name'),
    supabaseAdmin.from('store_settings').select('key, value'),
  ]);
  const error = categoryResult.error || productResult.error || neighborhoodResult.error || optionResult.error || settingsResult.error;
  if (error) return NextResponse.json({ success: false, error: 'Falha ao carregar catálogo' }, { status: 500 });

  const products = productResult.data.map((product) => {
    const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
    return {
      ...product,
      options_config: product.options_config ? JSON.stringify(product.options_config) : null,
      category_name: category?.name,
      category_slug: category?.slug,
    } as Product;
  });
  const settings: Partial<StoreSettings> = {};
  for (const row of settingsResult.data) {
    if (row.key !== 'admin_password') settings[row.key as keyof StoreSettings] = row.value;
  }

  return NextResponse.json({
    success: true,
    data: {
      categories: categoryResult.data as Category[],
      products,
      neighborhoods: neighborhoodResult.data as Neighborhood[],
      options: optionResult.data as CustomizationOption[],
      settings,
    },
  });
}
