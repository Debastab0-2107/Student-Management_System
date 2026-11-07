
import api from "../../services/api";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  KeyRound,
  BookPlus,
  Landmark,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Student Section",
    path: "/admin/students",
    icon: GraduationCap,
  },
  {
    label: "Faculty Section",
    path: "/admin/faculty",
    icon: Users,
  },
  {
    label: "Add Subject",
    path: "/admin/subjects",
    icon: BookPlus,
  },
  {
    label: "University Details",
    path: "/admin/university",
    icon: Landmark,
  },
  {
    label: "Update Password",
    path: "/admin/password",
    icon: KeyRound,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerNotification, setHeaderNotification] = useState(null);
  useEffect(() => {
  let notificationTimer;

  function showAdminNotification(event) {
    setHeaderNotification(event.detail);

    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(() => {
      setHeaderNotification(null);
    }, 5000);
  }

  window.addEventListener(
    "admin:notification",
    showAdminNotification
  );

  return () => {
    window.removeEventListener(
      "admin:notification",
      showAdminNotification
    );

    clearTimeout(notificationTimer);
  };
}, []);
  
  useEffect(() => {
    const token = localStorage.getItem("sms_token");
    const role = localStorage.getItem("sms_role");

    if (!token || role !== "ADMIN") {
      navigate("/login/admin", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setSidebarOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleLogout() {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_role");
    localStorage.removeItem("sms_student_id");
    navigate("/login/admin", { replace: true });
  }

  return (
    <div className="admin-shell">
      <style>{`
        .admin-shell {
          --an: #202945;
          --an2: #303b5d;
          --ag: #c19a52;
          --al: #858ba0;

          position: relative;
          isolation: isolate;
          min-height: 100vh;
          color: var(--an);
          background: #f3f0e9;
          font-family: Inter, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }

        .admin-shell * {
          box-sizing: border-box;
        }

        /* Blurred college campus background */
        .admin-shell::before {
          content: "";
          position: fixed;
          inset: -22px;
          z-index: -2;
          background-image:
            linear-gradient(
              120deg,
              rgba(32, 41, 69, 0.35),
              rgba(193, 154, 82, 0.12),
              rgba(48, 59, 93, 0.30)
            ),
            url("https://images.unsplash.com/photo-1562774053-701939374585?w=2000&q=85");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: blur(9px);
          transform: scale(1.04);
          animation: campus-drift 24s ease-in-out infinite alternate;
        }

        /* Soft overlay keeps the workspace readable */
        .admin-shell::after {
          content: "";
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            linear-gradient(
              135deg,
              rgba(249, 246, 240, 0.78),
              rgba(237, 240, 248, 0.72),
              rgba(248, 243, 233, 0.80)
            ),
            radial-gradient(
              circle at 12% 15%,
              rgba(193, 154, 82, 0.20),
              transparent 38%
            ),
            radial-gradient(
              circle at 88% 85%,
              rgba(48, 59, 93, 0.15),
              transparent 40%
            );
        }

        @keyframes campus-drift {
          0% {
            transform: scale(1.04) translate3d(0, 0, 0);
          }
          100% {
            transform: scale(1.10) translate3d(-8px, 5px, 0);
          }
        }

        /* NAVBAR - kept unchanged */
        .admin-topbar {
          height: 72px;
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 0 26px;
          color: white;
          background: linear-gradient(100deg, var(--an), var(--an2));
          box-shadow: 0 8px 25px #20294520;
        }

        .admin-menu-btn {
          width: 41px;
          height: 41px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #ffffff28;
          border-radius: 11px;
          color: white;
          background: #ffffff10;
          cursor: pointer;
          transition: background .2s ease;
        }

        .admin-menu-btn:hover {
          background: #ffffff20;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: white;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .6px;
        }

        .admin-brand-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid #e6c47f70;
          border-radius: 12px;
          color: #e6c47f;
          background: #ffffff0c;
        }

        .admin-top-spacer {
          flex: 1;
        }

        .admin-top-label {
          color: #d5d9e4;
          font-size: 11px;
        }

        .admin-top-avatar {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 2px solid #ffffff80;
          border-radius: 50%;
          color: var(--an);
          background: linear-gradient(135deg, #c19a52, #f3dba7);
          font-size: 13px;
          font-weight: 800;
        }

        /* MAIN WORKSPACE */
        .admin-workspace {
          position: relative;
          min-height: calc(100vh - 72px);
          padding: 30px;
          animation: workspace-enter .7s ease both;
        }

        @keyframes workspace-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* SIDEBAR BACKDROP */
        .admin-sidebar-backdrop {
          position: fixed;
          inset: 72px 0 0;
          z-index: 59;
          background: #111a30a6;
          backdrop-filter: blur(5px);
          animation: backdrop-enter .25s ease both;
        }

        @keyframes backdrop-enter {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* SIDEBAR */
        .admin-sidebar {
          position: fixed;
          z-index: 60;
          top: 72px;
          bottom: 0;
          left: 0;
          width: 275px;
          display: flex;
          flex-direction: column;
          padding: 22px 15px;
          color: white;
          background: rgba(32, 41, 69, 0.96);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-right: 1px solid rgba(255,255,255,0.10);
          box-shadow: 16px 0 40px #10182b25;
          transform: translateX(-105%);
          visibility: hidden;
          transition:
            transform .32s cubic-bezier(.22,.8,.25,1),
            visibility .32s ease;
          overflow-y: auto;
        }

        .admin-sidebar.open {
          transform: translateX(0);
          visibility: visible;
        }

        .admin-sidebar-heading {
          padding: 8px 11px 13px;
          color: #8e98b3;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .admin-sidebar-nav {
          display: grid;
          gap: 6px;
        }

        .admin-sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 47px;
          padding: 0 12px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: #c6ccdb;
          text-decoration: none;
          font-size: 12px;
          transition:
            background .22s ease,
            color .22s ease,
            border-color .22s ease,
            transform .22s ease;
        }

        .admin-sidebar.open .admin-sidebar-link {
          animation: nav-item-enter .4s ease both;
        }

        .admin-sidebar.open .admin-sidebar-link:nth-child(1) {
          animation-delay: .04s;
        }

        .admin-sidebar.open .admin-sidebar-link:nth-child(2) {
          animation-delay: .09s;
        }

        .admin-sidebar.open .admin-sidebar-link:nth-child(3) {
          animation-delay: .14s;
        }

        .admin-sidebar.open .admin-sidebar-link:nth-child(4) {
          animation-delay: .19s;
        }

        @keyframes nav-item-enter {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .admin-sidebar-link:hover {
          color: white;
          background: #ffffff0c;
          transform: translateX(4px);
        }

        .admin-sidebar-link.active {
          color: white;
          border-color: #c19a5235;
          background: linear-gradient(100deg, #c19a5235, #ffffff08);
          box-shadow: inset 3px 0 0 var(--ag);
        }

        .admin-sidebar-link.active svg {
          color: #e6c47f;
        }

        .admin-sidebar-bottom {
          margin-top: auto;
        }

        .admin-sidebar-note {
          padding: 14px;
          margin: 20px 0 13px;
          border: 1px solid #ffffff18;
          border-radius: 13px;
          color: #b9c1d4;
          background: #ffffff09;
          font-size: 10px;
          line-height: 1.8;
          transition: background .25s ease, border-color .25s ease;
        }

        .admin-sidebar-note:hover {
          background: #ffffff12;
          border-color: #c19a5250;
        }

        .admin-sidebar-note strong {
          display: block;
          margin-bottom: 5px;
          color: #f1d69e;
          font-size: 11px;
        }

        .admin-signout {
          width: 100%;
          min-height: 43px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 12px;
          border: 0;
          border-radius: 10px;
          color: #e1e4ed;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: background .2s ease, color .2s ease;
        }

        .admin-signout:hover {
          color: white;
          background: #ffffff10;
        }
        
        .admin-header-notification {
  display: flex;
  align-items: center;
  gap: 9px;
  max-width: 360px;
  padding: 9px 12px;
  border: 1px solid #b8ddc9;
  border-radius: 10px;
  color: #d9f5e5;
  background: #23644735;
  font-size: 10px;
  font-weight: 700;
  animation: admin-notification-in .3s ease both;
}

.admin-header-notification > svg {
  flex-shrink: 0;
  color: #8fe0b1;
}

.admin-header-notification span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-header-notification button {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 23px;
  height: 23px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  color: white;
  background: transparent;
  cursor: pointer;
}

.admin-header-notification button:hover {
  background: #ffffff20;
}

@keyframes admin-notification-in {
  from {
    opacity: 0;
    transform: translateY(-7px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media(max-width: 650px) {
  .admin-header-notification {
    max-width: 175px;
    padding: 7px;
    font-size: 9px;
  }
}
        /* RESPONSIVE */
        @media(max-width: 650px) {
          .admin-topbar {
            padding: 0 14px;
          }

          .admin-top-label {
            display: none;
          }

          .admin-workspace {
            padding: 20px 14px;
          }

          .admin-brand {
            font-size: 10px;
          }

          .admin-sidebar {
            width: min(275px, 85vw);
          }
        }

        /* ACCESSIBILITY */
        @media(prefers-reduced-motion: reduce) {
          .admin-shell,
          .admin-shell *,
          .admin-shell::before {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className="admin-topbar">
        <button
          className="admin-menu-btn"
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={sidebarOpen}
          aria-controls="admin-navigation"
        >
          {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <div className="admin-brand">
          <span className="admin-brand-icon">
            <ShieldCheck size={21} />
          </span>
          <span>DPP INSTITUTE OF TECHNOLOGY</span>
        </div>

<div className="admin-top-spacer" />

{headerNotification && (
  <div className="admin-header-notification">
    <CheckCircle2 size={17} />
    <span>{headerNotification.message}</span>
    <button
      type="button"
      onClick={() => setHeaderNotification(null)}
      aria-label="Dismiss notification"
    >
      <X size={15} />
    </button>
  </div>
)}

<span className="admin-top-label">Administrator Portal</span>
<div className="admin-top-avatar">A</div>
      </header>

      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-navigation"
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
        aria-hidden={!sidebarOpen}
      >
        <div className="admin-sidebar-heading">ADMINISTRATION</div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `admin-sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
                <ChevronRight
                  size={14}
                  style={{ marginLeft: "auto" }}
                />
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-note">
            <strong>Secure administration</strong>
            Your workspace is protected by your Admin login session.
          </div>

          <button
            className="admin-signout"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-workspace">
        <Outlet />
      </main>
    </div>
  );
}
