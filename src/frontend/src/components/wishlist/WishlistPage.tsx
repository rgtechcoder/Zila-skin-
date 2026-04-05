import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import ProductCard from "@/components/homepage/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar currentPage="wishlist" />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="mb-8">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-brand-text">
              My Wishlist
            </h1>
            {items.length > 0 && (
              <p className="text-brand-text-muted mt-1 text-sm">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 gap-5"
              data-ocid="wishlist.empty_state"
            >
              <div className="w-20 h-20 rounded-full bg-brand-accent flex items-center justify-center">
                <Heart size={36} className="text-brand-pink" />
              </div>
              <h2 className="text-xl font-semibold text-brand-text">
                Your wishlist is empty
              </h2>
              <p className="text-brand-text-muted text-sm text-center max-w-xs">
                Save products you love and find them here anytime.
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "#home";
                }}
                className="flex items-center gap-2 bg-brand-pink text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-pink-dark transition-colors"
                data-ocid="wishlist.primary_button"
              >
                <ShoppingBag size={16} />
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {items.map((item, idx) => (
                <ProductCard
                  key={item.id}
                  product={{
                    id: item.id,
                    name: item.name,
                    desc: item.desc ?? "",
                    price: item.price,
                    originalPrice: item.originalPrice,
                    rating: 4.5,
                    reviews: 0,
                    imageSeed: String(item.id),
                    imageUrl: item.imageUrl,
                  }}
                  index={idx + 1}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
