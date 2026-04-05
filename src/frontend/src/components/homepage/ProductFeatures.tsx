import { motion } from "motion/react";

const features = [
  {
    label: "Derma Tested",
    desc: "Clinically tested for safety and efficacy by dermatologists.",
  },
  {
    label: "Plant Bio Actives",
    desc: "Powered by potent plant-based actives for visible results.",
  },
  {
    label: "Cruelty Free",
    desc: "Certified by PETA. Absolutely no animal testing.",
  },
  {
    label: "Lab Innovation",
    desc: "Advanced, science-driven formulations for modern skincare.",
  },
];

export default function ProductFeatures() {
  return (
    <section
      className="my-12 py-10 px-4 rounded-3xl max-w-7xl mx-auto bg-gradient-to-r from-[#fde3ec] via-[#f3d0ff] to-[#fff] shadow-lg animate-gradient-x"
      data-ocid="product-features.section"
    >
      <h2 className="text-center mb-10">
        <motion.span
          className="inline-block text-3xl md:text-4xl font-playfair font-extrabold bg-gradient-to-r from-[#F1267A] via-[#9B59B6] to-[#F3D0FF] bg-clip-text text-transparent drop-shadow-lg animate-hero-gradient"
          initial={{ opacity: 0, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          animate={{
            backgroundPosition: [
              '0% 50%',
              '100% 50%',
              '0% 50%'
            ],
          }}
        >
          Zila Skin Product Features
        </motion.span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            whileHover={{ scale: 1.06, boxShadow: '0 8px 32px 0 #f3d0ff, 0 1.5px 8px #f1267a22' }}
            className="relative flex flex-col items-center justify-center text-center p-7 rounded-2xl bg-white/90 shadow-xl border border-[#f3d0ff] group overflow-hidden cursor-pointer transition-all duration-300"
          >
            {/* Animated floating gradient blob */}
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-[#f3d0ff] via-[#fde3ec] to-[#fff] opacity-60 blur-2xl group-hover:scale-125 group-hover:opacity-80 transition-all duration-500 z-0"
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="relative z-10 mb-2 text-brand-pink font-playfair text-xl md:text-2xl font-bold tracking-wide drop-shadow-sm group-hover:text-[#9B59B6] transition-colors duration-300"
              whileHover={{ color: '#9B59B6' }}
            >
              {f.label}
            </motion.div>
            <motion.div
              className="relative z-10 text-gray-600 text-base md:text-lg font-inter font-medium group-hover:text-brand-pink transition-colors duration-300"
              whileHover={{ color: '#F1267A' }}
            >
              {f.desc}
            </motion.div>
            {/* Subtle bottom glow */}
            <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-32 h-8 bg-pink-200/40 blur-2xl rounded-full z-0" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
