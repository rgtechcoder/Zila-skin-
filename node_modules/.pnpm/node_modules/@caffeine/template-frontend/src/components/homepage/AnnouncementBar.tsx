
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getAnnouncements } from "@/lib/firestore";

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAnnouncements()
      .then((data) => {
        if (!mounted) return;
        const active = data.filter((a) => a.active).map((a) => a.message);
        setAnnouncements(active);
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!announcements.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [announcements]);

  return (
    <div
      className="bg-brand-pink text-white text-xs font-sans-brand font-medium py-2.5 text-center overflow-hidden relative shadow-sm"
      style={{ background: '#F1267A' }}
      data-ocid="announcement.bar"
    >
      {loading ? (
        <span className="opacity-60">Loading…</span>
      ) : announcements.length === 0 ? (
        <span className="opacity-60">No announcements set</span>
      ) : (
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="block tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.13)]"
          >
            {announcements[index]}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}
