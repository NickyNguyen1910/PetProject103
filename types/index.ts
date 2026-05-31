export interface Product {
  id: string;
  name: string;
  group: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  cardType: 'photocard' | 'trading' | 'limited' | 'special';
  description: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  address?: string;
  phone?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  shippingInfo: ShippingInfo;
  createdAt: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}
