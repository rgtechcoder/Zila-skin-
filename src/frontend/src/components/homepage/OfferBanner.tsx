import { type FirestoreOffer, getOffers } from "@/lib/firestore";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import "./offerBannerMarquee.css";

export default function OfferBanner() {
  const [offers, setOffers] = useState<FirestoreOffer[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [marqueeActive, setMarqueeActive] = useState(false);
  const marqueeTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const load = () => {
      getOffers()
        .then((all) =>
          setOffers(all.filter((o) => o.active && o.type === "banner")),
        )
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  // On mount, show static for 2s, then activate marquee
  useEffect(() => {
    setMarqueeActive(false);
    if (marqueeTimeout.current) clearTimeout(marqueeTimeout.current);
    marqueeTimeout.current = setTimeout(() => setMarqueeActive(true), 2000);
    return () => {
      if (marqueeTimeout.current) clearTimeout(marqueeTimeout.current);
    };
  }, [offers.length]);

  const visible = offers.filter((o) => !dismissed.has(o.id ?? ""));

  return (
    <AnimatePresence>
      {visible.map((offer, idx) => (
        <motion.div
          key={offer.id ?? idx}
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-0 left-0 w-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-600 text-white py-0.5 px-6 text-center text-sm z-[1050] shadow-md"
          data-ocid="offer.panel"
        >
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-1 text-xs overflow-hidden" style={{minHeight:'1.5em'}}>
            <div className={marqueeActive ? "marquee" : "text-center w-full"}>
              <span className="font-semibold">{offer.title}</span>
              {offer.description && (
                <span className="text-white/90 ml-2">{offer.description}</span>
              )}
              {offer.couponCode && (
                <span className="bg-white/25 border border-white/40 rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wider font-mono ml-2">
                  {offer.couponCode}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setDismissed((prev) => new Set([...prev, offer.id ?? ""]))
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/20"
            aria-label="Dismiss offer"
            data-ocid="offer.close_button"
          >
            <X size={13} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
