const FeaturesSection = () => {
  const features = [
    {
      colorClass: "blue",
      title: "Smart scheduling",
      desc: "Intelligent conflict detection prevents double-bookings across venues and departments. See availability at a glance.",
      icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    },
    {
      colorClass: "indigo",
      title: "One-click registration",
      desc: "Students register with their university ID. No extra accounts needed. Organizers see attendance in real time.",
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    },
    {
      colorClass: "sky",
      title: "Approval workflows",
      desc: "Multi-level approval chains for events needing faculty sign-off, venue permits, or budget authorization.",
      icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    },
    {
      colorClass: "violet",
      title: "Live analytics",
      desc: "Track registrations, check-ins, and engagement metrics. Export reports for department records effortlessly.",
      icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    },
    {
      colorClass: "teal",
      title: "Instant notifications",
      desc: "Automated email and in-app reminders keep attendees informed about schedule changes, venue updates, and cancellations.",
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    },
    {
      colorClass: "pink",
      title: "Broadcast announcements",
      desc: "Send targeted messages to registered attendees or entire faculties. Keep everyone in sync before, during, and after.",
      icon: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>,
    },
  ];

  const iconColors = {
    blue:   "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    sky:    "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
    teal:   "bg-teal-50 text-teal-600",
    pink:   "bg-pink-50 text-pink-600",
  };

  return (
    <section className="relative bg-white py-24 px-6 overflow-hidden" aria-labelledby="features-heading">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg,#2563eb,#818cf8,#0ea5e9)" }} aria-hidden="true" />

      {/* Background blobs */}
      <div className="absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,.06) 0%,transparent 70%)" }} aria-hidden="true" />
      <div className="absolute -bottom-24 -left-16 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(99,102,241,.05) 0%,transparent 70%)" }} aria-hidden="true" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase
          text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1.5 mb-4">
          Why choose us
        </div>
        <h2 id="features-heading"
          className="font-display font-medium text-slate-800 leading-[1.12] mb-3"
          style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
          Everything you need to<br />
          <em className="not-italic" style={{
            background: "linear-gradient(135deg,#2563eb,#818cf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            run great events
          </em>
        </h2>
        <p className="text-sm text-slate-500 leading-[1.7] max-w-md">
          A complete platform built for university communities — from student clubs to large faculty-organized conferences.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map(({ colorClass, title, desc, icon }) => (
            <div key={title}
              className="group relative bg-white border border-slate-200 rounded-[20px] p-7
                overflow-hidden transition-all duration-300 hover:-translate-y-1
                hover:border-blue-200 hover:shadow-[0_12px_40px_rgba(59,130,246,.1)]">
              {/* Hover shimmer overlay */}
              <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100
                transition-opacity duration-300 pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(59,130,246,.04),transparent 60%)" }}
                aria-hidden="true" />

              <div className={`relative z-10 w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 ${iconColors[colorClass]}`}
                aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {icon}
                </svg>
              </div>
              <h3 className="relative z-10 text-base font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="relative z-10 text-[13.5px] text-slate-500 leading-[1.65]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;