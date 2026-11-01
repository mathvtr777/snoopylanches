'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Flame, Clock, Shield, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { StoreSettings } from '@/types';

interface HeaderProps {
  settings?: Partial<StoreSettings>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ settings, searchQuery, setSearchQuery }: HeaderProps) {
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const isOpen = settings?.is_open === '1' || settings?.is_open === undefined;

  return (
    <header className="sticky top-0 z-40 bg-[#0d0e12]/95 backdrop-blur-md border-b border-[#20232d] shadow-lg">
      {/* Barra superior de status e informações */}
      <div className="bg-[#14161f] border-b border-[#20232d]/60 px-4 py-1.5 text-xs text-gray-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOpen ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isOpen ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              ></span>
            </span>
            <span className="font-semibold text-gray-200">
              {isOpen ? 'Aberto Agora' : 'Fechado no momento'}
            </span>
            <span className="hidden sm:inline text-gray-400">• {settings?.opening_hours || '18:00 às 23:30'}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Entrega: {settings?.delivery_time || '35-50 min'}</span>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-gray-400 hover:text-amber-400 transition-colors py-0.5 px-2 rounded hover:bg-[#1f222d]"
              title="Acesso Administrativo"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">Painel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Identidade Visual */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase group-hover:text-amber-400 transition-colors">
                Snoopy
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 tracking-wider">
                LANCHONETE
              </span>
            </div>
            <p className="text-xs text-amber-400/90 font-medium">
              {settings?.slogan || 'Sabor que todo mundo ama!'}
            </p>
          </div>
        </Link>

        {/* Barra de Pesquisa Desktop */}
        <div className="hidden md:flex flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar hambúrguer, suco, combo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161820] border border-[#2b2f3e] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 pl-9 pr-3 py-2 rounded-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Botão do Carrinho no Topo */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-3.5 py-2 rounded-xl shadow-md shadow-red-950/50 transition-all hover:scale-105 active:scale-95"
          aria-label="Abrir carrinho"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[11px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#0d0e12] animate-bounce">
                {totalItems}
              </span>
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-[10px] text-red-200 font-medium uppercase">Meu Carrinho</span>
            <span className="text-xs font-bold text-white">
              {totalItems > 0 ? formatCurrency(subtotal) : 'R$ 0,00'}
            </span>
          </div>
        </button>
      </div>

      {/* Barra de Pesquisa Mobile */}
      <div className="md:hidden px-4 pb-2.5 pt-0.5">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="O que você deseja saborear hoje?..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161820] border border-[#2b2f3e] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 pl-9 pr-3 py-2 rounded-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

