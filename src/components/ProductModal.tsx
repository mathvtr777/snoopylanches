'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { Product, CustomizationOption, CartItemOption } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductModalProps {
  product: Product | null;
  options: CustomizationOption[];
  onClose: () => void;
}

export function ProductModal({ product, options, onClose }: ProductModalProps) {
  const { addItem, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Estados de customização
  const [selectedFillings, setSelectedFillings] = useState<string[]>([]);
  const [selectedTopping, setSelectedTopping] = useState<string>('');
  const [selectedMilkshakeFlavor, setSelectedMilkshakeFlavor] = useState<string>('');
  const [selectedComboBurger, setSelectedComboBurger] = useState<string>('3 PCQ');
  const [selectedBeverage, setSelectedBeverage] = useState<string>('');
  const [selectedSweetOption, setSelectedSweetOption] = useState<string>('Com açúcar');
  const [selectedChoice, setSelectedChoice] = useState<string>('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');
      setSelectedFillings([]);

      // Padrões
      const toppings = options.filter((o) => o.group_type === 'acai_topping' && o.is_active === 1);
      if (toppings.length > 0) setSelectedTopping(toppings[0].name);

      const msFlavors = options.filter((o) => o.group_type === 'milkshake_flavor' && o.is_active === 1);
      if (msFlavors.length > 0) setSelectedMilkshakeFlavor(msFlavors[0].name);

      // Parse configs
      if (product.options_config) {
        try {
          const cfg = JSON.parse(product.options_config);
          if (cfg.beverageChoice && cfg.beverageChoice.length > 0) {
            setSelectedBeverage(cfg.beverageChoice[0]);
          }
          if (cfg.burgerChoice && cfg.burgerChoice.length > 0) {
            setSelectedComboBurger(cfg.burgerChoice[0]);
          }
          if (cfg.choice && cfg.choice.length > 0) {
            setSelectedChoice(cfg.choice[0]);
          }
        } catch (e) {}
      }
    }
  }, [product, options]);

  if (!product) return null;

  let parsedConfig: any = {};
  if (product.options_config) {
    try {
      parsedConfig = JSON.parse(product.options_config);
    } catch (e) {}
  }

  const isAcai = parsedConfig.isAcai || product.category_slug === 'acai';
  const isMilkshake = parsedConfig.isMilkshake || product.category_slug === 'milk-shakes';
  const hasBurgerChoice = !!parsedConfig.burgerChoice;
  const hasBeverageChoice = !!parsedConfig.beverageChoice;
  const hasSweetOptions = !!parsedConfig.sweetOptions;
  const hasChoice = !!parsedConfig.choice;

  // Filtrar opções ativas vindas do banco
  const activeFillings = options.filter((o) => o.group_type === 'acai_filling' && o.is_active === 1);
  const activeToppings = options.filter((o) => o.group_type === 'acai_topping' && o.is_active === 1);
  const activeMilkshakeFlavors = options.filter((o) => o.group_type === 'milkshake_flavor' && o.is_active === 1);

  const toggleFilling = (fillingName: string) => {
    if (selectedFillings.includes(fillingName)) {
      setSelectedFillings(selectedFillings.filter((f) => f !== fillingName));
    } else {
      if (selectedFillings.length < 4) {
        setSelectedFillings([...selectedFillings, fillingName]);
      }
    }
  };

  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    const itemOptions: CartItemOption[] = [];

    if (isAcai) {
      if (selectedFillings.length > 0) {
        itemOptions.push({
          groupName: `Recheios (${selectedFillings.length}/4)`,
          selected: selectedFillings,
        });
      }
      if (selectedTopping) {
        itemOptions.push({
          groupName: 'Cobertura',
          selected: [selectedTopping],
        });
      }
    }

    if (isMilkshake && selectedMilkshakeFlavor) {
      itemOptions.push({
        groupName: 'Sabor do Milk-shake',
        selected: [selectedMilkshakeFlavor],
      });
    }

    if (hasBurgerChoice && selectedComboBurger) {
      itemOptions.push({
        groupName: 'Opção de Hambúrguer',
        selected: [selectedComboBurger],
      });
    }

    if (hasBeverageChoice && selectedBeverage) {
      itemOptions.push({
        groupName: 'Refrigerante',
        selected: [selectedBeverage],
      });
    }

    if (hasSweetOptions && selectedSweetOption) {
      itemOptions.push({
        groupName: 'Adoçar',
        selected: [selectedSweetOption],
      });
    }

    if (hasChoice && selectedChoice) {
      itemOptions.push({
        groupName: 'Escolha',
        selected: [selectedChoice],
      });
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
      options: itemOptions,
      notes: notes.trim(),
    });

    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#141620] border border-[#2b2f42] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scroll Content */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          {/* Imagem do Produto */}
          <div className="relative w-full h-56 sm:h-64 bg-[#1b1e2c]">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141620] via-transparent to-black/30" />
          </div>

          <div className="p-5 space-y-6">
            {/* Título e Preço */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-white">{product.name}</h2>
                <span className="text-xl font-black text-amber-400">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">{product.description}</p>
            </div>

            {/* SELEÇÃO DO AÇAÍ: 4 RECHEIOS */}
            {isAcai && (
              <div className="space-y-4 pt-3 border-t border-[#232737]">
                <div className="bg-[#1b1e2c] p-3.5 rounded-2xl border border-[#2d3246]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Escolha os Recheios</span>
                      <span className="text-xs text-amber-400 font-semibold">(Até 4 opções)</span>
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        selectedFillings.length === 4
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {selectedFillings.length}/4
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Toque para selecionar ou desmarcar:</p>

                  <div className="grid grid-cols-2 gap-2">
                    {activeFillings.map((fill) => {
                      const isSelected = selectedFillings.includes(fill.name);
                      const isLimitReached = selectedFillings.length >= 4 && !isSelected;

                      return (
                        <button
                          key={fill.id}
                          type="button"
                          disabled={isLimitReached}
                          onClick={() => toggleFilling(fill.name)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : isLimitReached
                              ? 'bg-[#141620] border-[#222638] text-gray-600 opacity-50 cursor-not-allowed'
                              : 'bg-[#141620] border-[#25293a] text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <span className="truncate">{fill.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* COBERTURA DO AÇAÍ: 1 OPÇÃO */}
                <div className="bg-[#1b1e2c] p-3.5 rounded-2xl border border-[#2d3246]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">Escolha 1 Cobertura</span>
                    <span className="text-xs text-amber-400 font-semibold">Inclusa</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {activeToppings.map((top) => {
                      const isSelected = selectedTopping === top.name;
                      return (
                        <button
                          key={top.id}
                          type="button"
                          onClick={() => setSelectedTopping(top.name)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                            isSelected
                              ? 'bg-red-600/20 border-red-500 text-red-300'
                              : 'bg-[#141620] border-[#25293a] text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <span className="truncate">{top.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-red-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SELEÇÃO DO MILK-SHAKE */}
            {isMilkshake && (
              <div className="space-y-2 pt-3 border-t border-[#232737]">
                <label className="text-sm font-bold text-white block">Escolha o Sabor do Milk-shake</label>
                <div className="grid grid-cols-2 gap-2">
                  {activeMilkshakeFlavors.map((flavor) => {
                    const isSelected = selectedMilkshakeFlavor === flavor.name;
                    return (
                      <button
                        key={flavor.id}
                        type="button"
                        onClick={() => setSelectedMilkshakeFlavor(flavor.name)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-[#1b1e2c] border-[#25293a] text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <span>{flavor.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ESCOLHA DO COMBO 4: 3 PCQ OU 3 CLÁSSICO */}
            {hasBurgerChoice && (
              <div className="space-y-2 pt-3 border-t border-[#232737]">
                <label className="text-sm font-bold text-white block">Escolha seus 3 Hambúrgueres do Combo:</label>
                <div className="grid grid-cols-2 gap-2">
                  {parsedConfig.burgerChoice.map((bg: string) => {
                    const isSelected = selectedComboBurger === bg;
                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setSelectedComboBurger(bg)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border text-left ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-[#1b1e2c] border-[#25293a] text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <span>{bg}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ESCOLHA DO REFRIGERANTE DO COMBO */}
            {hasBeverageChoice && (
              <div className="space-y-2 pt-3 border-t border-[#232737]">
                <label className="text-sm font-bold text-white block">Escolha a Bebida do Combo:</label>
                <div className="grid grid-cols-2 gap-2">
                  {parsedConfig.beverageChoice.map((bev: string) => {
                    const isSelected = selectedBeverage === bev;
                    return (
                      <button
                        key={bev}
                        type="button"
                        onClick={() => setSelectedBeverage(bev)}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                          isSelected
                            ? 'bg-red-600/20 border-red-500 text-red-300'
                            : 'bg-[#1b1e2c] border-[#25293a] text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <span>{bev}</span>
                        {isSelected && <Check className="w-4 h-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ESCOLHA DE ADOÇAR O SUCO */}
            {hasSweetOptions && (
              <div className="space-y-2 pt-3 border-t border-[#232737]">
                <label className="text-sm font-bold text-white block">Preparo do Suco:</label>
                <div className="grid grid-cols-3 gap-2">
                  {parsedConfig.sweetOptions.map((opt: string) => {
                    const isSelected = selectedSweetOption === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedSweetOption(opt)}
                        className={`flex items-center justify-center py-2 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-[#1b1e2c] border-[#25293a] text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ESCOLHA VARIADA (ÁGUA COM/SEM GÁS, SABOR REFRIGERANTE) */}
            {hasChoice && (
              <div className="space-y-2 pt-3 border-t border-[#232737]">
                <label className="text-sm font-bold text-white block">Escolha a sua opção:</label>
                <div className="flex flex-wrap gap-2">
                  {parsedConfig.choice.map((c: string) => {
                    const isSelected = selectedChoice === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedChoice(c)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-red-600/20 border-red-500 text-red-300'
                            : 'bg-[#1b1e2c] border-[#25293a] text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <span>{c}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CAMPO DE OBSERVAÇÕES */}
            <div className="pt-3 border-t border-[#232737]">
              <label className="text-sm font-bold text-gray-200 block mb-1.5">
                Alguma observação para o preparo?
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: sem cebola roxa, maionese à parte, ponto da carne..."
                rows={2}
                className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 p-3 rounded-xl transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Rodapé Fixo do Modal: Quantidade e Botão Adicionar */}
        <div className="p-4 bg-[#11131a] border-t border-[#232737] flex items-center justify-between gap-4">
          {/* Seletor de Quantidade */}
          <div className="flex items-center bg-[#1b1e2c] border border-[#2d3246] rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-[#252a3b] hover:text-white disabled:opacity-40 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-white text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-[#252a3b] hover:text-white transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Adicionar ao Pedido */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-red-950/50 transition-all active:scale-98"
          >
            <span className="flex items-center gap-2 text-sm">
              <ShoppingBag className="w-4 h-4" />
              <span>Adicionar</span>
            </span>
            <span className="text-sm font-black text-amber-300">{formatCurrency(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

