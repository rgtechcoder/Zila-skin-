import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";

const zones = [
  {
    zone: "Metro Cities",
    cities: "Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata",
    days: "2–4 business days",
  },
  {
    zone: "Tier 2 Cities",
    cities: "Indore, Pune, Ahmedabad, Jaipur, Lucknow and more",
    days: "3–5 business days",
  },
  {
    zone: "Rest of India",
    cities: "All other serviceable PIN codes",
    days: "5–7 business days",
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Navbar currentPage="shipping" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="mb-10">
          <span className="text-brand-pink text-xs font-bold tracking-[0.2em] uppercase">
            Policies
          </span>
          <h1 className="font-serif text-4xl font-bold text-brand-text mt-2 mb-3">
            Shipping Policy
          </h1>
          <p className="text-brand-text-muted text-sm">
            Last updated: January 1, 2025
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            {
              emoji: "🚚",
              title: "Free Shipping",
              desc: "On all orders above ₹499",
            },
            {
              emoji: "📦",
              title: "Order Processing",
              desc: "1–2 business days",
            },
            {
              emoji: "🔍",
              title: "Order Tracking",
              desc: "Track via email link",
            },
            {
              emoji: "📍",
              title: "Pan India Delivery",
              desc: "We ship to all serviceable PIN codes",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4"
            >
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <p className="font-semibold text-brand-text">{f.title}</p>
                <p className="text-sm text-brand-text-muted mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="font-semibold text-brand-text text-xl mb-5">
            Delivery Timeline by Zone
          </h2>
          <div className="space-y-3">
            {zones.map((z) => (
              <div
                key={z.zone}
                className="bg-white rounded-xl p-5 shadow-sm border border-border"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-brand-text">{z.zone}</p>
                  <span className="text-xs font-bold bg-brand-accent text-brand-pink px-3 py-1 rounded-full">
                    {z.days}
                  </span>
                </div>
                <p className="text-sm text-brand-text-muted">{z.cities}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 text-brand-text-muted">
          <div>
            <h2 className="font-semibold text-brand-text text-lg mb-2">
              Shipping Partners
            </h2>
            <p className="text-sm">
              We partner with reliable courier services including Delhivery,
              Blue Dart, and India Post to ensure safe and timely delivery.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand-text text-lg mb-2">
              Order Tracking
            </h2>
            <p className="text-sm">
              Once your order is shipped, you will receive an email with your
              tracking number and a link to track your shipment in real time.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand-text text-lg mb-2">
              Undeliverable Packages
            </h2>
            <p className="text-sm">
              If delivery is unsuccessful after 3 attempts, the package will be
              returned to us. We will contact you to arrange re-delivery.
              Additional shipping charges may apply.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand-text text-lg mb-2">
              Damaged in Transit
            </h2>
            <p className="text-sm">
              If your order arrives damaged, please contact us within 48 hours
              with photos. We will arrange a replacement or refund at no extra
              cost.
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-brand-accent rounded-2xl">
          <p className="text-sm text-brand-text">
            Shipping questions? Email us at{" "}
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
