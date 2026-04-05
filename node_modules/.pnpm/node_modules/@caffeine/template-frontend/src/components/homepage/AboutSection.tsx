import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

const values = [
  {
    emoji: "🧪",
    title: "Science-Backed",
    desc: "Clinically tested, dermatologist-approved ingredients that deliver real results.",
  },
  {
    emoji: "🌿",
    title: "Clean Beauty",
    desc: "Free from parabens, sulphates, and harmful chemicals. Safe for everyday use.",
  },
  {
    emoji: "💝",
    title: "Inclusive",
    desc: "Formulated for all skin types and tones — because everyone deserves great skin.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-16 lg:py-24 bg-gradient-to-b from-brand-accent/40 to-brand-bg"
      data-ocid="about.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-brand-pink text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          >
            Our Story
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text mb-6 leading-tight"
          >
            Skin Science That
            <br className="hidden sm:block" />
            <span className="text-brand-pink"> Actually Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-brand-text-muted text-base lg:text-lg leading-relaxed mb-4"
          >
            Zila Skin was born from a simple belief — that effective skincare
            shouldn't be complicated or inaccessible. Founded by a team of
            dermatologists and skincare enthusiasts, we set out to create
            science-backed formulas that deliver real, visible results for every
            skin type.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="text-brand-text-muted text-base lg:text-lg leading-relaxed mb-8"
          >
            Every product is carefully formulated with clinically proven
            ingredients, dermatologist tested, and free from harmful chemicals.
            We believe your skin deserves the best — and that's exactly what we
            deliver.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="rounded-full border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white px-8"
              data-ocid="about.button"
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 lg:p-8 text-center shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              data-ocid="about.card"
            >
              <span className="text-4xl mb-4 block">{v.emoji}</span>
              <h3 className="font-semibold text-base lg:text-lg text-brand-text mb-2">
                {v.title}
              </h3>
              <p className="text-brand-text-muted text-sm leading-relaxed">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
