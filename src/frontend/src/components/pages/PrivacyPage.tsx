import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly to us when creating an account, placing an order, or contacting us. This includes: name, email address, phone number, shipping address, and payment information. We also collect usage data such as pages visited and browser type.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use collected information to: process and fulfill your orders, send order confirmations and updates, provide customer support, send promotional communications (with your consent), improve our products and website, and comply with legal obligations.",
  },
  {
    title: "3. Information Sharing",
    content:
      "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist in operating our website, such as payment processors (Razorpay) and shipping partners, subject to confidentiality agreements.",
  },
  {
    title: "4. Data Security",
    content:
      "We implement industry-standard security measures to protect your personal information. Payment transactions are processed through Razorpay's secure platform. However, no method of internet transmission is 100% secure.",
  },
  {
    title: "5. Cookies",
    content:
      "We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser. Disabling cookies may affect certain features of the website.",
  },
  {
    title: "6. Your Rights",
    content:
      "You have the right to access, correct, or delete your personal information. You may opt out of marketing communications at any time. To exercise these rights, contact us at hello@zilaskin.com.",
  },
  {
    title: "7. Data Retention",
    content:
      "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.",
  },
  {
    title: "8. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website. Your continued use of the site after changes constitutes acceptance.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Navbar currentPage="privacy" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="mb-10">
          <span className="text-brand-pink text-xs font-bold tracking-[0.2em] uppercase">
            Legal
          </span>
          <h1 className="font-serif text-4xl font-bold text-brand-text mt-2 mb-3">
            Privacy Policy
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
            Privacy questions? Email us at{" "}
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
