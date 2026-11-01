export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  sort_order: number;
}

export interface CustomizationOption {
  id: string;
  group_type: 'acai_filling' | 'acai_topping' | 'milkshake_flavor' | 'drink_flavor' | 'combo_option';
  name: string;
  price: number;
  is_active: number; // 1 or 0
}

export interface Product {
  id: string;
  category_id: string;
  category_slug?: string;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number | null;
  image_url: string;
  is_active: number; // 1 = disponível, 0 = indisponível
  is_featured: number;
  options_config?: string | null; // JSON string specifying requirements (e.g. max_fillings: 4, max_toppings: 1)
  sort_order: number;
  created_at?: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  fee: number;
  is_active: number; // 1 = ativo, 0 = inativo
  estimated_time?: string;
}

export interface StoreSettings {
  store_name: string;
  slogan: string;
  whatsapp_number: string;
  address: string;
  is_open: string; // '1' or '0'
  opening_hours: string;
  delivery_time: string;
  delivery_fee?: string;
  min_order: string;
  pix_key: string;
  pix_key_type: string;
  admin_password?: string;
}

export interface CartItemOption {
  groupName: string;
  selected: string[];
}

export interface CartItem {
  id: string; // unique cart item id (product id + timestamp or serialized options)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  options: CartItemOption[];
  notes: string;
}

export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'credit' | 'debit' | 'pix';
export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';

export interface OrderAddress {
  cep?: string;
  street: string;
  number: string;
  neighborhood: string;
  neighborhood_id?: string;
  delivery_fee: number;
  complement?: string;
  reference?: string;
}

export interface OrderData {
  id?: string;
  order_number?: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  address?: OrderAddress;
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  notes?: string;
  status?: OrderStatus;
  created_at?: string;
}

