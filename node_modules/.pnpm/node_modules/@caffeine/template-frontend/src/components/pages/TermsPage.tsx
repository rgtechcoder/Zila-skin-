import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using the Zila Skin website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.",
  },
  {
    title: "2. Products and Services",
    content:
      "Zila Skin offers skincare products through its online store. We reserve the right to modify, suspend, or discontinue any product or service at any time without prior notice. Product descriptions and images are for illustrative purposes.",
  },
  {
    title: "3. Ordering and Payment",
    content:
      "All orders are subject to product availability. Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We accept payments via Razorpay (UPI, Cards, Net Banking) and Cash on Delivery (COD). Payment must be completed before order processing.",
  },
  {
    title: "4. Shipping and Delivery",
    content:
      "We ship to all serviceable PIN codes across India. Delivery timelines are 3–7 business days. Free shipping is available on orders above ₹499. We are not responsible for delays caused by courier partners or force majeure events.",
  },
  {
    title: "5. Returns and Refunds",
    content:
      "We offer a 7-day return policy for damaged, defective, or incorrect products. Products must be unused, unopened, and in original packaging. Refunds are processed within 5–7 business days to the original payment method.",
  },
  {
    title: "6. Intellectual Property",
    content:
      "All content on the Zila Skin website, including logos, product images, descriptions, and brand assets, are the exclusive property of Zila Skin and protected by intellectual property laws. Unauthorized use is prohibited.",
  },
  {
    title: "7. Privacy",
    content:
      "Your use of the website is also governed by our Privacy Policy. By using this website, you consent to the collection and use of your data as described in our Privacy Policy.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "Zila Skin shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the amount paid for the specific product in question.",
  },
  {
    title: "9. Changes to Terms",
    content:
      "We reserve the right to modify these Terms of Service at any time. Changes take effect immediately upon posting. Continued use of the website after changes constitutes acceptance of the new terms.",
  },
  {
    title: "10. Contact Us",
    content:
      "For any questions about these Terms of Service, please contact us at hello@zilaskin.com or call +91 98765 43210. Our address: Zila Skin, Indore, Madhya Pradesh, India 452001.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Navbar currentPage="terms" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="mb-10">
          <span className="text-brand-pink text-xs font-bold tracking-[0.2em] uppercase">
            Legal
          </span>
          <h1 className="font-serif text-4xl font-bold text-brand-text mt-2 mb-3">
            Terms of Service
          </h1>
          <p className="text-brand-text-muted text-sm">
            Last updated: January 1, 2025
          </p>
        </div>
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-semibold text-brand-text text-lg mb-2">
                {s.title}
              </h2>
              <p className="text-brand-text-muted leading-relaxed">
                {s.content}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 bg-brand-accent rounded-2xl">
          <p className="text-sm text-brand-text">
            Questions? Email us at{" "}
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
