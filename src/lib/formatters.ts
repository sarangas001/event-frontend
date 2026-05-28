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