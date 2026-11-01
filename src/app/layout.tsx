import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Snoopy Lanchonete e Hamburgueria | Cardápio Digital Oficial',
  description: 'Sabor que todo mundo ama! Monte seu pedido online com hambúrgueres na brasa, porções, combos e sucos, e envie direto para nosso WhatsApp.',
  keywords: ['hamburgueria', 'lanchonete', 'snoopy', 'cardápio digital', 'delivery', 'hambúrguer artesanal'],
  authors: [{ name: 'Snoopy Lanchonete e Hamburgueria' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0d0e12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full bg-[#0d0e12]">
      <body className="min-h-full flex flex-col bg-[#0d0e12] text-gray-100 antialiased selection:bg-red-600 selection:text-white">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
