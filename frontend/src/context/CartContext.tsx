"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, variant_id?: string) => void;
  updateQuantity: (product_id: string, quantity: number, variant_id?: string) => void;
  updateVariant: (
    product_id: string,
    oldVariantId: string | undefined,
    newVariant: { id: string; variant_type: string; variant_value: string; extra_price: number },
    basePrice: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "mb_cart";

export function CartProvider({ children, storeSlug }: { children: React.ReactNode; storeSlug: string }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount — scoped per store
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${CART_KEY}_${storeSlug}`);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
  }, [storeSlug]);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(`${CART_KEY}_${storeSlug}`, JSON.stringify(items));
  }, [items, storeSlug]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product_id === newItem.product_id && i.variant_id === newItem.variant_id
      );
      if (existing) {
        return prev.map((i) =>
          i.product_id === newItem.product_id && i.variant_id === newItem.variant_id
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((product_id: string, variant_id?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product_id === product_id && i.variant_id === variant_id))
    );
  }, []);

  const updateQuantity = useCallback((product_id: string, quantity: number, variant_id?: string) => {
    if (quantity <= 0) {
      removeItem(product_id, variant_id);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product_id === product_id && i.variant_id === variant_id ? { ...i, quantity } : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const updateVariant = useCallback(
    (
      product_id: string,
      oldVariantId: string | undefined,
      newVariant: { id: string; variant_type: string; variant_value: string; extra_price: number },
      basePrice: number
    ) => {
      setItems((prev) =>
        prev.map((i) => {
          if (i.product_id === product_id && i.variant_id === oldVariantId) {
            const extra = Number(newVariant.extra_price) || 0;
            return {
              ...i,
              variant_id: newVariant.id,
              variant_info: `${newVariant.variant_type}: ${newVariant.variant_value}`,
              price: basePrice + extra,
            };
          }
          return i;
        })
      );
    },
    []
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateVariant,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
