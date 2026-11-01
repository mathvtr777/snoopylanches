'use client';

import React, { useState } from 'react';
import { 
  X, 
  Bike, 
  Store, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  Phone, 
  User, 
  MapPin, 
  Home, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Neighborhood, OrderType, PaymentMethod, StoreSettings, OrderData } from '@/types';
import { formatCurrency, generateWhatsAppMessage, formatPhone, getWhatsAppCleanNumber } from '@/lib/utils';

interface CheckoutModalProps {
  neighborhoods: Neighborhood[];
  settings?: Partial<StoreSettings>;
  onClose: () => void;
}

export function CheckoutModal({ neighborhoods, settings, onClose }: CheckoutModalProps) {
  const { items, subtotal, clearCart } = useCart();
  const storePhone = settings?.whatsapp_number || '5584991517640';

  // Taxa fixa de entrega (padrão R$ 3,00)
  const fixedDeliveryFee = Number(settings?.delivery_fee || 3.0);

  // Estados do Pedido
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Endereço Simplificado (sem CEP, direto ao ponto para lanchonete)
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [reference, setReference] = useState('');

  // Pagamento e Observação Geral
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [orderNotes, setOrderNotes] = useState('');

  // Feedback e Loading
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Bairros para sugestão automática (sem obrigar select rígido)
  const activeNeighborhoods = neighborhoods.filter((n) => n.is_active === 1);

  // Cálculo da Taxa Fixa
  const deliveryFee = orderType === 'delivery' ? fixedDeliveryFee : 0;
  const finalTotal = subtotal + deliveryFee;

  // Formatar Telefone
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 11) {
      if (raw.length > 6) {
        setCustomerPhone(`(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`);
      } else if (raw.length > 2) {
        setCustomerPhone(`(${raw.slice(0, 2)}) ${raw.slice(2)}`);
      } else {
        setCustomerPhone(raw);
      }
    }
  };

  const handleCopyPix = () => {
    const pixKey = settings?.pix_key || '(84) 99151-7640';
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleFinishOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validações
    if (!customerName.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Por favor, informe um telefone/WhatsApp válido com DDD.');
      return;
    }

    if (orderType === 'delivery') {
      if (!street.trim()) {
        setErrorMsg('Por favor, informe a rua para entrega.');
        return;
      }
      if (!number.trim()) {
        setErrorMsg('Por favor, informe o número da casa/comércio.');
        return;
      }
      if (!neighborhood.trim()) {
        setErrorMsg('Por favor, informe o seu bairro.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload: OrderData = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        order_type: orderType,
        items,
        subtotal,
        delivery_fee: deliveryFee,
        total: finalTotal,
        payment_method: paymentMethod,
        notes: orderNotes.trim() || undefined,
        address:
          orderType === 'delivery'
            ? {
                street: street.trim(),
                number: number.trim(),
                neighborhood: neighborhood.trim(),
                delivery_fee: deliveryFee,
                reference: reference.trim() || undefined,
              }
            : undefined,
      };

      // 1. Salvar o pedido no banco de dados
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        console.warn('Aviso: Não foi possível salvar o pedido na nuvem, mas prosseguindo com o envio do WhatsApp.', json.error);
      }

      // 2. Gerar mensagem e abrir WhatsApp
      const { whatsappUrl } = generateWhatsAppMessage(orderPayload, storePhone);

      // Limpar carrinho e fechar modal
      clearCart();
      onClose();

      // Abrir o WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      // Fallback: mesmo com erro de rede salva, gera a mensagem no WhatsApp para o cliente não perder o pedido!
      const fallbackPayload: OrderData = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        order_type: orderType,
        items,
        subtotal,
        delivery_fee: deliveryFee,
        total: finalTotal,
        payment_method: paymentMethod,
        notes: orderNotes.trim() || undefined,
        address:
          orderType === 'delivery'
            ? {
                street: street.trim(),
                number: number.trim(),
                neighborhood: neighborhood.trim(),
                delivery_fee: deliveryFee,
                reference: reference.trim() || undefined,
              }
            : undefined,
      };
      const { whatsappUrl } = generateWhatsAppMessage(fallbackPayload, storePhone);
      clearCart();
      onClose();
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-[#13151f] border border-[#2b2f42] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="p-4 sm:p-5 bg-[#171926] border-b border-[#25293a] flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>Finalizar Pedido</span>
            </h2>
            <p className="text-xs text-amber-400 font-medium">Snoopy Lanchonete e Hamburgueria</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#202434] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFinishOrder} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center gap-2 text-red-200 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. SELEÇÃO DO TIPO DE PEDIDO */}
          <div className="space-y-3">
            <label className="text-sm font-black text-white uppercase tracking-wide block">
              1. Como deseja receber seu pedido?
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all text-center ${
                  orderType === 'delivery'
                    ? 'bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950/40 ring-1 ring-red-500'
                    : 'bg-[#181a26] border-[#292d3f] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    orderType === 'delivery' ? 'bg-red-600 text-white' : 'bg-[#222536] text-gray-400'
                  }`}
                >
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold block">Entrega em Domicílio</span>
                  <span className="text-[11px] text-amber-300 font-bold block mt-0.5">
                    Taxa fixa: {formatCurrency(fixedDeliveryFee)}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all text-center ${
                  orderType === 'pickup'
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-500'
                    : 'bg-[#181a26] border-[#292d3f] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    orderType === 'pickup' ? 'bg-amber-500 text-black' : 'bg-[#222536] text-gray-400'
                  }`}
                >
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold block">Retirada no Balcão</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5 font-bold">Grátis (Sem taxa)</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. DADOS DO CLIENTE */}
          <div className="space-y-3 pt-4 border-t border-[#232737]">
            <label className="text-sm font-black text-white uppercase tracking-wide block">
              2. Seus Dados Pessoais
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#181a26] border border-[#2b2f42] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 pl-9 pr-3 py-2.5 rounded-xl transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">
                  Telefone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="(84) 99999-9999"
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full bg-[#181a26] border border-[#2b2f42] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 pl-9 pr-3 py-2.5 rounded-xl transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. ENDEREÇO DE ENTREGA (SE FOR ENTREGA) */}
          {orderType === 'delivery' && (
            <div className="space-y-3 pt-4 border-t border-[#232737]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-white uppercase tracking-wide">
                  3. Endereço de Entrega
                </label>
                <span className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold px-2.5 py-0.5 rounded-lg">
                  Taxa fixa: {formatCurrency(fixedDeliveryFee)}
                </span>
              </div>

              {/* Rua e Número */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Rua *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rua Principal"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#181a26] border border-[#2b2f42] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 px-3 py-2.5 rounded-xl transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Número *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 120 ou S/N"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full bg-[#181a26] border border-[#2b2f42] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 px-3 py-2.5 rounded-xl transition-all"
                  />
                </div>
              </div>

              {/* Bairro e Referência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Bairro *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      list="bairros-sugestoes"
                      placeholder="Ex: Centro"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-[#181a26] border border-[#2b2f42] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 pl-9 pr-3 py-2.5 rounded-xl transition-all"
                    />
                    {activeNeighborhoods.length > 0 && (
                      <datalist id="bairros-sugestoes">
                        {activeNeighborhoods.map((n) => (
                          <option key={n.id} value={n.name} />
                        ))}
                      </datalist>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">
                    Ponto de Referência / Complemento (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Próximo à praça, casa amarela, apto..."
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full bg-[#181a26] border border-[#2b2f42] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 px-3 py-2.5 rounded-xl transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. FORMAS DE PAGAMENTO */}
          <div className="space-y-3 pt-4 border-t border-[#232737]">
            <label className="text-sm font-black text-white uppercase tracking-wide block">
              {orderType === 'delivery' ? '4. Forma de Pagamento' : '3. Forma de Pagamento'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Cartão de Crédito */}
              <button
                type="button"
                onClick={() => setPaymentMethod('credit')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  paymentMethod === 'credit'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-[#181a26] border-[#292d3f] text-gray-400 hover:border-gray-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold text-white">Cartão de Crédito</span>
                <span className="text-[10px] text-gray-400">Na maquininha</span>
              </button>

              {/* Cartão de Débito */}
              <button
                type="button"
                onClick={() => setPaymentMethod('debit')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  paymentMethod === 'debit'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-[#181a26] border-[#292d3f] text-gray-400 hover:border-gray-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold text-white">Cartão de Débito</span>
                <span className="text-[10px] text-gray-400">Na maquininha</span>
              </button>

              {/* Pix */}
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  paymentMethod === 'pix'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                    : 'bg-[#181a26] border-[#292d3f] text-gray-400 hover:border-gray-600'
                }`}
              >
                <span className="text-sm font-black text-emerald-400">PIX</span>
                <span className="text-xs font-bold text-white">Pagamento Pix</span>
                <span className="text-[10px] text-gray-400">Instantâneo</span>
              </button>
            </div>

            {/* Caixa Informativa do Pix */}
            {paymentMethod === 'pix' && (
              <div className="bg-[#17241e] border border-emerald-600/40 p-3 rounded-2xl flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Chave Pix da Lanchonete:</span>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="flex items-center gap-1 text-[11px] bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 px-2.5 py-1 rounded-lg transition-colors font-bold"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar chave'}</span>
                  </button>
                </div>
                <p className="font-mono text-gray-200 bg-[#0e1713] p-2 rounded-xl text-center font-bold">
                  {settings?.pix_key || '(84) 99151-7640'} ({settings?.pix_key_type || 'Telefone'})
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  Você pode efetuar a transferência e enviar o comprovante na conversa do WhatsApp que será aberta a seguir.
                </p>
              </div>
            )}
          </div>

          {/* 5. OBSERVAÇÃO GERAL DO PEDIDO */}
          <div className="space-y-1.5 pt-3 border-t border-[#232737]">
            <label className="text-xs text-gray-300 font-semibold block">
              Observação geral para o pedido (opcional):
            </label>
            <input
              type="text"
              placeholder="Ex: Troco para R$ 100, campainha estragada, ligar ao chegar..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full bg-[#181a26] border border-[#2b2f42] focus:border-amber-500 focus:outline-none text-xs sm:text-sm text-gray-100 placeholder-gray-500 px-3 py-2.5 rounded-xl transition-all"
            />
          </div>

          {/* 6. RESUMO FINANCEIRO COMPLETO */}
          <div className="bg-[#171a25] border border-[#262b3d] p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider mb-2">
              Resumo Financeiro
            </h4>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
              <span>Subtotal dos produtos ({items.length} itens):</span>
              <span className="font-bold text-gray-100">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
              <span>Taxa de entrega:</span>
              <span className="font-bold text-gray-100">
                {orderType === 'delivery'
                  ? `${formatCurrency(fixedDeliveryFee)} (Fixa)`
                  : 'Grátis (Retirada no Balcão)'}
              </span>
            </div>

            <div className="pt-2 border-t border-[#252a3b] flex items-center justify-between text-base sm:text-lg font-black">
              <span className="text-white">TOTAL FINAL:</span>
              <span className="text-amber-400">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* BOTÃO FINALIZAR PELO WHATSAPP */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl shadow-emerald-950/50 transition-all text-sm sm:text-base active:scale-98 disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-white" />
            <span>
              {isSubmitting ? 'Gerando pedido...' : `Enviar Pedido pelo WhatsApp ${formatPhone(storePhone)}`}
            </span>
          </button>

          <p className="text-[11px] text-gray-500 text-center leading-tight">
            Ao clicar, seu pedido será registrado e o WhatsApp oficial da lanchonete abrirá automaticamente com todos os dados preenchidos para você confirmar o envio.
          </p>
        </form>
      </div>
    </div>
  );
}

