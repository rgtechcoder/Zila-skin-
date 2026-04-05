import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";

const values = [
  {
    emoji: "🌿",
    title: "Clean Formulations",
    desc: "Every product is free from parabens, sulfates, and harmful chemicals. We believe your skin deserves nothing but the best.",
  },
  {
    emoji: "🔬",
    title: "Science-Backed",
    desc: "Our formulas are developed in collaboration with dermatologists and skin scientists to deliver visible, proven results.",
  },
  {
    emoji: "🌸",
    title: "Cruelty Free",
    desc: "We are committed to 100% cruelty-free practices. No animal testing, ever.",
  },
  {
    emoji: "🇮🇳",
    title: "Made in India",
    desc: "Proudly manufactured in India, crafted for Indian skin types and climate conditions.",
  },
];

const team = [
  { name: "Priya Sharma", role: "Founder & CEO", initials: "PS" },
  { name: "Dr. Ankit Gupta", role: "Chief Dermatologist", initials: "AG" },
  { name: "Neha Verma", role: "Head of R&D", initials: "NV" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Navbar currentPage="about" />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#FDE3EC] via-[#FFF5F9] to-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,#F1267A_0%,transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block text-brand-pink text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Our Story
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-brand-text leading-tight mb-6">
            Skincare Born in <span className="text-brand-pink">Indore</span>,
            <br />
            Designed for You
          </h1>
          <p className="text-brand-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Zila Skin was founded with a single belief — premium skincare should
            be accessible, effective, and honest. No fluff, no fillers. Just
            results.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-pink text-xs font-bold tracking-[0.2em] uppercase">
                How It Began
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-text mt-3 mb-6">
                From a Small Lab to Your Skin
              </h2>
              <div className="space-y-4 text-brand-text-muted leading-relaxed">
                <p>
                  In 2022, frustrated with overpriced international skincare
                  brands that weren't formulated for Indian skin, our founder
                  Priya Sharma set out to create something different. Something
                  local, effective, and transparent.
                </p>
                <p>
                  Working with a team of dermatologists and cosmetic chemists in
                  Indore, we developed a line of skincare products that address
                  the real concerns of Indian consumers — hyperpigmentation,
                  humidity, sun damage, and sensitivity.
                </p>
                <p>
                  Today, Zila Skin has helped thousands of customers achieve
                  healthier, more confident skin. Every product is a promise:
                  clean, honest, and built for you.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FDE3EC] to-[#FFF5F9] rounded-3xl p-10 flex items-center justify-center">
              <div className="relative flex flex-col items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Zila Skin Logo Premium"
                  className="h-32 w-32 object-contain rounded-full border-4 border-pink-100 shadow-2xl bg-white"
                  style={{ boxShadow: '0 0 40px 0 #f76aa6, 0 8px 32px 0 rgba(241,38,122,0.10)' }}
                />
                <span className="mt-4 text-lg font-serif font-semibold text-brand-pink tracking-wide drop-shadow-sm">Zila Skin</span>
                <span className="text-xs text-brand-text-muted mt-1">Premium Skincare • Honest Beauty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#FFF5F9] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-pink text-xs font-bold tracking-[0.2em] uppercase">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-text mt-3">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{v.emoji}</div>
                <h3 className="font-semibold text-brand-text mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team section removed as requested */}

      {/* CTA - fixed for visibility */}
      <section className="py-16 bg-gradient-to-r from-[#f1267a] via-[#f76aa6] to-[#fde3ec]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4 drop-shadow-lg">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-white/90 mb-8 drop-shadow-md">
            Explore our curated range of skincare products crafted just for you.
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.hash = "#shop";
            }}
            className="bg-brand-pink text-white font-bold px-10 py-3 rounded-full hover:bg-white hover:text-brand-pink transition-colors shadow-lg"
            data-ocid="about.primary_button"
          >
            Shop Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
