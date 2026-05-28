import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Building2, Calendar, Clock3, MapPin, Mail, Users, ClipboardList, ShieldCheck, FileText, UserCircle2 } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { AppContext } from "@/context/AppContext";
import { formatDate, formatRole, formatTime } from "../lib/formatters";

type Person = {
  fullName: string;
  email: string;
  role: string;
  department?: string;
  organizerProfile?: { clubSociety?: string; position?: string; advisorName?: string; advisorEmail?: string } | null;
  lectureProfile?: { facultyName?: string; position?: string; universityEmail?: string } | null;
};

type ApprovalDetailResponse = {
  event: {
    title: string;
    description: string;
    category: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    expectedAttendees: number;
    venueName: string;
    coverImageUrl: string;
    classroomName: string;
    status: string;
    approvalStage: string;
    approvalRole: string;
    requiresSecurity: boolean;
    publicVisible: boolean;
    approvedAt?: string | null;
    rejectedAt?: string | null;
  };
  relations: {
    organization: {
      name: string;
      type: string;
      authorityType: string;
      presidentName: string;
      email: string;
      projectCount: number;
    } | null;
    project: {
      name: string;
      description: string;
      status: string;
      organizationAuthorityType: string;
      organizationAuthority: Person | null;
      president: Person | null;
    } | null;
    venue: {
      name: string;
      capacity: number;
      type: string;
      ownerType: string;
      owner: Person | null;
    } | null;
    president: Person | null;
  };
  workflow: {
    status: string;
    currentStage: string;
    currentRole: string;
    requiresSecurity: boolean;
    securityImageUrl: string;
    securitySubmittedAt?: string | null;
    returnedToPresidentAt?: string | null;
    finalApprovedAt?: string | null;
    history: Array<{
      stage: string;
      role: string;
      decision: string;
      comment: string;
      at?: string | null;
      actor: Person | null;
    }>;
  };
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  returned: "bg-red-50 text-red-700 border-red-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const ApprovalEventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  if (!appContext) return null;

  const { backendUrl } = appContext;
  const [detail, setDetail] = useState<ApprovalDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workflowComment, setWorkflowComment] = useState("");
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!eventId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(`${backendUrl}/api/workflow/event/${eventId}`);
        if (!data?.success) {
          toast.error(data?.message || "Failed to load approval details.");
          setDetail(null);
          return;
        }

        setDetail(data.message as ApprovalDetailResponse);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load approval details.");
        setDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [backendUrl, eventId]);

  const currentStep = useMemo(() => formatRole(detail?.workflow?.currentStage), [detail?.workflow?.currentStage]);
  const currentRole = useMemo(() => formatRole(detail?.workflow?.currentRole), [detail?.workflow?.currentRole]);
  const canActOnWorkflow = detail?.workflow?.status === "pending";

  const submitWorkflowDecision = async (status: "approved" | "rejected") => {
    if (!eventId || !detail) return;

    if (status === "rejected" && !workflowComment.trim()) {
      toast.error("Please add a rejection message.");
      return;
    }

    try {
      setIsSubmittingDecision(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/workflow/decision`, {
        eventId,
        status,
        comment: workflowComment.trim(),
      });

      if (!data?.success) {
        toast.error(data?.message || "Failed to update workflow.");
        return;
      }

      toast.success(status === "approved" ? "Workflow approved." : "Workflow rejected.");
      setWorkflowComment("");

      const refreshed = await axios.get(`${backendUrl}/api/workflow/event/${eventId}`);
      if (refreshed.data?.success) {
        setDetail(refreshed.data.message as ApprovalDetailResponse);
      }
      navigate("/approval-dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to update workflow.");
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  return (
    <MainLayout title="Approval Event Detail" subtitle="Event, relation, and workflow context without raw identifiers">
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-2">
        <button
          type="button"
          onClick={() => navigate("/approval-dashboard")}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft size={15} />
          Back to approval dashboard
        </button>

        {isLoading && <p className="rounded-2xl border bg-white p-6 text-sm text-slate-500">Loading event detail...</p>}

        {!isLoading && !detail && <p className="rounded-2xl border bg-white p-6 text-sm text-red-500">Event detail not available.</p>}

        {!isLoading && detail && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative min-h-[280px] overflow-hidden">
                {detail.event.coverImageUrl ? (
                  <img src={detail.event.coverImageUrl} alt={detail.event.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-8">
                  <p className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${statusStyles[detail.workflow.status] || "bg-white/15 text-white border-white/20"}`}>
                    {detail.workflow.status || "pending"}
                  </p>
                  <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight md:text-5xl">{detail.event.title}</h1>
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-white/85 md:text-base">{detail.event.description}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">Event overview</p>
                      <h2 className="mt-1 text-2xl font-semibold text-slate-900">{detail.event.title}</h2>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${statusStyles[detail.event.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {formatRole(detail.event.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Date</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800"><Calendar size={14} className="text-blue-500" /> {formatDate(detail.event.eventDate)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Time</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800"><Clock3 size={14} className="text-blue-500" /> {formatTime(detail.event.startTime)} - {formatTime(detail.event.endTime)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Venue</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800"><MapPin size={14} className="text-blue-500" /> {detail.event.venueName || "-"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Expected attendees</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800"><Users size={14} className="text-blue-500" /> {detail.event.expectedAttendees}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-blue-500" />
                    <h2 className="text-xl font-semibold text-slate-900">Workflow timeline</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Current stage: <span className="font-semibold text-slate-700">{currentStep}</span> and assigned role: <span className="font-semibold text-slate-700">{currentRole}</span></p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Requires security</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{detail.workflow.requiresSecurity ? "Yes" : "No"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Security submitted</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(detail.workflow.securitySubmittedAt)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Final approval</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(detail.workflow.finalApprovedAt)}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {detail.workflow.history.length === 0 && (
                      <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No workflow entries recorded yet.</p>
                    )}

                    {detail.workflow.history.map((item, index) => (
                      <article key={`${item.stage}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">{formatRole(item.stage)}</p>
                            <h3 className="mt-1 text-base font-semibold text-slate-900">{formatRole(item.role)}</h3>
                          </div>
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${statusStyles[item.decision] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {item.decision}
                          </span>
                        </div>
                        <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          <p className="flex items-center gap-2"><UserCircle2 size={14} className="text-blue-500" /> {item.actor?.fullName || item.actor?.role || "System"}</p>
                          <p className="flex items-center gap-2"><Mail size={14} className="text-blue-500" /> {item.actor?.email || "-"}</p>
                        </div>
                        <p className="mt-2 text-xs text-slate-400">{formatDate(item.at)}</p>
                        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">{item.comment || "No comment provided."}</p>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-blue-500" />
                    <h2 className="text-xl font-semibold text-slate-900">Workflow action</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Add a short note before approving or rejecting the workflow step.
                  </p>

                  <div className="mt-4">
                    <label htmlFor="workflow-comment" className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                      Message
                    </label>
                    <textarea
                      id="workflow-comment"
                      value={workflowComment}
                      onChange={(event) => setWorkflowComment(event.target.value)}
                      rows={4}
                      placeholder="Leave a note for the next reviewer or for the organizer."
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      disabled={!canActOnWorkflow || isSubmittingDecision}
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => submitWorkflowDecision("approved")}
                      disabled={!canActOnWorkflow || isSubmittingDecision}
                      className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingDecision ? "Submitting..." : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => submitWorkflowDecision("rejected")}
                      disabled={!canActOnWorkflow || isSubmittingDecision}
                      className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>

                  {!canActOnWorkflow && (
                    <p className="mt-3 text-xs text-slate-400">
                      Workflow actions are disabled because this event is no longer pending.
                    </p>
                  )}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-blue-500" />
                    <h2 className="text-xl font-semibold text-slate-900">Related records</h2>
                  </div>

                  <div className="mt-5 space-y-4 text-sm">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Organization</p>
                      <p className="mt-1 font-semibold text-slate-800">{detail.relations.organization?.name || "-"}</p>
                      <p className="mt-1 text-slate-600">{detail.relations.organization?.type || "-"}</p>
                      <p className="mt-1 text-slate-500">Authority: {formatRole(detail.relations.organization?.authorityType)}</p>
                      <p className="mt-1 text-slate-500">Contact: {detail.relations.organization?.email || "-"}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Project</p>
                      <p className="mt-1 font-semibold text-slate-800">{detail.relations.project?.name || "-"}</p>
                      <p className="mt-1 text-slate-600">{detail.relations.project?.description || "-"}</p>
                      <p className="mt-1 text-slate-500">Authority: {formatRole(detail.relations.project?.organizationAuthorityType)}</p>
                      <p className="mt-1 text-slate-500">President: {detail.relations.project?.president?.fullName || "-"}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Venue</p>
                      <p className="mt-1 font-semibold text-slate-800">{detail.relations.venue?.name || "-"}</p>
                      <p className="mt-1 text-slate-500">Type: {detail.relations.venue?.type || "-"}</p>
                      <p className="mt-1 text-slate-500">Capacity: {detail.relations.venue?.capacity || 0}</p>
                      <p className="mt-1 text-slate-500">Owner: {detail.relations.venue?.owner?.fullName || "-"}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">President</p>
                      <p className="mt-1 font-semibold text-slate-800">{detail.relations.president?.fullName || "-"}</p>
                      <p className="mt-1 text-slate-500">{detail.relations.president?.email || "-"}</p>
                      <p className="mt-1 text-slate-500">Role: {formatRole(detail.relations.president?.role)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-500" />
                    <h2 className="text-xl font-semibold text-slate-900">Approval summary</h2>
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Category: <span className="font-semibold text-slate-800">{formatRole(detail.event.category)}</span></p>
                    <p>Approval stage: <span className="font-semibold text-slate-800">{formatRole(detail.event.approvalStage)}</span></p>
                    <p>Assigned role: <span className="font-semibold text-slate-800">{formatRole(detail.event.approvalRole)}</span></p>
                    <p>Public visibility: <span className="font-semibold text-slate-800">{detail.event.publicVisible ? "Visible" : "Hidden"}</span></p>
                  </div>

                  {detail.workflow.securityImageUrl && (
                    <a
                      href={detail.workflow.securityImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      <FileText size={15} />
                      Open security attachment
                    </a>
                  )}
                </div>
              </aside>
            </section>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ApprovalEventDetail;
