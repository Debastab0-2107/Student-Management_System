
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  CalendarRange,
  CircleHelp,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

const NAV_GROUPS = [
  {
    heading: "STUDENT MENU",
    items: [
      { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
      { label: "Class routine", to: "/student/routine", icon: CalendarRange },
      { label: "My profile", to: "/student/profile", icon: UserRound },
      { label: "CA marks", to: "/student/ca-marks", icon: ClipboardList },
      {
        label: "University marks",
        to: "/student/university-marks",
        icon: BookOpenCheck,
      },
      {
        label: "Course overview",
        to: "/student/course-overview",
        icon: BookOpen,
      },
      { label: "Announcements", to: "/student/notices", icon: Megaphone },
    ],
  },
  {
    heading: "MORE",
    items: [
      {
        label: "Payments",
        to: "/student/payments",
        icon: CreditCard,
        soon: true,
      },
      {
        label: "Activities",
        to: "/student/activities",
        icon: Sparkles,
        soon: true,
      },
    ],
  },
];

export default function Sidebar({
  mobileNavOpen = false,
  setMobileNavOpen = () => {},
  onSignOut = () => {},
  onNotice = () => {},
}) {
  const location = useLocation();

  // Close the sidebar when Escape is pressed.
  useEffect(() => {
    if (!mobileNavOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileNavOpen, setMobileNavOpen]);

  // Close navigation after selecting an item.
  function handleNavigation(event, item) {
    setMobileNavOpen(false);

    if (item.soon) {
      event.preventDefault();

      onNotice(
        `${item.label} is coming soon. This feature is currently in progress.`
      );
    }
  }

  return (
    <>
      <style>{`
        .shared-sidebar,
        .shared-sidebar *,
        .shared-sidebar-overlay {
          box-sizing: border-box;
        }

        /* =====================================
           SIDEBAR
        ===================================== */

        .shared-sidebar {
          --navy: #202945;
          --gold: #e6c47f;

          position: fixed;
          inset: 0 auto 0 0;
          z-index: 301;
          display: flex;
          flex-direction: column;
          width: 270px;
          max-width: 86vw;
          height: 100vh;
          height: 100dvh;
          padding: 23px 15px 15px;
          overflow-x: hidden;
          overflow-y: auto;

          color: #f4f5fa;
          background: var(--navy);

          transform: translateX(-105%);
          visibility: hidden;
          pointer-events: none;

          box-shadow: 15px 0 45px rgba(10, 20, 40, .18);

          transition:
            transform .34s cubic-bezier(.22, 1, .36, 1),
            visibility .34s ease;

          scrollbar-width: thin;
          scrollbar-color: #46516f transparent;
          will-change: transform;
        }

        .shared-sidebar.shared-sidebar-open {
          transform: translateX(0);
          visibility: visible;
          pointer-events: auto;
        }

        .shared-sidebar button,
        .shared-sidebar a {
          font: inherit;
        }

        .shared-sidebar a {
          text-decoration: none;
        }

        .shared-sidebar button {
          cursor: pointer;
        }

        /* =====================================
           BRAND
        ===================================== */

        .shared-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 8px 27px;
        }

        .shared-sidebar-brand-mark {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border: 1px solid rgba(235, 201, 139, .42);
          border-radius: 14px;
          color: var(--gold);
          background: rgba(255, 255, 255, .055);
        }

        .shared-sidebar-brand-copy {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .shared-sidebar-brand-copy strong {
          color: #fff;
          font-size: 14px;
          letter-spacing: -.2px;
        }

        .shared-sidebar-brand-copy span {
          color: #aeb6cb;
          font-size: 11px;
        }

        .shared-sidebar-close {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, .12);
          border-radius: 10px;
          color: white;
          background: rgba(255, 255, 255, .06);
          transition:
            background .25s ease,
            transform .25s ease;
        }

        .shared-sidebar-close:hover {
          background: rgba(255, 255, 255, .13);
          transform: rotate(4deg);
        }

        /* =====================================
           NAVIGATION GROUPS
        ===================================== */

        .shared-sidebar-group {
          margin-bottom: 23px;
        }

        .shared-sidebar-heading {
          padding: 0 11px;
          margin-bottom: 10px;
          color: #8e98b3;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .shared-sidebar-nav {
          display: grid;
          gap: 4px;
        }

        .shared-sidebar-link {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 43px;
          padding: 0 11px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: #c6ccdb;
          font-size: 12px;

          transition:
            background .22s ease,
            color .22s ease,
            transform .22s ease,
            border-color .22s ease;
        }

        .shared-sidebar-link:hover {
          color: white;
          background: rgba(255, 255, 255, .07);
          transform: translateX(2px);
        }

        .shared-sidebar-link.active {
          color: white;
          border-color: rgba(222, 190, 126, .17);
          background: linear-gradient(
            100deg,
            rgba(194, 154, 82, .24),
            rgba(255, 255, 255, .045)
          );
        }

        .shared-sidebar-link.active > svg {
          color: var(--gold);
        }

        .shared-sidebar-link-label {
          flex: 1;
          min-width: 0;
        }

        .shared-sidebar-soon {
          padding: 4px 5px;
          border-radius: 5px;
          color: #d9c18e;
          background: rgba(217, 193, 142, .12);
          font-size: 8px;
          font-weight: 800;
        }

        /* =====================================
           SIDEBAR BOTTOM
        ===================================== */

        .shared-sidebar-bottom {
          margin-top: auto;
        }

        .shared-sidebar-help {
          padding: 14px;
          margin: 10px 0 16px;
          border: 1px solid rgba(255, 255, 255, .09);
          border-radius: 14px;
          background: rgba(255, 255, 255, .045);
        }

        .shared-sidebar-help-icon {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          margin-bottom: 11px;
          border-radius: 9px;
          color: var(--gold);
          background: rgba(228, 195, 127, .12);
        }

        .shared-sidebar-help strong {
          color: #fff;
          font-size: 11px;
        }

        .shared-sidebar-help p {
          margin: 7px 0 12px;
          color: #b1bad0;
          font-size: 10px;
          line-height: 1.7;
        }

        .shared-sidebar-help a {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #e8ca8c;
          font-size: 10px;
          font-weight: 700;
        }

        .shared-sidebar-signout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 42px;
          padding: 0 11px;
          border: 0;
          border-radius: 10px;
          color: #d2d6e1;
          background: transparent;
          text-align: left;

          transition:
            color .22s ease,
            background .22s ease;
        }

        .shared-sidebar-signout:hover {
          color: white;
          background: rgba(255, 255, 255, .07);
        }

        .shared-sidebar-foot {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          padding: 17px 5px 0;
          color: #8490ad;
          font-size: 8px;
          letter-spacing: .5px;
        }

        /* =====================================
           OUTSIDE OVERLAY
        ===================================== */

        .shared-sidebar-overlay {
          position: fixed;
          inset: 0;
          z-index: 300;
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          background: rgba(15, 22, 39, .48);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;

          transition:
            opacity .28s ease,
            visibility .28s ease;
        }

        .shared-sidebar-overlay.is-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        .shared-sidebar button:focus-visible,
        .shared-sidebar a:focus-visible,
        .shared-sidebar-overlay:focus-visible {
          outline: 2px solid #e6c47f;
          outline-offset: 3px;
        }

        /* =====================================
           REDUCED MOTION
        ===================================== */

        @media (prefers-reduced-motion: reduce) {
          .shared-sidebar,
          .shared-sidebar *,
          .shared-sidebar-overlay {
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
          }
        }
      `}</style>

      {/* DARK OUTSIDE OVERLAY */}
      <button
        type="button"
        className={`shared-sidebar-overlay ${
          mobileNavOpen ? "is-visible" : ""
        }`}
        aria-label="Close navigation"
        aria-hidden={!mobileNavOpen}
        tabIndex={mobileNavOpen ? 0 : -1}
        onClick={() => setMobileNavOpen(false)}
      />

      {/* SIDEBAR PANEL */}
      <aside
        id="student-navigation"
        className={`shared-sidebar ${
          mobileNavOpen ? "shared-sidebar-open" : ""
        }`}
        aria-label="Student navigation"
        aria-hidden={!mobileNavOpen}
      >
        <div className="shared-sidebar-brand">
          <div className="shared-sidebar-brand-mark">
            <GraduationCap size={23} />
          </div>

          <div className="shared-sidebar-brand-copy">
            <strong>DPP Institute</strong>
            <span>MCA student portal</span>
          </div>

          <button
            type="button"
            className="shared-sidebar-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        {NAV_GROUPS.map((group) => (
          <div className="shared-sidebar-group" key={group.heading}>
            <div className="shared-sidebar-heading">
              {group.heading}
            </div>

            <nav
              className="shared-sidebar-nav"
              aria-label={group.heading.toLowerCase()}
            >
              {group.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  !item.soon &&
                  (location.pathname === item.to ||
                    (item.to !== "/student/dashboard" &&
                      location.pathname.startsWith(`${item.to}/`)));

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    aria-current={isActive ? "page" : undefined}
                    className={`shared-sidebar-link ${
                      isActive ? "active" : ""
                    }`}
                    onClick={(event) =>
                      handleNavigation(event, item)
                    }
                  >
                    <Icon size={18} />

                    <span className="shared-sidebar-link-label">
                      {item.label}
                    </span>

                    {item.soon && (
                      <span className="shared-sidebar-soon">
                        SOON
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        <div className="shared-sidebar-bottom">
          <div className="shared-sidebar-help">
            <div className="shared-sidebar-help-icon">
              <CircleHelp size={17} />
            </div>

            <strong>Need assistance?</strong>

            <p>
              Contact your department administrator for account support.
            </p>

            <Link
              to="/contact"
              onClick={() => setMobileNavOpen(false)}
            >
              Get help <ArrowRight size={14} />
            </Link>
          </div>

          <button
            type="button"
            className="shared-sidebar-signout"
            onClick={() => {
              setMobileNavOpen(false);
              onSignOut();
            }}
          >
            <LogOut size={17} />
            <span>Sign out</span>
          </button>

          <div className="shared-sidebar-foot">
            <span>DEPARTMENT STUDENT PORTAL</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
