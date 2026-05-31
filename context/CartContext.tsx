'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const save = (data: CartItem[]) => {
    setItems(data);
    localStorage.setItem('cart', JSON.stringify(data));
  };

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      const next = existing
        ? prev.map(i => i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i)
        : [...prev, { product, quantity }];
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.product.id !== productId);
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) { removeItem(productId); return; }
    setItems(prev => {
      const next = prev.map(i => i.product.id === productId ? { ...i, quantity } : i);
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => save([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
