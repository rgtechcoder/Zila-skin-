import { Button } from "@/components/ui/button";
import SuggestionsSection from "./SuggestionsSection";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, subtotal, totalCount } = useCart();

  const delivery = subtotal >= 499 ? 0 : 99;
  const total = subtotal + delivery;

  function handleGoToCart() {
    onClose();
    window.location.hash = "#cart";
  }

  function handleCheckout() {
    onClose();
    window.location.hash = "#checkout";
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
            data-ocid="cart.panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-pink" />
                <h2 className="font-semibold text-lg text-brand-text">
                  Your Bag
                </h2>
                {totalCount > 0 && (
                  <span className="bg-brand-pink text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-brand-text-muted hover:text-brand-pink transition-colors"
                data-ocid="cart.close_button"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-accent flex items-center justify-center">
                  <ShoppingBag
                    size={36}
                    className="text-brand-pink opacity-60"
                  />
                </div>
                <div>
                  <p className="font-semibold text-brand-text text-lg">
                    Your bag is empty
                  </p>
                  <p className="text-brand-text-muted text-sm mt-1">
                    Add some products to get started
                  </p>
                </div>
                <Button
                  onClick={onClose}
                  className="rounded-full px-8 bg-brand-pink hover:bg-brand-pink/90 text-white"
                  data-ocid="cart.primary_button"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4" style={{ maxHeight: 320, overflowY: 'auto' }}>
                  <div className="flex flex-col gap-4">
                    {items.map((item, i) => (
                      <div
                        key={item.id}
                        className="flex gap-3 items-start"
                        data-ocid={`cart.item.${i + 1}`}
                      >
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-[#FFF5F9] to-[#FDE3EC] flex items-center justify-center shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-brand-text truncate">
                            {item.name}
                          </p>
                          <p className="text-brand-pink text-sm font-bold mt-0.5">
                            ₹{item.price}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded-full border border-border hover:border-brand-pink hover:text-brand-pink flex items-center justify-center text-brand-text-muted transition-all"
                              data-ocid={`cart.secondary_button.${i + 1}`}
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-full border border-border hover:border-brand-pink hover:text-brand-pink flex items-center justify-center text-brand-text-muted transition-all"
                              data-ocid={`cart.secondary_button.${i + 1}`}
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-brand-text-muted hover:text-red-500 transition-colors mt-0.5"
                          data-ocid={`cart.delete_button.${i + 1}`}
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart summary and actions just after items */}
                <div className="border-t border-border px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-muted">Subtotal</span>
                    <span className="font-semibold text-brand-text">
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-muted">Delivery</span>
                    <span
                      className={
                        delivery === 0
                          ? "text-green-600 font-semibold"
                          : "font-semibold text-brand-text"
                      }
                    >
                      {delivery === 0 ? "FREE" : `₹${delivery}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-bold text-brand-text">Total</span>
                    <span className="font-bold text-brand-text text-lg">
                      ₹{total}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full border-brand-pink text-brand-pink bg-gradient-to-r from-[#fde3ec] to-[#f3d0ff] hover:bg-brand-pink hover:text-white hover:from-[#F1267A] hover:to-[#9B59B6] font-semibold shadow-md transition-all duration-200"
                      onClick={handleGoToCart}
                      data-ocid="cart.secondary_button"
                    >
                      View Bag
                    </Button>
                    <Button
                      className="flex-1 rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] hover:opacity-90 text-white font-semibold shadow-md transition-all duration-200"
                      onClick={handleCheckout}
                      data-ocid="cart.primary_button"
                    >
                      Proceed to Pay
                    </Button>
                  </div>
                  {delivery > 0 && (
                    <p className="text-xs text-center text-brand-text-muted">
                      Add ₹{499 - subtotal} more for FREE delivery
                    </p>
                  )}
                </div>

                {/* Suggestions Section */}
                <SuggestionsSection />
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
