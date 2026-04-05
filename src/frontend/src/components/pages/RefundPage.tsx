import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";

const steps = [
  {
    step: "1",
    title: "Contact Us",
    desc: "Email hello@zilaskin.com or call +91 98765 43210 within 7 days of delivery.",
  },
  {
    step: "2",
    title: "Share Details",
    desc: "Provide your order ID, reason for return, and photos of the product if damaged.",
  },
  {
    step: "3",
    title: "Pickup Arranged",
    desc: "Our team will arrange a reverse pickup from your address within 2–3 business days.",
  },
  {
    step: "4",
    title: "Refund Processed",
    desc: "Once the product is received and inspected, refund is processed in 5–7 business days.",
  },
];

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Navbar currentPage="refund" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="mb-10">
          <span className="text-brand-pink text-xs font-bold tracking-[0.2em] uppercase">
            Policies
          </span>
          <h1 className="font-serif text-4xl font-bold text-brand-text mt-2 mb-3">
            Refund Policy
          </h1>
          <p className="text-brand-text-muted text-sm">
            Last updated: January 1, 2025
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#FDE3EC] to-[#FFF5F9] rounded-2xl p-6 mb-10">
          <p className="font-semibold text-brand-text mb-1">
            7-Day Return Window
          </p>
          <p className="text-brand-text-muted text-sm">
            We accept returns within 7 days of delivery for damaged, defective,
            or incorrect items.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          <div>
            <h2 className="font-semibold text-brand-text text-lg mb-3">
              Eligible for Return
            </h2>
            <ul className="space-y-2 text-brand-text-muted text-sm">
              {[
                "Damaged or broken products",
                "Wrong product delivered",
                "Missing items in order",
                "Product expired before delivery",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-brand-text text-lg mb-3">
              Not Eligible for Return
            </h2>
            <ul className="space-y-2 text-brand-text-muted text-sm">
              {[
                "Opened or used products",
                "Products returned after 7 days",
                "Items without original packaging",
                "Sale or discounted items (unless damaged)",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="font-semibold text-brand-text text-xl mb-6">
            How to Return — 4 Easy Steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-brand-pink text-white font-bold text-sm flex items-center justify-center mb-3">
                  {s.step}
                </div>
                <p className="font-semibold text-brand-text mb-1">{s.title}</p>
                <p className="text-sm text-brand-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-brand-text-muted">
          <div>
            <h2 className="font-semibold text-brand-text text-lg mb-2">
              Refund Timeline
            </h2>
            <p className="text-sm">
              Refunds are processed to the original payment method. Online
              payments: 5–7 business days. COD orders: Bank transfer within 7–10
              business days.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand-text text-lg mb-2">
              Exchange Policy
            </h2>
            <p className="text-sm">
              We offer exchanges for the same product in case of damage.
              Exchanges are subject to availability.
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-brand-accent rounded-2xl">
          <p className="text-sm text-brand-text">
            Need help with a return? Email us at{" "}
            <a
              href="mailto:hello@zilaskin.com"
              className="text-brand-pink font-medium hover:underline"
            >
              hello@zilaskin.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
