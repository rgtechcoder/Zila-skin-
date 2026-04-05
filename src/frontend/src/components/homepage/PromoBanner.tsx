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
              "linear-gradient(135deg, #FDE3EC 0%, #F76AA6 60%, #F1267A 100%)",
          }}
        >
          {/* Decorative blobs - clipped by overflow-hidden on parent */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/10 translate-y-1/3 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-brand-pink/20" />

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
                  src="product - Barrier Repair cleaneser.jpg"
                  alt="Barrier Repair Cleanser"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Center text */}
            <div className="flex flex-col items-center text-center gap-4 flex-1">
              <span className="text-white/80 text-xs font-semibold tracking-[0.2em] uppercase">
                Science Meets Nature
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight whitespace-pre-line">
                {"Lab & Leaf\nby Zila Skin"}
              </h2>
              <p className="text-white/85 text-sm sm:text-base max-w-md leading-relaxed">
                Science-backed formulas crafted with botanical extracts —
                Vitamin C, Niacinamide, Glutathione & more. Visible results from
                day one.
              </p>
              <a
                href="/"
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
                  src="product - vitamin c serum.jpg"
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
