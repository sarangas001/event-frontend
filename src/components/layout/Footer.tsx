import { Link } from "react-router-dom";
import { useState } from "react";

/* ─────────────────────────────────────────
   SOCIAL ICONS
───────────────────────────────────────── */
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-400">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

/* ─────────────────────────────────────────
   SOCIAL DATA
───────────────────────────────────────── */
const socials = [
  { label: "Facebook",  icon: <IconFacebook />,  color: "hover:bg-blue-600",   bg: "bg-blue-50",   text: "text-blue-600" },
  { label: "Instagram", icon: <IconInstagram />, color: "hover:bg-pink-500",   bg: "bg-pink-50",   text: "text-pink-500" },
  { label: "X",         icon: <IconX />,         color: "hover:bg-slate-800",  bg: "bg-slate-100", text: "text-slate-700" },
  { label: "LinkedIn",  icon: <IconLinkedIn />,  color: "hover:bg-blue-700",   bg: "bg-blue-50",   text: "text-blue-700" },
  { label: "YouTube",   icon: <IconYouTube />,   color: "hover:bg-red-500",    bg: "bg-red-50",    text: "text-red-500"  },
];

/* ─────────────────────────────────────────
   FOOTER LINK — with animated arrow
───────────────────────────────────────── */
const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link
      to={to}
      className="group flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors duration-200 py-1"
    >
      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 opacity-0 group-hover:opacity-100 text-blue-400">
        <IconArrow />
      </span>
      {children}
    </Link>
  </li>
);

/* ─────────────────────────────────────────
   MAIN FOOTER
───────────────────────────────────────── */
const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`

      `}</style>

      <footer className="footer-root font-body relative">
        {/* Top accent border */}
        <div className="footer-top-border w-full" />

        {/* BG decorations */}
        <div className="footer-blob-1" />
        <div className="footer-blob-2" />
        <div className="grid-dot" />

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 pt-16 pb-8">

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* ── Brand + Newsletter ── */}
            <div className="sm:col-span-2 lg:col-span-1">
              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
                <div className="logo-badge w-9 h-9 rounded-xl flex items-center justify-center text-white">
                  <IconSparkle />
                </div>
                <span className="font-display text-slate-800 text-xl font-medium tracking-wide">
                  Eventraze
                </span>
              </Link>

              <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-[260px]">
                Stay informed about campus events, workshops, and opportunities — all in one place.
              </p>

              {/* Newsletter */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-500 mb-2.5 flex items-center gap-1.5">
                <IconMail />
                Newsletter
              </p>

              {subscribed ? (
                <div className="check-pop flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  You're subscribed! 🎉
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                      className="subscribe-input w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-700 pr-4"
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="subscribe-btn relative text-white text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap"
                  >
                    <span className="relative z-10">Subscribe</span>
                  </button>
                </div>
              )}

              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                By subscribing you agree to our privacy policy and communication terms.
              </p>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <h4 className="col-title-line text-sm font-semibold text-slate-700 uppercase tracking-widest mb-4">
                Quick links
              </h4>
              <ul className="space-y-0.5">
                <FooterLink to="/events">Events</FooterLink>
                <FooterLink to="/event-registration">Registration</FooterLink>
                <FooterLink to="#">Support</FooterLink>
                <FooterLink to="#">FAQ</FooterLink>
                <FooterLink to="#">Contact</FooterLink>
                <FooterLink to="/sign-in">Admin</FooterLink>
              </ul>
            </div>

            {/* ── Resources ── */}
            <div>
              <h4 className="col-title-line text-sm font-semibold text-slate-700 uppercase tracking-widest mb-4">
                Resources
              </h4>
              <ul className="space-y-0.5">
                <FooterLink to="#">Assistance</FooterLink>
                <FooterLink to="#">Services</FooterLink>
                <FooterLink to="#">Guides</FooterLink>
                <FooterLink to="#">Blog</FooterLink>
                <FooterLink to="#">Community</FooterLink>
              </ul>
            </div>

            {/* ── Follow Us ── */}
            <div>
              <h4 className="col-title-line text-sm font-semibold text-slate-700 uppercase tracking-widest mb-4">
                Follow us
              </h4>

              {/* Icon pills row */}
              <div className="flex flex-wrap gap-2 mb-5">
                {socials.map(({ label, icon, color, bg, text }) => (
                  <Link key={label} to="#" title={label}>
                    <div className={`social-pill w-9 h-9 rounded-xl flex items-center justify-center ${bg} ${text} ${color}`}>
                      {icon}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Text list */}
              <ul className="space-y-0.5">
                {socials.map(({ label, text }) => (
                  <FooterLink key={label} to="#">
                    <span className={`text-xs font-medium ${text}`}>{label}</span>
                  </FooterLink>
                ))}
              </ul>
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* ── BOTTOM BAR ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-[0.78rem] text-slate-400 text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-blue-500 font-semibold">Eventraze</span>
              {" "}· University Event Management Platform
            </p>

            <nav className="flex items-center gap-1" aria-label="Legal">
              {["Privacy policy", "Terms of service", "Cookie settings"].map((item, i, arr) => (
                <span key={item} className="flex items-center gap-1">
                  <Link to="#" className="legal-link text-[0.75rem] text-slate-400 hover:text-blue-500 px-1.5 py-0.5 rounded transition-colors">
                    {item}
                  </Link>
                  {i < arr.length - 1 && (
                    <span className="text-slate-200 text-xs">·</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          {/* Made with love */}
          <p className="text-center text-[11px] text-slate-300 mt-6 tracking-wide">
            Crafted with <span className="text-red-400">♥</span> for the campus community
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;