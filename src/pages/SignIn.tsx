import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import concertStage from "@/assets/concert-stage.png";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";

const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-blue-400"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const IconLock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-blue-400"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const IconEye = ({ onClick, visible }: { onClick: () => void; visible: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
  >
    {visible ? (
      <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
      style={{
        background: "radial-gradient(circle, #3b82f6 0%, #6366f1 50%, transparent 70%)",
        animation: "blobFloat1 18s ease-in-out infinite",
      }}
    />
    <div
      className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
      style={{
        background: "radial-gradient(circle, #0ea5e9 0%, #3b82f6 60%, transparent 80%)",
        animation: "blobFloat2 22s ease-in-out infinite",
      }}
    />
    <div
      className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full opacity-10"
      style={{
        background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
        animation: "blobFloat3 14s ease-in-out infinite",
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(#1e40af 1px, transparent 1px),
          linear-gradient(90deg, #1e40af 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  </div>
);

const Particles = () => {
  const dots = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 12,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full bg-blue-400 opacity-20"
          style={{
            width: d.size,
            height: d.size,
            left: `${d.x}%`,
            bottom: "-10px",
            animation: `floatUp ${d.duration}s ${d.delay}s ease-in infinite`,
          }}
        />
      ))}
    </div>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("jk@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AppContext);
  if (!context) return null;
  const { backendUrl, setIsLoggedIn, checkAuth } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!email || !password) {
        setError("Your email or password are incorrect.");
        return;
      }
      setIsLoading(true);
      setError("");

      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/login", { email, password });

      if (data.success) {
        await checkAuth();
        if (data.role === "welfareOfficer") {
          navigate("/admin");
        } else if (data.role !== "president") {
          navigate("/approval-dashboard");
        } else {
          navigate("/");
        }
        setIsLoggedIn(true);
        toast.success("Login successful!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex font-body bg-slate-50 relative overflow-hidden">
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        <img
          src={concertStage}
          alt="Concert stage"
          className="absolute inset-0 w-full h-full object-cover image-parallax"
          style={{ filter: "brightness(0.55) saturate(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-slate-900/30 to-indigo-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2">
          <div className="relative z-10 p-10 flex items-center gap-3">
            <div className="logo-badge w-9 h-9 rounded-xl flex items-center justify-center text-white">
              <IconSparkle />
            </div>
            <span className="font-display text-white text-xl tracking-wide font-medium">Eventraze</span>
          </div>
        </Link>
        <div className="relative z-10 px-10 flex gap-2 mt-auto mb-6">
          {["Live Events", "Easy Booking", "Curated Picks"].map((t) => (
            <span key={t} className="tag-pill text-blue-600 text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>
        <div className="relative z-10 px-10 pb-12">
          <h2 className="font-display text-white text-5xl font-medium leading-[1.15] tracking-tight">
            Where every<br />
            <span className="text-blue-300">moment</span> becomes<br />
            a memory
          </h2>
          <p className="mt-4 text-slate-300/70 text-sm tracking-wide font-light max-w-xs">
            Discover world-class concerts, curated experiences, and unforgettable nights - all in one place.
          </p>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center px-6 py-6 lg:py-0 overflow-hidden">
        <AnimatedBackground />
        <Particles />

        <div className="relative z-10 w-full max-w-[420px] glass-card rounded-3xl p-10">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="logo-badge w-8 h-8 rounded-xl flex items-center justify-center text-white">
              <IconSparkle />
            </div>
            <span className="font-display text-slate-800 text-lg font-medium">Eventraze</span>
          </div>

          <div className="fade-in-up stagger-1 mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500 mb-2">Welcome back</p>
            <h1 className="font-display text-slate-800 text-4xl font-medium leading-tight">Sign in to<br />your account</h1>
            <p className="text-slate-400 text-sm mt-2 font-light">
              Don&apos;t have one?{" "}
              <Link to="/sign-up" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                Create for free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="fade-in-up stagger-2">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Email address</label>
              <div className="relative">
                <IconMail />
                <input
                  type="email"
                  className="input-field w-full rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm font-body"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="fade-in-up stagger-3">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <IconLock />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field w-full rounded-xl pl-11 pr-12 py-3 text-slate-700 text-sm font-body"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <IconEye onClick={() => setShowPassword(!showPassword)} visible={showPassword} />
              </div>
            </div>

            <div className="fade-in-up stagger-3 flex justify-between items-center pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border-[1.5px] border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all flex items-center justify-center">
                    {rememberMe && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="1.5 6 4.5 9 10.5 3" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors select-none">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="fade-in-up flex items-start gap-2.5 bg-red-50 border border-red-200/80 text-red-600 rounded-xl px-4 py-3 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="fade-in-up stagger-4 pt-2">
              <button type="submit" disabled={isLoading} className="btn-primary relative w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-wide overflow-hidden">
                <div className="shine-bar" />
                <span className="relative z-10">{isLoading ? "Signing in..." : "Sign in"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
