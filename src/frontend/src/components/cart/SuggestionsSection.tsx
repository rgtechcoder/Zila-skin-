import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  {
    id: 1001,
    name: "Barrier Repair Cream",
    desc: "Barrier Repair Cream",
    price: 499,
    originalPrice: 599,
    rating: 4.7,
    reviews: 120,
    imageSeed: "bs-barrier-repair-cream",
    imageUrl: "/BS barrier repair cream.jpg",
    badge: "Bestseller",
  },
  {
    id: 1002,
    name: "Glutathione Cleanser",
    desc: "Glutathione Cleanser",
    price: 399,
    originalPrice: 499,
    rating: 4.8,
    reviews: 98,
    imageSeed: "bs-glutathyone-cleanser",
    imageUrl: "/BS glutathyone cleanser.jpg",
    badge: "Bestseller",
  },
  {
    id: 1003,
    name: "Hydra Gel",
    desc: "Hydra Gel",
    price: 0,
    originalPrice: 0,
    rating: 4.6,
    reviews: 80,
    imageSeed: "bs-hydra-gel",
    imageUrl: "/BS hydra gel.jpg",
    badge: "Bestseller",
  },
  {
    id: 1004,
    name: "Face Wash",
    desc: "Face Wash",
    price: 0,
    originalPrice: 0,
    rating: 4.5,
    reviews: 70,
    imageSeed: "bs-face-wash",
    imageUrl: "/BS face wash.jpg",
    badge: "Bestseller",
  },
];

export default function SuggestionsSection() {
  const { addItem } = useCart();
  const [added, setAdded] = useState<{ [id: number]: boolean }>({});

  const handleAdd = (prod: typeof SUGGESTIONS[0]) => {
    addItem({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice,
      imageUrl: prod.imageUrl,
    });
    setAdded((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [prod.id]: false })), 1200);
  };

  return (
    <div className="border-t border-border px-6 py-5">
      <h3 className="font-semibold text-brand-text mb-3 text-base">You may also like</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {SUGGESTIONS.map((prod) => (
          <div key={prod.id} className="min-w-[120px] max-w-[130px] bg-white rounded-xl shadow p-2 flex flex-col items-center">
            <img src={prod.imageUrl} alt={prod.name} className="w-16 h-16 object-contain rounded-lg mb-2" />
            <div className="text-xs font-semibold text-brand-text text-center line-clamp-2 mb-1">{prod.name}</div>
            <div className="text-xs text-brand-pink font-bold mb-1">₹{prod.price}</div>
            <Button
              size="sm"
              className={`w-full rounded-full px-2 py-1 text-xs font-semibold mt-1 shadow ${added[prod.id] ? 'bg-green-500 text-white' : ''}`}
              style={{
                minHeight: 28,
                background: added[prod.id] ? '#22c55e' : '#F1267A',
                color: '#fff',
                border: '1px solid #F1267A',
                boxShadow: '0 2px 8px 0 rgba(241,38,122,0.10)',
              }}
              disabled={added[prod.id]}
              onClick={() => handleAdd(prod)}
              onMouseOver={e => { if (!added[prod.id]) e.currentTarget.style.background = '#c2185b'; }}
              onMouseOut={e => { if (!added[prod.id]) e.currentTarget.style.background = '#F1267A'; }}
            >
              {added[prod.id] ? 'Added!' : 'Add to Bag'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}