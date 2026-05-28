import { type ChangeEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import { AppContext } from "@/context/AppContext";

type EventDetails = {
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

type EditForm = {
  title: string;
  description: string;
  category: string;
  venue: string;
  venueId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  participantsCount: number;
  imageLink: string;
  _id: string;
};

type WorkflowItem = {
  _id: string;
  role: string;
  status: string;
  message?: string;
};

type VenueOption = {
  _id: string;
  venueName: string;
  ownerType?: string;
  type?: string;
};

const EventEditMode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { backendUrl } = appContext;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [eventPreview, setEventPreview] = useState<EventDetails | null>(null);
  const [canEditRejectedEvent, setCanEditRejectedEvent] = useState(false);
  const [editGuardMessage, setEditGuardMessage] = useState("");
  const [formData, setFormData] = useState<EditForm>({
    title: "",
    description: "",
    category: "",
    venue: "",
    venueId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    participantsCount: 0,
    imageLink: "",
    _id: "",
  });

  const isFullyCompleted = eventPreview?.isApproved === true;

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/api/event/event`, {
          params: { eventId: id },
        });

        if (!response.data?.success) {
          toast.error(response.data?.message || "Failed to load event details.");
          setEventPreview(null);
          return;
        }

        const payload = response.data.message as any;
        const event = (payload?.event ?? payload) as EventDetails & {
          title?: string;
          venueName?: string;
          coverImageUrl?: string;
          classroomName?: string;
          status?: string;
          venue?: { _id?: string; venueName?: string } | string;
        };
        const venueValue = event.venue as { _id?: string; venueName?: string } | string | null | undefined;
        const venueId = typeof venueValue === "object" && venueValue ? venueValue._id || "" : "";
        const venueName: string =
          typeof venueValue === "object" && venueValue
            ? venueValue.venueName || event.venueName || ""
            : typeof venueValue === "string"
              ? venueValue
              : event.venueName || "";
        setEventPreview(event);
        setFormData({
          title: event.eventTitle || event.title || "",
          description: event.description || "",
          category: event.category || "",
          venue: venueName,
          venueId,
          startDate: event.eventDate || "",
          startTime: event.startTime || "",
          endDate: event.eventDate || "",
          endTime: event.endTime || "",
          participantsCount: event.expectedAttendees || 0,
          imageLink: event.imageLink || event.coverImageUrl || "",
          _id: event._id,
        });

        const workflowResponse = await axios.get(`${backendUrl}/api/workflow/event/${id}`);

        if (workflowResponse.data?.success) {
          const workflowContent = workflowResponse.data?.message?.workflow?.history as Array<{ role?: string; decision?: string; comment?: string; at?: string }> | undefined;
          const items: WorkflowItem[] = Array.isArray(workflowContent)
            ? workflowContent.map((item, index) => ({
                _id: item.at || `${item.role || "step"}-${index}`,
                role: item.role || "",
                status: item.decision === "submitted" ? "pending" : (item.decision || ""),
                message: item.comment || "",
                updatedAt: item.at,
              }))
            : [];
          const lastItem = items.length > 0 ? items[items.length - 1] : null;
          const rejectedItem = [...items].reverse().find((item) => item.status === "rejected");

          const hasRejected = Boolean(rejectedItem) || event.isApproved !== true || event.status !== "approved";
          setCanEditRejectedEvent(hasRejected || Boolean(lastItem));
          setEditGuardMessage("");
        } else {
          setCanEditRejectedEvent(true);
          setEditGuardMessage("");
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to load event details.");
        setEventPreview(null);
        setCanEditRejectedEvent(false);
        setEditGuardMessage("Unable to verify workflow status for editing.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [backendUrl, id]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/admin/venues`);

        if (!data?.success) {
          setVenues([]);
          return;
        }

        setVenues(Array.isArray(data.message) ? data.message : []);
      } catch {
        setVenues([]);
      }
    };

    fetchVenues();
  }, [backendUrl]);

  const updateField = <K extends keyof EditForm>(key: K, value: EditForm[K]) => {
    setFormData((previous) => ({ ...previous, [key]: value }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        toast.error("No file selected.");
        return;
      }

      setIsUploadingImage(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "event-registration");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dadxdprtg/image/upload",
        data,
        { withCredentials: false },
      );

      const uploadedLink = response.data?.secure_url;
      if (!uploadedLink) {
        toast.error("Image upload failed.");
        return;
      }

      updateField("imageLink", uploadedLink);
      setEventPreview((previous) => (previous ? { ...previous, imageLink: uploadedLink } : previous));
      toast.success("Event image updated.");
    } catch (error: any) {
      toast.error(error?.message || "Image upload failed. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const submitUpdate = async () => {
    if (!formData._id) {
      toast.error("Invalid event ID.");
      return;
    }

    try {
      setIsSaving(true);
      axios.defaults.withCredentials = true;

      const response = await axios.post(`${backendUrl}/api/event/resubmit`, {
        eventId: formData._id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        venueId: formData.venueId,
        venue: formData.venue,
        venueName: formData.venue,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        participantsCount: formData.participantsCount,
        imageLink: formData.imageLink,
        coverImageUrl: formData.imageLink,
        classroomName: eventPreview?.classRoomName || "",
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || "Failed to update event.");
        return;
      }

      toast.success("Event details updated successfully.");
      navigate(`/event-detail/${formData._id}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update event.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout title="Event Edit Mode" subtitle="Update event details and continue your workflow">
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-2">
        <div className="mb-4 text-xs text-slate-400">
          <Link to="/my-events" className="font-medium hover:text-blue-600">My Events</Link>
          <span className="mx-2">/</span>
          {formData._id ? (
            <Link to={`/event-detail/${formData._id}`} className="font-medium hover:text-blue-600">Event Detail</Link>
          ) : (
            <span>Event Detail</span>
          )}
          <span className="mx-2">/</span>
          <span className="text-slate-600">Edit</span>
        </div>

        {isLoading && <p className="rounded-xl border bg-white p-6 text-sm text-slate-500">Loading event details...</p>}

        {!isLoading && !eventPreview && <p className="rounded-xl border bg-white p-6 text-sm text-red-500">Event not found.</p>}

        {!isLoading && eventPreview && (
          <div className="grid gap-5 lg:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="text-xl font-semibold text-slate-900">Edit event details</h2>
              <p className="mt-1 text-sm text-slate-500">Change details and save to move forward in the workflow.</p>
              {isFullyCompleted && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                  This event is fully completed because <span className="font-semibold">isApproved = true</span>.
                </div>
              )}
              {!canEditRejectedEvent && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  {editGuardMessage}
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Title</label>
                  <input
                    value={formData.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    disabled={false}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    disabled={false}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Event image</label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <img
                        src={formData.imageLink || eventPreview.imageLink}
                        alt={formData.title || "Event image"}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                      {isUploadingImage ? "Uploading..." : "Change image"}
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Category</label>
                  <input
                    value={formData.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    disabled={false}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Venue</label>
                  <select
                    value={formData.venueId}
                    onChange={(event) => {
                      const selectedVenue = venues.find((venue) => venue._id === event.target.value);
                      setFormData((previous) => ({
                        ...previous,
                        venueId: event.target.value,
                        venue: selectedVenue?.venueName || "",
                      }));
                    }}
                    disabled={false}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select a venue</option>
                    {venues.map((venue) => (
                      <option key={venue._id} value={venue._id}>
                        {venue.venueName}{venue.ownerType ? ` - ${venue.ownerType}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Start date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(event) => updateField("startDate", event.target.value)}
                    disabled={false}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Start time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(event) => updateField("startTime", event.target.value)}
                    disabled={false}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">End date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(event) => updateField("endDate", event.target.value)}
                    disabled={false}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">End time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(event) => updateField("endTime", event.target.value)}
                    disabled={false}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Participants count</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.participantsCount}
                    onChange={(event) => updateField("participantsCount", Math.max(1, Number(event.target.value) || 1))}
                    disabled={!canEditRejectedEvent}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={submitUpdate}
                    disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save event details"}
                </button>
                <Link
                  to={`/event-detail/${formData._id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </section>

            <aside className="space-y-5">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={eventPreview.imageLink} alt={eventPreview.eventTitle} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Current event</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{eventPreview.eventTitle}</h3>
                  <p className="mt-2 text-sm text-slate-600">{eventPreview.description}</p>
                </div>
              </section>

              {/* <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Backend contract</h2>
                <p className="mt-2 text-sm text-slate-600">This page sends exactly:</p>
                <code className="mt-2 block rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                  {`{ title, description, category, venue, startDate, startTime, endDate, endTime, participantsCount, _id }`}
                </code>
              </section> */}
            </aside>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EventEditMode;

