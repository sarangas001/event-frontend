import { useContext } from "react";
import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  X,
} from "lucide-react";

import { AppContext } from "@/context/AppContext";

import Avatar from "./components/Avatar";
import SideNavItem from "./components/SideNavItem";
import StatusBadge from "./components/StatusBadge";
import { useApprovalDashboard } from "./hooks/useApprovalDashboard";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ApprovalDashboardFeature = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  if (!appContext) return null;

  const { backendUrl, setIsLoggedIn, userData } = appContext;
  const dashboard = useApprovalDashboard({
    backendUrl,
    isStudent: userData?.role === "student",
    onLoggedOut: () => setIsLoggedIn(false),
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family:'Playfair Display',Georgia,serif; }
        .font-body    { font-family:'DM Sans',system-ui,sans-serif; }
        .dash-root { font-family:'DM Sans',system-ui,sans-serif; background:#f8fafc; }
        .sidebar { background:rgba(255,255,255,0.94); border-right:1px solid rgba(226,232,240,0.8); box-shadow:2px 0 16px rgba(59,130,246,0.05); }
        .dash-header { background:rgba(255,255,255,0.95); backdrop-filter:blur(16px); border-bottom:1px solid rgba(226,232,240,0.8); box-shadow:0 2px 8px rgba(59,130,246,0.04); }
        .filter-bar { background:rgba(255,255,255,0.90); backdrop-filter:blur(12px); border-bottom:1px solid rgba(226,232,240,0.7); }
        .events-table { background:white; border:1px solid rgba(226,232,240,0.8); border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(59,130,246,0.04); }
        .table-row { transition:background 0.15s, box-shadow 0.15s; border-bottom:1px solid #f1f5f9; }
        .table-row:hover { background:#f8faff; box-shadow:inset 3px 0 0 #3b82f6; }
        .table-row.selected { background:#eff6ff; box-shadow:inset 3px 0 0 #3b82f6; }
        .table-row:last-child { border-bottom:none; }
        .search-input { background:white; border:1.5px solid #e2e8f0; border-radius:12px; transition:all 0.22s; font-family:'DM Sans',system-ui,sans-serif; }
        .search-input:focus { border-color:#3b82f6; box-shadow:0 0 0 4px rgba(59,130,246,0.10); outline:none; }
        .search-input::placeholder { color:#94a3b8; }
        .filter-select { background:white; border:1.5px solid #e2e8f0; border-radius:12px; font-family:'DM Sans',system-ui,sans-serif; transition:all 0.22s; }
        .filter-select:focus { border-color:#3b82f6; box-shadow:0 0 0 4px rgba(59,130,246,0.10); outline:none; }
        .action-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition:all 0.18s; border:1.5px solid transparent; }
        .action-icon:hover { transform:translateY(-1px); }
        .action-icon-view    { color:#64748b; } .action-icon-view:hover    { background:#eff6ff; border-color:#bfdbfe; color:#2563eb; }
        .action-icon-comment { color:#64748b; } .action-icon-comment:hover { background:#f0fdf4; border-color:#bbf7d0; color:#059669; }
        .action-icon-check   { color:#059669; } .action-icon-check:hover   { background:#f0fdf4; border-color:#bbf7d0; color:#059669; }
        .action-icon-x       { color:#ef4444; } .action-icon-x:hover       { background:#fef2f2; border-color:#fecaca; color:#dc2626; }
        .detail-panel { background:white; border:1px solid rgba(226,232,240,0.8); border-radius:20px; box-shadow:0 4px 32px rgba(59,130,246,0.10); animation:panelSlide 0.3s cubic-bezier(0.4,0,0.2,1) both; overflow:hidden; }
        @keyframes panelSlide { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        .event-info-card { background:linear-gradient(135deg,#eff6ff,#f0f9ff); border:1.5px solid #bfdbfe; border-radius:16px; }
        .comment-item { background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; transition:border-color 0.18s; }
        .comment-item:hover { border-color:#bfdbfe; }
        .btn-approve { background:linear-gradient(135deg,#059669,#10b981); box-shadow:0 4px 12px rgba(16,185,129,0.28); transition:all 0.22s; position:relative; overflow:hidden; }
        .btn-approve:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(16,185,129,0.38); }
        .btn-reject  { background:white; border:1.5px solid #fecaca; color:#dc2626; transition:all 0.22s; }
        .btn-reject:hover  { background:#fef2f2; border-color:#fca5a5; transform:translateY(-1px); }
        .btn-revision { background:white; border:1.5px solid #bfdbfe; color:#2563eb; transition:all 0.22s; }
        .btn-revision:hover { background:#eff6ff; border-color:#93c5fd; transform:translateY(-1px); }
        .btn-send { background:linear-gradient(135deg,#2563eb,#3b82f6); box-shadow:0 3px 10px rgba(59,130,246,0.28); transition:all 0.22s; }
        .btn-send:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(59,130,246,0.38); }
        .btn-shine { position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.12) 50%,transparent 60%);background-size:200% 100%;animation:shine 3s linear infinite; }
        @keyframes shine { from{background-position:200% 0} to{background-position:-200% 0} }
        .page-btn { width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;border:1.5px solid #e2e8f0;background:white;color:#64748b;transition:all 0.18s; }
        .page-btn:hover { border-color:#3b82f6;color:#2563eb;background:#eff6ff; }
        .page-btn.active { background:linear-gradient(135deg,#2563eb,#3b82f6);border-color:transparent;color:white;box-shadow:0 3px 10px rgba(59,130,246,0.28); }
        .row-fade { animation:rowFade 0.4s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes rowFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .stat-pill { background:linear-gradient(135deg,#eff6ff,#f0f9ff); border:1.5px solid #bfdbfe; }
        .logo-badge { background:linear-gradient(135deg,#1d4ed8,#3b82f6); box-shadow:0 3px 10px rgba(59,130,246,0.30); }
        .table-row.overdue-row:hover { box-shadow:inset 3px 0 0 #ef4444; }
        .comments-scroll::-webkit-scrollbar { width:4px; }
        .comments-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:99px; }
        .comments-scroll::-webkit-scrollbar-thumb { background:#bfdbfe; border-radius:99px; }
      `}</style>
        <Header />

        <div className="dash-root min-h-screen flex font-body">
        <aside className="sidebar fixed left-0 top-0 bottom-0 z-40 flex w-64 flex-col">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
            <div className="logo-badge flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>
            <div onClick={() => navigate("/")} className="cursor-pointer">
              <h1 className="font-display text-base font-medium text-slate-800">
                Eventraze
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
                Approval Portal
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Queue
            </p>
            <SideNavItem
              icon={<Clock size={16} />}
              label="Pending"
              count={dashboard.statusCounts.pending}
              active={dashboard.activeNav === "pending"}
              onClick={() => {
                dashboard.setActiveNav("pending");
                dashboard.setStatusFilter("pending");
              }}
            />
            <SideNavItem
              icon={<Eye size={16} />}
              label="In Review"
              count={dashboard.statusCounts.inReview}
              active={dashboard.activeNav === "in-review"}
              onClick={() => {
                dashboard.setActiveNav("in-review");
                dashboard.setStatusFilter("in-review");
              }}
            />
            <SideNavItem
              icon={<Check size={16} />}
              label="Completed"
              count={dashboard.statusCounts.completed}
              active={dashboard.activeNav === "completed"}
              onClick={() => {
                dashboard.setActiveNav("completed");
                dashboard.setStatusFilter("approved");
              }}
            />
            <SideNavItem
              icon={<AlertTriangle size={16} />}
              label="Overdue"
              count={dashboard.statusCounts.overdue}
              danger
              active={dashboard.activeNav === "overdue"}
              onClick={() => {
                dashboard.setActiveNav("overdue");
                dashboard.setStatusFilter("overdue");
              }}
            />

            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Account
              </p>
              <SideNavItem
                icon={<Clock size={16} />}
                label="My History"
                active={dashboard.activeNav === "history"}
                onClick={() => {
                  dashboard.setActiveNav("history");
                  dashboard.setStatusFilter("all");
                }}
              />
            </div>
          </nav>

          <div className="border-t border-slate-100 px-4 py-4">
            <div className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50">
              <Avatar name={dashboard.name || "User"} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-700">
                  {dashboard.name}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {dashboard.role}
                </p>
              </div>
              <Settings size={14} className="flex-shrink-0 text-slate-300" />
            </div>
          </div>
        </aside>

        <div className="ml-64 flex min-h-screen flex-1 flex-col">
          <header className="dash-header sticky top-0 z-30 flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-medium text-slate-800">
                Approval Dashboard
              </h1>
              <span className="stat-pill rounded-full px-3 py-1 text-xs font-bold text-blue-700">
                {dashboard.role}
              </span>
            </div>
          </header>

          <div className="filter-bar flex flex-wrap items-center gap-3 px-6 py-3.5">
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <input
                value={dashboard.searchQuery}
                onChange={(event) =>
                  dashboard.setSearchQuery(event.target.value)
                }
                placeholder="Search by organizer or event…"
                className="search-input w-full pl-10 pr-4 py-2.5 text-sm text-slate-700"
              />
              {dashboard.searchQuery && (
                <button
                  onClick={() => dashboard.setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={dashboard.statusFilter}
                onChange={(event) =>
                  dashboard.setStatusFilter(event.target.value)
                }
                className="filter-select appearance-none pl-3.5 pr-9 py-2.5 text-sm font-medium text-slate-600 shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-review">In Review</option>
                <option value="approved">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {(dashboard.searchQuery || dashboard.statusFilter !== "all") && (
              <button
                onClick={() => {
                  dashboard.setSearchQuery("");
                  dashboard.setStatusFilter("all");
                }}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-red-500"
              >
                Reset
              </button>
            )}
            <span className="ml-auto text-xs font-semibold text-slate-400">
              {dashboard.filteredEvents.length} events
            </span>
          </div>

          <div className="flex flex-1 gap-5 overflow-hidden p-5">
            <div
              className={`events-table flex flex-1 flex-col overflow-hidden ${dashboard.selectedEvent ? "min-w-0" : ""}`}
            >
              <div className="flex-1 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="w-10 p-3.5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded accent-blue-500"
                        />
                      </th>
                      {[
                        "Event Title",
                        "Organizer",
                        "Submitted",
                        "Status",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="p-3.5 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.isLoadingData && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-sm text-slate-500"
                        >
                          Loading approval queue...
                        </td>
                      </tr>
                    )}
                    {!dashboard.isLoadingData &&
                      dashboard.filteredEvents.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-8 text-center text-sm text-slate-500"
                          >
                            No workflow items found for your role.
                          </td>
                        </tr>
                      )}
                    {!dashboard.isLoadingData &&
                      dashboard.filteredEvents.map((event, index) => (
                        <tr
                          key={event.id}
                          className={`table-row row-fade cursor-pointer ${dashboard.selectedEvent?.id === event.id ? "selected" : ""} ${event.status === "Overdue" ? "overdue-row" : ""}`}
                          style={{ animationDelay: `${index * 0.05}s` }}
                          onClick={() =>
                            dashboard.openEventDetailPage(event.id)
                          }
                        >
                          <td className="w-10 p-3.5">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded accent-blue-500"
                              onClick={(eventClick) =>
                                eventClick.stopPropagation()
                              }
                            />
                          </td>
                          <td className="max-w-[220px] p-3.5">
                            <p
                              className={`truncate text-sm font-semibold ${dashboard.selectedEvent?.id === event.id ? "text-blue-700" : "text-slate-700"}`}
                            >
                              {event.title}
                            </p>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={event.organizer} size="sm" />
                              <span className="whitespace-nowrap text-sm text-slate-600">
                                {event.organizer}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap p-3.5 text-sm text-slate-400">
                            {event.submissionDate}
                          </td>
                          <td className="p-3.5">
                            <StatusBadge status={event.status} />
                          </td>
                          <td className="p-3.5">
                            <div
                              className="flex items-center gap-1"
                              onClick={(eventClick) =>
                                eventClick.stopPropagation()
                              }
                            >
                              <button
                                className="action-icon action-icon-view"
                                title="View"
                                onClick={() =>
                                  dashboard.openEventDetailPage(event.id)
                                }
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                className="action-icon action-icon-comment"
                                title="Comment"
                              >
                                <MessageCircle size={13} />
                              </button>
                              <button
                                className="action-icon action-icon-check"
                                title="Approve"
                                onClick={() => {
                                  dashboard.setSelectedEvent(event);
                                  dashboard.handleWorkflowAction("approved");
                                }}
                              >
                                <Check size={13} />
                              </button>
                              <button
                                className="action-icon action-icon-x"
                                title="Reject"
                                onClick={() => {
                                  dashboard.setSelectedEvent(event);
                                  dashboard.handleWorkflowAction("rejected");
                                }}
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3.5">
                <p className="text-xs text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-600">
                    {dashboard.filteredEvents.length}
                  </span>{" "}
                  of {dashboard.events.length} events
                </p>
                <div className="flex items-center gap-1.5">
                  <button className="page-btn">
                    <ChevronLeft size={14} />
                  </button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <button className="page-btn">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default ApprovalDashboardFeature;
