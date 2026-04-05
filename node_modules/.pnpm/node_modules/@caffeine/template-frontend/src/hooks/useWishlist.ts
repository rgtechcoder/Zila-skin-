import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  desc?: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  isWishlisted: (id: number) => boolean;
}

export const WishlistContext = createContext<WishlistContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isWishlisted: () => false,
});

const STORAGE_KEY = "zila_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as WishlistItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isWishlisted = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items],
  );

  const value: WishlistContextValue = {
    items,
    addItem,
    removeItem,
    isWishlisted,
  };

  return React.createElement(WishlistContext.Provider, { value }, children);
}

export function useWishlist() {
  return useContext(WishlistContext);
}
