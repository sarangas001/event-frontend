import { Link } from "react-router-dom";
import crowdBg from "@/assets/crowd-bg.jpg";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import FeaturesSection from "@/components/ui/FeaturesSection";
import CategoriesSection from "@/components/ui/CategoriesSection";
import HowItWorksSection from "@/components/ui/HowItWorksSection";
import TestimonialsSection from "@/components/ui/TestimonialsSection";

export type CalendarEvent = { title: string; time: string; location: string };
export type CalendarEventMap = Record<string, CalendarEvent>;
export type CalendarDay = { day: string; highlighted: boolean };
export type UpcomingEvent = { id: string; title: string; description: string; image: string; category: string; readTime: string };
export type HeroStat = { id: string; value: string; label: string; icon: "calendar" | "users" | "trophy" };
export type FeaturedDate = { date: string; name: string; color: string };
export type HeroParticle = { size: number; x: number; delay: number; duration: number };

type HomePresenterProps = {
  isLoggedIn: boolean;
  isEventsLoading: boolean;
  upcomingEvents: UpcomingEvent[];
  calendarDays: CalendarDay[];
  calendarEventMap: CalendarEventMap;
  monthYearLabel: string;
  featuredDates: FeaturedDate[];
  heroParticles: HeroParticle[];
  heroStats: HeroStat[];
  onRetryEvents: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

const Arrow = () => <span aria-hidden="true">-&gt;</span>;

const featureItems = [
  {
    title: "Fast Discovery",
    description: "Find relevant workshops, talks, and activities in seconds with a clean event feed.",
  },
  {
    title: "Smooth Registration",
    description: "Register quickly and track your participation without jumping across multiple systems.",
  },
  {
    title: "Organizer Friendly",
    description: "Create events, monitor attendees, and manage approvals from one place.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Browse",
    description: "Explore upcoming events by category and date to find what matches your interests.",
  },
  {
    step: "02",
    title: "Register",
    description: "Sign up with a few clicks and receive clear event details right away.",
  },
  {
    step: "03",
    title: "Participate",
    description: "Attend, engage, and keep track of your campus activity journey over time.",
  },
];

const CalendarCell = ({ day, highlighted, event }: { day: string; highlighted: boolean; event?: CalendarEvent }) => {
  if (!day) return <div className="h-9" aria-hidden="true" />;
  if (!highlighted || !event) return <div className="h-9 rounded-lg text-center leading-9 text-slate-400">{day}</div>;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button type="button" className="h-9 w-full rounded-lg bg-blue-500 text-sm font-semibold text-white" aria-label={`Event on day ${day}`}>
          {day}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-60">
        <p className="text-xs uppercase text-blue-500">Day {day}</p>
        <p className="font-semibold text-slate-800">{event.title}</p>
        <p className="text-xs text-slate-500">{event.time}</p>
        <p className="text-xs text-slate-500">{event.location}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

const HomePresenter = ({
  isLoggedIn,
  isEventsLoading,
  upcomingEvents,
  calendarDays,
  calendarEventMap,
  monthYearLabel,
  featuredDates,
  heroParticles,
  heroStats,
  onRetryEvents,
  onPreviousMonth,
  onNextMonth,
}: HomePresenterProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-slate-900 px-6 py-16 text-white" aria-labelledby="home-hero-title">
          <img src={crowdBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-block rounded-full border border-white/25 px-4 py-1 text-xs uppercase tracking-[0.12em]">University Events Platform</p>
              <h1 id="home-hero-title" className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">Discover and manage campus events</h1>
              <p className="mt-4 max-w-xl text-sm text-white/80">Streamline event registration and approval for students, organizers, and faculty.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/events" className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold" aria-label="Browse all events">Browse events</Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4" aria-label="Platform statistics">
                {heroStats.map((stat) => (
                  <div key={stat.id}>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-xs uppercase tracking-[0.08em] text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur" aria-label="Event date calendar">
              <div className="mb-3 flex items-center justify-between">
                <button type="button" onClick={onPreviousMonth} aria-label="Previous month" className="rounded border border-white/25 px-2 py-1 text-xs">‹</button>
                <p className="font-semibold">{monthYearLabel}</p>
                <button type="button" onClick={onNextMonth} aria-label="Next month" className="rounded border border-white/25 px-2 py-1 text-xs">›</button>
              </div>
              <div className="mb-1 grid grid-cols-7 text-center text-xs text-white/70">
                {['Mo','Tu','We','Th','Fr','Sa','Su'].map((d) => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, idx) => (
                  <CalendarCell key={`${item.day}-${idx}`} day={item.day} highlighted={item.highlighted} event={calendarEventMap[item.day]} />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {featuredDates.map((date, index) => (
                  <div key={`${date.date}-${date.name}-${index}`} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm">
                    <span className="text-blue-300">{date.date}</span> {date.name}
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {heroParticles.map((particle, i) => (
            <span
              key={`${particle.x}-${i}`}
              aria-hidden="true"
              className="absolute rounded-full bg-blue-200/40"
              style={{ width: particle.size, height: particle.size, left: `${particle.x}%`, bottom: "8%", animationDelay: `${particle.delay}s`, animationDuration: `${particle.duration}s` }}
            />
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14" aria-labelledby="upcoming-events-title" aria-busy={isEventsLoading}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-blue-600">What&apos;s on</p>
                <h2 id="upcoming-events-title" className="text-3xl font-semibold text-slate-900">Upcoming campus events</h2>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/events" className="text-sm font-semibold text-blue-600 mr-2">View all</Link>
                {!isEventsLoading && upcomingEvents.length > 0 && (
                  <div className="flex gap-2">
                    <CarouselPrevious className="static translate-y-0 left-0 right-0 h-9 w-9 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors" />
                    <CarouselNext className="static translate-y-0 left-0 right-0 h-9 w-9 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors" />
                  </div>
                )}
              </div>
            </div>

            {isEventsLoading && <p role="status" className="rounded-xl border bg-white p-6 text-sm text-slate-500">Loading events...</p>}

            {!isEventsLoading && upcomingEvents.length === 0 && (
              <div className="rounded-xl border bg-white p-6 text-center">
                <p className="text-sm text-slate-500">No events available right now.</p>
                <button type="button" onClick={onRetryEvents} className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600" aria-label="Retry loading events">Retry</button>
              </div>
            )}

            {!isEventsLoading && upcomingEvents.length > 0 && (
              <CarouselContent className="-ml-5">
                {upcomingEvents.map((event) => (
                  <CarouselItem key={event.id} className="pl-5 sm:basis-1/2 lg:basis-1/3">
                    <Link to={`/event/${event.id}`} className="block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 h-full" aria-label={`Open event ${event.title}`}>
                      <img src={event.image} alt={event.title} className="h-48 w-full object-cover" />
                      <div className="p-4">
                        <p className="text-xs uppercase tracking-[0.1em] text-blue-600">{event.category}</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">{event.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{event.description}</p>
                        <p className="mt-3 text-sm font-semibold text-blue-600">Learn more <Arrow /></p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            )}
          </Carousel>
        </section>

        {/* <FeaturesSection /> */}
        <CategoriesSection />
        <HowItWorksSection />
        <TestimonialsSection />

        <section className="relative overflow-hidden bg-slate-900 px-6 py-16 text-center text-white" aria-labelledby="home-cta-title">
          <img src={crowdBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="relative mx-auto max-w-2xl">
            <h2 id="home-cta-title" className="text-4xl font-semibold">Start managing your events today</h2>
            <p className="mt-3 text-sm text-white/80">Create, track, and engage with campus events through our streamlined platform.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/events" className="rounded-lg border border-white/40 px-5 py-2.5 text-sm">Browse events</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePresenter;

