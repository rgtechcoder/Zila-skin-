import { useSubscribeNewsletter } from "@/hooks/useQueries";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useSubscribeNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    mutate(email, {
      onSuccess: (ok) => {
        if (ok) {
          toast.success("Welcome to the Glow Community! 🌸");
          setEmail("");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
      onError: () => toast.error("Unable to subscribe. Please try again."),
    });
  };

  return (
    <section
      className="py-12 lg:py-20 bg-brand-accent"
      data-ocid="newsletter.section"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-brand-pink text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          Stay in the Loop
        </p>
        <h2 className="font-serif text-3xl lg:text-5xl font-bold text-brand-text mb-4">
          Join the Glow Community
        </h2>
        <p className="text-brand-text-muted text-sm sm:text-base mb-8 max-w-md mx-auto">
          Be the first to discover new launches, skincare tips, and exclusive
          member-only offers. No spam, ever.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          data-ocid="newsletter.panel"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 w-full px-5 py-3.5 rounded-full border border-border bg-white text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(241,38,122,0.12)] placeholder:text-brand-text-muted"
            data-ocid="newsletter.input"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-pink text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-brand-pink/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_rgba(241,38,122,0.35)] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]"
            data-ocid="newsletter.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Signing up…
              </>
            ) : (
              <>
                SIGN UP <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-brand-text-muted mt-4">
          Join 50,000+ skincare lovers. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
