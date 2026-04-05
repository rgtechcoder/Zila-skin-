import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";



const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Shop for your concern", href: "#concerns" },
  { label: "Shop by category", href: "#category" },
  { label: "Bestsellers", href: "#bestsellers" },
  { label: "New Launches", href: "#new-launches" },
  { label: "All Products", href: "#shop" },
  { label: "About us", href: "#about-page" },
];

interface NavbarProps {
  currentPage?: string;
  activeSection?: string;
}

export default function Navbar({ currentPage, activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { totalCount } = useCart();
  const { items: wishItems } = useWishlist();
  const wishCount = wishItems.length;

  const isLoggedIn = !!localStorage.getItem("zila_user_email");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    e.preventDefault();
    setMobileOpen(false);
    if (href === "#shop") {
      window.location.hash = "#shop";
      return;
    }
    if (href === "#about-page") {
      window.location.hash = "#about-page";
      return;
    }
    if (currentPage !== "home") {
      window.location.hash = href;
      return;
    }
    const id = href.replace("#", "");
    if (id === "home" || id === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "#home");
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", href);
    }
  }

  function handleLogoClick() {
    setMobileOpen(false);
    if (currentPage !== "home") {
      window.location.hash = "#home";
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "#home");
  }

  function handleWishlistClick() {
    setMobileOpen(false);
    window.location.hash = "#wishlist";
  }

  function handleUserClick() {
    setMobileOpen(false);
    window.location.hash = isLoggedIn ? "#dashboard" : "#login";
  }

  function isActive(href: string) {
    if (href === "#shop") return currentPage === "shop";
    if (href === "#about-page") return false;
    if (currentPage !== "home") return false;
    return activeSection === href.replace("#", "");
  }

  return (
    <>
      <header
        className={`top-0 left-0 right-0 z-50 w-full transition-shadow duration-400 font-sans bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.09)]`}
        data-ocid="navbar.panel"
        style={{ position: 'fixed', top: 0 }}
      >
        <div className="w-full flex flex-col items-center justify-center px-2 sm:px-4 lg:px-6">
          <div className="flex flex-row items-center h-16 sm:h-20 lg:h-28 w-full pt-2 sm:pt-4">
            {/* Logo - fixed width, left */}
            <div className="flex items-center" style={{ minWidth: 140, maxWidth: 200, width: 160 }}>
              <button
                type="button"
                className="flex items-center bg-transparent border-0 p-0 cursor-pointer"
                data-ocid="navbar.link"
                onClick={handleLogoClick}
                style={{ minHeight: 56, width: '100%', alignItems: 'center', flexShrink: 0 }}
              >
                <img
                  src="/logo.png"
                  alt="Zila Skin Logo"
                  className="object-contain"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '72px',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: 0,
                  }}
                  sizes="(min-width: 1024px) 200px, 140px"
                />
              </button>
            </div>
            {/* Nav links - center, flex-1, mx-auto */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-4 mx-auto">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-lg lg:text-xl font-semibold transition-colors duration-200 whitespace-nowrap ${
                    isActive(link.href)
                      ? "text-brand-pink font-bold border-b-2 border-brand-pink pb-0.5"
                      : "text-brand-text hover:text-brand-pink"
                  }`}
                  data-ocid="navbar.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            {/* Icons - right, fixed width */}
            <div className="flex items-center gap-2 lg:gap-5 justify-end" style={{ minWidth: 160 }}>
                            {/* Hamburger menu button (mobile only) */}
                            <button
                              type="button"
                              className="lg:hidden text-brand-text hover:text-brand-pink transition-colors duration-200 p-1"
                              onClick={() => setMobileOpen(true)}
                              data-ocid="navbar.button"
                              aria-label="Menu"
                            >
                              <Menu size={28} />
                            </button>
                    {/* Hamburger menu drawer for mobile */}
                    <AnimatePresence>
                      {mobileOpen && (
                        <motion.div
                          initial={{ x: '100%' }}
                          animate={{ x: 0 }}
                          exit={{ x: '100%' }}
                          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                          className="fixed top-0 right-0 h-full w-64 bg-white z-[999] shadow-2xl flex flex-col p-6"
                          data-ocid="navbar.mobile_drawer"
                        >
                          <button
                            className="self-end mb-6 text-brand-text hover:text-brand-pink"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                          >
                            <X size={28} />
                          </button>
                          <nav className="flex flex-col gap-5 mt-4">
                            {navLinks.map((link) => (
                              <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => {
                                  handleNavClick(e, link.href);
                                  setMobileOpen(false);
                                }}
                                className={`text-lg font-semibold transition-colors duration-200 ${
                                  isActive(link.href)
                                    ? "text-brand-pink font-bold border-b-2 border-brand-pink pb-0.5"
                                    : "text-brand-text hover:text-brand-pink"
                                }`}
                                data-ocid="navbar.mobile_link"
                              >
                                {link.label}
                              </a>
                            ))}
                          </nav>
                        </motion.div>
                      )}
                    </AnimatePresence>
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-brand-text hover:text-brand-pink transition-colors duration-200 p-1"
                data-ocid="navbar.button"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                type="button"
                onClick={handleUserClick}
                className={`hidden sm:block transition-colors duration-200 p-1 ${
                  isLoggedIn
                    ? "text-brand-pink"
                    : "text-brand-text hover:text-brand-pink"
                }`}
                data-ocid="navbar.button"
                aria-label={isLoggedIn ? "My Account" : "Login"}
              >
                <User size={20} />
              </button>
              <button
                type="button"
                onClick={handleWishlistClick}
                className="hidden sm:flex relative text-brand-text hover:text-brand-pink transition-colors duration-200 p-1 items-center"
                data-ocid="navbar.button"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-pink text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishCount > 9 ? "9+" : wishCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative text-brand-text hover:text-brand-pink transition-colors duration-200 p-1"
                data-ocid="navbar.button"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 z-10 text-sm font-extrabold rounded-full w-6 h-6 flex items-center justify-center border-2 shadow select-none"
                    style={{ minWidth: 24, minHeight: 24, fontSize: 15, background: '#F1267A', color: '#fff', borderColor: '#F1267A', boxShadow: '0 2px 8px 0 rgba(241,38,122,0.18)' }}
                  >
                    {typeof totalCount === 'number' && totalCount > 0 ? (totalCount > 99 ? "99+" : totalCount) : ''}
                  </span>
                )}
              </button>
              {/* Hamburger menu button (mobile only) - only one instance */}
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pb-3"
              >
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for products, concerns, ingredients…"
                  className="w-full border border-border rounded-full px-5 py-2.5 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/30 transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(241,38,122,0.12)]"
                  data-ocid="navbar.search_input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        sessionStorage.setItem("zilaShopSearch", val);
                        sessionStorage.removeItem("zilaShopCategory");
                        setSearchOpen(false);
                        window.location.hash = "#shop";
                      }
                    }
                  }}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (val.length >= 2) {
                      sessionStorage.setItem("zilaShopSearch", val);
                      sessionStorage.removeItem("zilaShopCategory");
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col"
                data-ocid="navbar.panel"
              >
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                  <img
                    src="/assets/uploads/upscalemedia-transformed_8-019d21a0-d4fc-7717-b25a-5233f768c25c-1.png"
                    alt="Zila Skin"
                    className="h-10 w-auto object-contain"
                    style={{ maxWidth: "140px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="text-brand-text-muted hover:text-brand-pink transition-colors duration-200"
                    data-ocid="navbar.close_button"
                  >
                    <X size={22} />
                  </button>
                </div>
                <nav className="flex flex-col gap-1 px-6 py-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`flex items-center justify-between py-3 text-base font-medium border-b border-border/50 transition-colors duration-200 ${
                        isActive(link.href)
                          ? "text-brand-pink font-semibold"
                          : "text-brand-text hover:text-brand-pink"
                      }`}
                      data-ocid="navbar.link"
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="flex items-center gap-4 px-6 mt-auto pb-8">
                  <button
                    type="button"
                    onClick={handleUserClick}
                    className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-pink transition-colors duration-200"
                    data-ocid="navbar.button"
                  >
                    <User size={18} /> {isLoggedIn ? "My Account" : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={handleWishlistClick}
                    className="relative flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-pink transition-colors duration-200"
                    data-ocid="navbar.button"
                  >
                    <Heart size={18} />
                    Wishlist
                    {wishCount > 0 && (
                      <span className="bg-brand-pink text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {wishCount}
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
