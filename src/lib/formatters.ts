type DateFormatOptions = Intl.DateTimeFormatOptions;

const toTitleCase = (value?: string | null, fallback = "Unknown") => {
  if (!value) return fallback;

  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatRole = (value?: string | null) => toTitleCase(value);

export const formatDate = (
  value?: string | null,
  options: DateFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  },
  fallback = "-",
) => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const formatDateTime = (value?: string | null) =>
  formatDate(value, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export const formatTime = (value?: string | null) => {
  if (!value) return "-";

  const [hourRaw, minuteRaw] = value.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const isEventExpired = (eventDateStr: string, endTimeStr?: string) => {
  if (!eventDateStr) return true;

  const dateParts = eventDateStr.split("-");
  if (dateParts.length !== 3) {
    const parsedDate = new Date(eventDateStr);
    return isNaN(parsedDate.getTime()) ? true : parsedDate < new Date();
  }

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);

  let hours = 23;
  let minutes = 59;

  if (endTimeStr) {
    const timeParts = endTimeStr.split(":");
    if (timeParts.length >= 2) {
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
    }
  }

  const eventEndDate = new Date(year, month, day, hours, minutes, 59, 999);
  return eventEndDate < new Date();
};