import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import crowdBg from "@/assets/crowd-bg.jpg";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconCheck = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-400">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-400">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

/* ─────────────────────────────────────────
   STEP DEFINITIONS
───────────────────────────────────────── */
const steps = [
  { id:1, label:"Event Details",   icon:(
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  )},
  { id:2, label:"Venue Selection", icon:(
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )},
  { id:3, label:"Document Upload", icon:(
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )},
  { id:4, label:"Review",          icon:(
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )},
  { id:5, label:"Submission",      icon:(
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  )},
];

/* ─────────────────────────────────────────
   REVIEW ROW
───────────────────────────────────────── */
const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-slate-100 last:border-0">
    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:w-36 flex-shrink-0">{label}</span>
    <span className="text-sm font-medium text-slate-700">{value || <span className="text-slate-300 italic">Not provided</span>}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════ */
const EventRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { backendUrl, userData } = useContext(AppContext);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    projectId: "",
    eventTitle: "",
    description: "",
    category: "",
    eventDate: "",
    expectedAttendees: 0,
    startTime: "",
    endTime: "",
    applicantName: "",
    registrationNumber: "",
    imageLink: "",
    venue: "",
    venueId: "",
    classRoomName: "",
    documents: [] as File[],
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/project/list`);
        if (data?.success) {
          setProjects(Array.isArray(data.message) ? data.message : []);
        } else {
          toast.error(data?.message || "Unable to load president projects.");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || "Unable to load president projects.");
      } finally {
        setLoadingProjects(false);
      }
    };

    const loadVenues = async () => {
      try {
        setLoadingVenues(true);
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/admin/venues`);
        if (data?.success) {
          setVenues(Array.isArray(data.message) ? data.message : []);
        } else {
          toast.error(data?.message || "Unable to load venues.");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || "Unable to load venues.");
      } finally {
        setLoadingVenues(false);
      }
    };

    if (userData?.role === "president") {
      loadProjects();
      loadVenues();
    }
  }, [backendUrl, userData?.role]);

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.projectId) return "Please select your project.";
      if (!formData.eventTitle.trim()) return "Please enter the event title.";
      if (!formData.description.trim()) return "Please enter the event description.";
      if (!formData.category.trim()) return "Please select an event category.";
      if (!formData.eventDate.trim()) return "Please choose the event date.";
      if (!formData.expectedAttendees || formData.expectedAttendees <= 0) return "Expected attendees must be greater than 0.";
      if (!formData.startTime.trim()) return "Please choose the start time.";
      if (!formData.endTime.trim()) return "Please choose the end time.";
    }

    if (currentStep === 2) {
      if (!formData.venue.trim()) return "Please select a venue.";
      const selectedVenue = venues.find((venue) => venue._id === formData.venueId);
      const requiresClassroom = Boolean(
        selectedVenue && (
          String(selectedVenue.type || "").toLowerCase().includes("faculty") ||
          String(selectedVenue.ownerType || "").toLowerCase() === "dean"
        )
      );
      if (requiresClassroom && !formData.classRoomName.trim()) {
        return "Please enter the classroom name.";
      }
    }

    return "";
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      const validationMessage = validateCurrentStep();
      if (validationMessage) {
        return toast.error(validationMessage);
      }
      setCurrentStep(currentStep + 1);
      return;
    }

    if (currentStep === 5) {
      navigate("/workspace");
      return;
    }

    if (currentStep === 4) {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/event/create", {
          projectId: formData.projectId,
          title: formData.eventTitle,
          description: formData.description,
          category: formData.category,
          eventDate: formData.eventDate,
          expectedAttendees: formData.expectedAttendees,
          startTime: formData.startTime,
          endTime: formData.endTime,
          venueId: formData.venueId,
          venueName: formData.venue,
          coverImageUrl: formData.imageLink,
          classroomName: formData.classRoomName,
        });
        if (data.success) {
          toast.success("Event submitted successfully!");
          setCurrentStep(5);
          navigate("/my-events");
        } else {
          toast.error(data.message);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || "Event submission failed.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    try {
      setUploadingImage(true);
      setDragOver(false);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "event-registration");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dadxdprtg/image/upload",
        data, { withCredentials: false }
      );
      setFormData((prev) => ({ ...prev, imageLink: response.data.secure_url }));
    } catch (error) {
      toast.error("File upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleReplaceImage = () => {
    setFormData((prev) => ({ ...prev, imageLink: "" }));
    openFilePicker();
  };

  /* ─────────────────────────────────────────
     STEP CONTENT
  ───────────────────────────────────────── */
  const renderStepContent = () => {
    switch (currentStep) {

      /* ── Step 1: Event Details ── */
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="field-label">Project <span className="text-red-400">*</span></label>
              <div className="relative">
                <select value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="form-input appearance-none pr-10 cursor-pointer">
                  <option value="">{loadingProjects ? "Loading projects..." : "Select your project"}</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName} {project.organization?.organizationName ? `- ${project.organization.organizationName}` : ""}
                    </option>
                  ))}
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {!loadingProjects && projects.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No assigned project found. Your advisor or dean must create your project and president account first.
                </p>
              )}
            </div>

            <div>
              <label className="field-label">Event Title <span className="text-red-400">*</span></label>
              <input type="text" placeholder="Enter event title"
                value={formData.eventTitle}
                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                className="form-input" />
            </div>

            <div>
              <label className="field-label">Description <span className="text-red-400">*</span></label>
              <textarea placeholder="Describe your event" rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input resize-none" />
            </div>

            <div>
              <label className="field-label">Category <span className="text-red-400">*</span></label>
              <div className="relative">
                <select value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input appearance-none pr-10 cursor-pointer">
                  <option value="">Select a category</option>
                  <option value="music-arts">Music & Arts</option>
                  <option value="workshop">Workshop</option>
                  <option value="tech-innovation">Tech & Innovation</option>
                  <option value="sports">Sports</option>
                  <option value="conference">Conference</option>
                  <option value="cultural">Cultural Event</option>
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label flex items-center gap-1.5">
                  <Calendar size={12} className="text-blue-400" /> Event Date <span className="text-red-400">*</span>
                </label>
                <input type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">Expected Attendees <span className="text-red-400">*</span></label>
                <input type="number" placeholder="0"
                  value={formData.expectedAttendees}
                  onChange={(e) => setFormData({ ...formData, expectedAttendees: parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0 })}
                  className="form-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label flex items-center gap-1.5">
                  <Clock size={12} className="text-blue-400" /> Start Time <span className="text-red-400">*</span>
                </label>
                <input type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label flex items-center gap-1.5">
                  <Clock size={12} className="text-blue-400" /> End Time <span className="text-red-400">*</span>
                </label>
                <input type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="form-input" />
              </div>
            </div>
          </div>
        );

      /* ── Step 2: Venue ── */
      case 2:
        return (
          <div className="space-y-5">
            <div className="info-banner">
              <IconInfo />
              <p className="text-sm text-blue-700">Choose a venue that fits your expected number of attendees.</p>
            </div>

            <div>
              <label className="field-label flex items-center gap-1.5">
                <IconMapPin /> Venue / Place <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select value={formData.venueId}
                  onChange={(e) => {
                    const selectedVenue = venues.find((venue) => venue._id === e.target.value);
                    setFormData({
                      ...formData,
                      venueId: e.target.value,
                      venue: selectedVenue?.venueName || selectedVenue?.name || "",
                      classRoomName: selectedVenue && String(selectedVenue.type || "").toLowerCase().includes("faculty") ? formData.classRoomName : formData.classRoomName,
                    });
                  }}
                  className="form-input appearance-none pr-10 cursor-pointer">
                  <option value="">Select a place</option>
                  {loadingVenues && <option value="">Loading venues...</option>}
                  {!loadingVenues && venues.map((venue) => (
                    <option key={venue._id} value={venue._id}>
                      {venue.venueName || venue.name}
                    </option>
                  ))}
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>

            {(() => {
              const selectedVenue = venues.find((venue) => venue._id === formData.venueId);
              const requiresClassroom = Boolean(
                selectedVenue && (
                  String(selectedVenue.type || "").toLowerCase().includes("faculty") ||
                  String(selectedVenue.ownerType || "").toLowerCase() === "dean"
                )
              );

              return requiresClassroom;
            })() && (
              <div className="fade-in">
                <label className="field-label">Classroom Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder="Enter classroom name"
                  value={formData.classRoomName}
                  onChange={(e) => setFormData({ ...formData, classRoomName: e.target.value })}
                  className="form-input" />
              </div>
            )}

            {/* Venue preview card */}
            {formData.venue && (
              <div className="fade-in venue-preview p-4 rounded-2xl border border-blue-100 bg-blue-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-500">
                    <IconMapPin />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-0.5">Selected venue</p>
                    <p className="text-sm font-semibold text-slate-800">{formData.venue}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      /* ── Step 3: Upload ── */
      case 3:
        return (
          <div className="space-y-5">
            <input ref={fileInputRef} type="file" onChange={handleFileUpload} accept=".png, .jpg, .jpeg" className="hidden" />

            {uploadingImage ? (
              <div className="fade-in flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/70 p-10 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <div className="absolute inset-0 rounded-2xl border-2 border-blue-200 border-t-blue-500 animate-spin" />
                  <IconUpload />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Processing your image...</p>
                  <p className="text-xs text-slate-400">Please wait while we upload and prepare the preview.</p>
                </div>
              </div>
            ) : formData.imageLink ? (
              <div className="fade-in space-y-4">
                <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                  <img src={formData.imageLink} alt="Uploaded" className="w-full object-cover" />
                  <div className="absolute inset-0 max-w-sm bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <IconCheck /> Uploaded
                  </div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReplaceImage}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Change image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageLink: "" }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                onClick={openFilePicker}
                role="button"
                tabIndex={0}
                className={`drop-zone flex flex-col items-center justify-center gap-3 rounded-2xl p-10 text-center cursor-pointer
                  border-2 border-dashed transition-all duration-200
                  ${dragOver
                    ? "border-blue-400 bg-blue-50 scale-[1.01]"
                    : "border-slate-200 bg-slate-50/80 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFilePicker();
                  }
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <IconUpload />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    {dragOver ? "Drop it here!" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG, JPEG • Max 10MB</p>
                </div>
                <span className="px-5 py-2 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors">
                  Choose file
                </span>
              </div>
            )}
          </div>
        );

      /* ── Step 4: Review ── */
      case 4:
        return (
          <div className="space-y-5 fade-in">
            <div className="info-banner">
              <IconInfo />
              <p className="text-sm text-blue-700">Please review your event details before submitting.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              {/* Card header */}
              <div className="h-[3px] bg-gradient-to-r from-blue-500 to-indigo-400" />
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                  <IconSparkle />
                </div>
                <h3 className="font-display text-base font-medium text-slate-700">Event Summary</h3>
              </div>
              <div className="px-5 pb-2">
                <ReviewRow label="Title"       value={formData.eventTitle}   />
                <ReviewRow label="Description" value={formData.description}  />
                <ReviewRow label="Category"    value={formData.category}     />
                <ReviewRow label="Date"        value={formData.eventDate}    />
                <ReviewRow label="Start Time"  value={formData.startTime}    />
                <ReviewRow label="End Time"    value={formData.endTime}      />
                <ReviewRow label="Venue"       value={formData.venue}        />
                {formData.classRoomName && <ReviewRow label="Classroom" value={formData.classRoomName} />}
                <ReviewRow label="Attendees"   value={formData.expectedAttendees > 0 ? String(formData.expectedAttendees) : ""} />
              </div>
            </div>

            {formData.imageLink && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Event Image</p>
                <img src={formData.imageLink} alt="Preview" className="w-full max-w-xs rounded-xl object-cover border border-slate-100" />
              </div>
            )}
          </div>
        );

      /* ── Step 5: Success ── */
      case 5:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center fade-in">
            <div className="success-ring w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-emerald-500">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h3 className="font-display text-2xl font-medium text-slate-800 mb-2">Event Submitted!</h3>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Your event has been submitted for approval. You'll be notified once it's reviewed.
            </p>
          </div>
        );

      default: return null;
    }
  };

  const progressPct = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        .reg-root { font-family: 'DM Sans', system-ui, sans-serif; }

        /* Progress bar track */
        .progress-track {
          height: 4px; border-radius: 99px;
          background: #e2e8f0;
          position: relative; overflow: hidden;
        }
        .progress-fill {
          position: absolute; left:0; top:0; bottom:0;
          border-radius: 99px;
          background: linear-gradient(90deg, #2563eb, #0ea5e9);
          box-shadow: 0 0 8px rgba(59,130,246,0.35);
          transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
        }

        /* Step pill */
        .step-item {
          transition: all 0.2s;
          border-radius: 14px;
          position: relative;
        }
        .step-item.step-active {
          background: linear-gradient(135deg, #eff6ff, #f0f9ff);
          border: 1.5px solid #bfdbfe;
          box-shadow: 0 2px 12px rgba(59,130,246,0.12);
        }
        .step-item.step-done {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
        }
        .step-item.step-upcoming {
          background: transparent;
          border: 1.5px solid transparent;
        }
        .step-item:hover:not(.step-active) { background: #f8fafc; }

        /* Step number */
        .step-num {
          width: 28px; height: 28px; border-radius: 9px;
          display:flex; align-items:center; justify-content:center;
          font-size: 11px; font-weight: 700;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .step-num.num-active  { background: linear-gradient(135deg,#2563eb,#3b82f6); color:white; box-shadow:0 3px 8px rgba(59,130,246,0.30); }
        .step-num.num-done    { background: #d1fae5; color: #059669; }
        .step-num.num-pending { background: #f1f5f9; color: #94a3b8; }

        /* Form inputs */
        .form-input {
          width: 100%;
          background: rgba(248,250,252,0.9);
          border: 1.5px solid rgba(203,213,225,0.8);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: #334155;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: all 0.22s;
        }
        .form-input:focus {
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.10);
          outline: none;
        }
        .form-input::placeholder { color: #94a3b8; }

        .field-label {
          display:flex; align-items:center;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: #64748b;
          margin-bottom: 6px;
        }

        /* Info banner */
        .info-banner {
          display: flex; align-items: flex-start; gap: 10px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: 12px; padding: 12px 14px;
          color: #2563eb;
        }

        /* Form card */
        .form-card {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 8px 32px rgba(59,130,246,0.08), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.7) inset;
        }

        /* Nav sidebar */
        .nav-card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226,232,240,0.7);
          box-shadow: 0 4px 16px rgba(59,130,246,0.06);
        }

        /* Header glass */
        .subheader-glass {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 2px 8px rgba(59,130,246,0.04);
        }

        /* Buttons */
        .btn-next {
          background: linear-gradient(135deg, #2563eb, #3b82f6, #0ea5e9);
          box-shadow: 0 4px 14px rgba(59,130,246,0.30);
          transition: all 0.22s;
          position: relative; overflow: hidden;
        }
        .btn-next::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg,#1d4ed8,#2563eb); opacity:0; transition:opacity 0.22s;
        }
        .btn-next:hover::before { opacity:1; }
        .btn-next:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(59,130,246,0.40); }
        .btn-next-label { position:relative; z-index:1; }
        .btn-shine {
          position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.10) 50%,transparent 60%);
          background-size:200% 100%;
          animation: shine 3s linear infinite;
        }
        @keyframes shine { from{background-position:200% 0} to{background-position:-200% 0} }

        .btn-back {
          background: white; border: 1.5px solid #e2e8f0;
          transition: all 0.22s;
        }
        .btn-back:hover:not(:disabled) {
          border-color: #3b82f6; color: #2563eb; background: #eff6ff;
          transform: translateY(-1px);
        }
        .btn-back:disabled { opacity:0.4; cursor:not-allowed; }

        /* Fade in */
        .fade-in { animation: fadeIn 0.35s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        /* Step content transition */
        .step-content { animation: stepIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes stepIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }

        /* Success ring */
        .success-ring {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border: 3px solid #34d399;
          box-shadow: 0 0 0 8px rgba(52,211,153,0.12), 0 8px 24px rgba(52,211,153,0.20);
          animation: successPop 0.5s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes successPop {
          0%  { transform:scale(0.5); opacity:0; }
          60% { transform:scale(1.1); }
          100%{ transform:scale(1); opacity:1; }
        }

        /* Background */
        .reg-hero-bg {
          position:absolute; inset:0;
          background: linear-gradient(160deg, #f8fafc 0%, #eff6ff 50%, #f0f9ff 100%);
        }
        .reg-hero-blob-1 {
          position:absolute; border-radius:50%; pointer-events:none;
          top:-10%; right:-5%; width:500px; height:500px;
          background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%);
          animation: blobFloat1 20s ease-in-out infinite;
        }
        .reg-hero-blob-2 {
          position:absolute; border-radius:50%; pointer-events:none;
          bottom:-5%; left:0%; width:400px; height:400px;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          animation: blobFloat2 26s ease-in-out infinite;
        }
        @keyframes blobFloat1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,30px) scale(1.08)}}
        @keyframes blobFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,-40px) scale(1.1)}}

        .dot-grid {
          position:absolute; inset:0; pointer-events:none; opacity:0.025;
          background-image: radial-gradient(#1e40af 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>

      <div className="reg-root min-h-screen flex flex-col">
        <Header />

        {/* ── Sub-header ── */}
        <div className="subheader-glass sticky top-[64px] z-30 py-4 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background:"linear-gradient(135deg,#2563eb,#3b82f6)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                </div>
                <h1 className="font-display text-lg font-medium text-slate-800">Event Registration</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Step {currentStep} of {steps.length}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-track">
              <div className="progress-fill" style={{ width:`${progressPct}%` }} />
            </div>

            {/* Step labels (desktop) */}
            <div className="hidden sm:flex justify-between mt-2">
              {steps.map((step) => (
                <span key={step.id} className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  step.id === currentStep ? "text-blue-600" : step.id < currentStep ? "text-emerald-600" : "text-slate-400"
                }`}>
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <main className="flex-1 relative overflow-hidden">
          <div className="reg-hero-bg" />
          <div className="reg-hero-blob-1" />
          <div className="reg-hero-blob-2" />
          <div className="dot-grid" />

          <div className="relative z-10 max-w-[1200px] mx-auto px-5 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">

              {/* ── Sidebar navigation ── */}
              <div className="nav-card rounded-2xl p-3 sticky top-[140px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 px-2 pt-1 pb-2">
                  Progress
                </p>
                <div className="space-y-1">
                  {steps.map((step) => {
                    const isDone   = step.id < currentStep;
                    const isActive = step.id === currentStep;
                    return (
                      <div key={step.id}
                        className={`step-item flex items-center gap-3 px-3 py-2.5 ${
                          isActive ? "step-active" : isDone ? "step-done" : "step-upcoming"
                        }`}>
                        <div className={`step-num ${isActive ? "num-active" : isDone ? "num-done" : "num-pending"}`}>
                          {isDone ? <IconCheck /> : step.id}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold leading-tight ${isActive ? "text-blue-700" : isDone ? "text-emerald-700" : "text-slate-400"}`}>
                            {step.label}
                          </p>
                        </div>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" style={{animation:"pulseDot 2s ease infinite"}} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Progress percentage */}
                <div className="mt-3 pt-3 border-t border-slate-100 px-2">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Complete</span>
                    <span className="text-[10px] font-bold text-blue-600">{Math.round(progressPct)}%</span>
                  </div>
                  <div className="progress-track" style={{ height:"3px" }}>
                    <div className="progress-fill" style={{ width:`${progressPct}%` }} />
                  </div>
                </div>
              </div>

              {/* ── Form card ── */}
              <div className="form-card rounded-2xl overflow-hidden">
                {/* Card top accent */}
                <div className="h-[3px] bg-gradient-to-r from-blue-500 via-indigo-400 to-sky-400" />

                <div className="p-7">
                  {/* Step header */}
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                      style={{ background:"linear-gradient(135deg,#2563eb,#3b82f6)" }}>
                      {steps[currentStep - 1].icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-500">
                        Step {currentStep} of {steps.length}
                      </p>
                      <h2 className="font-display text-xl font-medium text-slate-800 leading-tight">
                        {steps[currentStep - 1].label}
                      </h2>
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="step-content" key={currentStep}>
                    {renderStepContent()}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                    <button onClick={handleBack} disabled={currentStep === 1}
                      className="btn-back flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Dot indicators */}
                      <div className="hidden sm:flex items-center gap-1 mr-3">
                        {steps.map((s) => (
                          <div key={s.id} className={`rounded-full transition-all duration-300 ${
                            s.id === currentStep
                              ? "w-5 h-2 bg-blue-500"
                              : s.id < currentStep
                                ? "w-2 h-2 bg-emerald-400"
                                : "w-2 h-2 bg-slate-200"
                          }`} />
                        ))}
                      </div>

                      <button onClick={handleNext}
                        className="btn-next flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white">
                        <div className="btn-shine" />
                        <span className="btn-next-label flex items-center gap-2">
                          {currentStep === 5 ? "Finish" : currentStep === 4 ? "Submit Event" : "Continue"}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default EventRegistration;
