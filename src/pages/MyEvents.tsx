import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Plus, Eye, Edit, X, Calendar, MapPin } from "lucide-react";
import uploaded1 from "@/assets/uploaded-1.jpg";
import uploaded3 from "@/assets/uploaded-3.jpg";
import uploaded4 from "@/assets/uploaded-4.jpg";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { AppContext } from "@/context/AppContext";

/* ============================================================
   TYPES (unchanged)
============================================================ */
type EventStatus = "Approved" | "Pending" | "In Review" | "Rejected";

interface MyEvent {
  id: string | number;
  title: string;
  image: string;
  date: string;
  location: string;
  status: EventStatus;
  attendees?: number;
}

interface ApiEvent {
  _id: string;
  eventTitle: string;
  imageLink: string;
  eventDate: string;
  venue: string;
  isApproved: unknown;
  expectedAttendees: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: T;
}

interface StatusTokens {
  pill: string;
  dot: string;
  bar: string;
}

interface StatItem {
  label: string;
  value: number;
  accent: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}

/* ============================================================
   STATUS NORMALIZER (unchanged)
============================================================ */
const normalizeStatus = (status: unknown): EventStatus => {
  if (typeof status === "string") {
    const s = status.toLowerCase();
    if (s.includes("approved")) return "Approved";
    if (s.includes("review"))   return "In Review";
    if (s.includes("reject"))   return "Rejected";
    if (s.includes("pending"))  return "Pending";
  }
  if (status === true)  return "Approved";
  if (status === false) return "Pending";
  return "Pending";
};

/* ============================================================
   STATUS CONFIG — light palette
============================================================ */
const STATUS_CONFIG: Record<Lowercase<EventStatus>, StatusTokens> = {
  approved:   { pill: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500", bar: "from-emerald-400 to-teal-400"     },
  pending:    { pill: "bg-amber-50  border-amber-200  text-amber-700",    dot: "bg-amber-500",   bar: "from-amber-400  to-orange-400"    },
  "in review":{ pill: "bg-sky-50    border-sky-200    text-sky-700",      dot: "bg-sky-500",     bar: "from-sky-400    to-blue-400"      },
  rejected:   { pill: "bg-red-50    border-red-200    text-red-700",      dot: "bg-red-500",     bar: "from-red-400    to-rose-400"      },
};

const getStatusTokens = (status: EventStatus): StatusTokens =>
  STATUS_CONFIG[status.toLowerCase() as Lowercase<EventStatus>];

/* ============================================================
   SEED DATA (unchanged)
============================================================ */
const SEED_EVENTS: MyEvent[] = [
  { id:1, title:"Annual Company Retreat 2025", status:"In Review", date:"Mar 15-17, 2025", location:"Main Auditorium",  image:uploaded1, attendees:150 },
  { id:2, title:"Tech Workshop Series",        status:"Pending",   date:"Feb 20, 2025",    location:"Conference Hall A", image:uploaded3, attendees:75  },
  { id:3, title:"Cultural Night 2025",         status:"Approved",  date:"Apr 10, 2025",    location:"Open Theater",      image:uploaded4, attendees:300 },
];

/* ============================================================
   STATS HOOK (unchanged)
============================================================ */
function useEventStats(events: MyEvent[]): StatItem[] {
  return [
    {
      label: "Total Events",
      value: events.length,
      accent: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      ),
    },
    {
      label: "Approved",
      value: events.filter(e => e.status === "Approved").length,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-500">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      ),
    },
    {
      label: "Pending",
      value: events.filter(e => e.status === "Pending").length,
      accent: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-500">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
    {
      label: "In Review",
      value: events.filter(e => e.status === "In Review").length,
      accent: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-100",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-sky-500">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      ),
    },
  ];
}

/* ============================================================
   STAT CARD
============================================================ */
const StatCard = ({ label, value, accent, bg, border, icon }: StatItem) => (
  <div className={`stat-card ${bg} border ${border} rounded-2xl p-5 relative overflow-hidden`}>
    {/* Subtle radial glow */}
    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20"
      style={{ background: "radial-gradient(circle, currentColor 0%, transparent 70%)" }} />

    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center shadow-sm`}>
        {icon}
      </div>
      {/* Mini trend line placeholder */}
      <div className="opacity-20">
        <svg viewBox="0 0 40 20" className="w-10 h-5">
          <polyline points="0,18 10,12 20,14 30,6 40,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>

    <div className={`text-3xl font-bold font-display ${accent} leading-none mb-1`}>{value}</div>
    <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</div>
  </div>
);

/* ============================================================
   EVENT CARD
============================================================ */
const EventCard = ({ event }: { event: MyEvent }) => {
  const tokens = getStatusTokens(event.status);

  return (
    <div className="event-card group bg-white border border-slate-200/80 rounded-2xl overflow-hidden
      hover:border-blue-300/60 hover:-translate-y-[4px]
      hover:shadow-[0_8px_16px_rgba(0,0,0,0.05),0_24px_48px_rgba(59,130,246,0.12)]
      transition-all duration-200">

      {/* Top accent bar */}
      <div className={`h-[3px] bg-gradient-to-r ${tokens.bar}`} />

      {/* Image */}
      <div className="relative h-[190px] overflow-hidden">
        <img
          src={event.image} alt={event.title}
          className="w-full h-full object-cover brightness-95
            group-hover:scale-[1.06] group-hover:brightness-100
            transition-all duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5
          text-[10px] font-bold tracking-[0.08em] capitalize
          px-2.5 py-1 rounded-full border backdrop-blur-[6px] shadow-sm ${tokens.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tokens.dot}`} />
          {event.status}
        </span>

        {/* Attendees badge */}
        {event.attendees && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1
            text-[10px] font-semibold px-2.5 py-1 rounded-full
            bg-white/90 text-slate-700 border border-slate-200/80
            backdrop-blur-[6px] shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-blue-500">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {event.attendees.toLocaleString()}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display text-[1.1rem] font-medium leading-[1.25] text-slate-800 mb-3
          group-hover:text-blue-600 transition-colors duration-200
          line-clamp-2" style={{ display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {event.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-blue-400"><Calendar size={12} /></span>
            {event.date}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-blue-400"><MapPin size={12} /></span>
            {event.location}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link to={`/event-detail/${event.id}`}
            className="flex-1 btn-view inline-flex items-center justify-center gap-1.5
              py-2.5 px-3 rounded-xl text-xs font-semibold text-white">
            <div className="btn-shine" />
            <span className="relative z-10 flex items-center gap-1"><Eye size={12} /> View</span>
          </Link>

          <button className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold
            bg-slate-50 border border-slate-200 text-slate-600
            hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600
            transition-all duration-150 flex items-center justify-center gap-1">
            <Edit size={12} /> Edit
          </button>

          <button className="w-9 h-[38px] flex items-center justify-center rounded-xl
            bg-red-50 border border-red-200 text-red-500
            hover:bg-red-100 hover:border-red-300
            transition-all duration-150">
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PAGE
============================================================ */
type FilterValue = "all" | "approved" | "pending" | "in review" | "rejected";

const FILTERS: { value: FilterValue; label: string; color: string; activeColor: string }[] = [
  { value: "all",       label: "All",       color: "bg-slate-100  text-slate-600  border-slate-200",  activeColor: "bg-blue-500    text-white border-blue-500"    },
  { value: "approved",  label: "Approved",  color: "bg-slate-100  text-slate-600  border-slate-200",  activeColor: "bg-emerald-500 text-white border-emerald-500" },
  { value: "pending",   label: "Pending",   color: "bg-slate-100  text-slate-600  border-slate-200",  activeColor: "bg-amber-500   text-white border-amber-500"   },
  { value: "in review", label: "In Review", color: "bg-slate-100  text-slate-600  border-slate-200",  activeColor: "bg-sky-500     text-white border-sky-500"     },
  { value: "rejected",  label: "Rejected",  color: "bg-slate-100  text-slate-600  border-slate-200",  activeColor: "bg-red-500     text-white border-red-500"     },
];

const MyEvents: React.FC = () => {
  const [filter,   setFilter]   = useState<FilterValue>("all");
  const [myEvents, setMyEvents] = useState<MyEvent[]>(SEED_EVENTS);

  const { backendUrl } = useContext(AppContext);
  const stats = useEventStats(myEvents);

  const getAllEvents = async () => {
    try {
      const { data } = await axios.get<ApiResponse<ApiEvent[]>>(
        `${backendUrl}/api/event/organization-events`,
        { withCredentials: true }
      );
      if (!data.success) return;
      const formatted = data.message.map(event => ({
        id:        event._id,
        title:     event.eventTitle,
        image:     event.imageLink,
        date:      event.eventDate,
        location:  event.venue,
        status:    normalizeStatus(event.isApproved),
        attendees: event.expectedAttendees,
      }));
      setMyEvents(formatted);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message ?? error.message);
    }
  };

  useEffect(() => { getAllEvents(); }, []);

  const filteredEvents = myEvents.filter(event =>
    filter === "all" ? true : event.status.toLowerCase() === filter
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        .myevents-root { font-family: 'DM Sans', system-ui, sans-serif; }

        /* Stat card */
        .stat-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(59,130,246,0.05);
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .stat-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.06), 0 16px 32px rgba(59,130,246,0.10);
          transform: translateY(-2px);
        }

        /* Event card */
        .event-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(59,130,246,0.05);
        }

        /* View button */
        .btn-view {
          background: linear-gradient(135deg, #2563eb, #3b82f6, #0ea5e9);
          box-shadow: 0 3px 10px rgba(59,130,246,0.28);
          position: relative; overflow: hidden;
          transition: all 0.22s;
        }
        .btn-view:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(59,130,246,0.38);
        }
        .btn-shine {
          position: absolute; inset: 0;
          background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.12) 50%,transparent 60%);
          background-size: 200% 100%;
          animation: shine 3s linear infinite;
        }
        @keyframes shine { from{background-position:200% 0} to{background-position:-200% 0} }

        /* Create event btn */
        .btn-create {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          box-shadow: 0 4px 14px rgba(59,130,246,0.30);
          transition: all 0.22s;
          position: relative; overflow: hidden;
        }
        .btn-create::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg,#1d4ed8,#2563eb);
          opacity:0; transition:opacity 0.22s;
        }
        .btn-create:hover::before { opacity:1; }
        .btn-create:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(59,130,246,0.40); }

        /* Filter tab */
        .filter-tab {
          border: 1.5px solid;
          transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
          position: relative; overflow: hidden;
        }
        .filter-tab:hover:not(.active-tab) {
          border-color: #93c5fd;
          color: #2563eb;
          background: #eff6ff;
        }

        /* Stagger fade */
        .card-fade { animation: cardUp 0.55s cubic-bezier(0.4,0,0.2,1) both; }
        .stat-fade { animation: cardUp 0.5s  cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes cardUp {
          from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)}
        }

        /* Empty state */
        .empty-box {
          background: linear-gradient(135deg, #eff6ff, #f0f9ff);
          border: 1px solid #bfdbfe;
        }

        /* Filter bar */
        .filter-bar {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 2px 8px rgba(59,130,246,0.04);
        }

        /* Section badge */
        .section-badge {
          background: linear-gradient(135deg, #eff6ff, #f0f9ff);
          border: 1px solid rgba(147,197,253,0.4);
        }
      `}</style>

      <MainLayout title="My Events" subtitle="Manage your event submissions">
        <div className="myevents-root max-w-6xl mx-auto px-5 pb-16 pt-2">

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="stat-fade" style={{ animationDelay:`${i*0.07}s` }}>
                <StatCard {...stat} />
              </div>
            ))}
          </div>

          {/* ── Filter + Create bar ── */}
          <div className="filter-bar rounded-2xl p-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

              {/* Section label */}
              <div className="section-badge flex items-center gap-2 px-3.5 py-1.5 rounded-full flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-500">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 flex-wrap flex-1">
                {FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`filter-tab px-4 py-2 rounded-xl text-xs font-semibold capitalize tracking-wide ${
                      filter === f.value
                        ? `active-tab ${f.activeColor} shadow-sm`
                        : f.color
                    }`}
                  >
                    {f.label}
                    {/* Count badge */}
                    {f.value !== "all" && (
                      <span className={`ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold
                        ${filter === f.value ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {myEvents.filter(e => e.status.toLowerCase() === f.value).length}
                      </span>
                    )}
                    {f.value === "all" && (
                      <span className={`ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold
                        ${filter === f.value ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {myEvents.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Create button */}
              <Link to="/event-registration"
                className="btn-create relative flex-shrink-0 inline-flex items-center gap-2
                  px-5 py-2.5 rounded-xl text-sm font-semibold text-white tracking-wide">
                <span className="relative z-10 flex items-center gap-2">
                  <Plus size={15} /> Create Event
                </span>
              </Link>
            </div>
          </div>

          {/* ── Events grid ── */}
          {filteredEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map((event, idx) => (
                <div key={event.id} className="card-fade" style={{ animationDelay:`${idx*0.08}s` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            /* ── Empty state ── */
            <div className="card-fade flex flex-col items-center justify-center py-24 text-center">
              <div className="empty-box w-16 h-16 rounded-2xl flex items-center justify-center text-blue-400 mb-5 shadow-sm">
                <Calendar size={28} />
              </div>
              <h3 className="font-display text-2xl font-medium text-slate-700 mb-2">
                No {filter === "all" ? "" : filter} events
              </h3>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
                {filter === "all"
                  ? "You haven't created any events yet. Get started by clicking Create Event."
                  : `No events with "${filter}" status found. Try a different filter.`}
              </p>
              <div className="flex gap-3">
                {filter !== "all" && (
                  <button onClick={() => setFilter("all")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                      bg-slate-50 border border-slate-200 text-slate-600 text-sm font-semibold
                      hover:bg-slate-100 transition-all duration-200">
                    Show all events
                  </button>
                )}
                <Link to="/event-registration"
                  className="btn-create relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    text-sm font-semibold text-white">
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus size={14} /> Create Event
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default MyEvents;
