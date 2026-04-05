import { useProducts } from "@/hooks/useProducts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "./ProductCard";

function SkeletonCard() {
  return (
    <div className="min-w-[220px] sm:min-w-[240px] lg:min-w-[260px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="aspect-square bg-gradient-to-b from-gray-100 to-gray-200 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
        <div className="h-8 bg-gray-100 rounded-full animate-pulse mt-3" />
      </div>
    </div>
  );
}



export default function BestsellersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products, loading } = useProducts();

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };


  // Only show static BS images from public folder
  const staticBS = [
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
      name: "Grape Seed Body Lotion",
      desc: "Grape Seed Body Lotion",
      price: 349,
      originalPrice: 449,
      rating: 4.6,
      reviews: 87,
      imageSeed: "bs-grape-seed-body-lotion",
      imageUrl: "/BS grape seed body lotion.jpg",
      badge: "Bestseller",
    },
    {
      id: 1004,
      name: "Rice Water Toner",
      desc: "Rice Water Toner",
      price: 299,
      originalPrice: 399,
      rating: 4.5,
      reviews: 65,
      imageSeed: "bs-rice-water-toner",
      imageUrl: "/BS rice water toner.jpg",
      badge: "Bestseller",
    },
    {
      id: 1005,
      name: "Serum",
      desc: "Serum",
      price: 599,
      originalPrice: 699,
      rating: 4.9,
      reviews: 150,
      imageSeed: "bs-serum",
      imageUrl: "/BS serum.jpg",
      badge: "Bestseller",
    },
    {
      id: 1006,
      name: "Skin Brightening Cream",
      desc: "Skin Brightening Cream",
      price: 499,
      originalPrice: 599,
      rating: 4.7,
      reviews: 110,
      imageSeed: "bs-skin-brightening-cream",
      imageUrl: "/BS skin brightinging cream.jpg",
      badge: "Bestseller",
    },
    {
      id: 1007,
      name: "Vitamin C Cleanser",
      desc: "Vitamin C Cleanser",
      price: 399,
      originalPrice: 499,
      rating: 4.8,
      reviews: 105,
      imageSeed: "bs-vitamin-c-cleanser",
      imageUrl: "/BS vitamin c cleanser.jpg",
      badge: "Bestseller",
    },
    {
      id: 1008,
      name: "Vitamin C Sunscreen",
      desc: "Vitamin C Sunscreen",
      price: 349,
      originalPrice: 449,
      rating: 4.6,
      reviews: 90,
      imageSeed: "bs-vitamin-c-sunscreen",
      imageUrl: "/BS vitamin c sunscreen.jpg",
      badge: "Bestseller",
    },
  ];

  return (
    <section
      className="py-12 lg:py-20 bg-brand-bg"
      data-ocid="bestsellers.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-brand-pink text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Most Loved
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-brand-text">
              Bestseller Favorites
            </h2>
          </motion.div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border hover:bg-brand-pink hover:text-white hover:border-brand-pink flex items-center justify-center transition-all duration-200"
              data-ocid="bestsellers.pagination_prev"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border hover:bg-brand-pink hover:text-white hover:border-brand-pink flex items-center justify-center transition-all duration-200"
              data-ocid="bestsellers.pagination_next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Mobile: 2-column grid */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {staticBS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i + 1} />
          ))}
        </div>

        {/* Desktop: horizontal scroll carousel */}
        <div
          ref={scrollRef}
          className="hidden sm:flex gap-5 overflow-x-auto scrollbar-hide pb-2"
        >
          {staticBS.map((p, i) => (
            <div
              key={p.id}
              className="min-w-[220px] sm:min-w-[240px] lg:min-w-[260px] flex-shrink-0"
            >
              <ProductCard product={p} index={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
