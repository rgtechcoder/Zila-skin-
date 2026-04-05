import { motion } from "motion/react";

const concerns = [
  { label: "Hydration", emoji: "💧", desc: "Quench dry skin" },
  { label: "Brightening", emoji: "✨", desc: "Even skin tone" },
  { label: "Anti-Aging", emoji: "🌿", desc: "Turn back time" },
  { label: "Acne-Prone", emoji: "🫧", desc: "Clear & calm" },
  { label: "Pigmentation", emoji: "🔆", desc: "Fade dark spots" },
  { label: "Sensitivity", emoji: "🌸", desc: "Gentle care" },
];

export default function ShopByConcern() {
  function handleConcern(label: string) {
    sessionStorage.setItem("zilaShopConcern", label);
    sessionStorage.removeItem("zilaShopCategory");
    sessionStorage.removeItem("zilaShopSearch");
    window.location.hash = "#shop";
  }

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
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-6">
          {concerns.map((c, i) => (
            <motion.button
              type="button"
              key={c.label}
              onClick={() => handleConcern(c.label)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="group flex flex-col items-center gap-2 py-4 sm:py-5 px-2 sm:px-3 rounded-2xl bg-white hover:bg-brand-pink transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_8px_24px_rgba(241,38,122,0.22)] text-left w-full"
              data-ocid={`concern.item.${i + 1}`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-accent group-hover:bg-white/20 flex items-center justify-center text-xl sm:text-2xl transition-colors duration-300">
                {c.emoji}
              </div>
              <div className="text-center min-w-0">
                <p className="font-semibold text-xs sm:text-sm text-brand-text group-hover:text-white transition-colors break-words">
                  {c.label}
                </p>
                <p className="text-[10px] sm:text-xs text-brand-text-muted group-hover:text-white/80 mt-0.5 transition-colors hidden sm:block">
                  {c.desc}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
