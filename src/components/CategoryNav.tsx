'use client';

import React from 'react';
import { Category } from '@/types';
import { 
  Flame, 
  UtensilsCrossed, 
  Salad, 
  Soup, 
  Sparkles, 
  ChefHat, 
  Sandwich, 
  IceCream, 
  GlassWater, 
  Milk, 
  CupSoda,
  Wheat 
} from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  categoryCounts?: Record<string, number>;
}

export function CategoryNav({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts = {},
}: CategoryNavProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'Salad':
        return <Salad className="w-4 h-4" />;
      case 'Soup':
        return <Soup className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'ChefHat':
        return <ChefHat className="w-4 h-4" />;
      case 'Sandwich':
        return <Sandwich className="w-4 h-4" />;
      case 'IceCream':
        return <IceCream className="w-4 h-4" />;
      case 'GlassWater':
        return <GlassWater className="w-4 h-4" />;
      case 'Milk':
        return <Milk className="w-4 h-4" />;
      case 'Wheat':
        return <Wheat className="w-4 h-4" />;
      case 'CupSoda':
      default:
        return <CupSoda className="w-4 h-4" />;
    }
  };

  return (
    <nav className="sticky top-[102px] sm:top-[68px] z-30 bg-[#0d0e12]/95 backdrop-blur-md border-b border-[#20232e] py-2.5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-900/50 scale-[1.02]'
                    : 'bg-[#161822] text-gray-300 hover:text-white hover:bg-[#202433] border border-[#262a39]'
                }`}
              >
                <span className={isActive ? 'text-amber-300' : 'text-gray-400'}>
                  {getIcon(cat.icon)}
                </span>
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-black/40 text-amber-300' : 'bg-[#252a3b] text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

