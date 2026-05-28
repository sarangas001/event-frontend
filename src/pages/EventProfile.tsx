import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AppContext } from "@/context/AppContext";
import { formatDate, formatTime } from "../lib/formatters";

type ApiEvent = {
  _id: string;
  eventTitle: string;
  description: string;
  category: string;
  eventDate: string;
  expectedAttendees: number;
  startTime: string;
  endTime: string;
  venue: string;
  imageLink: string;
  isApproved: boolean;
  organizationId: string;
  classRoomName?: string;
};

const EventProfile = () => {
  const { id } = useParams<{ id: string }>();
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { backendUrl } = appContext;

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        axios.defaults.withCredentials = true;

        const detailEndpoints = [
          `${backendUrl}/api/event/event/${id}`,
          `${backendUrl}/api/event/events/${id}`,
        ];

        for (const endpoint of detailEndpoints) {
          try {
            const response = await axios.get(endpoint);
            if (response.data?.success && response.data?.message?._id) {
              setEvent(response.data.message as ApiEvent);
              setIsLoading(false);
              return;
            }
          } catch {
            // Try next endpoint.
          }
        }

        const listResponse = await axios.get(`${backendUrl}/api/event/events`);
        if (listResponse.data?.success && Array.isArray(listResponse.data?.message)) {
          const matched = (listResponse.data.message as ApiEvent[]).find((item) => item._id === id);
          if (matched) {
            setEvent(matched);
          } else {
            toast.error("Event not found.");
            setEvent(null);
          }
        } else {
          toast.error(listResponse.data?.message || "Failed to load event details.");
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to load event details.");
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [backendUrl, id]);

  const eventStatusLabel = useMemo(() => {
    if (!event) {
      return "Unknown";
    }

    return event.isApproved ? "Approved" : "Pending Approval";
  }, [event]);

  const venueLabel = useMemo(() => {
    if (!event) {
      return "-";
    }

    if (event.classRoomName && event.classRoomName.trim().length > 0) {
      return `${event.venue} (${event.classRoomName})`;
    }

    return event.venue;
  }, [event]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-slate-900 px-6 py-16 text-white" aria-labelledby="event-title">
          {event?.imageLink && (
            <img
              src={event.imageLink}
              alt={event.eventTitle}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}

          <div className="relative mx-auto max-w-6xl">
            <Link
              to="/events"
              className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/85 transition hover:bg-white/10"
            >
              Back to events
            </Link>

            {isLoading && <p className="text-sm text-white/80">Loading event details...</p>}

            {!isLoading && !event && (
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                <h1 id="event-title" className="text-3xl font-semibold">Event details unavailable</h1>
                <p className="mt-2 text-sm text-white/80">We could not find this event. Please return to the events page.</p>
              </div>
            )}

            {!isLoading && event && (
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                <p className="inline-flex items-center rounded-full border border-blue-300/40 bg-blue-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-blue-100">
                  {eventStatusLabel}
                </p>
                <h1 id="event-title" className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{event.eventTitle}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85">{event.description}</p>
              </div>
            )}
          </div>
        </section>

        {!isLoading && event && (
          <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-3" aria-label="Event details">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="text-xl font-semibold text-slate-900">Event information</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Date</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(event.eventDate)}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Time</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Category</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Expected attendees</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{event.expectedAttendees}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Venue</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{venueLabel}</p>
                </div>
              </div>
            </article>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Quick summary</h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-slate-200 p-3">
                  <dt className="text-xs uppercase tracking-[0.08em] text-slate-500">Event ID</dt>
                  <dd className="mt-1 break-all font-semibold text-slate-900">{event._id}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <dt className="text-xs uppercase tracking-[0.08em] text-slate-500">Organization ID</dt>
                  <dd className="mt-1 break-all font-semibold text-slate-900">{event.organizationId}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <dt className="text-xs uppercase tracking-[0.08em] text-slate-500">Approval state</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{eventStatusLabel}</dd>
                </div>
              </dl>

              <Link
                to="/events"
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Browse more events
              </Link>
            </aside>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EventProfile;
