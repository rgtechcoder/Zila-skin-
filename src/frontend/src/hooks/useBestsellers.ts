import { useState, useEffect } from "react";
import { getProducts } from "@/lib/firestore";
import type { FirestoreProduct } from "@/lib/firestore";

// --- STATIC BESTSELLERS ---
const STATIC_BESTSELLERS: FirestoreProduct[] = [
  {
    id: "bs1",
    name: "Bestseller Barrier Repair Cream",
    price: 599,
    originalPrice: 699,
    category: "Bestseller",
    description: "Bestseller Product 1",
    stock: 100,
    imageUrl: "/BS barrier repair cream.jpg",
    badge: "Bestseller"
  },
  {
    id: "bs2",
    name: "Bestseller Glutathione Cleanser",
    price: 599,
    originalPrice: 699,
    category: "Bestseller",
    description: "Bestseller Product 2",
    stock: 100,
    imageUrl: "/BS glutathyone cleanser.jpg",
    badge: "Bestseller"
  },
  {
    id: "bs3",
    name: "Bestseller Grape Seed Body Lotion",
    price: 599,
    originalPrice: 699,
    category: "Bestseller",
    description: "Bestseller Product 3",
    stock: 100,
    imageUrl: "/BS grape seed body lotion.jpg",
    badge: "Bestseller"
  },
  {
    id: "bs4",
    name: "Bestseller Rice Water Toner",
    price: 599,
    originalPrice: 699,
    category: "Bestseller",
    description: "Bestseller Product 4",
    stock: 100,
    imageUrl: "/BS rice water toner.jpg",
    badge: "Bestseller"
  },
  {
    id: "bs5",
    name: "Bestseller Serum",
    price: 599,
    originalPrice: 699,
    category: "Bestseller",
    description: "Bestseller Product 5",
    stock: 100,
    imageUrl: "/BS serum.jpg",
    badge: "Bestseller"
  },
  {
    id: "bs6",
    name: "Bestseller Skin Brightening Cream",
    price: 599,
    originalPrice: 699,
    category: "Bestseller",
    description: "Bestseller Product 6",
    stock: 100,
    imageUrl: "/BS skin brightinging cream.jpg",
    badge: "Bestseller"
  },
  {
    id: "bs7",
    name: "Bestseller Vitamin C Cleanser",
    price: 599,
    originalPrice: 699,
    category: "Bestseller",
    description: "Bestseller Product 7",
    stock: 100,
    imageUrl: "/BS vitamin c cleanser.jpg",
    badge: "Bestseller"
  },
  {
    id: "bs8",
    name: "Bestseller Vitamin C Sunscreen",
    price: 599,
    originalPrice: 699,
    category: "Bestseller",
    description: "Bestseller Product 8",
    stock: 100,
    imageUrl: "/BS vitamin c sunscreen.jpg",
    badge: "Bestseller"
  },
];

export function useBestsellers() {
  const [bestsellers, setBestsellers] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirestoreData, setIsFirestoreData] = useState(false);

  useEffect(() => {
    getProducts()
      .then((data) => {
        // Support badge as string or array
        const filtered = data.filter((p) =>
          p.badge === "Bestseller" || (Array.isArray(p.badge) && p.badge.includes("Bestseller"))
        );
        if (filtered.length > 0) {
          setBestsellers(filtered);
          setIsFirestoreData(true);
        } else {
          setBestsellers(STATIC_BESTSELLERS);
          setIsFirestoreData(false);
        }
      })
      .catch(() => {
        setBestsellers(STATIC_BESTSELLERS);
        setIsFirestoreData(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { bestsellers, loading, isFirestoreData };
}
