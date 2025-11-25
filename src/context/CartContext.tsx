/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  image?: string;
  price?: number; 
  quantity: number;
  stockMax: number; // <--- NUEVO CAMPO OBLIGATORIO
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  // Modificamos addItem para recibir el stock máximo
  addItem: (item: Omit<CartItem, "quantity">) => void; 
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};

const STORAGE_KEY = "legacyframe_cart_v3"; // Cambiamos versión para limpiar cache viejo

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
      
      // CASO 1: El producto YA está en el carrito
      if (idx >= 0) {
        const currentQty = prev[idx].quantity;
        
        // --- VALIDACIÓN DE STOCK ---
        if (currentQty >= newItem.stockMax) {
          alert(`¡No puedes agregar más! Solo quedan ${newItem.stockMax} unidades disponibles.`);
          return prev; // No hacemos cambios
        }

        const clone = [...prev];
        clone[idx] = { ...clone[idx], quantity: clone[idx].quantity + 1 };
        return clone;
      }
      
      // CASO 2: Producto nuevo en el carrito
      if (newItem.stockMax < 1) {
        alert("Este producto está agotado.");
        return prev;
      }
      
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const total = useMemo(() => items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
};