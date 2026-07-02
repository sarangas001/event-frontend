import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle2, Clock3, XCircle, Calendar, MapPin, Users } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { AppContext } from "@/context/AppContext";
import { formatDate, formatDateTime, formatRole, formatTime } from "../lib/formatters";

type EventData = {
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

type WorkflowDetailItem = {
  stage: string;
  role: string;
  decision: string;
  comment: string;
  at?: string | null;
  actor?: { fullName?: string; email?: string; role?: string } | null;
};

type WorkflowEventDetailResponse = {
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
    classroomName?: string;
    status: string;
    approvalStage?: string;
    approvalRole?: string;
  };
  workflow: {
    status?: string;
    currentStage?: string;
    currentRole?: string;
    history: WorkflowDetailItem[];
    requiresSecurity?: boolean;
    securityImageUrl?: string;
    securitySubmittedAt?: string | null;
    returnedToPresidentAt?: string | null;
    finalApprovedAt?: string | null;
  };
  relations?: {
    president?: { fullName?: string; email?: string; role?: string } | null;
  };
};

type WorkflowItem = {
  _id: string;
  role: string;
  status: "approved" | "pending" | "rejected" | string;
  message?: string;
  updatedAt?: string;
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const appContext = useContext(AppContext);

  if (!appContext) return null;

  const { backendUrl, userData } = appContext;

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([]);
  const [workflowCurrentRole, setWorkflowCurrentRole] = useState<string | null>(null);
  const [workflowCurrentStage, setWorkflowCurrentStage] = useState<string | null>(null);
  const [workflowStatusStr, setWorkflowStatusStr] = useState<string | null>(null);
  const [isPresidentOfEvent, setIsPresidentOfEvent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [organizerResponseMessage, setOrganizerResponseMessage] = useState("");
  const [workflowRequiresSecurity, setWorkflowRequiresSecurity] = useState<boolean>(false);
  const [workflowSecurityImageUrl, setWorkflowSecurityImageUrl] = useState<string | null>(null);
  const [isUploadingSecurity, setIsUploadingSecurity] = useState<boolean>(false);
  const securityInputRef = useRef<HTMLInputElement | null>(null);

  const fetchEventAndWorkflow = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(`${backendUrl}/api/workflow/event/${id}`);
      if (!data?.success) {
        toast.error(data?.message || "Failed to load event details.");
        setEventData(null);
        setWorkflowItems([]);
        return;
      }

      const payload = data.message as WorkflowEventDetailResponse;
      setEventData({
        _id: id,
        eventTitle: payload.event.title || "Untitled Event",
        description: payload.event.description || "",
        category: payload.event.category || "",
        eventDate: payload.event.eventDate || "",
        expectedAttendees: payload.event.expectedAttendees || 0,
        startTime: payload.event.startTime || "",
        endTime: payload.event.endTime || "",
        venue: payload.event.venueName || "",
        imageLink: payload.event.coverImageUrl || "",
        isApproved: payload.event.status === "approved",
        organizationId: "",
        classRoomName: payload.event.classroomName || "",
      });

      setWorkflowRequiresSecurity(Boolean(payload.workflow?.requiresSecurity));
      setWorkflowSecurityImageUrl(payload.workflow?.securityImageUrl || null);

      setWorkflowItems(
        Array.isArray(payload.workflow?.history)
          ? payload.workflow.history.map((item, index) => ({
              _id: `${item.stage}-${index}`,
              role: item.role || "",
              status: item.decision === "submitted" ? "pending" : item.decision,
              message: item.comment || "",
              updatedAt: item.at || undefined,
            }))
          : []
      );
      // set current workflow stage/role/status for pending display
      setWorkflowCurrentRole(payload.workflow?.currentRole || payload.event.approvalRole || null);
      setWorkflowCurrentStage(payload.workflow?.currentStage || payload.event.approvalStage || null);
      setWorkflowStatusStr(payload.workflow?.status || payload.event.status || null);
      // determine if current user is the president for this event
      const currUserEmail = userData?.email;
      const presidentEmail = payload.relations?.president?.email || null;
      setIsPresidentOfEvent(Boolean(currUserEmail && presidentEmail && currUserEmail === presidentEmail));
    } catch (error: any) {
      toast.error(error?.message || "Failed to load event details.");
      setEventData(null);
      setWorkflowItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, id]);

  useEffect(() => {
    fetchEventAndWorkflow();
  }, [fetchEventAndWorkflow]);

  const progress = useMemo(() => {
    if (workflowStatusStr === "approved" || eventData?.isApproved) {
      return 100;
    }

    if (workflowItems.length === 0) {
      return 0;
    }

    const completedCount = workflowItems.filter((item) =>
      ["approved", "submitted", "uploaded"].includes(String(item.status).toLowerCase())
    ).length;

    return Math.round((completedCount / workflowItems.length) * 100);
  }, [eventData?.isApproved, workflowItems, workflowStatusStr]);

  const workflowStatus = useMemo(() => {
    if (eventData?.isApproved === true) return "Fully Completed";
    if (workflowItems.some((item) => item.status === "rejected")) return "Rejected";
    if (workflowItems.length > 0 && workflowItems.every((item) => item.status === "approved")) return "Completed";
    if (workflowItems.length > 0 && workflowItems.some((item) => item.status === "approved")) return "In Progress";
    if (workflowItems.length > 0) return "Pending";
    return "Not Started";
  }, [eventData?.isApproved, workflowItems]);

  const latestWorkflowItem = useMemo(() => {
    if (workflowItems.length === 0) return null;
    return workflowItems[workflowItems.length - 1];
  }, [workflowItems]);

  const latestRejectedItem = useMemo(() => {
    for (let index = workflowItems.length - 1; index >= 0; index -= 1) {
      if (workflowItems[index].status === "rejected") {
        return workflowItems[index];
      }
    }
    return null;
  }, [workflowItems]);

  const canOpenEditMode = Boolean(latestRejectedItem);

  const handleSubmitOrganizerResponse = async () => {
    const trimmedMessage = organizerResponseMessage.trim();
    if (!trimmedMessage) {
      toast.error("Please add your update message before continuing.");
      return;
    }

    try {
      setIsSubmittingResponse(true);
      axios.defaults.withCredentials = true;

      const response = await axios.post(`${backendUrl}/api/workflow/decision`, {
        eventId: id,
        status: "approved",
        comment: trimmedMessage,
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || "Failed to submit workflow update.");
        return;
      }

      toast.success("Update sent successfully. Workflow moved to the next step.");
      setOrganizerResponseMessage("");
      await fetchEventAndWorkflow();
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit workflow update.");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const openSecurityPicker = () => securityInputRef.current?.click();

  const handleSecurityFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return toast.error('No file selected');

    try {
      setIsUploadingSecurity(true);
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', 'event-registration');

      const cloudResp = await axios.post('https://api.cloudinary.com/v1_1/dadxdprtg/image/upload', form, { withCredentials: false });
      const imageUrl = cloudResp?.data?.secure_url;
      if (!imageUrl) throw new Error('Cloud upload failed');

      axios.defaults.withCredentials = true;
      const resp = await axios.post(`${backendUrl}/api/workflow/security-upload`, { eventId: id, imageUrl });
      if (!resp.data?.success) {
        throw new Error(resp.data?.message || 'Upload failed');
      }

      toast.success('Security image uploaded');
      setWorkflowSecurityImageUrl(imageUrl);
      setWorkflowRequiresSecurity(false);
      await fetchEventAndWorkflow();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Security upload failed');
    } finally {
      setIsUploadingSecurity(false);
      if (securityInputRef.current) securityInputRef.current.value = '';
    }
  };

  return (
    <MainLayout title="Event Detail" subtitle="Real-time event and approval workflow details">
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-2">
        <div className="mb-4 text-xs text-slate-400">
          <Link to="/my-events" className="font-medium hover:text-blue-600">My Events</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-600">Event Detail</span>
        </div>

        {isLoading && <p className="rounded-xl border bg-white p-6 text-sm text-slate-500">Loading event and workflow...</p>}

        {!isLoading && !eventData && <p className="rounded-xl border bg-white p-6 text-sm text-red-500">Event not found.</p>}

        {!isLoading && eventData && (
          <>
            <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-60 w-full overflow-hidden">
                <img src={eventData.imageLink} alt={eventData.eventTitle} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="inline-flex rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
                    {eventData.isApproved
                      ? "Fully Completed Event"
                      : (workflowStatusStr === 'pending' || workflowStatus === 'Pending')
                        ? `Pending — ${workflowCurrentRole ? formatRole(workflowCurrentRole) : 'Awaiting reviewer'}`
                        : "Pending Approval"}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold">{eventData.eventTitle}</h1>
                  <p className="mt-2 max-w-3xl text-sm text-white/90">{eventData.description}</p>
                </div>
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="text-xl font-semibold text-slate-900">Workflow timeline</h2>
                <p className="mt-1 text-sm text-slate-500">Status: <span className="font-semibold text-slate-700">{workflowStatus}</span></p>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-700">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {workflowCurrentStage && (((userData?.role === 'president') && isPresidentOfEvent) || userData?.role !== 'president') && (
                    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                      <p className="text-xs text-slate-500">Current approval stage</p>
                      <p className="mt-1 font-semibold text-slate-800">{formatRole(workflowCurrentStage)}</p>
                      <p className="mt-1 text-xs text-slate-500">Assigned role: <span className="font-medium text-slate-700">{workflowCurrentRole ? formatRole(workflowCurrentRole) : '-'}</span></p>
                    </div>
                  )}
                  {workflowItems.length === 0 && (
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No workflow records found for this event.</p>
                  )}

                  {workflowItems.map((item, index) => {
                    const approved = item.status === "approved";
                    const rejected = item.status === "rejected";
                    const pending = item.status === "pending";

                    return (
                      <article key={item._id || `${item.role}-${index}`} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {approved && <CheckCircle2 size={16} className="text-emerald-500" />}
                            {rejected && <XCircle size={16} className="text-red-500" />}
                            {pending && <Clock3 size={16} className="text-amber-500" />}
                            {!approved && !rejected && !pending && <Clock3 size={16} className="text-slate-400" />}
                            <h3 className="text-sm font-semibold text-slate-800">{formatRole(item.role)}</h3>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                              approved
                                ? "bg-emerald-50 text-emerald-700"
                                : rejected
                                  ? "bg-red-50 text-red-700"
                                  : pending
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-500">Updated: <span className="font-medium text-slate-700">{formatDateTime(item.updatedAt)}</span></p>
                        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{item.message?.trim() ? item.message : "No message provided."}</p>
                      </article>
                    );
                  })}
                </div>
              </section>

              <aside className="space-y-5">
                {canOpenEditMode && (
                  <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Edit access</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Edit access is available only after a workflow rejection.
                    </p>

                    {latestRejectedItem?.message?.trim() && (
                      <div className="mt-4 rounded-xl border border-amber-200 bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-700">
                          Rejection note from {formatRole(latestRejectedItem.role)}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">{latestRejectedItem.message}</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <label htmlFor="organizer-response" className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Your message
                      </label>
                      <textarea
                        id="organizer-response"
                        value={organizerResponseMessage}
                        onChange={(event) => setOrganizerResponseMessage(event.target.value)}
                        rows={4}
                        placeholder="I changed the date. Please continue the workflow."
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitOrganizerResponse}
                      disabled={isSubmittingResponse}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingResponse ? "Submitting..." : "Submit update and continue workflow"}
                    </button>
                  </section>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Event summary</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <p className="flex items-start gap-2 text-slate-600"><Calendar size={15} className="mt-0.5 text-blue-500" /> {formatDate(eventData.eventDate)}</p>
                    <p className="flex items-start gap-2 text-slate-600"><Clock3 size={15} className="mt-0.5 text-blue-500" /> {formatTime(eventData.startTime)} - {formatTime(eventData.endTime)}</p>
                    <p className="flex items-start gap-2 text-slate-600"><MapPin size={15} className="mt-0.5 text-blue-500" /> {eventData.venue}</p>
                    <p className="flex items-start gap-2 text-slate-600"><Users size={15} className="mt-0.5 text-blue-500" /> {eventData.expectedAttendees} attendees</p>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
                  <div className="mt-4 space-y-2">
                      <input ref={securityInputRef} type="file" accept=".png, .jpg, .jpeg" className="hidden" onChange={handleSecurityFileChange} />
                      {userData?.role === 'president' && isPresidentOfEvent && workflowRequiresSecurity && !workflowSecurityImageUrl && (
                        <button
                          type="button"
                          onClick={openSecurityPicker}
                          disabled={isUploadingSecurity}
                          className="inline-flex w-full justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 mb-2"
                        >
                          {isUploadingSecurity ? 'Uploading...' : 'Upload security image'}
                        </button>
                      )}
                      {workflowSecurityImageUrl && (
                        <div className="mb-2">
                          <p className="text-xs text-slate-500">Security proof</p>
                          <a href={workflowSecurityImageUrl} target="_blank" rel="noreferrer" className="inline-block mt-2">
                            <img src={workflowSecurityImageUrl} alt="Security proof" className="w-full max-w-xs rounded-lg border" />
                          </a>
                        </div>
                      )}
                    {canOpenEditMode ? (
                      <Link to={`/event-edit/${eventData._id}`} className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        Open event edit mode
                      </Link>
                    ) : null}
                    <Link to="/my-events" className="inline-flex w-full justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      Back to my events
                    </Link>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default EventDetail;
