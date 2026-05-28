import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";

/* ─────────────────────────────────────────────────────────────
   These small atoms are identical to Profile.tsx — extract
   to a shared @/components/ui/profile-atoms.tsx when ready.
───────────────────────────────────────────────────────────── */

/* ── Icons ── */
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconMail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconId = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M16 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 15h4"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V2h12v20"/><path d="M2 22h20"/><path d="M10 7h4M10 11h4M10 15h4"/>
  </svg>
);
const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ── Shared input style ── */
const inputCls =
  "w-full bg-white/[0.04] border border-white/[0.09] rounded-[10px] " +
  "px-3.5 py-2.5 text-[13px] font-body text-[#f0ede8] placeholder-white/20 outline-none " +
  "focus:border-[rgba(255,190,60,0.5)] focus:bg-white/[0.06] " +
  "focus:shadow-[0_0_0_3px_rgba(255,190,60,0.07)] " +
  "hover:border-white/[0.16] transition-all duration-200";

/* ── Field wrapper ── */
const Field = ({
  label, icon, id, children,
}: {
  label: string; icon?: React.ReactNode; id: string; children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id}
      className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/35 flex items-center gap-1.5">
      {icon && <span className="opacity-60">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

/* ── Section card ── */
const SectionCard = ({
  icon, title, children,
}: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) => (
  <div className="bg-white/[0.025] border border-white/[0.07] rounded-[18px] p-6">
    <div className="flex items-center gap-2.5 mb-5">
      <span className="w-8 h-8 rounded-[9px] bg-[rgba(255,190,60,0.1)] border border-[rgba(255,190,60,0.18)]
        flex items-center justify-center text-[#ffbe3c]">
        {icon}
      </span>
      <h3 className="font-display text-[1.05rem] font-normal text-[#f0ede8] tracking-[0.02em]">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

/* ── Toggle row ── */
const ToggleRow = ({
  label, checked, onChange,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <label className="flex items-center justify-between gap-3 cursor-pointer group py-1">
    <span className="text-[13px] text-white/50 group-hover:text-white/70 transition-colors duration-150">
      {label}
    </span>
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer
        ${checked
          ? "bg-gradient-to-r from-[#ffbe3c] to-[#ff8c00]"
          : "bg-white/[0.08] border border-white/[0.1]"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm
        transition-transform duration-200
        ${checked ? "translate-x-4" : "translate-x-0.5"}`}
      />
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </div>
  </label>
);

/* ══════════════════════════════════════════════════════════ */
const OrganizerProfile = () => {
  const navigate  = useNavigate();
  const { backendUrl } = useContext(AppContext);

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
      eventStatus:         false,
      approvalRequests:    false,
      commentsFeedback:    false,
      systemAnnouncements: false,
    },
    deliveryChannels: {
      sms:   false,
      email: false,
    },
  });

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

  return (
    <MainLayout title="My Profile" subtitle="Manage your account information and preferences">
      <div className="max-w-[1100px] mx-auto px-5 pb-14">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ══════════════════════════════════
                LEFT — Identity card
            ══════════════════════════════════ */}
            <div className="bg-white/[0.025] border border-white/[0.07] rounded-[18px] p-6 flex flex-col">

              {/* Avatar + identity */}
              <div className="flex flex-col items-center text-center pb-6 mb-6 border-b border-white/[0.06]">
                <div className="w-[72px] h-[72px] rounded-full
                  bg-[rgba(255,190,60,0.1)] border-2 border-[rgba(255,190,60,0.25)]
                  flex items-center justify-center text-[#ffbe3c] mb-4
                  shadow-[0_0_24px_rgba(255,190,60,0.1)]">
                  <IconUser />
                </div>

                <h3 className="font-display text-[1.15rem] font-normal text-[#f0ede8] mb-1.5">
                  {formData.fullName}
                </h3>

                {/* Role badge */}
                <span className="inline-flex items-center px-3 py-0.5 rounded-full mb-1.5
                  text-[10px] font-medium tracking-[0.1em] uppercase
                  bg-[rgba(255,190,60,0.12)] border border-[rgba(255,190,60,0.22)] text-[#ffbe3c]">
                  Organizer
                </span>

                <p className="text-[12px] text-white/35 leading-snug">
                  {formData.clubSociety}
                </p>
              </div>

              {/* Personal fields */}
              <div className="flex flex-col gap-4 flex-1">
                <Field label="Full Name" icon={<IconUser />} id="fullName">
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={inputCls}
                    autoComplete="name"
                  />
                </Field>

                <Field label="University Email" icon={<IconMail />} id="universityEmail">
                  <input
                    id="universityEmail"
                    type="email"
                    value={formData.universityEmail}
                    onChange={(e) => setFormData({ ...formData, universityEmail: e.target.value })}
                    className={inputCls}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Registration Number" icon={<IconId />} id="registrationNumber">
                  <input
                    id="registrationNumber"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className={inputCls}
                  />
                </Field>

                <Field label="Phone Number" icon={<IconPhone />} id="phoneNumber">
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={inputCls}
                    autoComplete="tel"
                  />
                </Field>
              </div>
            </div>

            {/* ══════════════════════════════════
                RIGHT — Detail panels
            ══════════════════════════════════ */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Organizer Details */}
              <SectionCard icon={<IconBuilding />} title="Organizer Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Club / Society" id="clubSociety">
                    <input
                      id="clubSociety"
                      type="text"
                      value={formData.clubSociety}
                      onChange={(e) => setFormData({ ...formData, clubSociety: e.target.value })}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Position" id="position">
                    <input
                      id="position"
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Advisor Name" id="advisorName">
                    <input
                      id="advisorName"
                      type="text"
                      value={formData.advisorName}
                      onChange={(e) => setFormData({ ...formData, advisorName: e.target.value })}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Advisor Email" id="advisorEmail">
                    <input
                      id="advisorEmail"
                      type="email"
                      value={formData.advisorEmail}
                      onChange={(e) => setFormData({ ...formData, advisorEmail: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </SectionCard>

              {/* Notification Preferences */}
              <SectionCard icon={<IconBell />} title="Notification Preferences">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">

                  {/* Types */}
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/30 mb-3">
                      Notification types
                    </p>
                    <div className="flex flex-col gap-0.5">
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
                          onChange={(v) =>
                            setFormData({
                              ...formData,
                              notificationTypes: { ...formData.notificationTypes, [item.key]: v },
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Channels */}
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/30 mb-3">
                      Delivery channels
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {[
                        { key: "sms",   label: "SMS"   },
                        { key: "email", label: "Email" },
                      ].map((item) => (
                        <ToggleRow
                          key={item.key}
                          label={item.label}
                          checked={formData.deliveryChannels[item.key as keyof typeof formData.deliveryChannels]}
                          onChange={(v) =>
                            setFormData({
                              ...formData,
                              deliveryChannels: { ...formData.deliveryChannels, [item.key]: v },
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Security */}
              <SectionCard icon={<IconShield />} title="Security">
                <div className="flex flex-col gap-0">

                  <div className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-[#f0ede8] mb-0.5">
                        Password Management
                      </p>
                      <p className="text-[12px] text-white/35">
                        Last changed: January 15, 2025
                      </p>
                    </div>
                    <button type="button"
                      className="text-[12px] font-medium text-[#ffbe3c] hover:opacity-75
                        transition-opacity duration-150 whitespace-nowrap shrink-0 mt-0.5">
                      Manage settings
                    </button>
                  </div>

                  <div className="border-t border-white/[0.06]" />

                  <div className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-[#f0ede8] mb-0.5">
                        Two-Factor Authentication
                      </p>
                      <p className="text-[12px] text-white/35">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button type="button"
                      className="text-[12px] font-medium text-[#ffbe3c] hover:opacity-75
                        transition-opacity duration-150 whitespace-nowrap shrink-0 mt-0.5">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </SectionCard>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5
                    bg-transparent text-white/50
                    text-[12px] font-normal tracking-[0.08em] uppercase
                    border border-white/[0.1] rounded-[10px]
                    hover:border-white/20 hover:text-white/75 hover:bg-white/[0.03]
                    transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5
                    bg-gradient-to-br from-[#ffbe3c] to-[#ff8c00] text-[#0a0a0b]
                    text-[12px] font-medium tracking-[0.08em] uppercase
                    border-none rounded-[10px] cursor-pointer
                    shadow-[0_4px_20px_rgba(255,190,60,0.25)]
                    hover:opacity-90 hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(255,190,60,0.38)]
                    transition-all duration-200"
                >
                  Update profile
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default OrganizerProfile;