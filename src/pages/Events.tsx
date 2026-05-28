import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { toast } from "@/components/ui/sonner";

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconArrow = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const IconFilter = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IconDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);
const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconList = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

/* ─────────────────────────────────────────
   STATUS BADGE HELPER (logic unchanged)
───────────────────────────────────────── */
const getStatusBadge = (status: string) => {
  const map: Record<string, { cls: string; dot: string }> = {
    approved: { cls: "bg-emerald-50 border-emerald-200 text-emerald-600", dot: "bg-emerald-500" },
    pending:  { cls: "bg-amber-50  border-amber-200  text-amber-600",    dot: "bg-amber-500"  },
    rejected: { cls: "bg-red-50    border-red-200    text-red-600",      dot: "bg-red-500"    },
  };
  return map[status.toLowerCase()] ?? map.pending;
};

/* ─────────────────────────────────────────
   FILTER SELECT
───────────────────────────────────────── */
const FilterSelect = ({ value, onChange, children, icon, placeholder }: {
  value: string; onChange: (v: string) => void;
  children: React.ReactNode; icon: React.ReactNode; placeholder?: string;
}) => (
  <div className="relative flex items-center">
    <span className="absolute left-3.5 text-blue-400 pointer-events-none z-10">{icon}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="filter-select appearance-none pl-10 pr-9 py-2.5 min-w-[160px]
        bg-white border border-slate-200 rounded-xl
        text-sm font-medium text-slate-600
        focus:outline-none focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.10)]
        hover:border-slate-300 hover:text-slate-800
        transition-all duration-200 cursor-pointer shadow-sm"
    >
      {children}
    </select>
    <span className="absolute right-3 text-slate-400 pointer-events-none"><IconChevron /></span>
  </div>
);

/* ─────────────────────────────────────────
   ACTIVE FILTER PILL
───────────────────────────────────────── */
const FilterPill = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
    bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold">
    {label}
    <button onClick={onRemove} className="hover:text-blue-800 transition-colors">
      <IconX />
    </button>
  </span>
);

/* ─────────────────────────────────────────
   EVENT CARD (grid view)
───────────────────────────────────────── */
const EventCard = ({ event }: { event: any }) => {
  const badge = getStatusBadge(event.status);
  return (
    <div className="event-card group bg-white border border-slate-200/80 rounded-2xl overflow-hidden
      hover:border-blue-300/60 hover:-translate-y-[4px]
      hover:shadow-[0_8px_16px_rgba(0,0,0,0.06),0_24px_48px_rgba(59,130,246,0.12)]
      transition-all duration-200">

      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={event.image} alt={event.title}
          className="w-full h-full object-cover brightness-95 saturate-95
            group-hover:scale-[1.07] group-hover:brightness-100
            transition-all duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Category badge */}
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.1em] uppercase
          px-2.5 py-1 rounded-full bg-white/90 text-blue-600 border border-blue-100
          backdrop-blur-[6px] shadow-sm">
          {event.category}
        </span>

        {/* Status badge */}
        <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5
          text-[10px] font-semibold tracking-[0.06em] capitalize
          px-2.5 py-1 rounded-full border backdrop-blur-[6px] shadow-sm ${badge.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {event.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display text-[1.1rem] font-medium leading-[1.25] text-slate-800 mb-3
          group-hover:text-blue-600 transition-colors duration-200 line-clamp-2"
          style={{ display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {event.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-blue-400"><IconCalendar /></span>
            {event.date}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-blue-400"><IconPin /></span>
            {event.location}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link to={`/event/${event.id}`}
            className="flex-1 btn-card-primary inline-flex items-center justify-center gap-1.5
              py-2 px-3 rounded-xl text-[11.5px] font-semibold tracking-wide text-white">
            <div className="btn-card-shine" />
            <span className="relative z-10 flex items-center gap-1.5">
              View details <IconArrow />
            </span>
          </Link>
          <button className="flex-1 py-2 px-3 rounded-xl text-[11.5px] font-medium tracking-wide
            bg-slate-50 border border-slate-200 text-slate-600
            hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600
            transition-all duration-150">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   EVENT ROW (list view)
───────────────────────────────────────── */
const EventRow = ({ event }: { event: any }) => {
  const badge = getStatusBadge(event.status);
  return (
    <div className="group flex items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-4
      hover:border-blue-300/60 hover:shadow-[0_4px_20px_rgba(59,130,246,0.10)]
      transition-all duration-200">
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <img src={event.image} alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-display text-base font-medium text-slate-800 group-hover:text-blue-600 transition-colors truncate">
            {event.title}
          </h3>
          <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {event.status}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="text-blue-400"><IconCalendar /></span>{event.date}</span>
          <span className="flex items-center gap-1"><span className="text-blue-400"><IconPin /></span>{event.location}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-500 border border-blue-100 px-2 py-0.5 rounded-full">{event.category}</span>
        </div>
      </div>
      <Link to={`/event/${event.id}`}
        className="flex-shrink-0 btn-card-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white">
        <div className="btn-card-shine" />
        <span className="relative z-10 flex items-center gap-1.5">View <IconArrow /></span>
      </Link>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════ */
const Events = () => {
  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate,     setSelectedDate]     = useState("");
  const [allEvents,        setAllEvents]        = useState<any[]>([]);
  const [viewMode,         setViewMode]         = useState<"grid"|"list">("grid");

  const { backendUrl } = useContext(AppContext);

  /* Filtering logic (unchanged) */
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  /* Data fetching (unchanged) */
  const getAllEvents = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/event/events");
      if (data.success) {
        const formattedEvents = data.message.map((event: any) => ({
          id:       event._id,
          title:    event.eventTitle,
          image:    event.imageLink,
          date:     event.eventDate,
          location: event.venue,
          category: event.category.charAt(0).toUpperCase() + event.category.slice(1),
          status:   "Approved",
        }));
        setAllEvents(formattedEvents);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => { getAllEvents(); }, []);

  const hasResults = filteredEvents.length > 0;
  const activeFilters = [searchQuery, selectedCategory, selectedDate].filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        .events-root { font-family: 'DM Sans', system-ui, sans-serif; }

        /* Search input */
        .search-input {
          background: white;
          border: 1.5px solid #e2e8f0;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.10);
          outline: none;
        }
        .search-input::placeholder { color: #94a3b8; }

        /* Filter bar glass */
        .filter-bar {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 2px 8px rgba(59,130,246,0.04), 0 1px 2px rgba(0,0,0,0.04);
        }

        /* Card button */
        .btn-card-primary {
          background: linear-gradient(135deg, #2563eb, #3b82f6, #0ea5e9);
          box-shadow: 0 3px 10px rgba(59,130,246,0.28);
          position: relative; overflow: hidden;
          transition: all 0.22s;
        }
        .btn-card-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(59,130,246,0.38);
        }
        .btn-card-shine {
          position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.12) 50%,transparent 60%);
          background-size:200% 100%;
          animation: shine 3s linear infinite;
        }
        @keyframes shine { from{background-position:200% 0} to{background-position:-200% 0} }

        /* Event card */
        .event-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(59,130,246,0.05);
        }

        /* Stagger fade */
        .card-stagger { animation: cardFadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes cardFadeUp {
          from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)}
        }

        /* Filter select */
        .filter-select { box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .filter-select:focus { box-shadow: 0 0 0 4px rgba(59,130,246,0.10); }

        /* View toggle btn */
        .view-btn {
          width: 36px; height: 36px; border-radius: 10px;
          display:flex; align-items:center; justify-content:center;
          transition: all 0.18s;
          border: 1.5px solid #e2e8f0;
        }
        .view-btn.active {
          background: #eff6ff; border-color: #bfdbfe; color: #2563eb;
          box-shadow: 0 2px 8px rgba(59,130,246,0.12);
        }
        .view-btn:not(.active) { background:white; color:#94a3b8; }
        .view-btn:not(.active):hover { background:#f8fafc; border-color:#cbd5e1; color:#64748b; }

        /* Empty state */
        .empty-icon {
          background: linear-gradient(135deg, #eff6ff, #e0f2fe);
          border: 1px solid #bfdbfe;
        }

        /* Results tag */
        .results-tag {
          background: linear-gradient(135deg, #eff6ff, #f0f9ff);
          border: 1px solid rgba(147,197,253,0.4);
        }

        /* Load more btn */
        .load-more-btn {
          background: white;
          border: 1.5px solid #e2e8f0;
          transition: all 0.22s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .load-more-btn:hover {
          border-color: #3b82f6;
          color: #2563eb;
          background: #eff6ff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59,130,246,0.12);
        }

        /* Top accent strip */
        .section-accent::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:3px;
          background: linear-gradient(90deg, #2563eb 0%, #818cf8 50%, #0ea5e9 100%);
        }
      `}</style>

      <MainLayout title="Upcoming Events" subtitle="Discover and explore university events">
        <div className="events-root max-w-[1200px] mx-auto px-5 pb-16 pt-2">

          {/* ── Sticky filter bar ── */}
          <div className="filter-bar sticky top-[65px] z-20 rounded-2xl p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search events or venues…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-slate-700 font-body"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <IconX />
                  </button>
                )}
              </div>

              {/* Selects */}
              <div className="flex gap-2.5 flex-wrap sm:flex-nowrap">
                <FilterSelect value={selectedCategory} onChange={setSelectedCategory} icon={<IconFilter />}>
                  <option value="">All Categories</option>
                  <option value="concert">Concert</option>
                  <option value="festival">Festival</option>
                  <option value="performance">Performance</option>
                  <option value="workshop">Workshop</option>
                </FilterSelect>

                <FilterSelect value={selectedDate} onChange={setSelectedDate} icon={<IconCalendar />}>
                  <option value="">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </FilterSelect>
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                <button onClick={() => setViewMode("grid")} className={`view-btn ${viewMode==="grid"?"active":""}`} aria-label="Grid view">
                  <IconGrid />
                </button>
                <button onClick={() => setViewMode("list")} className={`view-btn ${viewMode==="list"?"active":""}`} aria-label="List view">
                  <IconList />
                </button>
              </div>
            </div>

            {/* Active filter pills */}
            {activeFilters > 0 && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active:</span>
                {searchQuery     && <FilterPill label={`"${searchQuery}"`}  onRemove={() => setSearchQuery("")} />}
                {selectedCategory && <FilterPill label={selectedCategory}   onRemove={() => setSelectedCategory("")} />}
                {selectedDate     && <FilterPill label={selectedDate}       onRemove={() => setSelectedDate("")} />}
                <button onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSelectedDate(""); }}
                  className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors ml-1">
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* ── Results header ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="results-tag flex items-center gap-2 px-3.5 py-1.5 rounded-full">
                <IconSparkle />
                <span className="text-xs font-semibold text-blue-600">
                  {hasResults
                    ? <>{filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found</>
                    : "No results"
                  }
                </span>
              </div>
              {activeFilters > 0 && (
                <span className="text-xs text-slate-400">
                  {activeFilters} filter{activeFilters !== 1 ? "s" : ""} active
                </span>
              )}
            </div>

            {/* Sort label */}
            <p className="text-xs text-slate-400 hidden sm:block">
              Sorted by <span className="font-medium text-slate-600">Latest</span>
            </p>
          </div>

          {/* ── GRID VIEW ── */}
          {hasResults && viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {filteredEvents.map((event, idx) => (
                <div key={event.id} className="card-stagger" style={{ animationDelay: `${idx * 0.07}s` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {hasResults && viewMode === "list" && (
            <div className="flex flex-col gap-3 mb-12">
              {filteredEvents.map((event, idx) => (
                <div key={event.id} className="card-stagger" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <EventRow event={event} />
                </div>
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!hasResults && (
            <div className="card-stagger flex flex-col items-center justify-center py-24 text-center">
              <div className="empty-icon w-16 h-16 rounded-2xl flex items-center justify-center text-blue-400 mb-5 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-medium text-slate-700 mb-2">No events found</h3>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSelectedDate(""); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-blue-50 border border-blue-200 text-blue-600 text-sm font-semibold
                  hover:bg-blue-100 hover:border-blue-300 transition-all duration-200">
                <IconX /> Clear all filters
              </button>
            </div>
          )}

          {/* ── Load more ── */}
          {hasResults && (
            <div className="text-center">
              <button className="load-more-btn inline-flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-semibold text-slate-600">
                Load more events
                <IconDown />
              </button>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default Events;
