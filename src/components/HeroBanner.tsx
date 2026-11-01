'use client';

import React from 'react';
import { Bike, ShieldCheck, CreditCard, Sparkles, PhoneCall } from 'lucide-react';
import { StoreSettings } from '@/types';
import { formatPhone, getWhatsAppCleanNumber } from '@/lib/utils';

interface HeroBannerProps {
  settings?: Partial<StoreSettings>;
}

export function HeroBanner({ settings }: HeroBannerProps) {
  const phone = settings?.whatsapp_number || '5584991517640';
  const cleanPhone = getWhatsAppCleanNumber(phone);
  const formattedPhone = formatPhone(phone);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#181a24] via-[#12141c] to-[#0d0e12] border-b border-[#20232e] py-6 sm:py-8 px-4">
      {/* Efeito de luz ambiente e brasas */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>O MELHOR HAMBÚRGUER ARTESANAL DA REGIÃO</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Sabor irresistível preparado na <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-amber-300">brasa viva</span>!
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Pães brioche macios, carnes suculentas grelhadas, molhos especiais e ingredientes de alta qualidade. Faça seu pedido em segundos e receba quentinho onde você estiver.
            </p>

            {/* Destaque WhatsApp */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Olá! Gostaria de fazer um pedido ou tirar uma dúvida na Snoopy.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp: {formattedPhone}</span>
              </a>
              <span className="text-xs text-gray-400">
                Atendimento das {settings?.opening_hours || '18:00 às 23:30'}
              </span>
            </div>
          </div>

          {/* Badges de confiança / Vantagens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2.5 pt-2 md:pt-0">
            <div className="bg-[#191c26]/90 border border-[#2b2f3e] rounded-2xl p-3 flex items-center gap-3 shadow-md hover:border-amber-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Bike className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-100">Entrega Ágil</p>
                <p className="text-[11px] text-gray-400">{settings?.delivery_time || '35-50 min'}</p>
              </div>
            </div>

            <div className="bg-[#191c26]/90 border border-[#2b2f3e] rounded-2xl p-3 flex items-center gap-3 shadow-md hover:border-red-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-100">Pagamento</p>
                <p className="text-[11px] text-gray-400">Pix ou Cartão</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-[#191c26]/90 border border-[#2b2f3e] rounded-2xl p-3 flex items-center gap-3 shadow-md hover:border-emerald-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-100">Qualidade Garantida</p>
                <p className="text-[11px] text-gray-400">Carnes selecionadas na brasa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

