const StarRating = () => (
  <div className="flex gap-1" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "The approval workflow saved us so many back-and-forth emails. Our Drama Society event was approved and live within the same afternoon.",
      name: "Samira Khan",
      role: "Drama Society President",
      initials: "SK",
      avatarColor: "bg-blue-100 text-blue-700",
    },
    {
      quote: "Real-time check-in on event day was a game-changer. No more paper sign-in sheets. We knew exactly how many people showed up instantly.",
      name: "Marcus Reeves",
      role: "Computer Science Club Lead",
      initials: "MR",
      avatarColor: "bg-indigo-100 text-indigo-700",
    },
    {
      quote: "As a faculty coordinator I manage 20+ events a year. The analytics dashboard alone saves me hours every semester. I can't imagine going back.",
      name: "Dr. Layla Patel",
      role: "Faculty Events Coordinator",
      initials: "LP",
      avatarColor: "bg-sky-100 text-sky-700",
    },
  ];

  return (
    <section className="events-section py-24 px-6 relative overflow-hidden"
      aria-labelledby="testimonials-heading">
      <div className="dot-grid" aria-hidden="true" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase
          text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1.5 mb-4">
          What people say
        </div>
        <h2 id="testimonials-heading"
          className="font-display font-medium text-slate-800 leading-[1.12] mb-14"
          style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
          Loved by students<br />
          <em className="not-italic" style={{
            background: "linear-gradient(135deg,#2563eb,#818cf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            &amp; organizers alike
          </em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, initials, avatarColor }) => (
            <figure key={name}
              className="event-card flex flex-col gap-4 p-7 m-0">
              <StarRating />
              <blockquote className="flex-1">
                <span className="block font-display text-4xl text-blue-200 leading-none mb-1"
                  aria-hidden="true">"</span>
                <p className="text-[14px] text-slate-600 leading-[1.7] italic">{quote}</p>
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                  text-[13px] font-semibold flex-shrink-0 ${avatarColor}`}
                  aria-hidden="true">
                  {initials}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-800 leading-tight">{name}</p>
                  <p className="text-[12px] text-slate-400">{role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;