type StatusBadgeProps = {
  status: string;
};

const STATUS_MAP: Record<string, { pill: string; dot: string; label: string }> = {
  Pending: { pill: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500", label: "Pending" },
  Approved: { pill: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500", label: "Approved" },
  Overdue: { pill: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500", label: "Overdue" },
  "In Review": { pill: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-500", label: "In Review" },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = STATUS_MAP[status] ?? STATUS_MAP.Pending;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
