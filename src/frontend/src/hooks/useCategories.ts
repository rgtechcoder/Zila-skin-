import { useState, useEffect } from "react";
import { getCategories } from "@/lib/firestore";
import type { Category } from "@/lib/firestore";

// --- STATIC CATEGORIES ---
const STATIC_CATEGORIES: Category[] = [
  // Example static categories
  { id: "1", name: "Moisturizer", slug: "moisturizer" },
  { id: "2", name: "Cleanser", slug: "cleanser" },
  { id: "3", name: "Serum", slug: "serum" },
  { id: "4", name: "Sunscreen", slug: "sunscreen" },
  { id: "5", name: "Toner", slug: "toner" },
  { id: "6", name: "Body Lotion", slug: "body-lotion" },
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirestoreData, setIsFirestoreData] = useState(false);

  useEffect(() => {
    getCategories()
      .then((data) => {
        if (data.length > 0) {
          setCategories(data);
          setIsFirestoreData(true);
        } else {
          setCategories(STATIC_CATEGORIES);
          setIsFirestoreData(false);
        }
      })
      .catch(() => {
        setCategories(STATIC_CATEGORIES);
        setIsFirestoreData(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, isFirestoreData };
}
