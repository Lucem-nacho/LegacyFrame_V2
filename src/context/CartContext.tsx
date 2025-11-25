/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  image?: string;
  price?: number; 
  quantity: number;
  stockMax: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void; 
  removeItem: (id: string) => void;
  increaseItem: (id: string) => void; // <--- IMPORTANTE
  decreaseItem: (id: string) => void; // <--- IMPORTANTE
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};

const STORAGE_KEY = "legacyframe_cart_v5"; // Versión nueva para limpiar cache

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === newItem.id);
      
      if (idx >= 0) {
        if (prev[idx].quantity >= newItem.stockMax) {
          alert(`¡No puedes agregar más! Solo quedan ${newItem.stockMax} unidades.`);
          return prev;
        }
        const clone = [...prev];
        clone[idx] = { ...clone[idx], quantity: clone[idx].quantity + 1 };
        return clone;
      }
      
      if (newItem.stockMax < 1) {
        alert("Producto agotado.");
        return prev;
      }
      
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  // FUNCIONES DE CANTIDAD
  const increaseItem = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        if (item.quantity < item.stockMax) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert(`Stock máximo alcanzado (${item.stockMax} un.)`);
          return item;
        }
      }
      return item;
    }));
  };

  const decreaseItem = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const total = useMemo(() => items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, increaseItem, decreaseItem, clear }}>
      {children}
    </CartContext.Provider>
  );
};