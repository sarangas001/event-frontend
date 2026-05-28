import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import crowdBg from "@/assets/crowd-bg.jpg";

interface MainLayoutProps {
  children: ReactNode;
  showBackground?: boolean;
  title?: string;
  subtitle?: string;
}

const MainLayout = ({ children, showBackground = true, title, subtitle }: MainLayoutProps) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        /* ── Page wrapper ── */
        .layout-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ── Hero banner ── */
        .hero-banner {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        /* Crowd photo layer */
        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          filter: brightness(0.45) saturate(1.1);
          transform: scale(1.06);
          animation: heroZoom 20s ease-in-out infinite alternate;
        }
        @keyframes heroZoom {
          from { transform: scale(1.06) translateY(0); }
          to   { transform: scale(1.00) translateY(-12px); }
        }

        /* Blue gradient overlay */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(160deg, rgba(29,78,216,0.72) 0%, rgba(15,23,42,0.55) 50%, rgba(7,89,133,0.65) 100%);
        }

        /* Subtle grid texture */
        .hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
        }

        /* Animated blob accents inside hero */
        .hero-blob-1 {
          position: absolute;
          top: -60px; right: -60px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%);
          animation: blobDrift1 18s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-blob-2 {
          position: absolute;
          bottom: -80px; left: 10%;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          animation: blobDrift2 24s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes blobDrift1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-40px, 30px) scale(1.1); }
        }
        @keyframes blobDrift2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(50px,-40px) scale(1.08); }
        }

        /* Floating particles */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(147,197,253,0.35);
          animation: particleFloat linear infinite;
          pointer-events: none;
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-120px) scale(0.4); opacity: 0; }
        }

        /* Hero text */
        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 500;
          color: #ffffff;
          line-height: 1.18;
          letter-spacing: -0.01em;
          animation: titleReveal 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s both;
        }
        .hero-subtitle {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 1rem;
          color: rgba(255,255,255,0.72);
          font-weight: 300;
          letter-spacing: 0.01em;
          animation: titleReveal 0.8s cubic-bezier(0.4,0,0.2,1) 0.25s both;
        }
        @keyframes titleReveal {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* Breadcrumb / badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          animation: titleReveal 0.8s cubic-bezier(0.4,0,0.2,1) 0s both;
          margin-bottom: 14px;
        }

        /* Decorative bottom wave on hero */
        .hero-wave {
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 56px;
          background: #f8fafc;
          clip-path: ellipse(55% 100% at 50% 100%);
        }

        /* Bottom accent line on hero */
        .hero-accent-line {
          position: absolute;
          bottom: 52px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          border-radius: 99px;
          background: linear-gradient(90deg, #60a5fa, #818cf8);
          box-shadow: 0 0 12px rgba(96,165,250,0.5);
        }

        /* ── Content area ── */
        .layout-content {
          flex: 1;
          background: #f8fafc;
          position: relative;
        }

        /* Subtle dot grid on content background */
        .content-dots {
          position: fixed;
          inset: 0;
          opacity: 0.018;
          background-image: radial-gradient(#1e40af 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        /* Content fade-in */
        .content-inner {
          position: relative;
          z-index: 1;
          animation: contentFadeIn 0.5s cubic-bezier(0.4,0,0.2,1) 0.15s both;
        }
        @keyframes contentFadeIn {
          from { opacity:0; transform: translateY(12px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>

      <div className="layout-root">

        {/* ── STICKY HEADER ── */}
        <Header />

        {/* ── MAIN ── */}
        <main className="flex-1 flex flex-col relative">

          {/* Fixed dot-grid texture behind everything */}
          <div className="content-dots" />

          {/* ── HERO BANNER (when showBackground + title) ── */}
          {showBackground && title && (
            <div className="hero-banner">

              {/* Background image with zoom */}
              <img src={crowdBg} alt="" className="hero-img" aria-hidden="true" />

              {/* Color overlay */}
              <div className="hero-overlay" />

              {/* Grid texture */}
              <div className="hero-grid" />

              {/* Blob accents */}
              <div className="hero-blob-1" />
              <div className="hero-blob-2" />

              {/* Particles */}
              {[
                { size: 5,  x: 12,  delay: 0,   dur: 9  },
                { size: 3,  x: 28,  delay: 2.5, dur: 12 },
                { size: 6,  x: 45,  delay: 1,   dur: 10 },
                { size: 4,  x: 62,  delay: 3.5, dur: 14 },
                { size: 3,  x: 75,  delay: 0.5, dur: 11 },
                { size: 5,  x: 88,  delay: 4,   dur: 13 },
              ].map((p, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    width: p.size,
                    height: p.size,
                    left: `${p.x}%`,
                    bottom: "10%",
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.dur}s`,
                  }}
                />
              ))}

              {/* Hero content */}
              <div className="relative z-10 max-w-[1240px] mx-auto px-6 pt-16 pb-20">

                {/* Badge pill */}
                <div className="hero-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12, opacity: 0.7 }}>
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  Eventraze Platform
                </div>

                <h1 className="hero-title">{title}</h1>

                {subtitle && (
                  <p className="hero-subtitle mt-3 max-w-xl">{subtitle}</p>
                )}

                {/* Animated underline bar */}
                <div
                  className="mt-6 h-[3px] rounded-full"
                  style={{
                    width: 56,
                    background: "linear-gradient(90deg, #60a5fa, #818cf8)",
                    boxShadow: "0 0 12px rgba(96,165,250,0.55)",
                    animation: "titleReveal 0.8s cubic-bezier(0.4,0,0.2,1) 0.35s both",
                  }}
                />
              </div>

              {/* Wave cutout at the bottom */}
              <div className="hero-wave" />
            </div>
          )}

          {/* ── BACKGROUND-ONLY (no title) ── */}
          {showBackground && !title && (
            <div
              className="absolute inset-0"
              style={{ zIndex: 0 }}
              aria-hidden="true"
            >
              <img src={crowdBg} alt="" className="hero-img" />
              <div className="hero-overlay" />
              <div className="hero-grid" />
            </div>
          )}

          {/* ── PAGE CONTENT ── */}
          <div
            className="layout-content relative z-10"
            style={showBackground && !title ? { position: "relative", zIndex: 10 } : {}}
          >
            <div className="content-inner">
              {children}
            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;