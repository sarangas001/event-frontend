import type { ReactNode } from "react";

type SideNavItemProps = {
  icon: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
};

const SideNavItem = ({ icon, label, count, active = false, danger = false, onClick }: SideNavItemProps) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${active ? "border border-blue-100 bg-blue-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}
  >
    <span className={active ? "text-blue-500" : "text-slate-400"}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {count !== undefined && (
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${danger ? "border border-red-200 bg-red-100 text-red-600" : active ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
        {count}
      </span>
    )}
  </button>
);

export default SideNavItem;
