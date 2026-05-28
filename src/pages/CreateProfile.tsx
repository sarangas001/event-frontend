import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { AlertCircle } from "lucide-react";
import { css } from "@/styles/CreateProfilePage";

/* ── SVG Icons ──────────────────────────────────────────── */
const IconPerson = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconArrow = () => (
  <svg className="cp-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

/* ── Role definitions (same IDs — logic unchanged) ──────── */
const roles = [
  {
    id: "organizer",
    label: "Organizer",
    sublabel: "Create and manage events",
    badge: "approval",
    badgeText: "Needs approval",
  },
  {
    id: "student",
    label: "Student / User",
    sublabel: "Browse and attend events",
    badge: "instant",
    badgeText: "Instant access",
  },
  {
    id: "lecturer",
    label: "Lecturer",
    sublabel: "Host academic sessions",
    badge: "approval",
    badgeText: "Needs approval",
  },
];

/* ══════════════════════════════════════════════════════════ */
const CreateProfile = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedRole === "organizer") {
      navigate("/profile/organizer");
    } else if (selectedRole === "student") {
      navigate("/profile/student");
    } else if (selectedRole === "lecturer") {
      navigate("/profile/lecturer");
    }
  };

  return (
    <MainLayout title="Create profile" subtitle="Manage your account information and preferences">
      <style>{css}</style>

      <div className="cp-page">

        {/* ── Step progress ── */}
        <div className="cp-progress">
          <div className="cp-step">
            <div className="cp-step-circle cp-step-circle--done">✓</div>
            <span className="cp-step-label">Account</span>
          </div>
          <div className="cp-step-line" />
          <div className="cp-step">
            <div className="cp-step-circle cp-step-circle--active">2</div>
            <span className="cp-step-label cp-step-label--active">Role</span>
          </div>
          <div className="cp-step-line" />
          <div className="cp-step">
            <div className="cp-step-circle">3</div>
            <span className="cp-step-label">Details</span>
          </div>
        </div>

        {/* ── Heading ── */}
        <h1 className="cp-heading">Choose your role</h1>
        <p className="cp-subheading">Step 2 of 3 — How will you use Eventraze?</p>

        {/* ── Two-column grid ── */}
        <div className="cp-grid">

          {/* ── Left: Role selection card ── */}
          <div className="cp-card">
            <div className="cp-card-icon"><IconPerson /></div>
            <h2 className="cp-card-title">Select your role</h2>
            <p className="cp-card-desc">
              Your role determines what you can do on the platform.<br />
              You can only have one active role per account.
            </p>

            <div className="cp-roles">
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <label
                    key={role.id}
                    className={`cp-role-option ${isSelected ? "cp-role-option--selected" : ""}`}
                  >
                    {/* Hidden native input — logic unchanged */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => setSelectedRole(role.id)}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />

                    {/* Custom radio indicator */}
                    <span className="cp-radio">
                      <span className="cp-radio-dot" />
                    </span>

                    <span className="cp-role-info">
                      <span className="cp-role-label">{role.label}</span>
                      <span className="cp-role-sublabel">{role.sublabel}</span>
                    </span>

                    <span className={`cp-role-badge cp-role-badge--${role.badge}`}>
                      {role.badgeText}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="cp-btn-wrap">
              <button
                onClick={handleNext}
                disabled={!selectedRole}
                className="cp-btn-primary"
              >
                Continue
                <IconArrow />
              </button>
            </div>
          </div>

          {/* ── Right: Notice card ── */}
          <div className="cp-notice">
            <div className="cp-notice-icon">
              <AlertCircle />
            </div>

            <div>
              <h3 className="cp-notice-title">Approval required</h3>
              <p className="cp-notice-body">
                Lecturer and Organizer accounts must be reviewed before full access is granted. Student accounts are activated instantly.
              </p>
            </div>

            <div className="cp-notice-sep" />

            <div className="cp-notice-steps">
              <div className="cp-notice-step">
                <span className="cp-notice-num">1</span>
                <span className="cp-notice-step-text">
                  <strong>Submit your profile</strong> — complete the details form on the next step.
                </span>
              </div>
              <div className="cp-notice-step">
                <span className="cp-notice-num">2</span>
                <span className="cp-notice-step-text">
                  <strong>Admin review</strong> — your request is reviewed, typically within 24 hours.
                </span>
              </div>
              <div className="cp-notice-step">
                <span className="cp-notice-num">3</span>
                <span className="cp-notice-step-text">
                  <strong>Access granted</strong> — you'll receive a notification once approved.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default CreateProfile;