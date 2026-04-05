import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronRight,
  Droplets,
  Heart,
  Leaf,
  Package,
  RefreshCw,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const PRODUCT_IMAGES = [
  "/assets/uploads/whatsapp_image_2026-03-21_at_8.26.00_pm-019d216e-a4ca-73de-8587-623abfcbffe4-7.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-21_at_8.26.00_pm_3-019d216e-808e-76ab-9899-e35652a1a476-1.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-21_at_8.25.59_pm_2-019d216e-8655-75c4-90fc-8395dd1d83f6-5.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-21_at_8.26.00_pm_1-019d216e-8646-71ec-934b-8a0238624d7b-4.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-21_at_8.26.01_pm-019d216e-8e15-725f-8e61-e65fba3f419a-6.jpeg",
  "/assets/uploads/whatsapp_image_2026-03-21_at_8.26.00_pm_2-019d216e-83cf-74e1-9f96-e81a94b4784d-2.jpeg",
];

const THUMBNAILS = [
  { id: "niac", src: PRODUCT_IMAGES[0] },
  { id: "vitc", src: PRODUCT_IMAGES[1] },
  { id: "rice", src: PRODUCT_IMAGES[2] },
  { id: "spf", src: PRODUCT_IMAGES[3] },
];

const FAQS = [
  {
    id: "faq-daily",
    q: "Can I use this serum every day?",
    a: "Yes. Niacinamide is gentle enough for daily use, both morning and night. Begin with once daily if you have sensitive skin and build up gradually.",
  },
  {
    id: "faq-vitc",
    q: "Can I use it with Vitamin C?",
    a: "Modern formulations allow combining Niacinamide and Vitamin C without the flushing risk. Apply Vitamin C first, wait 15\u201320 minutes, then apply this serum.",
  },
  {
    id: "faq-results",
    q: "How long before I see results?",
    a: "Most users notice improved texture and reduced shine within 2 weeks. Pore size and dark spots show visible improvement at the 4\u20138 week mark with consistent use.",
  },
  {
    id: "faq-sensitive",
    q: "Is this serum suitable for sensitive skin?",
    a: "Yes. The formula is fragrance-free, alcohol-free, and dermatologically tested. Always patch-test before full application if you have very reactive skin.",
  },
  {
    id: "faq-spf",
    q: "Can I use this under SPF?",
    a: "Absolutely. Apply this serum after cleansing and toning, follow with moisturiser, and finish with SPF 30+ during the day. It layers beautifully under sunscreen.",
  },
];

const RELATED_PRODUCTS = [
  {
    id: 1,
    name: "Vitamin C+E Cleanser",
    desc: "Brightening gentle foam cleanser",
    price: 499,
    originalPrice: 649,
    rating: 4.3,
    reviews: 876,
    image: PRODUCT_IMAGES[1],
    badge: "",
  },
  {
    id: 2,
    name: "Rice Water Toner",
    desc: "Soothing & hydrating essence",
    price: 549,
    originalPrice: 699,
    rating: 4.6,
    reviews: 1050,
    image: PRODUCT_IMAGES[2],
    badge: "New",
  },
  {
    id: 3,
    name: "SPF 50+ Sunscreen",
    desc: "Lightweight, no white cast",
    price: 799,
    originalPrice: 999,
    rating: 4.7,
    reviews: 2100,
    image: PRODUCT_IMAGES[3],
    badge: "Bestseller",
  },
  {
    id: 4,
    name: "Vitamin C Moisturizer",
    desc: "Brightens & deeply hydrates",
    price: 899,
    originalPrice: 1199,
    rating: 4.4,
    reviews: 540,
    image: PRODUCT_IMAGES[4],
    badge: "",
  },
];

const FBT_PRODUCTS = [
  { name: "Niacinamide 10% Serum", price: 649, image: PRODUCT_IMAGES[0] },
  { name: "Rice Water Toner", price: 549, image: PRODUCT_IMAGES[2] },
  { name: "SPF 50+ Sunscreen", price: 799, image: PRODUCT_IMAGES[3] },
];

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= Math.floor(rating);
        const partial = !filled && s === Math.ceil(rating) && rating % 1 !== 0;
        return (
          <span
            key={s}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Star
              size={size}
              className="fill-gray-200 text-gray-200 absolute inset-0"
            />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? "50%" : "100%" }}
              >
                <Star size={size} className="fill-amber-400 text-amber-400" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function SectionWrapper({
  children,
  delay = 0,
}: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

function goHome() {
  window.location.hash = "";
}

function goShop() {
  window.location.hash = "#shop";
}

export default function ProductDetailPage() {
  const [mainImage, setMainImage] = useState(PRODUCT_IMAGES[0]);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [fbtAdded, setFbtAdded] = useState(false);

  const handleAddToCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleFbtAdd = () => {
    setFbtAdded(true);
    setTimeout(() => setFbtAdded(false), 2000);
  };

  return (
    <div
      className="bg-brand-bg min-h-screen pb-20 lg:pb-0 overflow-x-hidden"
      data-ocid="product.page"
    >
      {/* ── TOP SECTION ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs text-brand-text-muted mb-8"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            onClick={goHome}
            className="hover:text-brand-pink transition-colors"
            data-ocid="product.link"
          >
            Home
          </button>
          <ChevronRight size={12} />
          <button
            type="button"
            onClick={goShop}
            className="hover:text-brand-pink transition-colors"
            data-ocid="product.link"
          >
            Shop
          </button>
          <ChevronRight size={12} />
          <span className="text-brand-text font-medium">
            Niacinamide 10% Serum
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── LEFT: Image Gallery ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-[#fdf6f9] rounded-2xl flex items-center justify-center p-5 sm:p-8 min-h-[280px] sm:min-h-[380px] md:min-h-[440px]">
              <img
                src={mainImage}
                alt="Niacinamide 10% Serum"
                className="w-full h-full max-h-[420px] object-contain transition-all duration-300"
                data-ocid="product.canvas_target"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {THUMBNAILS.map((thumb, i) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => setMainImage(thumb.src)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden bg-[#fdf6f9] flex items-center justify-center p-2 border-2 transition-all duration-200 ${
                    mainImage === thumb.src
                      ? "border-brand-pink shadow-soft"
                      : "border-transparent hover:border-brand-pink/40"
                  }`}
                  data-ocid={`product.button.${i + 1}`}
                  aria-label={`Product image ${i + 1}`}
                >
                  <img
                    src={thumb.src}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Product Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <span className="inline-flex self-start bg-brand-pink/10 text-brand-pink text-xs font-bold px-3 py-1 rounded-full tracking-wide">
              BESTSELLER
            </span>

            <div>
              <h1 className="font-serif-display text-xl sm:text-2xl lg:text-3xl font-bold text-brand-text leading-snug">
                Niacinamide 10% + Zinc PCA Serum
              </h1>
              <p className="mt-2 text-sm text-brand-text-muted">
                Minimises pores, controls sebum & evens skin tone
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StarDisplay rating={4.5} size={15} />
              <span className="text-sm text-brand-text font-semibold">4.5</span>
              <span className="text-sm text-brand-text-muted">
                (1,240 reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 py-3 border-t border-b border-border/40">
              <span className="font-bold text-brand-text text-2xl">₹649</span>
              <span className="text-sm text-brand-text-muted line-through">
                ₹849
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                -24% OFF
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-brand-text">
                Quantity
              </span>
              <div className="flex items-center gap-2 border border-border rounded-full px-1 py-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-brand-text hover:bg-brand-accent transition-colors font-bold text-lg"
                  data-ocid="product.button"
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <span
                  className="w-8 text-center text-sm font-semibold text-brand-text"
                  data-ocid="product.input"
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-brand-text hover:bg-brand-accent transition-colors font-bold text-lg"
                  data-ocid="product.button"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    cartAdded
                      ? "bg-emerald-500 text-white"
                      : "bg-brand-pink text-white hover:bg-brand-pink/90 shadow-soft"
                  }`}
                  data-ocid="product.primary_button"
                >
                  <ShoppingBag size={16} />
                  {cartAdded ? "Added to Cart!" : "Add to Cart"}
                </button>
                <button
                  type="button"
                  onClick={() => setWishlisted((w) => !w)}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-brand-pink transition-colors"
                  data-ocid="product.toggle"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={16}
                    className={
                      wishlisted
                        ? "fill-brand-pink text-brand-pink"
                        : "text-brand-text-muted"
                    }
                  />
                </button>
              </div>
              <button
                type="button"
                className="w-full py-3.5 rounded-full font-semibold text-sm border-2 border-brand-text text-brand-text hover:bg-brand-text hover:text-white transition-all duration-300"
                data-ocid="product.secondary_button"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-1 py-4 border-t border-border/40">
              {[
                { icon: Truck, label: "Free Delivery", sub: "On orders ₹499+" },
                {
                  icon: Shield,
                  label: "100% Authentic",
                  sub: "Verified quality",
                },
                {
                  icon: RefreshCw,
                  label: "Easy Returns",
                  sub: "7-day hassle-free",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-accent/60 flex items-center justify-center">
                    <Icon size={15} className="text-brand-pink" />
                  </div>
                  <span className="text-xs font-semibold text-brand-text">
                    {label}
                  </span>
                  <span className="text-[10px] text-brand-text-muted">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BELOW SECTIONS ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* 1. Key Benefits */}
        <SectionWrapper>
          <section className="py-14 border-t border-border/40">
            <h2 className="font-serif-display text-xl lg:text-3xl font-bold text-brand-text mb-6 lg:mb-8">
              Key Benefits
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Sparkles,
                  title: "Minimises Enlarged Pores",
                  desc: "Niacinamide tightens pores visibly within 4 weeks of consistent use.",
                },
                {
                  icon: Droplets,
                  title: "Controls Excess Sebum",
                  desc: "Regulates oil production to keep skin matte and balanced all day.",
                },
                {
                  icon: Shield,
                  title: "Fades Dark Spots",
                  desc: "Inhibits melanin transfer to visibly lighten blemishes and hyperpigmentation.",
                },
                {
                  icon: Zap,
                  title: "Strengthens Skin Barrier",
                  desc: "Boosts ceramide synthesis for a resilient, moisturised, healthy skin barrier.",
                },
                {
                  icon: Leaf,
                  title: "Calms Redness & Irritation",
                  desc: "Anti-inflammatory properties soothe acne-prone and sensitive skin types.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 rounded-2xl bg-white border border-border/50 hover:shadow-card transition-shadow"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-accent/70 flex items-center justify-center">
                    <Icon size={18} className="text-brand-pink" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-text mb-1">
                      {title}
                    </h3>
                    <p className="text-xs text-brand-text-muted leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {/* 2. Ingredients */}
        <SectionWrapper delay={0.05}>
          <section className="py-14 border-t border-border/40">
            <h2 className="font-serif-display text-xl lg:text-3xl font-bold text-brand-text mb-3">
              Key Ingredients
            </h2>
            <p className="text-sm text-brand-text-muted mb-8">
              Clinically studied actives in effective concentrations.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Niacinamide 10%",
                  note: "Pore-minimising, oil-control",
                  color: "bg-pink-50 border-pink-100",
                },
                {
                  name: "Zinc PCA",
                  note: "Sebum-regulating, anti-bacterial",
                  color: "bg-purple-50 border-purple-100",
                },
                {
                  name: "Hyaluronic Acid",
                  note: "Deep hydration, plumping",
                  color: "bg-blue-50 border-blue-100",
                },
                {
                  name: "Panthenol",
                  note: "Barrier repair, soothing",
                  color: "bg-green-50 border-green-100",
                },
              ].map(({ name, note, color }) => (
                <div
                  key={name}
                  className={`rounded-2xl border p-5 ${color} hover:shadow-card transition-shadow`}
                >
                  <h3 className="text-sm font-bold text-brand-text mb-1.5">
                    {name}
                  </h3>
                  <p className="text-xs text-brand-text-muted">{note}</p>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {/* 3. How to Use */}
        <SectionWrapper delay={0.05}>
          <section className="py-14 border-t border-border/40">
            <h2 className="font-serif-display text-xl lg:text-3xl font-bold text-brand-text mb-6 lg:mb-8">
              How to Use
            </h2>
            <div className="flex flex-col gap-5">
              {[
                {
                  step: "01",
                  title: "Cleanse",
                  desc: "Start with a freshly cleansed face. Pat dry gently \u2014 do not rub.",
                },
                {
                  step: "02",
                  title: "Tone (Optional)",
                  desc: "Apply a hydrating toner to prep skin and boost serum absorption.",
                },
                {
                  step: "03",
                  title: "Apply Serum",
                  desc: "Dispense 3\u20134 drops and gently press into face, neck, and d\u00e9colletage. Avoid eye area.",
                },
                {
                  step: "04",
                  title: "Moisturise & Protect",
                  desc: "Follow with your moisturiser. Apply SPF 30+ in the morning as the last step.",
                },
              ].map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="flex gap-5 p-5 rounded-2xl bg-white border border-border/50"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-brand-pink flex items-center justify-center text-white text-xs font-bold">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-text mb-1">
                      {title}
                    </h3>
                    <p className="text-xs text-brand-text-muted leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {/* 4. Suitable For */}
        <SectionWrapper delay={0.05}>
          <section className="py-14 border-t border-border/40">
            <h2 className="font-serif-display text-xl lg:text-3xl font-bold text-brand-text mb-6 lg:mb-8">
              Suitable For
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-brand-text-muted mb-3">
                  Skin Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Oily Skin",
                    "Combination Skin",
                    "Acne-Prone Skin",
                    "Normal Skin",
                  ].map((t) => (
                    <span
                      key={t}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-accent text-brand-pink border border-brand-pink/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-brand-text-muted mb-3">
                  Skin Concerns
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Enlarged Pores",
                    "Excess Sebum",
                    "Uneven Skin Tone",
                    "Dark Spots",
                    "Dullness",
                  ].map((c) => (
                    <span
                      key={c}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-brand-text border border-border"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* 5. FAQ */}
        <SectionWrapper delay={0.05}>
          <section className="py-14 border-t border-border/40">
            <h2 className="font-serif-display text-xl lg:text-3xl font-bold text-brand-text mb-6 lg:mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="space-y-3"
              data-ocid="product.panel"
            >
              {FAQS.map(({ id, q, a }, i) => (
                <AccordionItem
                  key={id}
                  value={id}
                  className="bg-white border border-border/50 rounded-2xl px-5 overflow-hidden"
                  data-ocid={`product.item.${i + 1}`}
                >
                  <AccordionTrigger className="text-sm font-semibold text-brand-text py-4 hover:no-underline">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-brand-text-muted leading-relaxed pb-4">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </SectionWrapper>

        {/* 6. Reviews */}
        <SectionWrapper delay={0.05}>
          <section className="py-14 border-t border-border/40">
            <h2 className="font-serif-display text-xl lg:text-3xl font-bold text-brand-text mb-6 lg:mb-8">
              Customer Reviews
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-white rounded-2xl border border-border/50">
              <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                <span className="font-serif-display text-5xl font-bold text-brand-text">
                  4.5
                </span>
                <StarDisplay rating={4.5} size={18} />
                <span className="text-xs text-brand-text-muted">
                  Based on 1,240 reviews
                </span>
              </div>
              <div className="flex flex-col gap-2 flex-1 justify-center">
                {[
                  { star: 5, pct: 62 },
                  { star: 4, pct: 22 },
                  { star: 3, pct: 9 },
                  { star: 2, pct: 4 },
                  { star: 1, pct: 3 },
                ].map(({ star, pct }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs text-brand-text-muted w-4 text-right">
                      {star}
                    </span>
                    <Star
                      size={11}
                      className="fill-amber-400 text-amber-400 shrink-0"
                    />
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-brand-text-muted w-8">
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  name: "Priya S.",
                  initials: "PS",
                  rating: 5,
                  date: "March 2026",
                  text: "My skin has never looked better! Pores are visibly smaller and my skin is so much smoother. Will definitely repurchase.",
                },
                {
                  name: "Rhea K.",
                  initials: "RK",
                  rating: 4,
                  date: "February 2026",
                  text: "Noticed a real difference in my oily T-zone after just 2 weeks. Lightweight and absorbs instantly \u2014 no sticky feeling.",
                },
                {
                  name: "Ananya M.",
                  initials: "AM",
                  rating: 5,
                  date: "January 2026",
                  text: "Best serum I\u2019ve tried at this price point. My dark spots from old acne are finally fading. Skin feels balanced all day.",
                },
              ].map(({ name, initials, rating, date, text }) => (
                <div
                  key={name}
                  className="p-5 bg-white rounded-2xl border border-border/50 flex flex-col gap-3"
                  data-ocid="product.card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-pink flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-text">
                        {name}
                      </p>
                      <p className="text-xs text-brand-text-muted">{date}</p>
                    </div>
                  </div>
                  <StarDisplay rating={rating} size={13} />
                  <p className="text-xs text-brand-text-muted leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {/* 7. Related Products */}
        <SectionWrapper delay={0.05}>
          <section className="py-14 border-t border-border/40">
            <h2 className="font-serif-display text-xl lg:text-3xl font-bold text-brand-text mb-6 lg:mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {RELATED_PRODUCTS.map((product, i) => {
                const disc = Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100,
                );
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    data-ocid={`product.item.${i + 1}`}
                  >
                    {product.badge && (
                      <span className="absolute text-[10px] top-2 left-2 z-10 bg-brand-pink text-white px-2 py-0.5 rounded-full font-bold">
                        {product.badge}
                      </span>
                    )}
                    <div className="aspect-square bg-[#fdf6f9] flex items-center justify-center p-5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-4/5 h-4/5 object-contain"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-1.5">
                      <p className="text-xs font-bold text-brand-text leading-snug">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-brand-text-muted">
                        {product.desc}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <StarDisplay rating={product.rating} size={11} />
                        <span className="text-[10px] text-brand-text-muted">
                          ({product.reviews.toLocaleString()})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="font-bold text-brand-text text-sm">
                          ₹{product.price}
                        </span>
                        <span className="text-[11px] text-brand-text-muted line-through">
                          ₹{product.originalPrice}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          -{disc}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </SectionWrapper>

        {/* 8. Frequently Bought Together */}
        <SectionWrapper delay={0.05}>
          <section className="py-14 border-t border-border/40">
            <h2 className="font-serif-display text-xl lg:text-3xl font-bold text-brand-text mb-6 lg:mb-8">
              Frequently Bought Together
            </h2>
            <div className="bg-white rounded-2xl border border-border/50 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                {FBT_PRODUCTS.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2 w-28">
                      <div className="w-24 h-24 rounded-xl bg-[#fdf6f9] flex items-center justify-center p-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs font-semibold text-brand-text text-center leading-tight">
                        {p.name}
                      </p>
                      <p className="text-xs text-brand-pink font-bold">
                        ₹{p.price}
                      </p>
                    </div>
                    {i < FBT_PRODUCTS.length - 1 && (
                      <span className="text-xl font-bold text-brand-text-muted">
                        +
                      </span>
                    )}
                  </div>
                ))}
                <span className="text-xl font-bold text-brand-text-muted mx-2">
                  =
                </span>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs text-brand-text-muted">Total</p>
                  <p className="text-xl font-bold text-brand-text">
                    ₹
                    {FBT_PRODUCTS.reduce(
                      (s, p) => s + p.price,
                      0,
                    ).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    Save ₹148 overall
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleFbtAdd}
                  className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    fbtAdded
                      ? "bg-emerald-500 text-white"
                      : "bg-brand-pink text-white hover:bg-brand-pink/90 shadow-soft"
                  }`}
                  data-ocid="product.primary_button"
                >
                  {fbtAdded ? "Added All to Cart!" : "Add All to Cart"}
                </button>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* 9. Trust Badges */}
        <SectionWrapper delay={0.05}>
          <section className="py-14 border-t border-border/40">
            <div className="bg-brand-accent/40 rounded-2xl px-6 py-8">
              <h2 className="font-serif-display text-xl lg:text-2xl font-bold text-brand-text mb-6 text-center">
                Why Choose Zila Skin
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    icon: Shield,
                    title: "Dermatologically Tested",
                    sub: "Clinically verified for safety",
                  },
                  {
                    icon: Heart,
                    title: "Cruelty Free",
                    sub: "Never tested on animals",
                  },
                  {
                    icon: Leaf,
                    title: "No Parabens",
                    sub: "Free from harmful preservatives",
                  },
                  {
                    icon: Package,
                    title: "Dermatologist Recommended",
                    sub: "Trusted by skin professionals",
                  },
                ].map(({ icon: Icon, title, sub }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center text-center gap-3 p-4 bg-white rounded-2xl border border-brand-pink/10"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-pink/10 flex items-center justify-center">
                      <Icon size={20} className="text-brand-pink" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-text mb-0.5">
                        {title}
                      </p>
                      <p className="text-[11px] text-brand-text-muted">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionWrapper>
      </div>

      {/* ── Mobile Sticky CTA ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/50 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        data-ocid="product.panel"
      >
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
            cartAdded
              ? "bg-emerald-500 text-white"
              : "bg-brand-pink text-white shadow-soft"
          }`}
          data-ocid="product.primary_button"
        >
          <ShoppingBag size={16} />
          {cartAdded ? "Added to Cart!" : "Add to Cart \u2014 ₹649"}
        </button>
      </div>
    </div>
  );
}
