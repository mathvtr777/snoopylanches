'use client';

import React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#12141c] border-l border-[#232737] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header do Carrinho */}
          <div className="p-4 bg-[#161822] border-b border-[#232737] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wide">
                  Seu Carrinho
                </h2>
                <p className="text-xs text-gray-400">
                  {totalItems} {totalItems === 1 ? 'item adicionado' : 'itens adicionados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors p-1"
                  title="Esvaziar carrinho"
                >
                  Limpar
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#202434] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Fechar carrinho"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#1b1e2c] flex items-center justify-center text-gray-600 border border-[#2b2f42]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <p className="font-bold text-gray-200 text-lg">Seu carrinho está vazio</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Adicione hambúrgueres artesanais, porções, combos ou sucos para começar seu pedido!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="bg-[#181a24] border border-[#262a39] rounded-2xl p-3 flex gap-3 relative group"
                  >
                    {/* Imagem do Item */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#202433] shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="pr-6">
                        <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                        <span className="text-xs font-black text-amber-400">
                          {formatCurrency(itemTotal)}
                        </span>

                        {/* Opções selecionadas */}
                        {item.options && item.options.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {item.options.map((opt, i) => (
                              <p key={i} className="text-[11px] text-gray-400 truncate">
                                <span className="text-amber-400/80 font-medium">{opt.groupName}:</span>{' '}
                                {opt.selected.join(', ')}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Observação */}
                        {item.notes && (
                          <p className="text-[11px] text-gray-400 italic mt-0.5 truncate">
                            Obs: &quot;{item.notes}&quot;
                          </p>
                        )}
                      </div>

                      {/* Controle de Quantidade */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#232737]">
                        <span className="text-[11px] text-gray-400">
                          {formatCurrency(item.price)} un.
                        </span>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-[#101217] border border-[#2b2f3e] rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#202434] transition-colors"
                              aria-label="Diminuir"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#202434] transition-colors"
                              aria-label="Aumentar"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botão Remover */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2.5 right-2.5 text-gray-500 hover:text-red-400 transition-colors p-1"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Rodapé com Subtotal e Botão Finalizar */}
          {items.length > 0 && (
            <div className="p-4 bg-[#161822] border-t border-[#232737] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-medium">Subtotal</span>
                <span className="text-lg font-black text-amber-400">{formatCurrency(subtotal)}</span>
              </div>

              <p className="text-[11px] text-gray-400 text-center">
                Taxa fixa de entrega: R$ 3,00 (ou grátis para retirada no balcão).
              </p>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-3 px-4 rounded-xl shadow-lg shadow-red-950/50 transition-all active:scale-98"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

