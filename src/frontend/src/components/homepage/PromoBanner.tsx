import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function PromoBanner() {
  return (
    <section className="py-12 lg:py-20 bg-white" data-ocid="promo.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl w-full"
          style={{
            background:
              "radial-gradient(ellipse at 60% 40%, #fffbe9 0%, #ffe0f7 60%, #e0c3fc 100%)",
          }}
        >
          {/* Decorative luxury blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#e0c3fc]/40 blur-2xl animate-blob1" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#ffe0f7]/40 blur-2xl animate-blob2" />
          {/* Animated gold blob for premium shine */}
          <div className="absolute left-1/3 top-2/3 w-60 h-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffe066]/30 blur-3xl animate-blob3 z-0" />


          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 px-5 sm:px-8 lg:px-12 py-10 lg:py-16">
            {/* Left image with floating animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              animate={{
                y: [0, -10, 0, 10, 0],
                scale: [1, 1.04, 1, 0.96, 1],
              }}
              transition={{
                delay: 0.2,
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
              className="hidden lg:block w-48 xl:w-56 shrink-0"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
                <img
                  src="lab&leaf1.jpg"
                  alt="Barrier Repair Cleanser"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Center text with overlay for readability */}
            <div className="flex flex-col items-center text-center gap-4 flex-1 relative z-10">
              {/* Overlay behind text for contrast */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full max-h-80 bg-white/70 backdrop-blur-sm rounded-2xl -z-10" />
              <span
                className="text-neutral-800 text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ textShadow: '0 2px 16px rgba(255,255,255,0.18), 0 1px 1px rgba(255,255,255,0.10)' }}
              >
                Science Meets Nature
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl lg:text-6xl font-bold text-neutral-900 leading-tight whitespace-pre-line"
                style={{ textShadow: '0 2px 16px rgba(255,255,255,0.18), 0 1px 1px rgba(255,255,255,0.10)' }}
              >
                {"Lab & Leaf\nby Zila Skin"}
              </h2>
              <p
                className="text-neutral-700 text-sm sm:text-base max-w-md leading-relaxed"
                style={{ textShadow: '0 2px 16px rgba(255,255,255,0.18), 0 1px 1px rgba(255,255,255,0.10)' }}
              >
                Science-backed formulas crafted with botanical extracts —
                Vitamin C, Niacinamide, Glutathione & more. Visible results from
                day one.
              </p>
              <a
                href="#shop"
                className="inline-flex items-center gap-2.5 bg-white text-brand-pink font-bold text-sm px-8 py-3.5 rounded-full hover:bg-brand-bg transition-all duration-300 hover:scale-105 group"
                data-ocid="promo.primary_button"
              >
                SHOP THE COLLECTION
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>

            {/* Right image with floating animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              animate={{
                y: [0, 10, 0, -10, 0],
                scale: [1, 1.04, 1, 0.96, 1],
              }}
              transition={{
                delay: 0.2,
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
              className="hidden lg:block w-48 xl:w-56 shrink-0"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
                <img
                  src="lab&leaf2.jpg"
                  alt="Vitamin C Brightening Serum"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
