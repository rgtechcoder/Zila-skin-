import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import {
  Minus,
  Plus,
  RotateCcw,
  Shield,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, totalCount } = useCart();

  const delivery = subtotal >= 499 ? 0 : 99;
  const total = subtotal + delivery;

  function handleCheckout() {
    window.location.hash = "#checkout";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 font-sans">
      <Navbar currentPage="cart" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-brand-text mb-2">
          Shopping Bag
        </h1>
        <p className="text-brand-text-muted text-sm mb-8">
          {totalCount} item{totalCount !== 1 ? "s" : ""}
        </p>

        {items.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-6"
            data-ocid="cart.empty_state"
          >
            <div className="w-24 h-24 rounded-full bg-brand-accent flex items-center justify-center">
              <Tag size={44} className="text-brand-pink opacity-50" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-xl text-brand-text">
                Your bag is empty
              </p>
              <p className="text-brand-text-muted mt-2">
                Looks like you haven't added anything yet.
              </p>
            </div>
            <Button
              className="rounded-full bg-brand-pink hover:bg-brand-pink/90 text-white px-8"
              onClick={() => {
                window.location.hash = "#home";
              }}
              data-ocid="cart.primary_button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4" data-ocid="cart.list">
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                {items.map((item, i) => (
                  <div key={item.id}>
                    <div
                      className="flex gap-4 p-4 sm:p-5"
                      data-ocid={`cart.item.${i + 1}`}
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-b from-[#FFF5F9] to-[#FDE3EC] flex items-center justify-center shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-brand-text leading-snug">
                          {item.name}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-full border border-border hover:border-brand-pink hover:text-brand-pink flex items-center justify-center text-brand-text-muted transition-all"
                              data-ocid={`cart.secondary_button.${i + 1}`}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 rounded-full border border-border hover:border-brand-pink hover:text-brand-pink flex items-center justify-center text-brand-text-muted transition-all"
                              data-ocid={`cart.secondary_button.${i + 1}`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-brand-text">
                              ₹{item.price * item.quantity}
                            </p>
                            <p className="text-xs text-brand-text-muted line-through">
                              ₹{item.originalPrice * item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-brand-text-muted hover:text-red-500 transition-colors self-start mt-1"
                        data-ocid={`cart.delete_button.${i + 1}`}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {i < items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4" data-ocid="cart.card">
              <div className="bg-white rounded-2xl shadow-card p-5 sm:p-6">
                <h2 className="font-semibold text-lg text-brand-text mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-text-muted">
                      Subtotal ({totalCount} items)
                    </span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-muted">Delivery</span>
                    <span
                      className={
                        delivery === 0
                          ? "text-green-600 font-semibold"
                          : "font-semibold"
                      }
                    >
                      {delivery === 0 ? "FREE" : `₹${delivery}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  <Button
                    className="rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] hover:opacity-90 text-white font-semibold shadow-md transition-all duration-200"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {[
                    { Icon: Truck, label: "Free Delivery" },
                    { Icon: RotateCcw, label: "Easy Returns" },
                    { Icon: Shield, label: "Secure Pay" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center">
                        <Icon size={14} className="text-brand-pink" />
                      </div>
                      <span className="text-[10px] text-brand-text-muted font-medium">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {delivery > 0 && (
                <div className="bg-brand-accent rounded-xl px-4 py-3 text-sm text-brand-text">
                  🎉 Add <strong>₹{499 - subtotal}</strong> more to get FREE
                  delivery!
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
