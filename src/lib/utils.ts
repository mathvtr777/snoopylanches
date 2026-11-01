import type { OrderData } from '../types/index';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    const ddd = cleaned.slice(2, 4);
    const num = cleaned.slice(4);
    return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('55')) {
    const ddd = cleaned.slice(2, 4);
    const num = cleaned.slice(4);
    return `(${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`;
  }
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function getWhatsAppCleanNumber(phone = '5584991517640'): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = `55${cleaned}`;
  }
  return cleaned || '5584991517640';
}

export function generateWhatsAppMessage(order: OrderData, storeWhatsApp = '5584991517640'): { message: string; whatsappUrl: string } {
  const paymentLabels: Record<string, string> = {
    credit: 'Cartão de crédito',
    debit: 'Cartão de débito',
    pix: 'Pix',
  };

  const lines: string[] = [];

  lines.push('🍔 *NOVO PEDIDO – SNOOPY LANCHONETE* 🍟');
  lines.push('');
  lines.push('Olá! Gostaria de confirmar meu pedido feito pelo cardápio:');
  lines.push('');
  lines.push('👤 *DADOS DO CLIENTE:*');
  lines.push(`• Nome: ${order.customer_name}`);
  lines.push(`• Telefone: ${formatPhone(order.customer_phone)}`);
  lines.push('');
  lines.push('🛵 *TIPO DE PEDIDO:*');
  lines.push(order.order_type === 'delivery' ? 'Entrega em domicílio' : 'Retirada no balcão');
  lines.push('');

  // Endereço só aparece se for entrega
  if (order.order_type === 'delivery' && order.address) {
    lines.push('📍 *ENDEREÇO DE ENTREGA:*');
    lines.push(`• Bairro: ${order.address.neighborhood}`);
    lines.push(`• Rua: ${order.address.street}, Nº ${order.address.number}`);
    if (order.address.reference && order.address.reference.trim()) {
      lines.push(`• Ponto de Referência: ${order.address.reference.trim()}`);
    } else if (order.address.complement && order.address.complement.trim()) {
      lines.push(`• Complemento: ${order.address.complement.trim()}`);
    }
    lines.push('');
  }

  lines.push('🛍️ *ITENS DO PEDIDO:*');
  order.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    lines.push(`• *${item.quantity}x* ${item.name} (${formatCurrency(itemTotal)})`);

    if (item.options && item.options.length > 0) {
      item.options.forEach((opt) => {
        if (opt.selected && opt.selected.length > 0) {
          lines.push(`   └ ${opt.groupName}: ${opt.selected.join(', ')}`);
        }
      });
    }
  });
  lines.push('');

  // Observações dos produtos ou gerais
  const notesList: string[] = [];
  order.items.forEach((item) => {
    if (item.notes && item.notes.trim()) {
      notesList.push(`${item.name}: ${item.notes.trim()}`);
    }
  });
  if (order.notes && order.notes.trim()) {
    notesList.push(`Geral: ${order.notes.trim()}`);
  }

  if (notesList.length > 0) {
    lines.push('📝 *OBSERVAÇÕES:*');
    notesList.forEach((n) => lines.push(`- ${n}`));
    lines.push('');
  }

  lines.push('💰 *RESUMO FINANCEIRO:*');
  lines.push(`• Subtotal: ${formatCurrency(order.subtotal)}`);
  if (order.order_type === 'delivery') {
    lines.push(`• Taxa de entrega fixa: ${formatCurrency(order.delivery_fee)}`);
  } else {
    lines.push('• Taxa de entrega: Grátis (Retirada no balcão)');
  }
  lines.push(`*TOTAL: ${formatCurrency(order.total)}*`);
  lines.push('');
  lines.push('💳 *FORMA DE PAGAMENTO:*');
  lines.push(paymentLabels[order.payment_method] || order.payment_method);
  lines.push('');
  lines.push('Aguardo a confirmação do pedido!');

  const fullMessage = lines.join('\n');
  const cleanPhone = getWhatsAppCleanNumber(storeWhatsApp);
  const encoded = encodeURIComponent(fullMessage);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

  return { message: fullMessage, whatsappUrl };
}
