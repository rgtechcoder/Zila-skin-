import { useState, useEffect } from "react";
import { getProducts } from "@/lib/firestore";
import type { FirestoreProduct } from "@/lib/firestore";

// --- STATIC NEW LAUNCHES ---
const STATIC_NEW_LAUNCHES: FirestoreProduct[] = [
  {
    id: "ns1",
    name: "New Launch 1",
    price: 499,
    originalPrice: 599,
    category: "New Launch",
    description: "New Launch Product 1",
    stock: 100,
    imageUrl: "/Ns 1.jpg",
    badge: "New"
  },
  {
    id: "ns2",
    name: "New Launch 2",
    price: 499,
    originalPrice: 599,
    category: "New Launch",
    description: "New Launch Product 2",
    stock: 100,
    imageUrl: "/Ns 2.jpg",
    badge: "New"
  },
  {
    id: "ns3",
    name: "New Launch 3",
    price: 499,
    originalPrice: 599,
    category: "New Launch",
    description: "New Launch Product 3",
    stock: 100,
    imageUrl: "/Ns 3.jpg",
    badge: "New"
  },
  {
    id: "ns4",
    name: "New Launch 4",
    price: 499,
    originalPrice: 599,
    category: "New Launch",
    description: "New Launch Product 4",
    stock: 100,
    imageUrl: "/Ns 4.jpg",
    badge: "New"
  },
];

export function useNewLaunches() {
  const [newLaunches, setNewLaunches] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirestoreData, setIsFirestoreData] = useState(false);

  useEffect(() => {
    getProducts()
      .then((data) => {
        // Support badge as string or array
        const filtered = data.filter((p) =>
          p.badge === "New" || (Array.isArray(p.badge) && p.badge.includes("New"))
        );
        if (filtered.length > 0) {
          setNewLaunches(filtered);
          setIsFirestoreData(true);
        } else {
          setNewLaunches(STATIC_NEW_LAUNCHES);
          setIsFirestoreData(false);
        }
      })
      .catch(() => {
        setNewLaunches(STATIC_NEW_LAUNCHES);
        setIsFirestoreData(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { newLaunches, loading, isFirestoreData };
}
