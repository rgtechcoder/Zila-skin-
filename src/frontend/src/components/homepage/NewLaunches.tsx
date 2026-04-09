// (removed stray object here, now only inside staticNS array)
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { useNewLaunches } from "@/hooks/useNewLaunches";

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

export default function NewLaunches() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { newLaunches } = useNewLaunches();
  // newLaunches already filtered by hook

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
      imageUrl: p.newLaunchImage || p.imageUrl,
      badge: p.badge || "New Launch",
    };
  }

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="py-12 lg:py-20 bg-gradient-to-br from-[#FFF5F9] via-[#FDE3EC] to-[#F3D0FF] relative overflow-hidden"
      data-ocid="newlaunches.section"
    >
      {/* Decorative pattern overlay for premium feel */}
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-lighten bg-[url('/pattern.svg')] bg-repeat" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-pink text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              New Launches
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-brand-text">
              Fresh Off the Lab
            </h2>
            <p className="text-brand-text-muted mt-2 text-sm">
              Science-first formulas, just launched
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border hover:border-brand-pink hover:text-brand-pink flex items-center justify-center transition-all"
              data-ocid="newlaunches.pagination_prev"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border hover:border-brand-pink hover:text-brand-pink flex items-center justify-center transition-all"
              data-ocid="newlaunches.pagination_next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>


        {/* Mobile: 2-column grid */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {newLaunches.map((p, i) => (
            <ProductCard key={p.id || i} product={mapToProductCard(p, i)} index={i + 1} />
          ))}
        </div>

        {/* Desktop: horizontal scroll carousel */}
        <div
          ref={scrollRef}
          className="hidden sm:flex gap-5 overflow-x-auto scrollbar-hide pb-2"
        >
          {newLaunches.map((p, i) => (
            <div
              key={p.id || i}
              className="min-w-[300px] sm:min-w-[340px] lg:min-w-[370px] flex-shrink-0"
            >
              <ProductCard product={mapToProductCard(p, i)} index={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
