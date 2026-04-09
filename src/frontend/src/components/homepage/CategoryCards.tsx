import { type FirestoreCategory, getCategories } from "@/lib/firestore";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

const STATIC_CATS = [
  {
    name: "Cleansers",
    filterKey: "Cleanser",
    desc: "Fresh start, every day",
    imageUrl: "/product - glutathyone cleanser.jpg",
  },
  {
    name: "Serums",
    filterKey: "Serum",
    desc: "Targeted, potent care",
    imageUrl: "/product - niacinamide serum.jpg",
  },
  {
    name: "Moisturisers",
    filterKey: "Moisturizer",
    desc: "Nourish & hydrate",
    imageUrl: "/product - vitamin c cream.jpg",
  },
  {
    name: "Sunscreens",
    filterKey: "Sunscreen",
    desc: "Daily UV defence",
    imageUrl: "/product - niacinamide sunscreen.jpg",
  },
  {
    name: "Toners",
    filterKey: "Toner",
    desc: "Refine & balance",
    imageUrl: "/product - niacinamide toner.jpg",
  },
  {
    name: "Body Lotion",
    filterKey: "Body Lotion",
    desc: "Glow every day",
    imageUrl: "/product - coconut body lotion.jpg",
  },
];

interface CatItem {
  name: string;
  filterKey: string;
  desc: string;
  imageUrl: string;
}

export default function CategoryCards() {
  const [categories, setCategories] = useState<CatItem[]>(STATIC_CATS);

  useEffect(() => {
    getCategories()
      .then((cats: FirestoreCategory[] & { order?: number }[]) => {
        if (cats.length > 0) {
          // Sort by 'order' field if present
          cats.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setCategories(
            cats.map((c) => ({
              name: c.name,
              filterKey: c.slug ?? c.name,
              desc: "",
              imageUrl:
                (c as FirestoreCategory & { imageUrl?: string }).imageUrl ?? "",
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  function handleCategoryClick(filterKey: string) {
    sessionStorage.setItem("zilaShopCategory", filterKey);
    sessionStorage.removeItem("zilaShopSearch");
    window.location.hash = "#shop";
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="py-12 lg:py-20 bg-gradient-to-br from-[#FFF5F9] via-[#FDE3EC] to-[#F3D0FF] relative overflow-hidden"
      data-ocid="category.section"
    >
      {/* Decorative pattern overlay for premium feel */}
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-lighten bg-[url('/pattern.svg')] bg-repeat" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 lg:mb-12">
          <p className="text-brand-pink text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Explore Our Range
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-brand-text">
            Shop by Category
          </h2>
        </div>
        <div className="relative">
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-brand-pink/80 text-brand-pink hover:text-white rounded-full shadow p-2 transition-all duration-200 disabled:opacity-30"
            onClick={() => scrollRef.current && scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' })}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div ref={scrollRef} className="flex flex-nowrap gap-3 lg:gap-5 overflow-x-auto pb-2 hide-scrollbar px-0 justify-start" style={{maxWidth:'100%'}}>
            {categories.map((cat, i) => (
              <motion.button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.filterKey)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex-shrink-0 flex flex-col items-center gap-2 p-3 md:p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-[#F3D0FF]/60 shadow-[0_2px_16px_rgba(241,38,122,0.10),0_1.5px_8px_rgba(155,89,182,0.10)] hover:bg-brand-accent/80 hover:border-brand-pink/30 hover:shadow-[0_8px_32px_rgba(241,38,122,0.14),0_2px_12px_rgba(155,89,182,0.10)] transition-all duration-300 cursor-pointer min-w-[180px] max-w-[180px] w-[180px] lg:min-w-[200px] lg:max-w-[200px] lg:w-[200px]"
                data-ocid={`category.item.${i + 1}`}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(241,38,122,0.10)] bg-gradient-to-br from-[#FFF5F9] via-[#FDE3EC] to-[#F3D0FF] flex items-center justify-center group-hover:ring-2 group-hover:ring-brand-pink/30 transition-all duration-300">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-400"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FDE3EC] to-[#F3D0FF] rounded-xl" />
                  )}
                </div>
                <div className="text-center min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-brand-text group-hover:text-brand-pink transition-colors truncate">
                    {cat.name}
                  </p>
                  {cat.desc && (
                    <p className="text-[10px] sm:text-xs text-brand-text-muted mt-0.5 hidden sm:block">
                      {cat.desc}
                    </p>
                  )}
                </div>
                <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-brand-pink opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={12} />
                </span>
              </motion.button>
            ))}
          </div>
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-brand-pink/80 text-brand-pink hover:text-white rounded-full shadow p-2 transition-all duration-200 disabled:opacity-30"
            onClick={() => scrollRef.current && scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' })}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
