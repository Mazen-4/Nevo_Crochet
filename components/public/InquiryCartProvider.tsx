"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Project } from '@/types';

const STORAGE_KEY = 'nevo-inquiry-cart';

type InquiryCartContextValue = {
  items: CartItem[];
  count: number;
  isOpen: boolean;
  lastAdded: string | null;
  addItem: (project: Project) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const InquiryCartContext = createContext<InquiryCartContextValue | undefined>(undefined);

export function InquiryCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn('Unable to read inquiry cart from localStorage', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = (project: Project) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === project.id);

      if (existing) {
        return current.map((item) =>
          item.id === project.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          id: project.id,
          title: project.title,
          quantity: 1,
          priceLabel: project.priceLabel,
        },
      ];
    });

    setLastAdded(project.title);
    setIsOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!lastAdded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsOpen(false);
      setLastAdded(null);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [lastAdded]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      isOpen,
      lastAdded,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    }),
    [items, isOpen, lastAdded],
  );

  return <InquiryCartContext.Provider value={value}>{children}</InquiryCartContext.Provider>;
}

export function useInquiryCart() {
  const context = useContext(InquiryCartContext);

  if (!context) {
    throw new Error('useInquiryCart must be used inside InquiryCartProvider');
  }

  return context;
}
