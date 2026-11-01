'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export function FloatingCartButton() {
  const { totalItems, subtotal, setIsCartOpen, isCartOpen, isCheckoutOpen } = useCart();

  // Não exibir se carrinho vazio ou se já estiver com modal aberto
  if (totalItems === 0 || isCartOpen || isCheckoutOpen) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 sm:hidden">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-gradient-to-r from-red-600 via-red-600 to-amber-600 text-white p-3.5 rounded-2xl shadow-2xl shadow-red-950/80 border border-red-500/40 flex items-center justify-between active:scale-95 transition-all animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[11px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-md">
              {totalItems}
            </span>
          </div>

          <div className="text-left">
            <span className="text-[11px] font-semibold text-red-100 uppercase tracking-wider block">
              Ver Carrinho
            </span>
            <span className="text-sm font-black text-white">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-200">
          <span>Avançar</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}

