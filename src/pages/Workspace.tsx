import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, FileUp, Home, LogOut, RefreshCcw, Send, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type WorkflowItem = any;
type ProjectItem = any;
type EventItem = any;
type OrganizationItem = {
  _id: string;
  organizationName: string;
  organizationType?: string;
};

const stageLabel: Record<string, string> = {
  organizationAuthority: "Organization Authority",
  welfareOfficer: "Welfare Officer",
  venueOwner: "Venue Owner",
  categoryCheck: "Category Check",
  securityUpload: "Security Upload",
  finalOrganizationAuthority: "Final Organization Authority",
  proctor: "Proctor",
  viceChancellor: "Vice Chancellor",
  welfareFinal: "Welfare Final",
  approved: "Approved",
  returnedToPresident: "Returned to President",
};

const Workspace = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  if (!context) return null;
  const { userData, setIsLoggedIn, setUserData, backendUrl } = context;

  const role = userData?.role || "student";
  const canApprove = ["advisor", "dean", "welfareOfficer", "sportsDirector", "chairmanOfArt", "proctor", "viceChancellor"].includes(role);
  const canCreateProject = role === "president";
  const canCreateEvent = role === "president";

  const [activeTab, setActiveTab] = useState<"queue" | "project" | "events" | "security" | "timeline">("queue");
  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState<WorkflowItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [comment, setComment] = useState("");
  const [securityFile, setSecurityFile] = useState<File | null>(null);
  const [projectForm, setProjectForm] = useState({
    organizationId: "",
    projectName: "",
    description: "",
  });
  const [eventForm, setEventForm] = useState({
    projectId: "",
    title: "",
    description: "",
    category: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    expectedAttendees: "",
    venueName: "",
    classroomName: "",
    coverImageUrl: "",
  });

  useEffect(() => {
    if (role === "student") {
      navigate("/");
    }
  }, [role, navigate]);

  const tabs = useMemo(
    () =>
      [
        { key: "project", label: "Project Setup", show: canCreateProject },
        { key: "events", label: "My Events", show: canCreateEvent },
        { key: "security", label: "Security Upload", show: canCreateEvent },
        { key: "timeline", label: "Timeline View", show: true },
      ].filter((tab) => tab.show),
    [canApprove, canCreateEvent, canCreateProject],
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [queueRes, projectRes, organizationRes, eventRes] = await Promise.allSettled([
        api.get("/api/workflow/queue"),
        api.get("/api/project/list"),
        api.get("/api/project/organizations"),
        api.get("/api/event/mine"),
      ]);

      if (queueRes.status === "fulfilled" && queueRes.value.data?.success) {
        const nextQueue = Array.isArray(queueRes.value.data.message) ? queueRes.value.data.message : [];
        setQueue(nextQueue);
        setSelectedWorkflow(nextQueue[0] || null);
      } else {
        setQueue([]);
        setSelectedWorkflow(null);
      }

      if (projectRes.status === "fulfilled" && projectRes.value.data?.success) {
        setProjects(Array.isArray(projectRes.value.data.message) ? projectRes.value.data.message : []);
      } else {
        setProjects([]);
      }

      if (organizationRes.status === "fulfilled" && organizationRes.value.data?.success) {
        setOrganizations(Array.isArray(organizationRes.value.data.message) ? organizationRes.value.data.message : []);
      } else {
        setOrganizations([]);
      }

      if (eventRes.status === "fulfilled" && eventRes.value.data?.success) {
        setMyEvents(Array.isArray(eventRes.value.data.message) ? eventRes.value.data.message : []);
      } else {
        setMyEvents([]);
      }
    } catch (error) {
      toast.error("Unable to load workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [role]);

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/sign-in");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  const createProject = async () => {
    const { data } = await api.post("/api/project/create", projectForm);
    if (!data?.success) return toast.error(data?.message || "Unable to create project");
    toast.success("Project created");
    setProjectForm({
      organizationId: "",
      projectName: "",
      description: "",
    });
    loadData();
  };

  const createEvent = async () => {
    if (!eventForm.projectId) return toast.error("Please select a project");
    if (!eventForm.title.trim()) return toast.error("Event title is required");
    if (!eventForm.description.trim()) return toast.error("Event description is required");
    if (!eventForm.category.trim()) return toast.error("Event category is required");
    if (!eventForm.eventDate) return toast.error("Event date is required");
    if (!eventForm.startTime) return toast.error("Start time is required");
    if (!eventForm.endTime) return toast.error("End time is required");
    if (!eventForm.expectedAttendees || Number(eventForm.expectedAttendees) <= 0) {
      return toast.error("Expected attendees must be greater than 0");
    }
    if (!eventForm.venueName.trim()) return toast.error("Venue name is required");

    try {
      const { data } = await api.post("/api/event/create", {
        projectId: eventForm.projectId,
        title: eventForm.title.trim(),
        description: eventForm.description.trim(),
        category: eventForm.category.trim(),
        eventDate: eventForm.eventDate,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        expectedAttendees: Number(eventForm.expectedAttendees),
        venueName: eventForm.venueName.trim(),
        classroomName: eventForm.classroomName.trim(),
        coverImageUrl: eventForm.coverImageUrl.trim(),
      });

      if (!data?.success) return toast.error(data?.message || "Unable to create event");
      toast.success("Event submitted");
      setEventForm({
        projectId: "",
        title: "",
        description: "",
        category: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        expectedAttendees: "",
        venueName: "",
        classroomName: "",
        coverImageUrl: "",
      });
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Unable to create event");
    }
  };

  const decide = async (status: "approved" | "rejected") => {
    if (!selectedWorkflow?.event?._id) return;
    if (status === "rejected" && !comment.trim()) return toast.error("Comment required for rejection");
    const { data } = await api.post("/api/workflow/decision", {
      eventId: selectedWorkflow.event._id,
      status,
      comment: comment.trim(),
    });
    if (!data?.success) return toast.error(data?.message || "Unable to update");
    toast.success(status === "approved" ? "Approved" : "Rejected");
    setComment("");
    loadData();
  };

  const resubmit = async (eventId: string) => {
    const event = myEvents.find((e) => e._id === eventId);
    if (!event) return;
    const { data } = await api.post("/api/event/resubmit", { eventId, ...event });
    if (!data?.success) return toast.error(data?.message || "Unable to resubmit");
    toast.success("Event resubmitted");
    loadData();
  };

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadSecurity = async () => {
    if (!securityFile || !selectedWorkflow?.event?._id) return toast.error("Select an image");
    const imageUrl = await toDataUrl(securityFile);
    const { data } = await api.post("/api/workflow/security-upload", {
      eventId: selectedWorkflow.event._id,
      imageUrl,
    });
    if (!data?.success) return toast.error(data?.message || "Unable to upload security proof");
    toast.success("Security proof uploaded");
    setSecurityFile(null);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      <Header />
      <div className="flex">
        <aside className="w-72 min-h-screen bg-white border-r border-slate-200 p-5">
          <h2 className="font-display text-xl text-slate-800">Workflow Workspace</h2>
          <p className="text-xs text-slate-500 mt-1">{role}</p>
          <div className="mt-5 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-h-screen">
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
            <h1 className="font-display text-xl text-slate-800">Workspace</h1>
            <div className="flex gap-2">
              <button onClick={loadData} className="px-3 py-2 text-sm rounded-xl border bg-white hover:bg-slate-50"><RefreshCcw className="w-4 h-4 inline mr-1" />Refresh</button>
            </div>
          </header>

          <main className="p-6">
            {loading && <div className="text-sm text-slate-500 mb-4">Loading workspace...</div>}

            {activeTab === "queue" && canApprove && (
              <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
                <div className="bg-white border rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-3 text-left text-xs text-slate-500">Event</th>
                        <th className="p-3 text-left text-xs text-slate-500">Stage</th>
                        <th className="p-3 text-left text-xs text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queue.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-4 text-sm text-slate-500">No queue items for your role.</td>
                        </tr>
                      )}
                      {queue.map((item) => (
                        <tr key={item._id} onClick={() => setSelectedWorkflow(item)} className="border-t cursor-pointer hover:bg-slate-50">
                          <td className="p-3 text-sm text-slate-700">{item.event?.title || item.event?.eventTitle || "-"}</td>
                          <td className="p-3 text-sm text-slate-600">{stageLabel[item.currentStage] || item.currentStage}</td>
                          <td className="p-3 text-sm text-slate-600">{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white border rounded-2xl p-4">
                  <h3 className="font-semibold text-slate-800">Selected Item</h3>
                  {selectedWorkflow ? (
                    <div className="space-y-3 mt-3">
                      <div className="text-sm text-slate-600">{selectedWorkflow.event?.title || selectedWorkflow.event?.eventTitle}</div>
                      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment" className="w-full border rounded-xl p-2.5 text-sm" />
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => decide("approved")} className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-sm"><Check className="w-4 h-4 inline mr-1" />Approve</button>
                        <button onClick={() => decide("rejected")} className="px-3 py-2 rounded-xl bg-red-500 text-white text-sm"><X className="w-4 h-4 inline mr-1" />Reject</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 mt-3">Select an item from queue.</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === "project" && canCreateProject && (
              <section className="bg-white border rounded-2xl p-5 grid md:grid-cols-2 gap-3">
                <h3 className="md:col-span-2 font-semibold text-slate-800">Step 0: Create Project</h3>
                <select
                  className="border rounded-xl p-2.5 text-sm"
                  value={projectForm.organizationId}
                  onChange={(e) => setProjectForm((s) => ({ ...s, organizationId: e.target.value }))}
                >
                  <option value="">Select Organization</option>
                  {organizations.map((organization) => (
                    <option key={organization._id} value={organization._id}>
                      {organization.organizationName}{organization.organizationType ? ` (${organization.organizationType})` : ""}
                    </option>
                  ))}
                </select>
                <input placeholder="Project Name" className="border rounded-xl p-2.5 text-sm" value={projectForm.projectName} onChange={(e) => setProjectForm((s) => ({ ...s, projectName: e.target.value }))} />
                <textarea placeholder="Description" className="md:col-span-2 border rounded-xl p-2.5 text-sm" value={projectForm.description} onChange={(e) => setProjectForm((s) => ({ ...s, description: e.target.value }))} />
                <div className="md:col-span-2"><button onClick={createProject} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"><Send className="w-4 h-4 inline mr-1" />Create Project</button></div>
              </section>
            )}

            {activeTab === "events" && canCreateEvent && (
              <section className="space-y-5">
                <div className="bg-white border rounded-2xl p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">Step 1: Create Event</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Use the event registration wizard to submit your project event into the approval workflow.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/event-registration")}
                      disabled={projects.length === 0}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Open Event Registration
                    </button>
                  </div>
                  {projects.length === 0 && (
                    <p className="mt-3 text-xs text-amber-600">
                      No project found yet. Create your project first, then continue with event registration.
                    </p>
                  )}
                </div>

                <div className="bg-white border rounded-2xl p-5">
                  <h3 className="font-semibold text-slate-800">My Event Submissions</h3>
                  <div className="mt-3 space-y-2">
                    {myEvents.length === 0 && <p className="text-sm text-slate-500">No events yet.</p>}
                    {myEvents.map((event) => (
                      <div key={event._id} className="border rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{event.title || event.eventTitle}</p>
                          <p className="text-xs text-slate-500">{stageLabel[event.approvalStage] || event.approvalStage} • {event.status}</p>
                        </div>
                        {event.status === "returned" && <button onClick={() => resubmit(event._id)} className="px-3 py-1.5 text-xs rounded-lg border hover:bg-slate-50">Resubmit</button>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeTab === "security" && canCreateEvent && (
              <section className="bg-white border rounded-2xl p-5">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-500" />Step 4: Security Upload</h3>
                <p className="text-sm text-slate-500 mt-2">After 6:00 PM events require 5-signature image upload.</p>
                <div className="mt-4 border rounded-xl p-3">
                  <select className="w-full border rounded-xl p-2.5 text-sm" value={selectedWorkflow?._id || ""} onChange={(e) => setSelectedWorkflow(queue.find((q) => q._id === e.target.value) || null)}>
                    <option value="">Select Event In Security Stage</option>
                    {queue.filter((q) => q.currentStage === "securityUpload").map((q) => (
                      <option key={q._id} value={q._id}>{q.event?.title || q.event?.eventTitle}</option>
                    ))}
                  </select>
                  <input className="mt-3 w-full border rounded-xl p-2.5 text-sm" type="file" accept="image/*" onChange={(e) => setSecurityFile(e.target.files?.[0] || null)} />
                  <button onClick={uploadSecurity} className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-900 text-sm"><FileUp className="w-4 h-4 inline mr-1" />Submit Security Proof</button>
                </div>
              </section>
            )}

            {activeTab === "timeline" && (
              <section className="bg-white border rounded-2xl p-5">
                <h3 className="font-semibold text-slate-800">Timeline View</h3>
                <p className="text-sm text-slate-500 mt-1">Read-only stage history for selected workflow.</p>
                {selectedWorkflow?.history?.length ? (
                  <div className="mt-4 space-y-2">
                    {selectedWorkflow.history.map((item: any, idx: number) => (
                      <div key={`${item.at}-${idx}`} className="border rounded-xl p-3">
                        <p className="text-sm text-slate-700">{stageLabel[item.stage] || item.stage}</p>
                        <p className="text-xs text-slate-500">{item.role} • {item.decision} • {new Date(item.at).toLocaleString()}</p>
                        {item.comment ? <p className="text-xs text-slate-600 mt-1">{item.comment}</p> : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">Select a workflow item from Queue tab first.</p>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Workspace;
