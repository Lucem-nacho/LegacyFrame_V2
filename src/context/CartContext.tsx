/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  image?: string;
  price?: number; // precio unitario opcional
  priceText?: string; // para rangos como en Molduras
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};

const STORAGE_KEY = "legacyframe_cart_v1";

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar errores de almacenamiento (modo privado o sin permisos)
    }
  }, [items]);

  const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], quantity: clone[idx].quantity + qty };
        return clone;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, it) => acc + it.quantity, 0), [items]);
  const total = useMemo(() => items.reduce((acc, it) => acc + (it.price ?? 0) * it.quantity, 0), [items]);

  const value: CartContextValue = { items, count, total, addItem, removeItem, clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
