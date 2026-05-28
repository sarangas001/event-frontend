import { Link } from "react-router-dom";

const CategoriesSection = () => {
  const categories = [
    { label: "Music & Arts",      count: "24 events",
      icon: <><path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM21 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/></> },
    { label: "Workshops",         count: "38 events",
      icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
    { label: "Tech & Innovation", count: "19 events",
      icon: <><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></> },
    { label: "Sports",            count: "31 events",
      icon: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16M8 22v-5M16 22v-5M12 17c-4 0-7-3-7-7V4h14v6c0 4-3 7-7 7z"/></> },
    { label: "Conferences",        count: "15 events",
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
    { label: "Cultural",          count: "22 events",
      icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></> },
  ];

  return (
    <section className="bg-white py-20 px-6" aria-labelledby="categories-heading">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase
          text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1.5 mb-4">
          Browse by category
        </div>
        <h2 id="categories-heading"
          className="font-display font-medium text-slate-800 leading-[1.12] mb-3"
          style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
          Find what excites you
        </h2>
        <p className="text-sm text-slate-500 leading-[1.7] max-w-md mx-auto">
          From workshops to concerts — something for every student.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
          {categories.map(({ label, count, icon }) => (
            <Link key={label} to="/events"
              aria-label={`Browse ${label} — ${count}`}
              className="group relative flex flex-col items-center gap-3 px-5 py-6 rounded-[16px]
                border border-white/[0.06] overflow-hidden cursor-pointer
                transition-all duration-300 hover:-translate-y-1
                hover:border-blue-400/30 hover:shadow-[0_12px_32px_rgba(59,130,246,.2)]"
              style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)" }}>
              {/* Hover shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(59,130,246,.18),transparent 60%)" }}
                aria-hidden="true" />

              <div className="relative z-10 w-12 h-12 rounded-[12px] flex items-center justify-center
                bg-white/[0.08] text-blue-200/85">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  {icon}
                </svg>
              </div>
              <span className="relative z-10 text-[13px] font-medium text-white/75 text-center
                group-hover:text-white transition-colors">
                {label}
              </span>
              <span className="relative z-10 text-[11px] text-white/35">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection