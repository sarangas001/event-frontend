import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const context = useContext(AppContext);
  if (!context) return null;
  const { backendUrl, setIsLoggedIn, setUserData, userData } = context;

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        toast.success("Logout successful!");
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/sign-in");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const navLink = (path: string) =>
    `relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[0.82rem] font-medium transition-all duration-200 whitespace-nowrap ${
      isActive(path)
        ? "text-blue-600 bg-blue-50"
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
    }`;

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header
      className={`header-glass sticky top-0 z-[100] w-full border-b border-slate-200/60 font-body transition-all duration-300 ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-5 h-[64px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="logo-badge w-8 h-8 rounded-xl flex items-center justify-center text-white">
            <IconSparkle />
          </div>
          <span className="font-display text-slate-800 text-[1.2rem] font-medium tracking-wide">Eventraze</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
          <Link to="/" className={navLink("/")}>
            Home
            {isActive("/") && <span className="nav-link-active-bar" />}
          </Link>
          <Link to="/events" className={navLink("/events")}>
            Events
            {isActive("/events") && <span className="nav-link-active-bar" />}
          </Link>
          {
            userData?.role === "president" && (
              <Link to="/my-events" className={navLink("/my-events")}>
                My Events
                {isActive("/my-events") && <span className="nav-link-active-bar" />}
              </Link>
            )
          }
          {
            userData?.role === "welfareOfficer" && (
              <Link to="/admin" className={navLink("/admin")}>
                Dashboard
                {isActive("/admin") && <span className="nav-link-active-bar" />}
              </Link>
            )
          }
          {
            userData?.role === "dean" && (
              <Link to="/workspace" className={navLink("/workspace")}>
                Manage Organizations
                {isActive("/workspace") && <span className="nav-link-active-bar" />}
              </Link>
            )
          }
          {
            userData && userData?.role != "president"  && (
              <Link to="/approval-dashboard" className={navLink("/approval-dashboard")}>
                Event Workflow
                {isActive("/approval-dashboard") && <span className="nav-link-active-bar" />}
              </Link>
            )
          }
        </nav>

        {userData?.role ? (
          <div className="flex items-center gap-2.5 shrink-0">
            {userData?.name && (
              <span className="hidden lg:block text-[0.78rem] font-medium text-slate-500 max-w-[110px] truncate">
                {userData.name}
              </span>
            )}
            <div onClick={() => navigate("/profile")} className="avatar-ring">
              <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
                {userData?.name ? (
                  <span className="text-[11px] font-bold text-blue-600 tracking-wide">{initials}</span>
                ) : (
                  <User size={14} className="text-blue-400" />
                )}
              </div>
            </div>
            <div className="header-divider" />
            <button
              onClick={handleLogout}
              className="logout-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.78rem] font-medium text-slate-400"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="w-[120px]" />
        )}
      </div>
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/25 to-transparent pointer-events-none" />
    </header>
  );
};

export default Header;
