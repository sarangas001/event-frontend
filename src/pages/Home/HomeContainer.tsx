import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { AppContext } from "@/context/AppContext";
import HomePresenter, {
  type CalendarDay,
  type CalendarEventMap,
  type FeaturedDate,
  type HeroParticle,
  type HeroStat,
  type UpcomingEvent,
} from "./HomePresenter";

const HERO_STATS: HeroStat[] = [
  { id: "events", value: "200+", label: "Events / year", icon: "calendar" },
  { id: "attendees", value: "5k+", label: "Attendees", icon: "users" },
  { id: "organizers", value: "40+", label: "Organizers", icon: "trophy" },
];

const HERO_PARTICLES: HeroParticle[] = [
  { size: 5, x: 8, delay: 0, duration: 10 },
  { size: 3, x: 20, delay: 2.5, duration: 13 },
  { size: 6, x: 38, delay: 1, duration: 9 },
  { size: 4, x: 55, delay: 3.5, duration: 12 },
  { size: 3, x: 72, delay: 0.5, duration: 11 },
  { size: 5, x: 85, delay: 4, duration: 14 },
  { size: 4, x: 92, delay: 1.5, duration: 10 },
  { size: 3, x: 48, delay: 5, duration: 15 },
];

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
};

const FEATURED_DATE_COLORS = [
  "from-blue-500 to-indigo-500",
  "from-sky-500 to-blue-500",
  "from-cyan-500 to-sky-500",
  "from-indigo-500 to-blue-500",
];

const formatTime12Hour = (time24: string) => {
  const [hoursRaw, minutesRaw] = time24.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time24;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getCalendarDays = (date: Date, highlightedDays: number[]): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const totalCells = firstDayOffset + daysInMonth;
  const trailingBlanks = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const leadingBlankCells = Array.from({ length: firstDayOffset }, () => ({ day: "", highlighted: false }));

  const monthCells = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    return {
      day: `${dayNumber}`,
      highlighted: highlightedDays.includes(dayNumber),
    };
  });

  const trailingBlankCells = Array.from({ length: trailingBlanks }, () => ({ day: "", highlighted: false }));

  return [...leadingBlankCells, ...monthCells, ...trailingBlankCells];
};

const HomeContainer = () => {
  const { isLoggedIn, backendUrl } = useContext(AppContext);

  const [apiEvents, setApiEvents] = useState<ApiEvent[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  const heroParticles = useMemo(() => HERO_PARTICLES, []);
  const heroStats = useMemo(() => HERO_STATS, []);

  const activeMonthDate = useMemo(() => new Date(), []);

  const monthYearLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(activeMonthDate);
  }, [activeMonthDate]);

  const eventsForActiveMonth = useMemo(() => {
    return apiEvents.filter((event) => {
      const date = new Date(event.eventDate);
      return date.getFullYear() === activeMonthDate.getFullYear() && date.getMonth() === activeMonthDate.getMonth();
    });
  }, [apiEvents, activeMonthDate]);

  const upcomingEvents = useMemo<UpcomingEvent[]>(() => {
    return apiEvents.map((event) => ({
      id: event._id,
      title: event.eventTitle,
      description: event.description,
      image: event.imageLink,
      category: `${event.category.charAt(0).toUpperCase()}${event.category.slice(1)}`,
      readTime: `${Math.ceil(event.expectedAttendees / 10)} min read`,
    }));
  }, [apiEvents]);

  const calendarEventMap = useMemo<CalendarEventMap>(() => {
    return eventsForActiveMonth.reduce<CalendarEventMap>((accumulator, event) => {
      const day = new Date(event.eventDate).getDate().toString();
      const startTime = formatTime12Hour(event.startTime);
      const endTime = formatTime12Hour(event.endTime);

      accumulator[day] = {
        title: event.eventTitle,
        time: `${startTime} - ${endTime}`,
        location: event.venue || "TBA",
      };

      return accumulator;
    }, {});
  }, [eventsForActiveMonth]);

  const highlightedDays = useMemo(
    () => Object.keys(calendarEventMap).map((day) => Number(day)),
    [calendarEventMap],
  );

  const calendarDays = useMemo(() => getCalendarDays(activeMonthDate, highlightedDays), [activeMonthDate, highlightedDays]);

  const featuredDates = useMemo<FeaturedDate[]>(() => {
    return eventsForActiveMonth
      .slice()
      .sort((left, right) => new Date(left.eventDate).getTime() - new Date(right.eventDate).getTime())
      .slice(0, 4)
      .map((event, index) => ({
        date: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
        }).format(new Date(event.eventDate)),
        name: event.eventTitle,
        color: FEATURED_DATE_COLORS[index % FEATURED_DATE_COLORS.length],
      }));
  }, [eventsForActiveMonth]);

  const fetchUpcomingEvents = useCallback(async () => {
    setIsEventsLoading(true);

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${backendUrl}/api/event/events`);
      const payload = response.data;

      if (!payload?.success) {
        toast.error(payload?.message || "Failed to load events.");
        setApiEvents([]);
        return;
      }

      const eventsFromApi = Array.isArray(payload.message) ? payload.message : [];

      setApiEvents(eventsFromApi);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong while loading events.");
      setApiEvents([]);
    } finally {
      setIsEventsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  return (
    <HomePresenter
      isLoggedIn={isLoggedIn}
      isEventsLoading={isEventsLoading}
      upcomingEvents={upcomingEvents}
      calendarDays={calendarDays}
      calendarEventMap={calendarEventMap}
      monthYearLabel={monthYearLabel}
      featuredDates={featuredDates}
      heroParticles={heroParticles}
      heroStats={heroStats}
      onRetryEvents={fetchUpcomingEvents}
    />
  );
};

export default HomeContainer;

