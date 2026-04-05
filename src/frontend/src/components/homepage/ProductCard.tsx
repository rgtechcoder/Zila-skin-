import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  imageSeed: string;
  imageUrl?: string;
  badge?: string;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const {
    addItem: wishAdd,
    removeItem: wishRemove,
    isWishlisted,
  } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl ?? "",
    });
    setAdded(true);
    toast.success(`${product.name} added to bag!`, {
      description: `₹${product.price}`,
      duration: 2000,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl ?? "",
    });
    window.location.hash = "#checkout";
  };

  const handleWishlist = () => {
    if (wishlisted) {
      wishRemove(product.id);
      toast("Removed from wishlist", { duration: 1800 });
    } else {
      wishAdd({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl ?? "",
        desc: product.desc,
      });
      toast.success("Added to wishlist! ❤️", { duration: 1800 });
    }
  };

  const discountPct =
    product.discount ??
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );

  return (
    <div
      className="group relative rounded-3xl overflow-hidden border border-[#F3D0FF]/60 shadow-[0_2px_16px_rgba(241,38,122,0.10),0_1.5px_8px_rgba(155,89,182,0.10)] bg-white hover:shadow-[0_8px_32px_rgba(241,38,122,0.18),0_2px_12px_rgba(155,89,182,0.12)] hover:border-brand-pink/40 transition-all duration-300 hover:-translate-y-2 flex flex-col min-h-[480px] max-w-[360px] w-full"
      data-ocid={`product.item.${index}`}
    >
      {product.badge && (
        <span
          className="absolute top-2 left-2 z-10 bg-white text-brand-pink text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow border border-brand-pink/30 tracking-wide uppercase animate-badge-slide"
          style={{ letterSpacing: '0.5px', minWidth: '60px', textAlign: 'center' }}
        >
          {product.badge}
        </span>
      )}
      {discountPct > 0 && (
        <span className="absolute top-2 right-10 z-10 bg-green-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-md">
          -{discountPct}%
        </span>
      )}
      <button
        type="button"
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xs hover:scale-110 transition-all duration-200 border border-gray-200"
        data-ocid={`product.toggle.${index}`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={13}
          className={
            wishlisted
              ? "fill-brand-pink text-brand-pink"
              : "text-brand-text-muted"
          }
        />
      </button>

      {/* Premium image section with modern effect */}
      <div className="w-full flex items-center justify-center pt-8 pb-4">
        <div
          className="rounded-2xl bg-white shadow-[0_4px_24px_0_rgba(241,38,122,0.10)] border border-[#F3D0FF]/40 p-2 flex items-center justify-center min-h-[270px] min-w-[270px] max-h-[270px] max-w-[270px] aspect-square relative cursor-pointer"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
          onClick={() => setShowPopup((v) => !v)}
        >
          <img
            src={
              product.imageUrl ??
              `https://picsum.photos/seed/${product.imageSeed}/300/300`
            }
            alt={product.name}
            className="object-contain w-full h-full rounded-2xl drop-shadow-[0_6px_24px_rgba(241,38,122,0.10)] transition-transform duration-500 group-hover:scale-105 bg-white"
          />
          {showPopup && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => setShowPopup(false)}
            >
              <div
                className="relative bg-white rounded-3xl p-4 shadow-2xl max-w-[98vw] max-h-[98vh] flex flex-col items-center"
                onClick={e => e.stopPropagation()}
              >
                {/* Close (X) button */}
                <button
                  onClick={() => setShowPopup(false)}
                  aria-label="Close"
                  className="absolute top-3 right-3 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-pink-100 hover:text-brand-pink transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  style={{fontSize: 22, fontWeight: 'bold'}}
                >
                  &#10005;
                </button>
                <img
                  src={
                    product.imageUrl ??
                    `https://picsum.photos/seed/${product.imageSeed}/1200/1200`
                  }
                  alt={product.name}
                  className="object-contain w-full h-full max-w-[700px] max-h-[85vh] rounded-2xl scale-90 opacity-0 animate-zoomin"
                  style={{animation: 'zoomin 0.5s cubic-bezier(0.4,0,0.2,1) forwards'}}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card content with glassmorphism footer */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="px-4 flex flex-col gap-1.5 sm:gap-2">
          <h3 className="font-semibold text-xs sm:text-sm text-brand-text leading-snug line-clamp-2">
            {product.name}
          </h3>
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
              ({product.reviews})
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-bold text-brand-text text-sm sm:text-base">
              ₹{product.price}
            </span>
            <span className="text-[10px] sm:text-xs text-brand-text-muted line-through">
              ₹{product.originalPrice}
            </span>
          </div>
        </div>
        {/* Footer glassmorphism */}
        <div className="mt-3 px-4 pb-4 pt-2 rounded-b-3xl bg-white/60 backdrop-blur-md shadow-[0_2px_12px_rgba(241,38,122,0.10)] flex gap-1.5">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-[10px] sm:text-xs font-semibold border transition-all duration-300 ${
              added
                ? "bg-brand-pink text-white border-brand-pink scale-[0.97]"
                : "bg-white text-brand-pink border-brand-pink hover:bg-brand-pink hover:text-white hover:shadow-[0_4px_14px_rgba(241,38,122,0.28)] hover:scale-[1.02] active:scale-[0.97]"
            }`}
            data-ocid={`product.secondary_button.${index}`}
          >
            <span className={added ? "animate-[bounce_0.4s_ease-out_1]" : ""}>
              <ShoppingBag size={10} />
            </span>
            {added ? "Added!" : "ADD TO CART"}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white shadow-md hover:opacity-90 active:scale-95 transition-all duration-200"
            data-ocid={`product.primary_button.${index}`}
          >
            <Zap size={10} /> BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Product };
