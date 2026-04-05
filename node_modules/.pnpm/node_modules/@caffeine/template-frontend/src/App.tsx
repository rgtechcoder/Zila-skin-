import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import AdminApp from "./components/admin/AdminApp";
import CartPage from "./components/cart/CartPage";
import CheckoutPage from "./components/checkout/CheckoutPage";
// import AboutSection from "./components/homepage/AboutSection";
import ProductFeatures from "./components/homepage/ProductFeatures";
import AnnouncementBar from "./components/homepage/AnnouncementBar";
import BestsellersSection from "./components/homepage/BestsellersSection";
import CategoryCards from "./components/homepage/CategoryCards";
import Footer from "./components/homepage/Footer";
import HeroSlider from "./components/homepage/HeroSlider";
import Navbar from "./components/homepage/Navbar";
import NewLaunches from "./components/homepage/NewLaunches";
// import Newsletter from "./components/homepage/Newsletter";
import OfferBanner from "./components/homepage/OfferBanner";
import OfferPopup from "./components/homepage/OfferPopup";
import PromoBanner from "./components/homepage/PromoBanner";
import ShopByConcern from "./components/homepage/ShopByConcern";
import Testimonials from "./components/homepage/Testimonials";
import AboutPage from "./components/pages/AboutPage";
import PrivacyPage from "./components/pages/PrivacyPage";
import RefundPage from "./components/pages/RefundPage";
import ShippingPage from "./components/pages/ShippingPage";
import TermsPage from "./components/pages/TermsPage";
import ProductDetailPage from "./components/product/ProductDetailPage";
import ShopPage from "./components/shop/ShopPage";
import UserAuthPage from "./components/user/UserAuthPage";
import UserDashboard from "./components/user/UserDashboard";
import WishlistPage from "./components/wishlist/WishlistPage";
import { CartProvider } from "./hooks/useCart";
import { WishlistProvider } from "./hooks/useWishlist";

type Page =
  | "home"
  | "shop"
  | "product"
  | "cart"
  | "checkout"
  | "wishlist"
  | "admin"
  | "login"
  | "dashboard"
  | "about-page"
  | "terms"
  | "privacy"
  | "refund"
  | "shipping";

const HOME_HASHES = [
  "#home",
  "#concerns",
  "#category",
  "#bestsellers",
  "#new-launches",
  "#about",
  "#about-section",
];
const LEGACY_HASH_MAP: Record<string, string> = {
  "#ingredients": "#new-launches",
  "#combos": "#category",
};

function getPage(hash?: string): Page {
  const h = hash ?? window.location.hash;
  if (h === "#shop") return "shop";
  if (h === "#product") return "product";
  if (h === "#cart") return "cart";
  if (h === "#checkout") return "checkout";
  if (h === "#wishlist") return "wishlist";
  if (h === "#admin") return "admin";
  if (h === "#login") return "login";
  if (h === "#dashboard") return "dashboard";
  if (h === "#about-page") return "about-page";
  if (h === "#terms") return "terms";
  if (h === "#privacy") return "privacy";
  if (h === "#refund") return "refund";
  if (h === "#shipping") return "shipping";
  return "home";
}

function scrollToSection(hash: string) {
  const id = hash.replace("#", "");
  if (id === "home" || id === "") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

const FULL_PAGE_HASHES = [
  "#admin",
  "#shop",
  "#product",
  "#cart",
  "#checkout",
  "#wishlist",
  "#login",
  "#dashboard",
  "#about-page",
  "#terms",
  "#privacy",
  "#refund",
  "#shipping",
];


export default function App() {
  const [page, setPage] = useState<Page>(getPage);
  const [activeSection, setActiveSection] = useState("home");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Force homepage on initial load (refresh) if not a full-page
  useEffect(() => {
    const hash = window.location.hash;
    if (!FULL_PAGE_HASHES.includes(hash)) {
      window.location.hash = "#home";
      setPage("home");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (page !== "home") return;
    const sections = [
      "home",
      "concerns",
      "category",
      "bestsellers",
      "new-launches",
      "about",
      "about-section",
    ];
    const entries: Record<string, number> = {};

    observerRef.current = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          entries[entry.target.id] = entry.intersectionRatio;
        }
        let best = "home";
        let bestRatio = 0;
        for (const [id, ratio] of Object.entries(entries)) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (bestRatio > 0) setActiveSection(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5] },
    );

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [page]);

  useEffect(() => {
    const handler = () => {
      let hash = window.location.hash;
      if (LEGACY_HASH_MAP[hash]) hash = LEGACY_HASH_MAP[hash];

      if (FULL_PAGE_HASHES.includes(hash)) {
        setPage(getPage(hash));
        window.scrollTo({ top: 0 });
        return;
      }
      if (HOME_HASHES.includes(hash) || hash === "") {
        setPage("home");
        setTimeout(() => scrollToSection(hash), 80);
      }
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (HOME_HASHES.includes(hash)) {
      setTimeout(() => scrollToSection(hash), 200);
    }
  }, []);

  // Admin: full-screen, no navbar/footer
  if (page === "admin") {
    return (
      <motion.div
        key="admin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <AdminApp />
        <Toaster richColors position="top-right" />
      </motion.div>
    );
  }

  // Policy/About pages: full standalone pages
  const standalonePages: Page[] = [
    "about-page",
    "terms",
    "privacy",
    "refund",
    "shipping",
  ];
  if (standalonePages.includes(page)) {
    const pageMap: Record<string, React.ReactNode> = {
      "about-page": <AboutPage />,
      terms: <TermsPage />,
      privacy: <PrivacyPage />,
      refund: <RefundPage />,
      shipping: <ShippingPage />,
    };
    return (
      <WishlistProvider>
        <CartProvider>
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {pageMap[page]}
          </motion.div>
          <OfferPopup />
          <Toaster richColors position="top-right" />
        </CartProvider>
      </WishlistProvider>
    );
  }

  return (
    <WishlistProvider>
      <CartProvider>
        <div className="min-h-screen bg-brand-bg font-sans">
          <OfferBanner />
          <AnnouncementBar />
          <AnimatePresence mode="wait">
            {page === "cart" ? (
              <motion.div
                key="cart"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <CartPage />
              </motion.div>
            ) : page === "checkout" ? (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <CheckoutPage />
              </motion.div>
            ) : page === "wishlist" ? (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <WishlistPage />
              </motion.div>
            ) : page === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <UserAuthPage />
              </motion.div>
            ) : page === "dashboard" ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <UserDashboard />
              </motion.div>
            ) : (
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Navbar currentPage={page} activeSection={activeSection} />
                <main>
                  {page === "shop" ? (
                    <ShopPage />
                  ) : page === "product" ? (
                    <ProductDetailPage />
                  ) : (
                    <>
                      <section id="home">
                        <HeroSlider />
                      </section>
                      <section id="concerns">
                        <ShopByConcern />
                      </section>
                      <section id="category">
                        <CategoryCards />
                      </section>
                      <section id="bestsellers">
                        <BestsellersSection />
                      </section>
                      <section id="new-launches">
                        <NewLaunches />
                      </section>
                      <PromoBanner />
                      <Testimonials />
                      {/* <Newsletter /> */}
                      <section id="about-section">
                        <ProductFeatures />
                      </section>
                    </>
                  )}
                </main>
                <Footer />
              </motion.div>
            )}
          </AnimatePresence>
          <OfferPopup />
          <Toaster richColors position="top-right" />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}
