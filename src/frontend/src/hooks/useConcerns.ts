import { useState, useEffect } from "react";
import { getConcerns } from "@/lib/firestore";
import type { FirestoreConcern } from "@/lib/firestore";

// --- STATIC CONCERNS ---
const STATIC_CONCERNS: FirestoreConcern[] = [
  { id: "1", name: "Hydration", slug: "hydration" },
  { id: "2", name: "Brightening", slug: "brightening" },
  { id: "3", name: "Anti-Aging", slug: "anti-aging" },
  { id: "4", name: "Sun Protection", slug: "sun-protection" },
  { id: "5", name: "Acne", slug: "acne" },
];

export function useConcerns() {
  const [concerns, setConcerns] = useState<FirestoreConcern[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirestoreData, setIsFirestoreData] = useState(false);

  useEffect(() => {
    getConcerns()
      .then((data) => {
        if (data.length > 0) {
          setConcerns(data);
          setIsFirestoreData(true);
        } else {
          setConcerns(STATIC_CONCERNS);
          setIsFirestoreData(false);
        }
      })
      .catch(() => {
        setConcerns(STATIC_CONCERNS);
        setIsFirestoreData(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { concerns, loading, isFirestoreData };
}
