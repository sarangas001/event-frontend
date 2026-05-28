import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertStage from "@/assets/concert-stage.png";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-blue-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-blue-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-blue-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

const IconEye = ({ onClick, visible }: { onClick: () => void; visible: boolean }) => (
  <button type="button" onClick={onClick} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
    {visible ? (
      <svg viewBox="0 0 24 24" fill="none" className="w-[17px] h-[17px]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" className="w-[17px] h-[17px]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>
);

const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

/* ─────────────────────────────────────────
   PASSWORD CHECK ROW
───────────────────────────────────────── */

const PasswordCheck = ({ passed, label }: { passed: boolean; label: string }) => (
  <div className="flex items-center gap-2 text-[11px] font-medium transition-all duration-300">
    <span className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
      passed ? "bg-emerald-100 text-emerald-500" : "bg-slate-100 text-slate-300"
    }`}>
      {passed ? <Check size={9} strokeWidth={3} /> : <X size={9} strokeWidth={2.5} />}
    </span>
    <span className={`transition-colors duration-300 ${passed ? "text-emerald-600" : "text-slate-400"}`}>
      {label}
    </span>
  </div>
);

/* ─────────────────────────────────────────
   STRENGTH HELPER
───────────────────────────────────────── */

function strengthScore(checks: Record<string, boolean>) {
  const score = Object.values(checks).filter(Boolean).length;
  if (score === 0) return { width: "0%", color: "transparent", label: "" };
  if (score === 1) return { width: "25%", color: "#f87171", label: "Weak" };
  if (score === 2) return { width: "55%", color: "#fb923c", label: "Fair" };
  if (score === 3) return { width: "80%", color: "#34d399", label: "Good" };
  return { width: "100%", color: "#10b981", label: "Strong" };
}

/* ─────────────────────────────────────────
   ANIMATED BACKGROUND
───────────────────────────────────────── */

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full opacity-[0.14]"
      style={{ background: "radial-gradient(circle, #3b82f6 0%, #6366f1 50%, transparent 70%)", animation: "blob1 20s ease-in-out infinite" }} />
    <div className="absolute -bottom-40 -left-20 w-[480px] h-[480px] rounded-full opacity-[0.10]"
      style={{ background: "radial-gradient(circle, #0ea5e9 0%, #3b82f6 60%, transparent 80%)", animation: "blob2 25s ease-in-out infinite" }} />
    <div className="absolute top-1/3 right-1/4 w-[280px] h-[280px] rounded-full opacity-[0.07]"
      style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)", animation: "blob3 16s ease-in-out infinite" }} />
    <div className="absolute inset-0 opacity-[0.025]"
      style={{ backgroundImage: "linear-gradient(#1e40af 1px,transparent 1px),linear-gradient(90deg,#1e40af 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

const SignUp = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn } = useContext(AppContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    passwordsMatch: formData.password === formData.confirmPassword && formData.confirmPassword !== "",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields");
        return;
      }
      if (!passwordChecks.passwordsMatch) {
        setError("Passwords do not match");
        return;
      }
      setIsLoading(true);
      setError("");
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/register", formData);
      if (data.success) {
        setIsLoggedIn(true);
        navigate("/create-profile");
        toast.success("Account created successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const { width, color, label: strengthLabel } = strengthScore(passwordChecks);
  const showChecks = formData.password.length > 0;
  const confirmError = formData.confirmPassword.length > 0 && !passwordChecks.passwordsMatch;

  return (
    <>

      <div className="h-screen flex font-body bg-slate-50 overflow-hidden">

        {/* ── LEFT IMAGE PANEL ── */}
        <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col">
          <img src={concertStage} alt="Concert" className="absolute inset-0 w-full h-full object-cover image-breathe"
            style={{ filter: "brightness(0.52) saturate(1.1)" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/65 via-slate-900/25 to-indigo-900/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

          {/* Logo */}
          <div className="relative z-10 p-10 flex items-center gap-3">
            <div className="logo-badge w-9 h-9 rounded-xl flex items-center justify-center text-white">
              <IconSparkle />
            </div>
            <span className="font-display text-white text-xl tracking-wide font-medium">Eventraze</span>
          </div>

          {/* Steps visual */}
          <div className="relative z-10 px-10 mt-auto mb-8">
            <p className="text-blue-300 text-xs uppercase tracking-[0.18em] font-semibold mb-4">Getting started</p>
            {[
              { num: "01", title: "Your details", desc: "Name, email & password", active: true },
              { num: "02", title: "Build your profile", desc: "Preferences & interests", active: false },
              { num: "03", title: "Start exploring", desc: "Discover amazing events", active: false },
            ].map((step) => (
              <div key={step.num} className={`flex items-start gap-4 py-3 border-l-2 pl-4 mb-1 transition-all ${
                step.active ? "border-blue-400" : "border-white/10"
              }`}>
                <span className={`text-[11px] font-bold tracking-widest mt-0.5 ${step.active ? "text-blue-300" : "text-white/25"}`}>
                  {step.num}
                </span>
                <div>
                  <p className={`text-sm font-medium ${step.active ? "text-white" : "text-white/30"}`}>{step.title}</p>
                  <p className={`text-xs mt-0.5 ${step.active ? "text-slate-400" : "text-white/20"}`}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hero text */}
          <div className="relative z-10 px-10 pb-12">
            <h2 className="font-display text-white text-4xl font-medium leading-[1.2]">
              Your next great<br />
              <span className="text-blue-300">experience</span><br />
              starts here
            </h2>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="flex-1 relative flex flex-col justify-center items-center px-6 py-6 overflow-y-auto overflow-x-hidden">
          <AnimatedBackground />

          <div className="relative z-10 w-full max-w-[460px] glass-card rounded-3xl p-8">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-7">
              <div className="logo-badge w-8 h-8 rounded-xl flex items-center justify-center text-white">
                <IconSparkle />
              </div>
              <span className="font-display text-slate-800 text-lg font-medium">Eventraze</span>
            </div>

            {/* Step indicators */}
            <div className="fade-in-up s1 flex items-center gap-2 mb-6">
              <div className="step-dot-active w-6 h-1.5 rounded-full" />
              <div className="step-dot-inactive w-4 h-1.5 rounded-full" />
              <div className="step-dot-inactive w-4 h-1.5 rounded-full" />
              <span className="ml-1 text-[11px] font-semibold uppercase tracking-widest text-blue-400">
                Step 1 of 2
              </span>
            </div>

            {/* Header */}
            <div className="fade-in-up s2 mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500 mb-1.5">
                Create account ✨
              </p>
              <h1 className="font-display text-slate-800 text-3xl font-medium leading-snug">
                Join Eventraze today
              </h1>
              <p className="text-slate-400 text-sm mt-1.5 font-light">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name + Email row */}
              <div className="fade-in-up s3 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <IconUser />
                    <input
                      className="input-field w-full rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm"
                      placeholder="Jane Smith"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <IconMail />
                    <input
                      type="email"
                      className="input-field w-full rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="fade-in-up s4">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <IconLock />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field w-full rounded-xl pl-11 pr-12 py-3 text-slate-700 text-sm"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <IconEye onClick={() => setShowPassword(!showPassword)} visible={showPassword} />
                </div>

                {/* Strength panel */}
                {showChecks && (
                  <div className="checks-panel mt-2.5 bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                    {/* Strength bar */}
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex-1 h-[3px] bg-slate-200 rounded-full overflow-hidden">
                        <div className="strength-bar" style={{ width, backgroundColor: color }} />
                      </div>
                      {strengthLabel && (
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
                          {strengthLabel}
                        </span>
                      )}
                    </div>
                    <PasswordCheck passed={passwordChecks.minLength} label="At least 8 characters" />
                    <PasswordCheck passed={passwordChecks.hasUppercase} label="One uppercase letter" />
                    <PasswordCheck passed={passwordChecks.hasNumber} label="One number" />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="fade-in-up s5">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <IconLock />
                  <input
                    type={showConfirm ? "text" : "password"}
                    className={`input-field w-full rounded-xl pl-11 pr-12 py-3 text-slate-700 text-sm ${
                      confirmError ? "error-ring" : ""
                    }`}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <IconEye onClick={() => setShowConfirm(!showConfirm)} visible={showConfirm} />
                </div>
                {formData.confirmPassword && (
                  <div className="mt-2 pl-1">
                    <PasswordCheck passed={passwordChecks.passwordsMatch} label="Passwords match" />
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="fade-in-up flex items-start gap-2.5 bg-red-50 border border-red-200/80 text-red-600 rounded-xl px-4 py-3 text-xs font-medium">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="fade-in-up s6 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-wide overflow-hidden"
                >
                  <div className="shine-bar" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                        </svg>
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create account
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Footer */}
              <p className="fade-in-up s7 text-center text-[11px] text-slate-400 leading-relaxed pt-1">
                By creating an account you agree to our{" "}
                <span className="text-blue-400 hover:underline cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;