import { type FirestoreOffer, getOffers } from "@/lib/firestore";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function OfferPopup() {
  const [offer, setOffer] = useState<FirestoreOffer | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("zila_offer_popup_seen");
    if (seen) return;
    const timer = setTimeout(() => {
      getOffers()
        .then((all) => {
          const popups = all.filter((o) => o.active && o.type === "popup");
          if (popups.length > 0) setOffer(popups[0]);
        })
        .catch(() => {});
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setClosed(true);
    sessionStorage.setItem("zila_offer_popup_seen", "1");
  }

  return (
    <AnimatePresence>
      {offer && !closed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          data-ocid="offer.modal"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            onKeyDown={(e) => e.key === "Escape" && handleClose()}
            role="button"
            tabIndex={-1}
            aria-label="Close offer"
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center z-10"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Close"
              data-ocid="offer.close_button"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🎁</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">
              {offer.title}
            </h2>
            {offer.description && (
              <p className="text-brand-text-muted text-sm mb-4 leading-relaxed">
                {offer.description}
              </p>
            )}

            {offer.couponCode && (
              <div className="bg-gradient-to-r from-rose-50 to-fuchsia-50 border border-rose-100 rounded-2xl p-4 mb-6">
                <p className="text-xs text-brand-text-muted mb-1 font-medium">
                  USE CODE
                </p>
                <p className="font-mono font-bold text-2xl text-brand-pink tracking-widest">
                  {offer.couponCode}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              data-ocid="offer.primary_button"
            >
              Shop Now
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 text-xs text-brand-text-muted hover:text-brand-text transition-colors"
              data-ocid="offer.secondary_button"
            >
              No thanks, maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
