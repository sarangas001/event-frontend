const HowItWorksSection = () => {
  const steps = [
    {
      num: "1",
      title: "Create your event",
      desc: "Fill in the details — title, date, venue, capacity. Attach a cover image and write a description. Takes under 5 minutes.",
    },
    {
      num: "2",
      title: "Get approved",
      desc: "Your organizer or faculty advisor reviews and approves. You're notified the moment it's live and open for registrations.",
    },
    {
      num: "3",
      title: "Manage & celebrate",
      desc: "Track attendees in real time, send reminders, and check everyone in on the day. Download your post-event report instantly.",
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden" aria-labelledby="hiw-heading"
      style={{ background: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 45%,#0c1445 100%)" }}>
      <div className="hero-mesh" style={{ opacity: 0.035 }} aria-hidden="true" />
      <div className="absolute -top-20 right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,.15) 0%,transparent 70%)" }} aria-hidden="true" />
      <div className="absolute -bottom-16 left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%)" }} aria-hidden="true" />

      <div className="relative z-10 max-w-[1200px] mx-auto text-center">
        <div className="eyebrow-pill mx-auto w-fit mb-4">
          <div className="pulse-dot" aria-hidden="true" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-blue-300">
            How it works
          </span>
        </div>
        <h2 id="hiw-heading"
          className="font-display font-medium text-slate-100 leading-[1.12] mb-3"
          style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
          Up and running<br />
          <em className="not-italic" style={{
            background: "linear-gradient(135deg,#60a5fa,#a5b4fc)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            in three steps
          </em>
        </h2>
        <p className="text-sm leading-[1.7] text-white/45 max-w-md mx-auto mb-14">
          No complex setup. Get from zero to a live event page in minutes.
        </p>

        {/* Connector line (decorative, hidden on mobile) */}
        <div className="relative">
          <div className="absolute top-[27px] left-[15%] right-[15%] h-px hidden lg:block pointer-events-none"
            style={{ background: "linear-gradient(90deg,transparent,rgba(96,165,250,.3) 20%,rgba(96,165,250,.3) 80%,transparent)" }}
            aria-hidden="true" />

          <ol className="grid grid-cols-1 lg:grid-cols-3 gap-6 list-none">
            {steps.map(({ num, title, desc }) => (
              <li key={num}
                className="bg-white/[0.05] border border-white/[0.08] rounded-[20px] px-7 py-8
                  text-center transition-all duration-250
                  hover:bg-white/[0.09] hover:border-blue-400/30">
                <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center
                  text-white text-xl font-semibold relative z-10"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                    boxShadow: "0 4px 16px rgba(59,130,246,.35)",
                  }}
                  aria-label={`Step ${num}`}>
                  {num}
                </div>
                <h3 className="text-[15px] font-semibold text-slate-100 mb-2.5">{title}</h3>
                <p className="text-[13px] text-white/50 leading-[1.65]">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection