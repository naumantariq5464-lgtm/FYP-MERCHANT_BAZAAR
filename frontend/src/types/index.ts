// =============================================
// Merchant Bazaar — Shared TypeScript Types
// =============================================

export type UserRole = "seller" | "admin";
export type StoreStatus = "draft" | "published";
export type ProductStatus = "active" | "inactive";
export type OrderStatus = "pending" | "confirmed" | "processing" | "delivered" | "cancelled";
export type VariantType = "size" | "color";

export interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Store {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  slug: string;
  business_category: string | null;
  status: StoreStatus;
  created_at: string;
  settings?: StoreSettings;
}

export interface StoreSettings {
  id: string;
  store_id: string;
  logo_url: string | null;
  hero_images: string[];
  hero_heading: string | null;
  hero_description: string | null;
  promotional_text: string | null;
  primary_color: string;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_type: VariantType;
  variant_value: string;
  extra_price: number;
  stock_quantity: number;
}

export interface Product {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  status: ProductStatus;
  created_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_info: string | null;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  store_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
}

// Cart types — frontend only, not persisted to backend
export interface CartItem {
  product_id: string;
  product_name: string;
  image_url: string | null;
  price: number;
  base_price?: number;
  quantity: number;
  variant_id?: string;
  variant_info?: string;
  available_variants?: Array<{
    id: string;
    variant_type: string;
    variant_value: string;
    extra_price: number;
  }>;
}

// Admin dashboard stats
export interface PlatformStats {
  total_sellers: number;
  total_stores: number;
  published_stores: number;
  draft_stores: number;
}

export interface SellerWithStore {
  seller: User;
  store: Store | null;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message: string;
}
