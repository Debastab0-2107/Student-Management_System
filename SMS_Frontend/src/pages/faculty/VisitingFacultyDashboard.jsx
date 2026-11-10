
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  KeyRound,
  LogOut,
  Menu,
  Megaphone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

const FACULTY_OPTIONS = [
  {
    title: "Teacher Profile",
    description:
      "View your faculty information and manage your account details.",
    tag: "PERSONAL INFORMATION",
    icon: UserRound,
    number: "01",
    section: "profile",
  },
  {
    title: "Class Routine",
    description:
      "View your assigned classes and academic timetable.",
    tag: "ACADEMIC SCHEDULE",
    icon: CalendarDays,
    number: "02",
    section: "routine",
  },
  {
    title: "Notices",
    description:
      "Stay updated with departmental announcements and important notices.",
    tag: "DEPARTMENT UPDATES",
    icon: Megaphone,
    number: "03",
    section: "notices",
  },
];

export default function VisitingFacultyDashboard() {
  const navigate = useNavigate();

  const [facultyId, setFacultyId] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [routineNotice, setRoutineNotice] = useState(false);
  const [showRoutine, setShowRoutine] = useState(false);
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("sms_token");
    const role = localStorage.getItem("sms_role");
    const id = localStorage.getItem("sms_teacher_id");

    if (!token || role !== "TEACHER") {
      navigate("/login/visiting-faculty", { replace: true });
      return;
    }

    setFacultyId(id || "Faculty ID");
  }, [navigate]);

  const today = new Date();

  const dateLabel = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function openSection(section) {
    setMobileMenu(false);

    if (section === "routine") {
      setActiveSection("routine");
      setRoutineNotice(true);
      setShowRoutine(false);
      return;
    }

    setActiveSection(section);
  }

  function confirmRoutineNotice() {
    setRoutineNotice(false);
    setShowRoutine(true);
  }

  function finishLogout() {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_role");
    localStorage.removeItem("sms_teacher_id");
    localStorage.removeItem("sms_must_change_password");

    setLogoutPrompt(false);
    navigate("/login/visiting-faculty", { replace: true });
  }

  return (
    <div className="vfd-page">
      <style>{`
        .vfd-page {
          --navy: #202945;
          --navy-light: #303b5d;
          --gold: #c19a52;
          --gold-light: #fbf4e7;
          --ink: #252c43;
          --muted: #858ba0;
          min-height: 100vh;
          min-height: 100dvh;
          padding: 30px clamp(16px, 3vw, 42px);
          background:
            radial-gradient(circle at 95% 5%, #e9e3d5 0, transparent 23%),
            #f6f7fa;
          color: var(--ink);
          font-family: Inter, "Segoe UI", sans-serif;
        }

        .vfd-page *,
        .vfd-page *::before,
        .vfd-page *::after {
          box-sizing: border-box;
        }

        .vfd-container {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
        }

        .vfd-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 29px;
        }

        .vfd-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vfd-brand-icon {
          display: grid;
          place-items: center;
          width: 47px;
          height: 47px;
          border-radius: 14px;
          color: #a27c37;
          background: var(--gold-light);
          border: 1px solid #e8d8b7;
        }

        .vfd-brand-copy strong {
          display: block;
          color: var(--navy);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .3px;
        }

        .vfd-brand-copy span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 10px;
        }

        .vfd-top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vfd-date {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 15px;
          border: 1px solid #e4e6eb;
          border-radius: 11px;
          color: #657087;
          background: #fff;
          font-size: 11px;
          font-weight: 600;
        }

        .vfd-date svg {
          color: var(--gold);
        }

        .vfd-menu-button {
          display: none;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 1px solid #e3e5eb;
          border-radius: 11px;
          background: white;
          color: var(--navy);
          cursor: pointer;
        }

        .vfd-welcome {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: clamp(23px, 3vw, 36px);
          margin-bottom: 30px;
          border: 1px solid #ffffff30;
          border-radius: 20px;
          color: white;
          background: linear-gradient(115deg, #202945, #354365);
          box-shadow: 0 14px 35px #2029451c;
        }

        .vfd-welcome::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          right: -70px;
          top: -145px;
          border: 1px solid #ffffff28;
          border-radius: 50%;
          box-shadow:
            0 0 0 25px #ffffff08,
            0 0 0 52px #ffffff05;
          pointer-events: none;
        }

        .vfd-welcome-copy {
          position: relative;
          z-index: 1;
        }

        .vfd-welcome small {
          color: #e6c47f;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .vfd-welcome h1 {
          margin: 10px 0 7px;
          color: white;
          font-size: clamp(24px, 3vw, 34px);
          letter-spacing: -1px;
        }

        .vfd-welcome p {
          margin: 0;
          color: #c7cede;
          font-size: 12px;
          line-height: 1.8;
        }

        .vfd-welcome-id {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 17px;
          padding: 8px 12px;
          border: 1px solid #ffffff24;
          border-radius: 8px;
          color: #f0dba8;
          background: #ffffff0d;
          font-size: 10px;
          font-weight: 700;
        }

        .vfd-welcome-icon {
          position: relative;
          z-index: 1;
          display: grid;
          place-items: center;
          width: 65px;
          height: 65px;
          flex-shrink: 0;
          border: 1px solid #e6c47f55;
          border-radius: 19px;
          color: #e6c47f;
          background: #ffffff0d;
        }

        .vfd-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 17px;
        }

        .vfd-section-heading h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          color: var(--navy);
          font-size: 17px;
          font-weight: 800;
        }

        .vfd-section-heading h2::before {
          content: "";
          width: 4px;
          height: 20px;
          border-radius: 5px;
          background: var(--gold);
        }

        .vfd-section-heading span {
          color: var(--muted);
          font-size: 10px;
        }

        .vfd-card-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 17px;
        }

        .vfd-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 275px;
          padding: 22px;
          border: 1px solid #e9eaf0;
          border-radius: 17px;
          color: var(--ink);
          background: #fff;
          box-shadow: 0 9px 26px #2029450b;
          text-align: left;
          cursor: pointer;
          transition:
            transform .22s ease,
            box-shadow .22s ease,
            border-color .22s ease;
          animation: vfd-card-enter .5s ease both;
        }

        .vfd-card:nth-child(2) {
          animation-delay: .07s;
        }

        .vfd-card:nth-child(3) {
          animation-delay: .14s;
        }

        @keyframes vfd-card-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vfd-card:hover {
          transform: translateY(-5px);
          border-color: #c19a5280;
          box-shadow: 0 17px 35px #20294516;
        }

        .vfd-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .vfd-card-icon {
          display: grid;
          place-items: center;
          width: 49px;
          height: 49px;
          border: 1px solid #e9d9b6;
          border-radius: 14px;
          color: #a27c37;
          background: var(--gold-light);
        }

        .vfd-card-number {
          color: #20294513;
          font-size: 35px;
          font-weight: 900;
        }

        .vfd-card-tag {
          margin-top: 23px;
          color: #a27c37;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.1px;
        }

        .vfd-card h3 {
          margin: 9px 0 8px;
          color: var(--navy);
          font-size: 18px;
          font-weight: 800;
        }

        .vfd-card p {
          margin: 0;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.8;
        }

        .vfd-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 19px;
          color: #9a783b;
          font-size: 10px;
          font-weight: 800;
        }

        .vfd-card-bottom svg {
          transition: transform .2s ease;
        }

        .vfd-card:hover .vfd-card-bottom svg {
          transform: translateX(4px);
        }

        .vfd-content-panel {
          padding: 25px;
          border: 1px solid #e7e9ef;
          border-radius: 17px;
          background: white;
          box-shadow: 0 9px 26px #2029450b;
        }

        .vfd-content-panel h2 {
          margin: 0 0 10px;
          color: var(--navy);
          font-size: 21px;
        }

        .vfd-content-panel p {
          color: var(--muted);
          font-size: 12px;
          line-height: 1.8;
        }

        .vfd-back-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 15px;
          padding: 10px 14px;
          border: 1px solid #e8d8b7;
          border-radius: 9px;
          color: #8e6b30;
          background: var(--gold-light);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .vfd-routine-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #edf0f4;
        }

        .vfd-routine-row:last-child {
          border-bottom: 0;
        }

        .vfd-routine-time {
          color: #a27c37;
          font-size: 11px;
          font-weight: 800;
        }

        .vfd-routine-row strong {
          display: block;
          color: var(--navy);
          font-size: 12px;
        }

        .vfd-routine-row span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 10px;
        }

        .vfd-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 34px;
          padding-top: 18px;
          border-top: 1px solid #e7e9ef;
          color: #9aa0ae;
          font-size: 10px;
        }

        .vfd-footer span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .vfd-footer svg {
          color: var(--gold);
        }

        .vfd-overlay {
          position: fixed;
          inset: 0;
          z-index: 500;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(15, 22, 39, .55);
          backdrop-filter: blur(5px);
        }

        .vfd-modal {
          width: 100%;
          max-width: 440px;
          padding: 28px;
          border: 1px solid #ffffff;
          border-radius: 19px;
          background: white;
          box-shadow: 0 25px 80px #0003;
          animation: vfd-modal-enter .2s ease both;
        }

        @keyframes vfd-modal-enter {
          from { opacity: 0; transform: translateY(8px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .vfd-modal-icon {
          display: grid;
          place-items: center;
          width: 49px;
          height: 49px;
          margin-bottom: 17px;
          border-radius: 14px;
          color: #a27c37;
          background: var(--gold-light);
        }

        .vfd-modal small {
          color: #a27c37;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .vfd-modal h2 {
          margin: 9px 0;
          color: var(--navy);
          font-size: 21px;
        }

        .vfd-modal p {
          margin: 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.8;
        }

        .vfd-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 23px;
        }

        .vfd-modal-actions button {
          min-height: 41px;
          padding: 0 15px;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .vfd-cancel {
          border: 1px solid #e3e6ec;
          color: #687187;
          background: white;
        }

        .vfd-confirm {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--navy);
          color: white;
          background: var(--navy);
        }

        .vfd-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px;
          border: 1px solid #e7e1d5;
          border-radius: 10px;
          color: #7f6536;
          background: #fff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s;
        }

        .vfd-logout:hover {
          background: var(--gold-light);
        }

        .vfd-mobile-nav {
          display: none;
        }

        @media (max-width: 1150px) {
          .vfd-card-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .vfd-page {
            padding: 20px 16px;
          }

          .vfd-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .vfd-date {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .vfd-page {
            padding: 17px 13px;
          }

          .vfd-card-grid {
            grid-template-columns: 1fr;
          }

          .vfd-card {
            min-height: 235px;
          }

          .vfd-brand-copy strong {
            font-size: 11px;
          }

          .vfd-welcome {
            padding: 23px 19px;
          }

          .vfd-welcome-icon {
            width: 49px;
            height: 49px;
          }

          .vfd-top-actions .vfd-logout {
            padding: 10px;
          }

          .vfd-top-actions .vfd-logout span {
            display: none;
          }

          .vfd-routine-row {
            grid-template-columns: 78px 1fr;
          }

          .vfd-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vfd-page *,
          .vfd-page *::before,
          .vfd-page *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="vfd-container">
        <header className="vfd-topbar">
          <div className="vfd-brand">
            <div className="vfd-brand-icon">
              <GraduationCap size={24} />
            </div>

            <div className="vfd-brand-copy">
              <strong>DPP INSTITUTE OF TECHNOLOGY</strong>
              <span>Visiting Faculty Portal</span>
            </div>
          </div>

          <div className="vfd-top-actions">
            <div className="vfd-date">
              <CalendarDays size={16} />
              {dateLabel}
            </div>

            <button
              className="vfd-logout"
              type="button"
              onClick={() => setLogoutPrompt(true)}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <section className="vfd-welcome">
          <div className="vfd-welcome-copy">
            <small>VISITING FACULTY WORKSPACE</small>
            <h1>Welcome to your faculty portal.</h1>
            <p>
              Your academic workspace for departmental updates,
              faculty information and class schedules.
            </p>

            <div className="vfd-welcome-id">
              <UserRound size={14} />
              Faculty ID: {facultyId || "Loading..."}
            </div>
          </div>

          <div className="vfd-welcome-icon">
            <BookOpen size={30} />
          </div>
        </section>

        {activeSection === "dashboard" && (
          <>
            <div className="vfd-section-heading">
              <h2>Your Workspace</h2>
              <span>Choose a section to continue</span>
            </div>

            <section className="vfd-card-grid">
              {FACULTY_OPTIONS.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    className="vfd-card"
                    type="button"
                    key={item.section}
                    onClick={() => openSection(item.section)}
                  >
                    <div className="vfd-card-top">
                      <div className="vfd-card-icon">
                        <Icon size={23} />
                      </div>
                      <span className="vfd-card-number">
                        {item.number}
                      </span>
                    </div>

                    <span className="vfd-card-tag">{item.tag}</span>

                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    <div className="vfd-card-bottom">
                      <span>Open section</span>
                      <ChevronRight size={17} />
                    </div>
                  </button>
                );
              })}
            </section>
          </>
        )}

        {activeSection === "profile" && (
          <section className="vfd-content-panel">
            <h2>Teacher Profile</h2>
            <p>
              Your faculty profile section is ready. We will connect
              your faculty information, alternative mobile number,
              educational details and password update functionality next.
            </p>
            <p>
              Logged-in Faculty ID: <strong>{facultyId}</strong>
            </p>

            <button
              className="vfd-back-button"
              onClick={() => setActiveSection("dashboard")}
              type="button"
            >
              <ChevronRight size={15} />
              Back to dashboard
            </button>
          </section>
        )}

        {activeSection === "notices" && (
          <section className="vfd-content-panel">
            <h2>Department Notices</h2>
            <p>
              This section will display departmental announcements
              and important academic notices for visiting faculty.
            </p>

            <button
              className="vfd-back-button"
              onClick={() => setActiveSection("dashboard")}
              type="button"
            >
              <ChevronRight size={15} />
              Back to dashboard
            </button>
          </section>
        )}

        {activeSection === "routine" && showRoutine && (
          <section className="vfd-content-panel">
            <h2>Class Routine</h2>
            <p>
              <strong>Temporary demonstration timetable</strong> —
              the actual departmental routine will be connected later.
            </p>

            <div className="vfd-routine-row">
              <div className="vfd-routine-time">10:00 AM</div>
              <div>
                <strong>Class Schedule — MCA</strong>
                <span>Room details pending</span>
              </div>
            </div>

            <div className="vfd-routine-row">
              <div className="vfd-routine-time">11:00 AM</div>
              <div>
                <strong>Academic Session — MCA</strong>
                <span>Room details pending</span>
              </div>
            </div>

            <div className="vfd-routine-row">
              <div className="vfd-routine-time">12:00 PM</div>
              <div>
                <strong>Practical / Tutorial</strong>
                <span>Room details pending</span>
              </div>
            </div>

            <button
              className="vfd-back-button"
              onClick={() => {
                setShowRoutine(false);
                setActiveSection("dashboard");
              }}
              type="button"
            >
              <ChevronRight size={15} />
              Back to dashboard
            </button>
          </section>
        )}

        <footer className="vfd-footer">
          <span>
            <ShieldCheck size={14} />
            Secure Visiting Faculty Portal
          </span>
          <span>
            <Clock3 size={14} />
            © {new Date().getFullYear()} DPP Institute of Technology
          </span>
        </footer>
      </div>

      {routineNotice && (
        <div className="vfd-overlay">
          <section
            className="vfd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vfd-routine-title"
          >
            <div className="vfd-modal-icon">
              <CalendarDays size={23} />
            </div>

            <small>ROUTINE INFORMATION</small>

            <h2 id="vfd-routine-title">
              Temporary class routine
            </h2>

            <p>
              The class routine currently displayed is a dummy
              demonstration. Your department's actual timetable
              has not been added yet.
              <br /><br />
              Click OK to view the temporary routine.
            </p>

            <div className="vfd-modal-actions">
              <button
                className="vfd-confirm"
                type="button"
                onClick={confirmRoutineNotice}
              >
                OK
                <CheckCircle2 size={15} />
              </button>
            </div>
          </section>
        </div>
      )}

      {logoutPrompt && (
        <div className="vfd-overlay">
          <section
            className="vfd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vfd-logout-title"
          >
            <div className="vfd-modal-icon">
              <KeyRound size={23} />
            </div>

            <small>SECURE SESSION</small>

            <h2 id="vfd-logout-title">
              Sign out of your account?
            </h2>

            <p>
              Are you sure you want to leave the Visiting Faculty Portal?
            </p>

            <div className="vfd-modal-actions">
              <button
                className="vfd-cancel"
                type="button"
                onClick={() => setLogoutPrompt(false)}
              >
                Stay here
              </button>

              <button
                className="vfd-confirm"
                type="button"
                onClick={finishLogout}
              >
                Sign out
                <LogOut size={15} />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
