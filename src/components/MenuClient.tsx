'use client';

import React, { useState, useMemo } from 'react';
import { Category, Product, Neighborhood, CustomizationOption, StoreSettings } from '@/types';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryNav } from '@/components/CategoryNav';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { formatPhone, getWhatsAppCleanNumber } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { 
  Flame, 
  Search, 
  Phone, 
  MapPin, 
  Clock, 
  Shield, 
  Heart,
  HelpCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

interface MenuClientProps {
  categories: Category[];
  products: Product[];
  neighborhoods: Neighborhood[];
  options: CustomizationOption[];
  settings: Partial<StoreSettings>;
}

export function MenuClient({
  categories,
  products,
  neighborhoods,
  options,
  settings,
}: MenuClientProps) {
  const { isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.slug || '');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtragem de produtos por busca ou categoria
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category_name && p.category_name.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  // Agrupamento de produtos por categoria
  const productsByCategory = useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const cat of categories) {
      map[cat.id] = filteredProducts.filter((p) => p.category_id === cat.id);
    }
    return map;
  }, [categories, filteredProducts]);

  // Contagem de itens por categoria para a navbar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat.id] = productsByCategory[cat.id]?.length || 0;
    }
    return counts;
  }, [categories, productsByCategory]);

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    const element = document.getElementById(`cat-${slug}`);
    if (element) {
      const yOffset = -140; // compensar header fixo + category nav
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const whatsappPhone = settings.whatsapp_number || '5584991517640';

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0e12] text-gray-100 pb-20 sm:pb-12">
      {/* 1. Header Fixo com Busca e Carrinho */}
      <Header
        settings={settings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. Banner de Destaque da Hamburgueria */}
      <HeroBanner settings={settings} />

      {/* 3. Navegação por Abas de Categorias */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
      />

      {/* 4. Conteúdo do Cardápio */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-12">
        {searchQuery ? (
          /* Visualização de Resultados da Pesquisa */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Resultados para &quot;<span className="text-amber-400">{searchQuery}</span>&quot;
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-red-400 hover:text-red-300 font-bold bg-[#1d202d] px-3 py-1.5 rounded-xl border border-[#2c3042]"
              >
                Limpar busca
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-[#141620] border border-[#232737] rounded-3xl p-12 text-center space-y-4">
                <Search className="w-12 h-12 text-gray-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-gray-200">Nenhum produto encontrado</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Tente buscar por termos mais genéricos como &quot;bacon&quot;, &quot;suco&quot;, &quot;combo&quot; ou &quot;batata&quot;.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenModal={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Visualização Organizada por Categorias */
          categories.map((cat) => {
            const catProducts = productsByCategory[cat.id] || [];
            if (catProducts.length === 0) return null;

            return (
              <section
                key={cat.id}
                id={`cat-${cat.slug}`}
                className="scroll-mt-36 space-y-4"
              >
                {/* Título da Seção */}
                <div className="flex items-center justify-between border-b border-[#232737] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-red-600" />
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                      {cat.name}
                    </h2>
                  </div>
                  <span className="text-xs text-gray-400 bg-[#171924] px-2.5 py-1 rounded-full border border-[#272b3b]">
                    {catProducts.length} {catProducts.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {/* Grid de Produtos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenModal={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* 5. Rodapé Profissional da Hamburgueria */}
      <footer className="mt-16 bg-[#090a0d] border-t border-[#1f222d] text-gray-400 text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1: Marca & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-white uppercase tracking-tight">
                Snoopy Lanchonete
              </span>
            </div>
            <p className="text-amber-400/90 font-medium">
              &quot;{settings.slogan || 'Sabor que todo mundo ama!'}&quot;
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              O ponto de encontro dos melhores lanches, hambúrgueres na brasa e porções irresistíveis. Peça online e receba com máxima rapidez.
            </p>
          </div>

          {/* Coluna 2: Atendimento & Horários */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Horário de Atendimento
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Todos os dias: {settings.opening_hours || '18:00 às 23:30'}</span>
            </div>
            <a
              href={`https://wa.me/${getWhatsAppCleanNumber(whatsappPhone)}?text=${encodeURIComponent(
                'Olá! Gostaria de falar com o atendimento da Snoopy.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs text-gray-300 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>WhatsApp: {formatPhone(whatsappPhone)}</span>
            </a>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>{settings.address || 'Rua Principal, Centro'}</span>
            </div>
          </div>

          {/* Coluna 3: Formas de Pagamento & Acesso */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Formas de Pagamento
            </h4>
            <p className="text-xs text-gray-400">
              Aceitamos Pix e Cartões de Crédito e Débito na maquininha na entrega ou retirada.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-400 bg-[#141620] px-3 py-1.5 rounded-lg border border-[#232737] transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Área Administrativa</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#171922] py-4 px-4 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Snoopy Lanchonete e Hamburgueria. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* 6. Modais & Drawer */}
      <ProductModal
        product={selectedProduct}
        options={options}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer />

      {isCheckoutOpen && (
        <CheckoutModal
          neighborhoods={neighborhoods}
          settings={settings}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {/* 7. Botão Flutuante Mobile do Carrinho */}
      <FloatingCartButton />

      {/* 8. Botão Flutuante do WhatsApp */}
      <FloatingWhatsAppButton whatsappNumber={whatsappPhone} />
    </div>
  );
}
