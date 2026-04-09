import { motion } from "motion/react";
import { useRef } from "react";
import { useConcerns } from "@/hooks/useConcerns";
import { Droplet, Sun, Sparkles, HeartPulse, AlertTriangle } from "lucide-react";
// Map concern names to Lucide icons
const concernIcons: Record<string, JSX.Element> = {
  Hydration: <Droplet size={32} className="text-sky-400" />,
  Brightening: <Sun size={32} className="text-yellow-400" />,
  "Acne / Oil Control": <Sparkles size={32} className="text-purple-400" />,
  Pigmentation: <AlertTriangle size={32} className="text-yellow-400" />,
  Sensitivity: <HeartPulse size={32} className="text-pink-400" />,
};
import "./hide-scrollbar.css";

export default function ShopByConcern() {

  const { concerns } = useConcerns();

  function handleConcern(slug: string) {
    sessionStorage.setItem("zilaShopConcern", slug);
    sessionStorage.removeItem("zilaShopCategory");
    sessionStorage.removeItem("zilaShopSearch");
    window.location.hash = "#shop";
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-12 lg:py-20 bg-brand-bg" data-ocid="concern.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <p className="text-brand-pink text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Personalised Skincare
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-brand-text">
            What&apos;s Your Skin Concern?
          </h2>
          <p className="text-brand-text-muted mt-3 text-sm max-w-xl mx-auto">
            Shop targeted solutions formulated for your unique skin needs.
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-brand-pink/80 text-brand-pink hover:text-white rounded-full shadow p-2 transition-all duration-200 disabled:opacity-30 border border-brand-pink"
            style={{display:'block'}}
            onClick={() => scrollRef.current && scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' })}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div ref={scrollRef} className="flex flex-nowrap gap-3 lg:gap-6 overflow-x-auto pb-2 hide-scrollbar px-0 justify-start" style={{maxWidth:'100%'}}>
            {concerns.length === 0 ? (
              <div className="text-center text-gray-400 py-8 min-w-[200px]">No concerns found.</div>
            ) : (
              concerns.map((c, i) => (
                <motion.button
                            type="button"
                            key={c.slug || c.name}
                            onClick={() => handleConcern(c.slug)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            className="group flex-shrink-0 flex flex-col items-center gap-2 py-4 sm:py-5 px-2 sm:px-3 rounded-2xl bg-white hover:bg-brand-pink transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_8px_24px_rgba(241,38,122,0.22)] text-left min-w-[180px] max-w-[180px] w-[180px] lg:min-w-[200px] lg:max-w-[200px] lg:w-[200px]"
                            data-ocid={`concern.item.${i + 1}`}
                          >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-accent group-hover:bg-white/20 flex items-center justify-center text-xl sm:text-2xl transition-colors duration-300">
                              {/* Show uploaded/custom icon if present, else mapped SVG */}
                              {c.icon && (c.icon.startsWith('data:') || c.icon.startsWith('http')) ? (
                                <img src={c.icon} alt={c.name} className="w-8 h-8 object-contain" />
                              ) : concernIcons[c.name] ? (
                                concernIcons[c.name]
                              ) : (
                                <Droplet size={32} className="text-gray-300" />
                              )}
                            </div>
                            <div className="text-center min-w-0">
                              <p className="font-semibold text-xs sm:text-sm text-brand-text group-hover:text-white transition-colors break-words">
                                {c.name}
                              </p>
                              <p className="text-[10px] sm:text-xs text-brand-text-muted group-hover:text-white/80 mt-0.5 transition-colors hidden sm:block">
                                {c.description}
                              </p>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-brand-pink/80 text-brand-pink hover:text-white rounded-full shadow p-2 transition-all duration-200 disabled:opacity-30 border border-brand-pink"
                      style={{display:'block'}}
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
