import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";


// Parallax helper (if you want to use it elsewhere)
function useParallax(amount = 20) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const onMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;
    setOffset({ x: x * amount, y: y * amount });
  };
  const onMouseLeave = () => setOffset({ x: 0, y: 0 });
  return { offset, onMouseMove, onMouseLeave };
}

const slides = [
  {
    id: 1,
    eyebrow: "SUMMER GLOW",
    headline: "The Ultimate Summer Glow.",
    cta: "Shop Now",
    ctaHref: "#category",
    imageUrl: "/Website Banner 1.jpg",
  },
  {
    id: 2,
    eyebrow: "GLOW CLEANSER",
    headline: "Not Every Glow Needs Makeup.",
    cta: "Shop Now",
    ctaHref: "#category",
    imageUrl: "/Website Banner 2.jpg",
  },
  {
    id: 3,
    eyebrow: "RADIANT SKIN",
    headline: "Sometimes, It Just Starts With A Good Cleanse.",
    cta: "Shop Now",
    ctaHref: "#category",
    imageUrl: "/Website Banner 3.jpg",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 3000); // Faster auto-slide (3s)
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div
      className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-0 mt-8 sm:mt-12 lg:mt-16"
      style={{ position: 'relative', minWidth: '100vw' }}
      data-ocid="hero.section"
    >
      <div
        className="relative w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#fde3ec] via-[#fff] to-[#f6e6f7]"
        style={{
          minHeight: 'auto',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          borderRadius: '20px',
          boxShadow: '0 8px 48px 0 rgba(241,38,122,0.10)',
          border: 'none',
          marginTop: '0',
          paddingTop: '0',
        }}
      >
        <div className="relative w-full h-full">
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 animate-gradient-move bg-[linear-gradient(120deg,#fde3ec_0%,#f76aa6_50%,#a18cd1_100%)] opacity-20 mix-blend-multiply rounded-t-xl rounded-b-2xl z-0"
            style={{ backgroundSize: '200% 200%' }}
          />
          <motion.div
            className="w-full flex items-center justify-center aspect-[1.5/1] min-h-[180px] max-h-[260px] sm:aspect-[2.2/1] sm:min-h-[320px] sm:max-h-[420px] lg:aspect-[2.8/1] lg:min-h-[420px] lg:max-h-[650px] xl:max-h-[700px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white"
            style={{
              boxShadow: '0 8px 48px 0 rgba(241,38,122,0.10)',
              width: '100vw',
              maxWidth: '100vw',
            }}
          >
            <motion.img
              src={slide.imageUrl}
              alt={slide.headline}
              className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
              style={{ background: '#fff' }}
              loading="eager"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </motion.div>
        </div>
        {/* Stylish navigation arrows */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 border-2 border-brand-pink/30 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all shadow-lg"
          data-ocid="hero.pagination_prev"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} className="sm:w-[22px] sm:h-[22px]" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 border-2 border-brand-pink/30 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all shadow-lg"
          data-ocid="hero.pagination_next"
          aria-label="Next slide"
        >
          <ChevronRight size={18} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      </div>
      {/* Dots - stylish */}
      <div className="flex items-center justify-center gap-3 py-2 sm:py-4 bg-transparent">
        {slides.map((s, i) => (
          <button
            type="button"
            key={s.id}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`transition-all duration-300 rounded-full border-2 ${
              i === current
                ? 'bg-brand-pink border-brand-pink w-7 h-3 shadow-md'
                : 'bg-brand-bg border-brand-pink/30 w-3 h-3'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
