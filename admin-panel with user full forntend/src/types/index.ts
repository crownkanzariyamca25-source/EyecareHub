export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  avatar: string;
  joinedDate: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  icon: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  products: string[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'disabled';
  usageCount: number;
  usageLimit: number;
}

export type ActivePage = 'dashboard' | 'products' | 'categories' | 'orders' | 'users' | 'coupons' | 'settings';
