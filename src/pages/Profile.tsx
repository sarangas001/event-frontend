import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect x="2" y="4" width="20" height="16" rx="3" /><path d="M2 7l10 7 10-7" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconId = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M16 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 15h4" />
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M6 22V2h12v20" /><path d="M2 22h20" /><path d="M10 7h4M10 11h4M10 15h4" />
  </svg>
);
const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

/* ─────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────── */
const Field = ({ label, icon, id, children }: {
  label: string; icon?: React.ReactNode; id: string; children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
      {icon && <span className="text-blue-400">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

/* ─────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────── */
const SectionCard = ({ icon, title, accent = "blue", children }: {
  icon: React.ReactNode; title: string; accent?: "blue" | "emerald" | "violet" | "amber"; children: React.ReactNode;
}) => {
  const accents = {
    blue:    { bg: "bg-blue-50",   border: "border-blue-100",   text: "text-blue-500",   bar: "from-blue-400 to-indigo-400" },
    emerald: { bg: "bg-emerald-50",border: "border-emerald-100",text: "text-emerald-500",bar: "from-emerald-400 to-teal-400" },
    violet:  { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-500", bar: "from-violet-400 to-indigo-400" },
    amber:   { bg: "bg-amber-50",  border: "border-amber-100",  text: "text-amber-500",  bar: "from-amber-400 to-orange-400" },
  };
  const a = accents[accent];
  return (
    <div className="profile-card bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
      {/* Top accent bar */}
      <div className={`h-[3px] bg-gradient-to-r ${a.bar}`} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${a.bg} ${a.border} border ${a.text}`}>
            {icon}
          </span>
          <h3 className="font-display text-[1rem] font-medium text-slate-700 tracking-tight">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   TOGGLE ROW
───────────────────────────────────────── */
const ToggleRow = ({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <label className="flex items-center justify-between gap-3 cursor-pointer group py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
    <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors select-none">
      {label}
    </span>
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 h-[22px] rounded-full transition-all duration-250 flex-shrink-0 cursor-pointer ${
        checked ? "bg-gradient-to-r from-blue-500 to-sky-400 shadow-[0_2px_8px_rgba(59,130,246,0.35)]" : "bg-slate-200"
      }`}
    >
      <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-[22px]" : "translate-x-[3px]"
      }`} />
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
    </div>
  </label>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "organizer",
    clubSociety: "Association of computer science",
    position: "",
    advisorName: "",
    advisorEmail: "",
    universityEmail: "organizer@gmail.com",
    registrationNumber: "organizer",
    phoneNumber: "123115616",
    notificationTypes: {
      eventStatus: false,
      approvalRequests: false,
      commentsFeedback: false,
      systemAnnouncements: false,
    },
    deliveryChannels: {
      sms: false,
      email: false,
    },
  });

  const { backendUrl, userData, isLoggedIn } = useContext(AppContext);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(backendUrl + "/api/organizer/profile", formData);
      if (data.success) {
        toast.success("Profile updated successfully");
        navigate("/");
      } else {
        toast.error("Failed to update profile" + data.message);
      }
    } catch (error: any) {
      toast.error("An error occurred while updating profile");
    }
  };

  const getAllData = async () => {
    try {
      axios.defaults.withCredentials = true;
      if (userData?.role === "student") {
        const { data } = await axios.get(backendUrl + "/api/student/profile");
        if (data.success) {
          const { fullName, email, registrationNumber, phoneNumber } = data.message;
          setFormData({ ...formData, fullName, universityEmail: email, registrationNumber, phoneNumber });
        } else {
          toast.error("Error fetching profile data: " + data.message);
        }
      } else if (userData?.role === "organizer") {
        const { data } = await axios.get(backendUrl + "/api/organizer/profile");
        if (data.success) {
          const { fullName, email, contactNum, organizerProfile, regiNumber } = data.message;
          setFormData({
            ...formData, fullName, universityEmail: email,
            registrationNumber: regiNumber, phoneNumber: contactNum,
            clubSociety: organizerProfile.clubSociety, position: organizerProfile.position,
            advisorName: organizerProfile.advisorName, advisorEmail: organizerProfile.advisorEmail,
          });
        } else {
          toast.error("Error fetching profile data: " + data.message);
        }
      } else if (userData?.role === "lecture") {
        const { data } = await axios.get(backendUrl + "/api/lecture/profile");
        if (data.success) {
          const { fullName, email, contactNum, lectureProfile, regiNumber } = data.message;
          setFormData({
            ...formData, fullName, universityEmail: email,
            registrationNumber: regiNumber, phoneNumber: contactNum,
            position: lectureProfile.position,
          });
        } else {
          toast.error("Error fetching profile data: " + data.message);
        }
      }else {
        const { data } = await axios.get(backendUrl + "/api/user/profile");
        if (!data.success) {
          toast.error("Error fetching profile data: " + data.message);
        }

        const { fullName, email, contactNum, regiNumber } = data.user;
        setFormData({
          ...formData, fullName, universityEmail: email,
          registrationNumber: regiNumber, phoneNumber: contactNum,
        });

      }
    } catch (error: any) {
      toast.error("Error fetching profile data " + error.message);
    }
  };

  useEffect(() => { getAllData(); }, []);

  const isOrganizer = userData?.role === "organizer";
  const roleLabel   = userData?.role?.toUpperCase() ?? "";

  /* initials for avatar */
  const initials = formData.fullName
    ? formData.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  /* role accent color */
  const roleAccent: Record<string, string> = {
    organizer: "from-blue-500 to-indigo-500",
    student:   "from-emerald-500 to-teal-500",
    lecture:   "from-violet-500 to-purple-500",
    admin:     "from-amber-500 to-orange-500",
  };
  const avatarGrad = roleAccent[userData?.role ?? ""] ?? "from-blue-500 to-sky-500";

  /* role badge color */
  const roleBadge: Record<string, string> = {
    organizer: "bg-blue-50 text-blue-600 border-blue-200",
    student:   "bg-emerald-50 text-emerald-600 border-emerald-200",
    lecture:   "bg-violet-50 text-violet-600 border-violet-200",
    admin:     "bg-amber-50 text-amber-600 border-amber-200",
  };
  const badgeCls = roleBadge[userData?.role ?? ""] ?? "bg-blue-50 text-blue-600 border-blue-200";

  return (
    <>
      <style>{`
        
      `}</style>

      <MainLayout title="My Profile" subtitle="Manage your account information and preferences">
        <div className="profile-page max-w-[1120px] mx-auto px-5 pb-16 pt-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

              {/* ══════════════════════════════════
                  LEFT — Identity Card
              ══════════════════════════════════ */}
              <div className="identity-card fade-up d1 rounded-2xl overflow-hidden flex flex-col">
                {/* Card top bar */}
                <div className={`h-[3px] bg-gradient-to-r ${avatarGrad}`} />

                <div className="p-6 flex flex-col flex-1">

                  {/* Avatar section */}
                  <div className="flex flex-col items-center text-center pb-6 mb-6 border-b border-slate-100">
                    {/* Avatar */}
                    <div className="relative mb-4">
                      <div className={`avatar-glow w-20 h-20 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-2xl font-bold font-display">{initials}</span>
                      </div>
                      {/* Camera overlay */}
                      <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-200 shadow-sm transition-all">
                        <IconCamera />
                      </button>
                    </div>

                    <h3 className="font-display text-xl font-medium text-slate-800 mb-2 tracking-tight">
                      {formData.fullName || "—"}
                    </h3>

                    {/* Role badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase border ${badgeCls} mb-2`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                      {roleLabel}
                    </span>

                    {isOrganizer && formData.clubSociety && (
                      <p className="text-xs text-slate-400 leading-snug max-w-[200px]">
                        {formData.clubSociety}
                      </p>
                    )}

                    {/* Quick stats row */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 w-full justify-center">
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">12</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Events</p>
                      </div>
                      <div className="stat-divider" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">3</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Active</p>
                      </div>
                      <div className="stat-divider" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">98%</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Score</p>
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="flex flex-col gap-4 flex-1">
                    <Field label="Full Name" icon={<IconUser />} id="fullName">
                      <input
                        id="fullName" type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="profile-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-700"
                        autoComplete="name"
                      />
                    </Field>

                    <Field label="University Email" icon={<IconMail />} id="universityEmail">
                      <input
                        id="universityEmail" type="email"
                        value={formData.universityEmail}
                        onChange={(e) => setFormData({ ...formData, universityEmail: e.target.value })}
                        className="profile-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-700"
                        autoComplete="email"
                      />
                    </Field>

                    <Field label="Registration Number" icon={<IconId />} id="registrationNumber">
                      <input
                        id="registrationNumber" type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        className="profile-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-700"
                      />
                    </Field>

                    <Field label="Phone Number" icon={<IconPhone />} id="phoneNumber">
                      <input
                        id="phoneNumber" type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="profile-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-700"
                        autoComplete="tel"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════
                  RIGHT — Detail panels
              ══════════════════════════════════ */}
              <div className="flex flex-col gap-5">

                {/* Organizer Details */}
                {isOrganizer && (
                  <div className="fade-up d2">
                    <SectionCard icon={<IconBuilding />} title="Organizer Details" accent="blue">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Club / Society" id="clubSociety">
                          <input
                            id="clubSociety" type="text"
                            value={formData.clubSociety}
                            onChange={(e) => setFormData({ ...formData, clubSociety: e.target.value })}
                            className="profile-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-700"
                          />
                        </Field>
                        <Field label="Position" id="position">
                          <input
                            id="position" type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="profile-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-700"
                          />
                        </Field>
                        <Field label="Advisor Name" id="advisorName">
                          <input
                            id="advisorName" type="text"
                            value={formData.advisorName}
                            onChange={(e) => setFormData({ ...formData, advisorName: e.target.value })}
                            className="profile-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-700"
                          />
                        </Field>
                        <Field label="Advisor Email" id="advisorEmail">
                          <input
                            id="advisorEmail" type="email"
                            value={formData.advisorEmail}
                            onChange={(e) => setFormData({ ...formData, advisorEmail: e.target.value })}
                            className="profile-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-700"
                          />
                        </Field>
                      </div>
                    </SectionCard>
                  </div>
                )}

                {/* Notification Preferences */}
                {isOrganizer && (
                  <div className="fade-up d3">
                    <SectionCard icon={<IconBell />} title="Notification Preferences" accent="emerald">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">

                        {/* Types column */}
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2 px-3">
                            Notification types
                          </p>
                          {[
                            { key: "eventStatus",         label: "Event status updates"  },
                            { key: "approvalRequests",    label: "Approval requests"      },
                            { key: "commentsFeedback",    label: "Comments & feedback"    },
                            { key: "systemAnnouncements", label: "System announcements"   },
                          ].map((item) => (
                            <ToggleRow
                              key={item.key}
                              label={item.label}
                              checked={formData.notificationTypes[item.key as keyof typeof formData.notificationTypes]}
                              onChange={(v) => setFormData({
                                ...formData,
                                notificationTypes: { ...formData.notificationTypes, [item.key]: v },
                              })}
                            />
                          ))}
                        </div>

                        {/* Channels column */}
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2 px-3">
                            Delivery channels
                          </p>
                          {[
                            { key: "sms",   label: "SMS"   },
                            { key: "email", label: "Email" },
                          ].map((item) => (
                            <ToggleRow
                              key={item.key}
                              label={item.label}
                              checked={formData.deliveryChannels[item.key as keyof typeof formData.deliveryChannels]}
                              onChange={(v) => setFormData({
                                ...formData,
                                deliveryChannels: { ...formData.deliveryChannels, [item.key]: v },
                              })}
                            />
                          ))}
                        </div>
                      </div>
                    </SectionCard>
                  </div>
                )}

                {/* Security */}
                <div className="fade-up d4">
                  <SectionCard icon={<IconShield />} title="Security" accent="violet">
                    <div className="space-y-1">

                      {/* Password row */}
                      <div className="security-row flex items-start justify-between gap-4 p-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-0.5">Password Management</p>
                          <p className="text-xs text-slate-400">Last changed: January 15, 2025</p>
                        </div>
                        <button type="button"
                          className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 mt-0.5 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                          Manage settings
                        </button>
                      </div>

                      <div className="h-px bg-slate-100 mx-3" />

                      {/* 2FA row */}
                      <div className="security-row flex items-start justify-between gap-4 p-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-slate-700">Two-Factor Authentication</p>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                              Recommended
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
                        </div>
                        <button type="button"
                          className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 mt-0.5 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </SectionCard>
                </div>

                {/* ── Action Buttons ── */}
                <div className="fade-up d5 flex items-center justify-between gap-3 pt-1">

                  {/* Left — last saved note */}
                  <p className="text-xs text-slate-400 hidden sm:block">
                    Changes will be applied immediately after saving.
                  </p>

                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary relative px-7 py-2.5 rounded-xl text-white text-sm font-semibold tracking-wide"
                    >
                      <div className="btn-shine" />
                      <span className="relative z-10 flex items-center gap-2">
                        <IconCheck />
                        Update profile
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </MainLayout>
    </>
  );
};

export default Profile;