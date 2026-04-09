import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { Heart, Menu, Search, X } from "lucide-react";
import PremiumCartIcon from "@/components/ui/PremiumCartIcon";
import PremiumUserIcon from "@/components/ui/PremiumUserIcon";
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

export default function Navbar({ currentPage, activeSection }: any) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { totalCount } = useCart();
  const { items: wishItems } = useWishlist();
  const wishCount = wishItems.length;
  const { products } = useProducts();

  // Use sessionStorage as fallback for login persistence
  const isLoggedIn = !!(localStorage.getItem("zila_user_email") || sessionStorage.getItem("zila_user_email"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(e: any, href: string) {
    e.preventDefault();
    setMobileOpen(false);
    // Persist login state in sessionStorage if present
    const email = localStorage.getItem("zila_user_email");
    if (email) sessionStorage.setItem("zila_user_email", email);
    window.location.hash = href;
  }

  function handleLogoClick() {
    window.location.hash = "#home";
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md"
            : "bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center h-16 lg:h-20 px-4 lg:px-6 gap-6">

          {/* LOGO */}
          <div
            className="hidden lg:flex items-center cursor-pointer mr-4"
            onClick={handleLogoClick}
          >
            <img src="/logo.png" className="h-16 w-auto object-contain" />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden">
            <Menu size={26} />
          </button>

          {/* MOBILE LOGO CENTER */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
            <img src="/logo.png" className="h-10 w-auto object-contain" />
          </div>

          {/* MENU */}
          <nav className="hidden lg:flex flex-1 justify-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative text-brand-text hover:text-brand-pink"
              >
                <span className="relative group">
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-brand-pink transition-all duration-300 group-hover:w-full"></span>
                </span>
              </a>
            ))}
          </nav>

          {/* ICONS */}
          <div className="flex items-center gap-4 ml-auto">
            <button onClick={() => setSearchOpen(true)} className="hidden lg:block">
              <Search size={20} />
            </button>
            <button onClick={() => window.location.hash = '#login'} className="hidden lg:block">
              <PremiumUserIcon size={24} />
            </button>
            <button onClick={() => window.location.hash = '#wishlist'} className="hidden lg:block">
              <Heart size={20} />
            </button>
            <button onClick={() => setCartOpen(true)} className="relative">
              <PremiumCartIcon size={24} />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <AnimatePresence>
            {searchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                className="fixed top-0 left-0 w-full z-[10000] bg-white/95 shadow-lg flex flex-col px-0 py-0"
                style={{ minHeight: '64px' }}
              >
              <div className="flex items-center px-6 py-4 gap-4">
                <Search size={24} className="text-gray-500 mr-2" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 text-lg border-none outline-none bg-transparent placeholder:text-gray-500"
                  style={{ minWidth: 0 }}
                  autoFocus
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="ml-2 p-2 rounded-full hover:bg-gray-100 transition">
                  <X size={28} />
                </button>
              </div>
              {/* Suggestions Dropdown */}
              {searchQuery.trim() && (
                <div className="w-full max-w-2xl mx-auto bg-white rounded-b-2xl shadow-lg border-t border-gray-100 overflow-y-auto max-h-96 z-[9999]">
                  {products.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">Loading...</div>
                  ) : (
                    (() => {
                      const q = searchQuery.trim().toLowerCase();
                      const filtered = products.filter(p =>
                        (p.name && p.name.toLowerCase().includes(q)) ||
                        (p.description && p.description.toLowerCase().includes(q)) ||
                        (p.category && p.category.toLowerCase().includes(q)) ||
                        (Array.isArray(p.concerns) && p.concerns.join(" ").toLowerCase().includes(q))
                      );
                      return filtered.length === 0
                        ? <div className="p-6 text-center text-gray-400">No products found</div>
                        : <ul>
                            {filtered.slice(0, 8).map(prod => (
                              <li
                                key={prod.id}
                                className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition"
                                onClick={() => {
                                  setSearchOpen(false);
                                  setSearchQuery("");
                                  window.location.hash = `#product?id=${prod.id}`;
                                }}
                              >
                                <img src={prod.imageUrl || "/logo.png"} alt={prod.name} className="w-12 h-12 object-cover rounded-lg border bg-gray-100" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-brand-text truncate">{prod.name}</div>
                                  <div className="text-xs text-gray-500 truncate">{prod.category}</div>
                                </div>
                                <div className="font-semibold text-brand-pink text-base">₹{prod.price}</div>
                              </li>
                            ))}
                          </ul>;
                    })()
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              className="fixed top-0 left-0 w-full h-full z-[9999]"
              style={{ background: '#fff', minHeight: '100vh', minWidth: '100vw' }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <X onClick={() => setMobileOpen(false)} />
                <img src="/logo.png" className="h-10" />
                <div />
              </div>

              {/* Top right icons for mobile menu */}
              <div className="flex justify-end gap-3 mb-4">
                <button onClick={() => { setSearchOpen(true); setMobileOpen(false); }} className="p-2 rounded-full bg-gray-100">
                  <Search size={22} />
                </button>
                <button onClick={() => window.location.hash = '#wishlist'} className="p-2 rounded-full bg-gray-100 mr-2">
                  <Heart size={22} />
                </button>
              </div>
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-lg font-medium text-brand-text hover:text-brand-pink transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="flex flex-col items-center gap-4 mt-10">
                {!isLoggedIn ? (
                  <button
                    onClick={() => { window.location.hash = '#login'; setMobileOpen(false); }}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all duration-200 text-lg"
                  >
                    Login
                  </button>
                ) : (
                  <button
                    onClick={() => { window.location.hash = '#dashboard'; setMobileOpen(false); }}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all duration-200 text-lg"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => { setCartOpen(true); setMobileOpen(false); }}
                  className="w-full py-3 rounded-full bg-white text-brand-pink font-semibold shadow-md border border-brand-pink hover:bg-pink-50 active:scale-95 transition-all duration-200 text-lg flex items-center justify-center gap-2"
                >
                  <PremiumCartIcon size={22} />
                  View Bag
                  {totalCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-bold">
                      {totalCount}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 🔥 IMPORTANT FIX FOR SLIDER OVERLAP */}
      <div className="mt-16 lg:mt-20"></div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}






// import CartDrawer from "@/components/cart/CartDrawer";
// import { useCart } from "@/hooks/useCart";
// import { useWishlist } from "@/hooks/useWishlist";
// import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
// import { AnimatePresence, motion } from "motion/react";
// import { useEffect, useRef, useState } from "react";



// const navLinks = [
//   { label: "Home", href: "#home" },
//   { label: "Shop for your concern", href: "#concerns" },
//   { label: "Shop by category", href: "#category" },
//   { label: "Bestsellers", href: "#bestsellers" },
//   { label: "New Launches", href: "#new-launches" },
//   { label: "All Products", href: "#shop" },
//   { label: "About us", href: "#about-page" },
// ];

// interface NavbarProps {
//   currentPage?: string;
//   activeSection?: string;
// }

// export default function Navbar({ currentPage, activeSection }: NavbarProps) {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [cartOpen, setCartOpen] = useState(false);
//   const searchRef = useRef<HTMLInputElement>(null);
//   const { totalCount } = useCart();
//   const { items: wishItems } = useWishlist();
//   const wishCount = wishItems.length;

//   const isLoggedIn = !!localStorage.getItem("zila_user_email");

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     if (searchOpen) {
//       setTimeout(() => searchRef.current?.focus(), 100);
//     }
//   }, [searchOpen]);

//   function handleNavClick(
//     e: React.MouseEvent<HTMLAnchorElement>,
//     href: string,
//   ) {
//     e.preventDefault();
//     setMobileOpen(false);
//     if (href === "#shop") {
//       window.location.hash = "#shop";
//       return;
//     }
//     if (href === "#about-page") {
//       window.location.hash = "#about-page";
//       return;
//     }
//     if (currentPage !== "home") {
//       window.location.hash = href;
//       return;
//     }
//     const id = href.replace("#", "");
//     if (id === "home" || id === "") {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       window.history.pushState(null, "", "#home");
//       return;
//     }
//     const el = document.getElementById(id);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "start" });
//       window.history.pushState(null, "", href);
//     }
//   }

//   function handleLogoClick() {
//     setMobileOpen(false);
//     if (currentPage !== "home") {
//       window.location.hash = "#home";
//       return;
//     }
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     window.history.pushState(null, "", "#home");
//   }

//   function handleWishlistClick() {
//     setMobileOpen(false);
//     window.location.hash = "#wishlist";
//   }

//   function handleUserClick() {
//     setMobileOpen(false);
//     window.location.hash = isLoggedIn ? "#dashboard" : "#login";
//   }

//   function isActive(href: string) {
//     if (href === "#shop") return currentPage === "shop";
//     if (href === "#about-page") return false;
//     if (currentPage !== "home") return false;
//     return activeSection === href.replace("#", "");
//   }

//   return (
//     <>
//       <header
//         className={`top-0 left-0 right-0 z-50 w-full transition-shadow duration-400 font-sans bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.09)]`}
//         data-ocid="navbar.panel"
//         style={{ position: 'fixed', top: 0 }}
//       >
//         <div className="w-full flex flex-col items-center justify-center px-2 sm:px-4 lg:px-6">
//           <div className="flex flex-row items-center h-16 sm:h-20 lg:h-28 w-full pt-2 sm:pt-4">
//             {/* Hamburger menu left, logo center, icons right (mobile) */}
//             <div className="flex items-center w-full relative lg:justify-start">
//               {/* Hamburger menu button (mobile only) */}
//               {/* Hamburger left on mobile */}
//               <button
//                 type="button"
//                 className="lg:hidden text-brand-text hover:text-brand-pink transition-colors duration-200 p-1 absolute left-0 top-1/2 -translate-y-1/2"
//                 onClick={() => setMobileOpen(true)}
//                 data-ocid="navbar.button"
//                 aria-label="Menu"
//               >
//                 <Menu size={28} />
//               </button>
//               {/* Logo center (mobile), left (desktop) */}
//               <div className="flex-1 flex justify-center items-center lg:justify-start">
//                 <button
//                   type="button"
//                   className="flex items-center bg-transparent border-0 p-0 cursor-pointer"
//                   data-ocid="navbar.link"
//                   onClick={handleLogoClick}
//                   style={{ minHeight: 56, minWidth: 140, maxWidth: 200, width: 160, alignItems: 'center', flexShrink: 0 }}
//                 >
//                   <img
//                     src="/logo.png"
//                     alt="Zila Skin Logo"
//                     className="object-contain"
//                     style={{ maxWidth: '200px', maxHeight: '72px', width: '100%', height: 'auto', display: 'block', margin: 0 }}
//                     sizes="(min-width: 1024px) 200px, 140px"
//                   />
//                 </button>
//               </div>
//               {/* Icons right (mobile) */}
//               <div className="flex items-center gap-2 lg:gap-5 justify-end" style={{ order: 3 }}>
//                 <button
//                   type="button"
//                   onClick={() => setSearchOpen(!searchOpen)}
//                   className="text-brand-text hover:text-brand-pink transition-colors duration-200 p-1"
//                   data-ocid="navbar.button"
//                   aria-label="Search"
//                 >
//                   <Search size={20} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleUserClick}
//                   className={`hidden sm:block transition-colors duration-200 p-1 ${
//                     isLoggedIn ? "text-brand-pink" : "text-brand-text hover:text-brand-pink"
//                   }`}
//                   data-ocid="navbar.button"
//                   aria-label={isLoggedIn ? "My Account" : "Login"}
//                 >
//                   <User size={20} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleWishlistClick}
//                   className="hidden sm:flex relative text-brand-text hover:text-brand-pink transition-colors duration-200 p-1 items-center"
//                   data-ocid="navbar.button"
//                   aria-label="Wishlist"
//                 >
//                   <Heart size={20} />
//                   {wishCount > 0 && (
//                     <span className="absolute -top-0.5 -right-0.5 bg-brand-pink text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
//                       {wishCount > 9 ? "9+" : wishCount}
//                     </span>
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setCartOpen(true)}
//                   className="relative text-brand-text hover:text-brand-pink transition-colors duration-200 p-1"
//                   data-ocid="navbar.button"
//                   aria-label="Cart"
//                 >
//                   <ShoppingBag size={20} />
//                   {totalCount > 0 && (
//                     <span
//                       className="absolute -top-2 -right-2 z-10 text-sm font-extrabold rounded-full w-6 h-6 flex items-center justify-center border-2 shadow select-none"
//                       style={{ minWidth: 24, minHeight: 24, fontSize: 15, background: '#F1267A', color: '#fff', borderColor: '#F1267A', boxShadow: '0 2px 8px 0 rgba(241,38,122,0.18)' }}
//                     >
//                       {typeof totalCount === 'number' && totalCount > 0 ? (totalCount > 99 ? "99+" : totalCount) : ''}
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <AnimatePresence>
//             {searchOpen && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.25 }}
//                 className="overflow-hidden pb-3"
//               >
//                 <input
//                   ref={searchRef}
//                   type="text"
//                   placeholder="Search for products, concerns, ingredients…"
//                   className="w-full border border-border rounded-full px-5 py-2.5 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/30 transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(241,38,122,0.12)]"
//                   data-ocid="navbar.search_input"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       const val = (e.target as HTMLInputElement).value.trim();
//                       if (val) {
//                         sessionStorage.setItem("zilaShopSearch", val);
//                         sessionStorage.removeItem("zilaShopCategory");
//                         setSearchOpen(false);
//                         window.location.hash = "#shop";
//                       }
//                     }
//                   }}
//                   onChange={(e) => {
//                     const val = e.target.value.trim();
//                     if (val.length >= 2) {
//                       sessionStorage.setItem("zilaShopSearch", val);
//                       sessionStorage.removeItem("zilaShopCategory");
//                     }
//                   }}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//         <AnimatePresence>
//           {mobileOpen && (
//             <>
//               {/* No overlay, only the menu drawer is visible for a clean white background */}
//               {/* Mobile menu drawer */}
//               <motion.div
//                 initial={{ x: "-100%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "-100%" }}
//                 transition={{ type: "spring", damping: 28, stiffness: 260 }}
//                 className="fixed top-0 left-0 h-full w-full z-[9999] bg-white flex flex-col"
//                 data-ocid="navbar.panel"
//                 style={{ background: '#fff', width: '100vw', maxWidth: '100vw', minHeight: '100vh' }}
//               >
//                 <div className="flex items-center justify-center px-6 py-5 border-b border-border relative">
//                   <button
//                     type="button"
//                     onClick={() => setMobileOpen(false)}
//                     className="text-brand-text-muted hover:text-brand-pink transition-colors duration-200 absolute left-0 top-1/2 -translate-y-1/2"
//                     data-ocid="navbar.close_button"
//                     style={{ padding: 0, marginRight: 16 }}
//                   >
//                     <X size={26} />
//                   </button>
//                   <div className="flex-1 flex justify-center">
//                     <img
//                       src="/logo.png"
//                       alt="Zila Skin"
//                       className="h-10 w-auto object-contain"
//                       style={{ maxWidth: "140px" }}
//                     />
//                   </div>
//                 </div>
//                 <nav className="flex flex-col gap-1 px-6 py-6">
//                   {navLinks.map((link) => (
//                     <a
//                       key={link.label}
//                       href={link.href}
//                       className={`flex items-center justify-between py-3 text-base font-medium border-b border-border/50 transition-colors duration-200 ${
//                         isActive(link.href)
//                           ? "text-brand-pink font-semibold"
//                           : "text-brand-text hover:text-brand-pink"
//                       }`}
//                       data-ocid="navbar.link"
//                       onClick={(e) => handleNavClick(e, link.href)}
//                     >
//                       {link.label}
//                     </a>
//                   ))}
//                 </nav>
//                 <div className="flex items-center gap-4 px-6 mt-auto pb-8">
//                   <button
//                     type="button"
//                     onClick={handleUserClick}
//                     className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-pink transition-colors duration-200"
//                     data-ocid="navbar.button"
//                   >
//                     <User size={18} /> {isLoggedIn ? "My Account" : "Login"}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleWishlistClick}
//                     className="relative flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-pink transition-colors duration-200"
//                     data-ocid="navbar.button"
//                   >
//                     <Heart size={18} />
//                     Wishlist
//                     {wishCount > 0 && (
//                       <span className="bg-brand-pink text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
//                         {wishCount}
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>
//       </header>
//       <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
//     </>
//   );
// }
