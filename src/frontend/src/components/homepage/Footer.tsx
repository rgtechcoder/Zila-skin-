import { Facebook, Instagram, Youtube } from "lucide-react";

const shopLinks = [
  { label: "Bestsellers", action: () => window.location.hash = "#bestsellers" },
  { label: "New Launches", action: () => window.location.hash = "#new-launches" },
  { label: "All Products", action: () => window.location.hash = "#shop" },
];

const policyLinks = [
  { label: "Terms of Service", hash: "#terms" },
  { label: "Privacy Policy", hash: "#privacy" },
  { label: "Refund Policy", hash: "#refund" },
  { label: "Shipping Policy", hash: "#shipping" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  function navigate(hash: string) {
    window.location.hash = hash;
  }

  return (
    <footer
      className="bg-[#1a1a1a] text-white overflow-hidden"
      id="about"
      data-ocid="footer.panel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 mb-6">
          {/* About / Contact */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start gap-4">
            <div className="w-full flex justify-start mb-1">
              <img
                src="/logo.png"
                alt="Zila Skin"
                className="h-16 w-auto max-w-[180px] object-contain drop-shadow-lg"
                style={{ filter: "brightness(0) invert(1) contrast(1.2)" }}
                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.insertAdjacentHTML("afterbegin", "<span class='text-white font-bold text-lg'>Zila Skin</span>"); }}
              />
            </div>
            <div className="flex flex-col gap-2 text-base text-white/80">
              <p className="font-extrabold text-white text-base tracking-wide uppercase mb-1">
                Zila Skin
              </p>
              <p className="leading-relaxed text-[15px]">
                G-5, The B Zone Gram Pipliyakumar Nipaniya, Indore MP 452016, M.P.
                <br />
                India 452001
              </p>
              <a
                href="tel:+919876543210"
                className="hover:text-brand-pink transition-colors text-[15px]"
              >
                +91 9977546633
              </a>
              <a
                href="mailto:info@scaleuptech.co.in"
                className="hover:text-brand-pink transition-colors text-[15px]"
              >
                info@scaleuptech.co.in
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-base text-white tracking-widest uppercase">
              Shop
            </h4>
            <ul className="flex flex-col gap-2">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={l.action}
                    className="text-sm text-white/70 hover:text-white transition-colors text-left"
                    data-ocid="footer.link"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-base text-white tracking-widest uppercase">
              Policies
            </h4>
            <ul className="flex flex-col gap-2">
              {policyLinks.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    onClick={() => navigate(p.hash)}
                    className="text-sm text-white/70 hover:text-white transition-colors text-left"
                    data-ocid="footer.link"
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Know More + Socials */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-base text-white tracking-widest uppercase">
              Know More
            </h4>
            <ul className="flex flex-col gap-2 mb-6">
              <li>
                <button
                  type="button"
                  onClick={() => navigate("#about-page")}
                  className="text-sm text-white/70 hover:text-white transition-colors text-left"
                  data-ocid="footer.link"
                >
                  About Us
                </button>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold text-base text-white mb-3">Follow Us</h4>
              <div className="flex items-center gap-4">
                {[
                  {
                    Icon: Facebook,
                    label: "Facebook",
                    url: "https://www.facebook.com/profile.php?id=61580074812467",
                  },
                  {
                    Icon: Instagram,
                    label: "Instagram",
                    url: "https://www.instagram.com/zila.skin?igsh=MXZjOGkyajhvbmI3bQ==",
                  },
                  { Icon: Youtube, label: "YouTube", url: "https://www.youtube.com/@zilaskin" },
                ].map(({ Icon, label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-pink flex items-center justify-center transition-all duration-300"
                    data-ocid="footer.link"
                  >
                    <Icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {year} Zila Skin. All rights reserved.</span>
          <span>
            {" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors underline"
            >
              
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
