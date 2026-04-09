import { useBestsellers } from "@/hooks/useBestsellers";
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

function BestsellersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { bestsellers, loading } = useBestsellers();

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // bestsellers already filtered by hook

  // Map FirestoreProduct to ProductCard type
  function mapToProductCard(p: any, i: number) {
    return {
      id: p.id || i,
      name: p.name,
      desc: p.description || p.desc || "",
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating ?? 5,
      reviews: p.reviews ?? 0,
      imageSeed: p.id || p.name || String(i),
      imageUrl: p.bestsellerImage || p.imageUrl,
      badge: p.badge || "Bestseller",
    };
  }

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
          {bestsellers.map((p, i) => (
            <ProductCard key={p.id || i} product={mapToProductCard(p, i)} index={i + 1} />
          ))}
        </div>

        {/* Desktop: horizontal scroll carousel */}
        <div
          ref={scrollRef}
          className="hidden sm:flex gap-5 overflow-x-auto scrollbar-hide pb-2"
        >
          {bestsellers.map((p, i) => (
            <div
              key={p.id || i}
              className="min-w-[220px] sm:min-w-[240px] lg:min-w-[260px] flex-shrink-0"
            >
              <ProductCard product={mapToProductCard(p, i)} index={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestsellersSection;
