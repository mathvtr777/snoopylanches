'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  LogOut, 
  Flame, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Save, 
  Store, 
  Bike, 
  Sparkles, 
  Layers, 
  ShoppingBag, 
  Settings, 
  PhoneCall, 
  DollarSign, 
  RefreshCw,
  Search,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Category, Product, Neighborhood, CustomizationOption, StoreSettings, OrderData } from '@/types';
import { formatCurrency, formatPhone } from '@/lib/utils';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Abas do Painel
  const [activeTab, setActiveTab] = useState<'products' | 'neighborhoods' | 'options' | 'orders' | 'settings'>('products');

  // Dados
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [settings, setSettings] = useState<Partial<StoreSettings>>({});
  const [orders, setOrders] = useState<OrderData[]>([]);

  // Filtro de produtos
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');

  // Modais de Criação / Edição
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [editingNeighborhood, setEditingNeighborhood] = useState<Partial<Neighborhood> | null>(null);
  const [isNeighModalOpen, setIsNeighModalOpen] = useState(false);

  const [newOptionGroup, setNewOptionGroup] = useState<'acai_filling' | 'acai_topping' | 'milkshake_flavor'>('acai_filling');
  const [newOptionName, setNewOptionName] = useState('');

  // Feedback Toast
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Carregar dados após autenticação
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/catalog');
      const json = await res.json();
      if (json.success) {
        setCategories(json.data.categories);
        setProducts(json.data.products);
        setNeighborhoods(json.data.neighborhoods);
        setOptions(json.data.options);
        setSettings(json.data.settings);
      }

      // Carregar pedidos
      const ordRes = await fetch('/api/admin/orders');
      const ordJson = await ordRes.json();
      if (ordJson.success) {
        setOrders(ordJson.data);
      }
    } catch (e) {
      console.error(e);
      showToast('Erro ao carregar dados do servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('snoopy_admin_auth', 'true');
        loadData();
      } else {
        setLoginError(data.error || 'Senha incorreta. Tente novamente.');
      }
    } catch (e) {
      setLoginError('Falha de conexão com o servidor.');
    }
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('snoopy_admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('snoopy_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  // ================= GERENCIAR PRODUTOS =================
  const handleToggleProductActive = async (product: Product) => {
    const newStatus = product.is_active === 1 ? 0 : 1;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, is_active: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_active: newStatus } : p))
        );
        showToast(newStatus === 1 ? 'Produto ativado!' : 'Produto marcado como indisponível');
      }
    } catch (e) {
      showToast('Erro ao alterar status');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir permanentemente este produto?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast('Produto excluído com sucesso');
      }
    } catch (e) {
      showToast('Erro ao excluir produto');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price || !editingProduct.category_id) {
      alert('Preencha os campos obrigatórios (Nome, Categoria e Preço)');
      return;
    }

    const isUpdate = !!editingProduct.id;
    const url = '/api/admin/products';
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isUpdate ? 'Produto atualizado!' : 'Produto criado!');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        loadData();
      } else {
        alert(data.error || 'Erro ao salvar produto');
      }
    } catch (e) {
      showToast('Erro na requisição');
    }
  };

  // ================= GERENCIAR BAIRROS =================
  const handleToggleNeighborhood = async (n: Neighborhood) => {
    const newStatus = n.is_active === 1 ? 0 : 1;
    try {
      const res = await fetch('/api/admin/neighborhoods', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: n.id, is_active: newStatus }),
      });
      if (res.ok) {
        setNeighborhoods((prev) =>
          prev.map((it) => (it.id === n.id ? { ...it, is_active: newStatus } : it))
        );
        showToast(newStatus === 1 ? 'Bairro ativado' : 'Bairro desativado');
      }
    } catch (e) {
      showToast('Erro ao atualizar bairro');
    }
  };

  const handleDeleteNeighborhood = async (id: string) => {
    if (!confirm('Deseja excluir este bairro?')) return;
    try {
      const res = await fetch(`/api/admin/neighborhoods?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNeighborhoods((prev) => prev.filter((it) => it.id !== id));
        showToast('Bairro excluído');
      }
    } catch (e) {
      showToast('Erro ao excluir bairro');
    }
  };

  const handleSaveNeighborhood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNeighborhood?.name || editingNeighborhood?.fee === undefined) return;

    const isUpdate = !!editingNeighborhood.id;
    try {
      const res = await fetch('/api/admin/neighborhoods', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNeighborhood),
      });
      if (res.ok) {
        showToast(isUpdate ? 'Bairro atualizado!' : 'Bairro adicionado!');
        setIsNeighModalOpen(false);
        setEditingNeighborhood(null);
        loadData();
      }
    } catch (e) {
      showToast('Erro ao salvar bairro');
    }
  };

  // ================= GERENCIAR OPÇÕES (AÇAÍ E MILK-SHAKE) =================
  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;

    try {
      const res = await fetch('/api/admin/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_type: newOptionGroup,
          name: newOptionName.trim(),
          price: 0,
        }),
      });
      if (res.ok) {
        showToast('Opção adicionada com sucesso!');
        setNewOptionName('');
        loadData();
      }
    } catch (e) {
      showToast('Erro ao adicionar opção');
    }
  };

  const handleToggleOption = async (opt: CustomizationOption) => {
    const newStatus = opt.is_active === 1 ? 0 : 1;
    try {
      const res = await fetch('/api/admin/options', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: opt.id, is_active: newStatus }),
      });
      if (res.ok) {
        setOptions((prev) =>
          prev.map((it) => (it.id === opt.id ? { ...it, is_active: newStatus } : it))
        );
        showToast(newStatus === 1 ? 'Opção ativada' : 'Opção desativada');
      }
    } catch (e) {
      showToast('Erro ao atualizar opção');
    }
  };

  const handleDeleteOption = async (id: string) => {
    if (!confirm('Deseja excluir esta opção?')) return;
    try {
      const res = await fetch(`/api/admin/options?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOptions((prev) => prev.filter((it) => it.id !== id));
        showToast('Opção excluída');
      }
    } catch (e) {
      showToast('Erro ao excluir');
    }
  };

  // ================= GERENCIAR STATUS DE PEDIDOS =================
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
        );
        showToast('Status do pedido atualizado!');
      }
    } catch (e) {
      showToast('Erro ao atualizar status');
    }
  };

  // ================= SALVAR CONFIGURAÇÕES =================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('Configurações salvas com sucesso!');
        loadData();
      }
    } catch (e) {
      showToast('Erro ao salvar configurações');
    }
  };

  // ================= TELA DE LOGIN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#141620] border border-[#2b2f42] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-red-600 to-red-700 flex items-center justify-center mx-auto shadow-lg shadow-red-950/60">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Painel Administrativo
              </h1>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                Snoopy Lanchonete e Hamburgueria
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Digite a senha de administrador para gerenciar produtos, preços, taxas de bairros e configurações.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Senha padrão: snoopy123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 focus:outline-none text-sm text-gray-100 placeholder-gray-500 pl-10 pr-4 py-3 rounded-xl transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-3 rounded-xl shadow-lg shadow-red-950/50 transition-all text-sm active:scale-98"
            >
              Entrar no Painel
            </button>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                &larr; Voltar para o Cardápio Público
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= PAINEL AUTENTICADO =================
  const filteredProducts = products.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category_id === filterCategory;
    const matchesQuery =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 flex flex-col">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Topo do Painel */}
      <header className="bg-[#141620] border-b border-[#232737] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Painel Snoopy</span>
                <span className="text-[10px] bg-red-600/30 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                  ADMIN
                </span>
              </h1>
              <p className="text-[11px] text-amber-400">Sabor que todo mundo ama!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-[#1b1e2c] border border-[#2b2f3e] px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>Ver Cardápio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-600/10 border border-red-500/20 px-3 py-1.5 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-[#1f222f] pt-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-400 bg-[#1a1d29]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Produtos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('neighborhoods')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'neighborhoods'
                ? 'border-amber-400 text-amber-400 bg-[#1a1d29]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Bairros & Taxas ({neighborhoods.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('options')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'options'
                ? 'border-amber-400 text-amber-400 bg-[#1a1d29]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Recheios & Opções</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-400 bg-[#1a1d29]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Histórico de Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400 bg-[#1a1d29]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações da Loja</span>
          </button>
        </div>
      </header>

      {/* Conteúdo da Aba */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        {/* ================= ABA 1: PRODUTOS ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">Gerenciamento do Cardápio</h2>
                <p className="text-xs text-gray-400">
                  Cadastre novos produtos, edite preços, descrições, imagens ou marque itens esgotados.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    category_id: categories[0]?.id || '',
                    name: '',
                    description: '',
                    price: 0,
                    original_price: null,
                    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
                    is_active: 1,
                    is_featured: 0,
                    sort_order: 99,
                  });
                  setIsProductModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Produto</span>
              </button>
            </div>

            {/* Filtros */}
            <div className="bg-[#141620] border border-[#232737] p-3.5 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-64 relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar por nome..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 focus:outline-none text-xs text-gray-100 placeholder-gray-500 pl-9 pr-3 py-2 rounded-xl"
                />
              </div>

              <div className="w-full sm:flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterCategory === 'all'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-[#1b1e2c] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Todas ({products.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilterCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      filterCategory === c.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-[#1b1e2c] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabela de Produtos */}
            <div className="bg-[#141620] border border-[#232737] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#181a26] text-gray-400 border-b border-[#232737] uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Produto</th>
                      <th className="p-3.5">Categoria</th>
                      <th className="p-3.5">Preço</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2230]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#181a26]/50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            {/* Miniatura */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-800 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white text-sm">{p.name}</p>
                              <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                                {p.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-gray-300 font-medium">
                          {p.category_name || p.category_id}
                        </td>
                        <td className="p-3.5 font-bold text-amber-400">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleProductActive(p)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                              p.is_active === 1
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                            }`}
                            title="Clique para alternar disponibilidade"
                          >
                            {p.is_active === 1 ? (
                              <>
                                <Eye className="w-3 h-3" /> Disponível
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" /> Esgotado
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="w-8 h-8 rounded-lg bg-[#222536] text-gray-300 hover:text-white hover:bg-amber-500/20 hover:text-amber-300 flex items-center justify-center transition-colors"
                              title="Editar Produto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id)}
                              className="w-8 h-8 rounded-lg bg-[#222536] text-gray-300 hover:text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                              title="Excluir Produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: BAIRROS E TAXAS ================= */}
        {activeTab === 'neighborhoods' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">Taxas de Entrega por Bairro</h2>
                <p className="text-xs text-gray-400">
                  Configure os bairros atendidos, valores de frete e ative ou desative bairros temporariamente.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingNeighborhood({ name: '', fee: 5.0, is_active: 1, estimated_time: '30-45 min' });
                  setIsNeighModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Bairro</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {neighborhoods.map((n) => (
                <div
                  key={n.id}
                  className={`bg-[#141620] border rounded-2xl p-4 flex flex-col justify-between gap-3 transition-colors ${
                    n.is_active === 1 ? 'border-[#262b3d]' : 'border-red-900/40 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{n.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Tempo: {n.estimated_time || '30-45 min'}</p>
                    </div>
                    <span className="text-base font-black text-amber-400">
                      {formatCurrency(n.fee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#232737]">
                    <button
                      type="button"
                      onClick={() => handleToggleNeighborhood(n)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                        n.is_active === 1
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {n.is_active === 1 ? 'Entrega Ativa' : 'Desativado'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingNeighborhood(n);
                          setIsNeighModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-lg bg-[#222536] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNeighborhood(n.id)}
                        className="w-8 h-8 rounded-lg bg-[#222536] text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ABA 3: RECHEIOS E OPÇÕES (AÇAÍ E MILK-SHAKE) ================= */}
        {activeTab === 'options' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Opções & Personalizações</h2>
              <p className="text-xs text-gray-400">
                Configure os recheios e coberturas do Açaí (até 4 recheios e 1 cobertura) e os sabores de Milk-Shake.
              </p>
            </div>

            {/* Formulário para Adicionar Opção */}
            <form
              onSubmit={handleAddOption}
              className="bg-[#141620] border border-[#232737] p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3"
            >
              <select
                value={newOptionGroup}
                onChange={(e) => setNewOptionGroup(e.target.value as any)}
                className="w-full sm:w-56 bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-xs text-gray-100 p-2.5 rounded-xl"
              >
                <option value="acai_filling">Açaí - Recheio</option>
                <option value="acai_topping">Açaí - Cobertura</option>
                <option value="milkshake_flavor">Milk-Shake - Sabor</option>
              </select>

              <input
                type="text"
                required
                placeholder="Nome da opção (ex: Nutella, Morango...)"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                className="w-full sm:flex-1 bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-xs text-gray-100 placeholder-gray-500 px-3 py-2.5 rounded-xl"
              />

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Opção</span>
              </button>
            </form>

            {/* Listas por Grupo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recheios do Açaí */}
              <div className="bg-[#141620] border border-[#232737] rounded-2xl p-4 space-y-3">
                <h3 className="font-black text-amber-400 text-sm uppercase flex items-center justify-between">
                  <span>Recheios de Açaí</span>
                  <span className="text-[11px] text-gray-400 font-semibold">(Máx 4 no pedido)</span>
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                  {options
                    .filter((o) => o.group_type === 'acai_filling')
                    .map((opt) => (
                      <div
                        key={opt.id}
                        className="bg-[#1b1e2c] border border-[#272b3b] p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="font-semibold text-gray-200 truncate">{opt.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleOption(opt)}
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              opt.is_active === 1
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-gray-800 text-gray-500'
                            }`}
                          >
                            {opt.is_active === 1 ? 'Ativo' : 'Off'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(opt.id)}
                            className="text-gray-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Coberturas do Açaí */}
              <div className="bg-[#141620] border border-[#232737] rounded-2xl p-4 space-y-3">
                <h3 className="font-black text-red-400 text-sm uppercase flex items-center justify-between">
                  <span>Coberturas de Açaí</span>
                  <span className="text-[11px] text-gray-400 font-semibold">(1 inclusa)</span>
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                  {options
                    .filter((o) => o.group_type === 'acai_topping')
                    .map((opt) => (
                      <div
                        key={opt.id}
                        className="bg-[#1b1e2c] border border-[#272b3b] p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="font-semibold text-gray-200 truncate">{opt.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleOption(opt)}
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              opt.is_active === 1
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-gray-800 text-gray-500'
                            }`}
                          >
                            {opt.is_active === 1 ? 'Ativo' : 'Off'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(opt.id)}
                            className="text-gray-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Sabores de Milk-Shake */}
              <div className="bg-[#141620] border border-[#232737] rounded-2xl p-4 space-y-3">
                <h3 className="font-black text-amber-300 text-sm uppercase">Sabores de Milk-Shake</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                  {options
                    .filter((o) => o.group_type === 'milkshake_flavor')
                    .map((opt) => (
                      <div
                        key={opt.id}
                        className="bg-[#1b1e2c] border border-[#272b3b] p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="font-semibold text-gray-200 truncate">{opt.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleOption(opt)}
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              opt.is_active === 1
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-gray-800 text-gray-500'
                            }`}
                          >
                            {opt.is_active === 1 ? 'Ativo' : 'Off'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(opt.id)}
                            className="text-gray-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 4: HISTÓRICO DE PEDIDOS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Pedidos Recebidos</h2>
                <p className="text-xs text-gray-400">
                  Histórico sincronizado de todos os pedidos montados no cardápio digital.
                </p>
              </div>

              <button
                onClick={loadData}
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-[#1b1e2c] border border-[#2b2f3e] px-3 py-1.5 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#141620] border border-[#232737] rounded-3xl p-12 text-center text-gray-400">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="font-bold text-gray-300">Nenhum pedido registrado até o momento</p>
                <p className="text-xs text-gray-500 mt-1">
                  Assim que os clientes concluírem os pedidos pelo WhatsApp, eles aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#141620] border border-[#25293b] rounded-2xl p-4 space-y-3 shadow-lg"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#232737] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-amber-400">
                          {ord.order_number || ord.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            ord.order_type === 'delivery'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ord.order_type === 'delivery' ? 'Entrega em domicílio' : 'Retirada no balcão'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {ord.created_at ? new Date(ord.created_at).toLocaleString('pt-BR') : ''}
                        </span>
                        <select
                          value={ord.status || 'pending'}
                          onChange={(e) => handleUpdateOrderStatus(ord.id!, e.target.value)}
                          className="bg-[#1b1e2c] border border-[#2d3246] text-xs text-gray-200 rounded-lg p-1 font-bold"
                        >
                          <option value="pending">Pendente</option>
                          <option value="preparing">Preparando</option>
                          <option value="delivering">Saiu p/ Entrega</option>
                          <option value="completed">Concluído</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-bold text-white text-sm">{ord.customer_name}</p>
                        <p className="text-gray-400 mt-0.5">
                          Telefone: {formatPhone(ord.customer_phone)}
                        </p>
                        {ord.address && (
                          <div className="text-gray-400 mt-1 bg-[#1a1d29] p-2 rounded-xl border border-[#262a39]">
                            <p className="font-bold text-gray-200">Endereço de Entrega:</p>
                            <p>
                              {ord.address.street}, {ord.address.number} - {ord.address.neighborhood}
                            </p>
                            {ord.address.complement && <p>Comp: {ord.address.complement}</p>}
                            {ord.address.reference && <p>Ref: {ord.address.reference}</p>}
                          </div>
                        )}
                        <p className="mt-2 text-gray-300 font-semibold">
                          Pagamento:{' '}
                          <span className="text-amber-400 font-bold uppercase">
                            {ord.payment_method}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-gray-300 mb-1">Itens do Pedido:</p>
                        <div className="space-y-1 bg-[#1a1d29] p-2.5 rounded-xl border border-[#262a39] max-h-36 overflow-y-auto no-scrollbar">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-start text-[11px]">
                              <div>
                                <span className="font-bold text-white">
                                  {it.quantity}x {it.name}
                                </span>
                                {it.options?.map((opt, oi) => (
                                  <p key={oi} className="text-gray-500 pl-2">
                                    {opt.groupName}: {opt.selected.join(', ')}
                                  </p>
                                ))}
                                {it.notes && (
                                  <p className="text-amber-300/80 italic pl-2">Obs: {it.notes}</p>
                                )}
                              </div>
                              <span className="font-bold text-gray-300">
                                {formatCurrency(it.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between font-black text-sm text-white pt-2">
                          <span>TOTAL DO PEDIDO:</span>
                          <span className="text-amber-400">{formatCurrency(ord.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 5: CONFIGURAÇÕES DA LOJA ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-[#141620] border border-[#232737] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Configurações Gerais da Loja</h2>
              <p className="text-xs text-gray-400">
                Altere o WhatsApp de recebimento, horário, status aberto/fechado e chave Pix.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* WhatsApp de Recebimento */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  WhatsApp para Recebimento dos Pedidos (com DDI e DDD) *
                </label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={settings.whatsapp_number || '5584991517640'}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 pl-10 pr-3 py-2.5 rounded-xl"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Ex: 5584991517640 para (84) 99151-7640
                </p>
              </div>

              {/* Status Aberto / Fechado */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Status do Estabelecimento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, is_open: '1' })}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      settings.is_open === '1'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'bg-[#1b1e2c] border-[#2b2f3e] text-gray-400'
                    }`}
                  >
                    ● Loja Aberta (Aceitando pedidos)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, is_open: '0' })}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      settings.is_open === '0'
                        ? 'bg-red-600/20 border-red-500 text-red-400'
                        : 'bg-[#1b1e2c] border-[#2b2f3e] text-gray-400'
                    }`}
                  >
                    ● Loja Fechada
                  </button>
                </div>
              </div>

              {/* Slogan */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Slogan da Marca</label>
                <input
                  type="text"
                  value={settings.slogan || 'Sabor que todo mundo ama!'}
                  onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2.5 rounded-xl"
                />
              </div>

              {/* Horário de Funcionamento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    value={settings.opening_hours || '18:00 às 23:30'}
                    onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Tempo Médio de Entrega
                  </label>
                  <input
                    type="text"
                    value={settings.delivery_time || '35-50 min'}
                    onChange={(e) => setSettings({ ...settings, delivery_time: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Taxa Fixa de Entrega (R$)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={settings.delivery_fee || '3.00'}
                    onChange={(e) => setSettings({ ...settings, delivery_fee: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2.5 rounded-xl"
                  />
                </div>
              </div>

              {/* Chave Pix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Chave Pix</label>
                  <input
                    type="text"
                    value={settings.pix_key || '(84) 99151-7640'}
                    onChange={(e) => setSettings({ ...settings, pix_key: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Tipo da Chave</label>
                  <input
                    type="text"
                    value={settings.pix_key_type || 'Telefone'}
                    onChange={(e) => setSettings({ ...settings, pix_key_type: e.target.value })}
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2.5 rounded-xl"
                  />
                </div>
              </div>

              {/* Senha de Admin */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Nova Senha de Acesso do Painel
                </label>
                <input
                  type="text"
                  placeholder="Deixe em branco para manter a atual"
                  value={settings.admin_password || ''}
                  onChange={(e) => setSettings({ ...settings, admin_password: e.target.value })}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2.5 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-black py-3 rounded-xl shadow-lg transition-all active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ================= MODAL CRIAR / EDITAR PRODUTO ================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#141620] border border-[#2b2f42] rounded-3xl p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#232737] mb-4">
              <h3 className="font-black text-white text-lg">
                {editingProduct.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Categoria *</label>
                  <select
                    value={editingProduct.category_id || categories[0]?.id}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category_id: e.target.value })
                    }
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-xs text-gray-100 px-3 py-2 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price !== undefined ? editingProduct.price : ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                    }
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Preço Original R$ (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Para efeito riscado"
                    value={editingProduct.original_price || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        original_price: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Disponibilidade</label>
                  <select
                    value={editingProduct.is_active !== undefined ? editingProduct.is_active : 1}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_active: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-xs text-gray-100 px-3 py-2 rounded-xl"
                  >
                    <option value={1}>Disponível para venda</option>
                    <option value={0}>Esgotado / Indisponível</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  URL da Imagem Ilustrativa
                </label>
                <input
                  type="url"
                  required
                  value={editingProduct.image_url || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, image_url: e.target.value })
                  }
                  className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-xs text-gray-100 px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-xs text-gray-100 p-2.5 rounded-xl resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CRIAR / EDITAR BAIRRO ================= */}
      {isNeighModalOpen && editingNeighborhood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#141620] border border-[#2b2f42] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#232737] mb-4">
              <h3 className="font-black text-white text-base">
                {editingNeighborhood.id ? 'Editar Bairro & Taxa' : 'Novo Bairro'}
              </h3>
              <button
                onClick={() => {
                  setIsNeighModalOpen(false);
                  setEditingNeighborhood(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNeighborhood} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Nome do Bairro *</label>
                <input
                  type="text"
                  required
                  value={editingNeighborhood.name || ''}
                  onChange={(e) =>
                    setEditingNeighborhood({ ...editingNeighborhood, name: e.target.value })
                  }
                  className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Taxa R$ *</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={
                      editingNeighborhood.fee !== undefined ? editingNeighborhood.fee : ''
                    }
                    onChange={(e) =>
                      setEditingNeighborhood({
                        ...editingNeighborhood,
                        fee: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-sm text-gray-100 px-3 py-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Tempo Médio</label>
                  <input
                    type="text"
                    value={editingNeighborhood.estimated_time || '30-45 min'}
                    onChange={(e) =>
                      setEditingNeighborhood({
                        ...editingNeighborhood,
                        estimated_time: e.target.value,
                      })
                    }
                    className="w-full bg-[#1b1e2c] border border-[#2b2f3e] focus:border-amber-500 text-xs text-gray-100 px-3 py-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNeighModalOpen(false);
                    setEditingNeighborhood(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
                >
                  Salvar Bairro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

