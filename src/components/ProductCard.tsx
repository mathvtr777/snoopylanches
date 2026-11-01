'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Flame, Sparkles, Ban } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const isAvailable = product.is_active === 1;

  return (
    <div
      onClick={() => isAvailable && onOpenModal(product)}
      className={`group relative bg-[#151722] border border-[#232737] hover:border-amber-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1 ${
        isAvailable ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Imagem do Produto */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#1a1d2c]">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`${product.slug === 'refrigerante-1l' ? 'object-contain p-2' : 'object-cover group-hover:scale-105'} transition-transform duration-500`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151722] via-transparent to-transparent opacity-80" />

        {/* Badges de destaque */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.is_featured === 1 && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
              <Sparkles className="w-3 h-3" /> Mais Pedido
            </span>
          )}
          {product.original_price && product.original_price > product.price && (
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-md">
              Promoção
            </span>
          )}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4">
            <span className="inline-flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
              <Ban className="w-4 h-4" /> Esgotado Hoje
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo Textual */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-100 text-base sm:text-lg group-hover:text-amber-400 transition-colors leading-snug">
              {product.name}
            </h3>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rodapé do Card: Preços e Botão */}
        <div className="pt-2 border-t border-[#222638] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.original_price && product.original_price > product.price && (
              <span className="text-[11px] text-gray-500 line-through font-medium">
                {formatCurrency(product.original_price)}
              </span>
            )}
            <span className="text-base sm:text-lg font-black text-amber-400">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) onOpenModal(product);
            }}
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 ${
              isAvailable
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-950/40'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

