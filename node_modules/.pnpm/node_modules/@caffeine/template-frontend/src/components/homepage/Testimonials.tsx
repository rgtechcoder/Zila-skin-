import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    initials: "PS",
    text: "Zila Skin's Vitamin C Serum has completely transformed my skin in just 3 weeks. My dark spots have faded noticeably and everyone keeps asking what I'm using. This is honestly the best skincare investment I've made.",
  },
  {
    id: 2,
    name: "Ananya Krishnan",
    location: "Bangalore",
    rating: 5,
    initials: "AK",
    text: "I've tried so many moisturisers but the Hydra Burst is in a different league. My skin feels plump and hydrated all day — even on AC-heavy office days. Repurchasing my 3rd jar already!",
  },
  {
    id: 3,
    name: "Meera Nair",
    location: "Delhi",
    rating: 5,
    initials: "MN",
    text: "As someone with sensitive skin, I was skeptical but the Ceramide Serum has become my holy grail. No irritation, no breakouts — just calm, happy skin. Zila Skin understands sensitive skin beautifully.",
  },
];

function Avatar({ initials, name }: { initials: string; name: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0 border border-brand-pink/20"
      aria-label={name}
    >
      <span className="text-xs font-bold text-brand-pink">{initials}</span>
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section
      className="py-16 lg:py-20 bg-brand-bg"
      data-ocid="testimonials.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-pink text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-brand-text">
            What Our Customers Say
          </h2>
        </div>

        {/* Desktop: 3 cards */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-7 shadow-card flex flex-col gap-5 hover:shadow-[0_8px_32px_rgba(241,38,122,0.10)] hover:-translate-y-1 transition-all duration-300"
              data-ocid={`testimonials.item.${i + 1}`}
            >
              <Quote size={28} className="text-brand-pink/40" />
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={
                      s <= t.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
              </div>
              <p className="text-brand-text-muted text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Avatar initials={t.initials} name={t.name} />
                <div>
                  <p className="text-sm font-semibold text-brand-text">
                    {t.name}
                  </p>
                  <p className="text-xs text-brand-text-muted">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[current].id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-card flex flex-col gap-4"
              >
                <Quote size={24} className="text-brand-pink/40" />
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={
                        s <= testimonials[current].rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-brand-text-muted text-sm leading-relaxed">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Avatar
                    initials={testimonials[current].initials}
                    name={testimonials[current].name}
                  />
                  <div>
                    <p className="text-sm font-semibold text-brand-text">
                      {testimonials[current].name}
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      {testimonials[current].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={prev}
              className="w-9 h-9 rounded-full border border-border hover:bg-brand-pink hover:border-brand-pink hover:text-white flex items-center justify-center transition-all duration-200"
              data-ocid="testimonials.pagination_prev"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? "bg-brand-pink w-5 h-2" : "bg-border w-2 h-2"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="w-9 h-9 rounded-full border border-border hover:bg-brand-pink hover:border-brand-pink hover:text-white flex items-center justify-center transition-all duration-200"
              data-ocid="testimonials.pagination_next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
