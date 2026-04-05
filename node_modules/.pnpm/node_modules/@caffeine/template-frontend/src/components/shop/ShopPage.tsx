import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import type { FirestoreProduct } from "@/lib/firestore";
import { useMemo } from "react";
import {
  ChevronDown,
  Filter,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LOGO =
  "/assets/uploads/upscalemedia-transformed_8-019d21a0-d4fc-7717-b25a-5233f768c25c-1.png";

// SKIN_TYPES and CONCERNS will be generated dynamically below
const PRICE_RANGES = ["All", "Under ₹500", "₹500–₹1000", "Above ₹1000"];
const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Top Rated",
];

type Product = {
  id: string | number;
  name: string;
  desc: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  skinType?: string;
  concern?: string;
  category: string;
  stock?: number;
};

function mapProduct(p: FirestoreProduct): Product {
  return {
    id: p.id ?? Math.random().toString(),
    name: p.name,
    desc: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating ?? 4.5,
    reviews: p.reviews ?? 0,
    image: p.imageUrl,
    badge: p.badge ?? "",
    skinType: p.skinType ?? "All Skin",
    concern: p.concern ?? "All",
    category: p.category,
    stock: p.stock,
  };
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative min-w-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-border rounded-full pl-3 pr-7 py-2 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink cursor-pointer font-sans truncate"
        data-ocid={"shop.select"}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === options[0] ? `${label}: ${opt}` : opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none"
      />
    </div>
  );
}

function ProductSkeleton({ index }: { index: number }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse"
      data-ocid={`shop.item.${index}`}
    >
      <div className="aspect-square bg-gradient-to-b from-gray-100 to-gray-200" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-8 bg-gray-100 rounded-full mt-2" />
        <div className="h-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

function ShopProductCard({
  product,
  index,
  onAddToCart,
  onBuyNow,
}: {
  product: Product;
  index: number;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}) {
  const {
    addItem: addWish,
    removeItem: removeWish,
    isWishlisted,
  } = useWishlist();
  const numericId =
    typeof product.id === "number"
      ? product.id
      : Number.parseInt(product.id as string) || 0;
  const wishlisted = isWishlisted(numericId);
  const [added, setAdded] = useState(false);

  const discountPct = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted(numericId)) {
      removeWish(numericId);
    } else {
      addWish({
        id: numericId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.image,
      });
    }
  };

  // const goToProduct = () => {
  //   window.location.hash = "#product";
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-[0_8px_32px_rgba(241,38,122,0.14),0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 flex flex-col"
      data-ocid={`shop.item.${index + 1}`}
    >
      {product.badge && (
        <span className="absolute top-2 left-2 z-10 bg-brand-pink text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
          {product.badge}
        </span>
      )}
      {discountPct > 0 && (
        <span className="absolute top-2 right-9 sm:right-12 z-10 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
          -{discountPct}%
        </span>
      )}

      <button
        type="button"
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-all"
        data-ocid={`shop.toggle.${index + 1}`}
        aria-label="Wishlist"
      >
        <Heart
          size={12}
          className={
            wishlisted
              ? "fill-brand-pink text-brand-pink"
              : "text-brand-text-muted"
          }
        />
      </button>

      <button
        type="button"
        /* onClick={goToProduct} */
        className="aspect-square overflow-hidden bg-gradient-to-b from-[#fdf6f9] to-[#fce8f3] flex items-center justify-center p-4 sm:p-5 w-full cursor-pointer"
        aria-label={`View ${product.name}`}
        data-ocid={`shop.button.${index + 1}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </button>

      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1 justify-between">
        <div className="flex-1 flex flex-col gap-1.5">
          <button
            type="button"
            /* onClick={goToProduct} */
            className="text-left"
            data-ocid={`shop.link.${index + 1}`}
          >
            <h3 className="font-semibold text-xs sm:text-sm text-brand-text leading-snug line-clamp-2 hover:text-brand-pink transition-colors">
              {product.name}
            </h3>
          </button>
          <p className="text-[10px] sm:text-xs text-brand-text-muted line-clamp-1">
            {product.desc}
          </p>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={10}
                  className={
                    s <= Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-brand-text-muted">
              ({product.reviews.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="font-bold text-brand-text text-sm sm:text-base">
              ₹{product.price}
            </span>
            <span className="text-[10px] sm:text-xs text-brand-text-muted line-through">
              ₹{product.originalPrice}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold border transition-all duration-300 ${
              added
                ? "bg-brand-pink text-white border-brand-pink"
                : "bg-white text-brand-pink border-brand-pink hover:bg-brand-pink hover:text-white hover:shadow-[0_4px_14px_rgba(241,38,122,0.28)] hover:scale-[1.02] active:scale-[0.97]"
            }`}
            data-ocid={`shop.secondary_button.${index + 1}`}
          >
            <ShoppingBag size={11} />
            {added ? "Added!" : "ADD TO CART"}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full text-white font-bold text-sm bg-gradient-to-r from-[#f72585] via-[#b5179e] to-[#7209b7] shadow-md border-0 transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.98]"
            style={{boxShadow: '0 2px 8px 0 rgba(183,23,158,0.15)'}}
            data-ocid={`shop.primary_button.${index + 1}`}
          >
            <Zap size={15} />
            BUY NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
}


function ShopPage() {
  const { addItem } = useCart();
  const { products: rawProducts, loading } = useProducts();

  // Dynamically get unique skin types and concerns from products
  const SKIN_TYPES = useMemo(() => {
    const all = Array.from(new Set(rawProducts.map(p => p.skinType).filter((v): v is string => Boolean(v))));
    return ["All Skin", ...all.filter(t => t && t !== "All Skin")];
  }, [rawProducts]);

  const CONCERNS = useMemo(() => {
    const all = Array.from(new Set(rawProducts.map(p => p.concern).filter((v): v is string => Boolean(v))));
    return ["All", ...all.filter(t => t && t !== "All")];
  }, [rawProducts]);

  const [skinType, setSkinType] = useState("All Skin");
  const [concern, setConcern] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const ALL_PRODUCTS_MAPPED: Product[] = rawProducts.map(mapProduct);

  useEffect(() => {
    const cat = sessionStorage.getItem("zilaShopCategory") || "";
    const search = sessionStorage.getItem("zilaShopSearch") || "";
    const concernFilter = sessionStorage.getItem("zilaShopConcern") || "";
    if (cat) {
      setCategoryFilter(cat);
      sessionStorage.removeItem("zilaShopCategory");
    }
    if (search) {
      setSearchQuery(search);
      sessionStorage.removeItem("zilaShopSearch");
    }
    if (concernFilter) {
      setConcern(concernFilter);
      sessionStorage.removeItem("zilaShopConcern");
    }
  }, []);

  function handleAddToCart(product: Product) {
    addItem({
      id:
        typeof product.id === "number"
          ? product.id
          : Number.parseInt(product.id as string) || 0,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.image,
    });
    toast.success(`${product.name} added to bag!`);
  }

  function handleBuyNow(product: Product) {
    sessionStorage.setItem(
      "zilaBuyNow",
      JSON.stringify({
        id:
          typeof product.id === "number"
            ? product.id
            : Number.parseInt(product.id as string) || 0,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.image,
        quantity: 1,
      }),
    );
    window.location.hash = "#checkout";
  }

  let filtered = ALL_PRODUCTS_MAPPED;

  if (categoryFilter) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === categoryFilter.toLowerCase(),
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.concern ?? "").toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q),
    );
  }

  if (skinType !== "All Skin")
    filtered = filtered.filter((p) => p.skinType === skinType);
  if (concern !== "All")
    filtered = filtered.filter((p) => p.concern === concern);
  if (priceRange === "Under ₹500")
    filtered = filtered.filter((p) => p.price < 500);
  else if (priceRange === "₹500–₹1000")
    filtered = filtered.filter((p) => p.price >= 500 && p.price <= 1000);
  else if (priceRange === "Above ₹1000")
    filtered = filtered.filter((p) => p.price > 1000);

  if (sortBy === "Price: Low to High")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "Price: High to Low")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "Top Rated")
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const shown = filtered.slice(0, visibleCount);
  const firstBatch = shown.slice(0, 6);
  const secondBatch = shown.slice(6);

  return (
    <div
      className="bg-brand-bg min-h-screen overflow-x-hidden"
      data-ocid="shop.page"
    >
      {/* Page Header */}
      <section className="pt-8 sm:pt-10 pb-6 sm:pb-8 text-center bg-gradient-to-b from-brand-accent/30 to-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          <h1 className="font-serif-display text-3xl md:text-5xl font-bold text-brand-text mb-3">
            {categoryFilter ? `Shop ${categoryFilter}s` : "Shop All"}
          </h1>
          {categoryFilter && (
            <button
              type="button"
              onClick={() => setCategoryFilter("")}
              className="text-xs text-brand-pink underline mb-3"
              data-ocid="shop.button"
            >
              × Clear category filter
            </button>
          )}
          <p className="text-brand-text-muted text-sm md:text-base max-w-md mx-auto">
            Discover our complete range of science-backed skincare
          </p>

          <div className="mt-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search products, concerns, ingredients…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full border border-border rounded-full px-5 py-2.5 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
              data-ocid="shop.search_input"
            />
          </div>

          <p className="mt-3 text-xs text-brand-text-muted font-medium tracking-wide uppercase">
            {loading
              ? "Loading products…"
              : `Showing ${filtered.length} products`}
          </p>
        </div>
      </section>

      {/* Filter + Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="hidden md:flex items-center justify-between bg-white rounded-2xl shadow-sm border border-border/50 px-5 py-3.5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 text-sm font-semibold text-brand-text mr-2">
          className="bg-brand-bg min-h-screen overflow-x-hidden mt-16 sm:mt-20 lg:mt-24"
              Filters
            </span>
            <FilterSelect
              label="Skin Type"
              options={SKIN_TYPES}
              value={skinType}
              onChange={setSkinType}
            />
            <FilterSelect
              label="Concern"
              options={CONCERNS}
              value={concern}
              onChange={setConcern}
            />
            <FilterSelect
              label="Price"
              options={PRICE_RANGES}
              value={priceRange}
              onChange={setPriceRange}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-text-muted">Sort By:</span>
            <FilterSelect
              label="Sort"
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-border/50 px-4 py-3">
            <span className="text-sm font-semibold text-brand-text">
              {loading ? "Loading…" : `${filtered.length} products`}
            </span>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-brand-pink"
              data-ocid="shop.toggle"
            >
              <Filter size={14} />
              {filtersOpen ? "Hide Filters" : "Filter & Sort"}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-t-0 border-border/50 rounded-b-2xl px-4 py-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FilterSelect
                      label="Skin Type"
                      options={SKIN_TYPES}
                      value={skinType}
                      onChange={setSkinType}
                    />
                    <FilterSelect
                      label="Concern"
                      options={CONCERNS}
                      value={concern}
                      onChange={setConcern}
                    />
                    <FilterSelect
                      label="Price"
                      options={PRICE_RANGES}
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                    <FilterSelect
                      label="Sort"
                      options={SORT_OPTIONS}
                      value={sortBy}
                      onChange={setSortBy}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductSkeleton key={i} index={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24" data-ocid="shop.empty_state">
            <p className="text-brand-text-muted text-lg">
              No products match your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
                setSkinType("All Skin");
                setConcern("All");
                setPriceRange("All");
              }}
              className="mt-4 text-sm text-brand-pink underline"
              data-ocid="shop.button"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {firstBatch.map((product, i) => (
                <ShopProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>

            {firstBatch.length === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="my-8 sm:my-10 rounded-2xl overflow-hidden"
                data-ocid="shop.panel"
              >
                <div className="bg-gradient-to-r from-brand-accent via-[#fef0f6] to-brand-accent px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border border-brand-pink/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={LOGO}
                      alt="Zila Skin"
                      className="h-7 w-auto object-contain opacity-80"
                    />
                    <div className="w-px h-8 bg-brand-pink/20 hidden sm:block" />
                    <p className="text-sm text-brand-text font-medium text-center sm:text-left">
                      <span className="font-bold text-brand-pink">
                        FREE DELIVERY
                      </span>{" "}
                      on orders above ₹499
                    </p>
                  </div>
                  <p className="text-sm text-brand-text">
                    Use code{" "}
                    <span className="font-bold text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-full tracking-wide">
                      ZILA10
                    </span>{" "}
                    for{" "}
                    <span className="font-bold text-brand-text">10% off</span>{" "}
                    your first order
                  </p>
                </div>
              </motion.div>
            )}

            {secondBatch.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {secondBatch.map((product, i) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    index={i + 6}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            )}

            {filtered.length > visibleCount && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-brand-pink text-brand-pink font-semibold text-sm rounded-full hover:bg-brand-pink hover:text-white transition-all duration-300"
                  data-ocid="shop.load_more_button"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Re-export for backward compatibility
export type { Product as ShopProduct };

export default ShopPage;
