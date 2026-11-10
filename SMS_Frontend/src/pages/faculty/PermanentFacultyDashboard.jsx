// src/pages/faculty/PermanentFacultyDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  LogOut,
  Megaphone,
  ShieldCheck,
  Users,
  UserRound,
  X,
} from "lucide-react";

const FACULTY_SECTIONS = [
  {
    id: "ca-upload",
    number: "01",
    title: "CA Result Upload",
    tag: "ASSESSMENT",
    description:
      "Upload Continuous Assessment marks using the common result format for students.",
    details: [
      "Access the standard CA marks format",
      "Upload student assessment marks",
      "Review upload status",
    ],
    icon: FileSpreadsheet,
    color: "gold",
  },
  {
    id: "profile",
    number: "02",
    title: "Teacher Profile",
    tag: "MY ACCOUNT",
    description:
      "View and maintain your faculty information and account details.",
    details: [
      "View and update profile information",
      "Update alternative mobile number",
      "Maintain educational details",
      "Change account password",
    ],
    icon: UserRound,
    color: "blue",
  },
  {
    id: "students",
    number: "03",
    title: "View All Student Details",
    tag: "STUDENT DIRECTORY",
    description:
      "View student records with department and academic filters.",
    details: [
      "Browse student information",
      "Filter and search student records",
      "Navigate records using pagination",
      "View-only access",
    ],
    icon: Users,
    color: "green",
  },
  {
    id: "semester-results",
    number: "04",
    title: "Semester Results",
    tag: "ACADEMIC RESULTS",
    description:
      "View semester-wise university examination results separately from student details.",
    details: [
      "Select an academic semester",
      "Filter semester results",
      "View student examination performance",
    ],
    icon: GraduationCap,
    color: "purple",
  },
  {
    id: "routine",
    number: "05",
    title: "Class Routine",
    tag: "TIMETABLE",
    description:
      "Access the faculty teaching timetable and class schedule.",
    details: [
      "View the weekly class schedule",
      "Check subject and classroom details",
      "Refer to the faculty timetable",
    ],
    icon: CalendarDays,
    color: "orange",
  },
  {
    id: "notices",
    number: "06",
    title: "Notices",
    tag: "ANNOUNCEMENTS",
    description:
      "Stay informed about academic updates and department announcements.",
    details: [
      "Read academic notices",
      "View department announcements",
      "Check important updates",
    ],
    icon: Megaphone,
    color: "rose",
  },
];

const DUMMY_ROUTINE = [
  {
    day: "Monday",
    classes: [
      { time: "10:00 – 11:00", subject: "Subject 1", room: "Room 101" },
      { time: "11:15 – 12:15", subject: "Subject 2", room: "Room 102" },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      { time: "09:00 – 10:00", subject: "Subject 3", room: "Room 101" },
      { time: "12:00 – 01:00", subject: "Subject 1", room: "Room 103" },
    ],
  },
  {
    day: "Wednesday",
    classes: [
      { time: "10:00 – 11:00", subject: "Subject 2", room: "Room 102" },
    ],
  },
  {
    day: "Thursday",
    classes: [
      { time: "09:00 – 10:00", subject: "Subject 1", room: "Room 101" },
      { time: "11:15 – 12:15", subject: "Subject 3", room: "Room 103" },
    ],
  },
  {
    day: "Friday",
    classes: [
      { time: "10:00 – 11:00", subject: "Subject 2", room: "Room 102" },
    ],
  },
];

export default function PermanentFacultyDashboard() {
  const navigate = useNavigate();

  const [teacherId, setTeacherId] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [showRoutineNotice, setShowRoutineNotice] = useState(false);
  const [showDummyRoutine, setShowDummyRoutine] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("sms_token");
    const role = localStorage.getItem("sms_role");
    const storedTeacherId = localStorage.getItem("sms_teacher_id");

    if (!token || role !== "TEACHER") {
      navigate("/login/permanent-faculty", { replace: true });
      return;
    }

    setTeacherId(storedTeacherId || "Faculty");
  }, [navigate]);

  const today = new Date();

  const dateLabel = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSectionClick = (section) => {
    setActiveSection(section);

    if (section.id === "routine") {
      setShowDummyRoutine(false);
      setShowRoutineNotice(true);
    } else {
      setShowRoutineNotice(false);
      setShowDummyRoutine(false);
    }
  };

  const handleRoutineConfirm = () => {
    setShowRoutineNotice(false);
    setShowDummyRoutine(true);
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out of the Permanent Faculty Portal?"
    );

    if (!confirmed) return;

    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_role");
    localStorage.removeItem("sms_teacher_id");
    localStorage.removeItem("sms_must_change_password");

    navigate("/login/permanent-faculty", { replace: true });
  };

  const closeSection = () => {
    setActiveSection(null);
    setShowRoutineNotice(false);
    setShowDummyRoutine(false);
  };

  return (
    <main className="pfd-page">
      <style>{`
        .pfd-page {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
          color: #252c43;
          animation: pfd-enter .45s ease both;
        }

        .pfd-page * {
          box-sizing: border-box;
        }

        @keyframes pfd-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pfd-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 25px;
        }

        .pfd-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .pfd-brand-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #e7d7b6;
          border-radius: 13px;
          background: #fbf4e7;
          color: #a27c37;
        }

        .pfd-brand strong {
          display: block;
          color: #202945;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .7px;
        }

        .pfd-brand span {
          display: block;
          margin-top: 4px;
          color: #858ba0;
          font-size: 10px;
        }

        .pfd-logout {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid #e4e7ed;
          border-radius: 10px;
          background: white;
          color: #59647a;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .pfd-logout:hover {
          border-color: #d8b46a;
          background: #fbf4e7;
          color: #202945;
        }

        .pfd-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .pfd-kicker {
          margin: 0 0 10px;
          color: #a27c37;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .pfd-heading h1 {
          margin: 0;
          color: #202945;
          font-size: clamp(27px, 3.5vw, 38px);
          line-height: 1.2;
          letter-spacing: -1.2px;
        }

        .pfd-heading h1 span {
          color: #b58b43;
        }

        .pfd-heading-copy {
          margin: 9px 0 0;
          color: #858ba0;
          font-size: 12px;
          line-height: 1.7;
        }

        .pfd-date {
          min-width: 190px;
          padding: 12px 16px;
          border: 1px solid #e5d7b9;
          border-radius: 13px;
          background: #fbf4e7;
          text-align: center;
        }

        .pfd-date span {
          display: block;
          margin-bottom: 5px;
          color: #a27c37;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .pfd-date strong {
          color: #202945;
          font-size: 11px;
        }

        .pfd-welcome {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          overflow: hidden;
          padding: 25px 28px;
          margin-bottom: 28px;
          border: 1px solid #ffffff24;
          border-radius: 18px;
          background: linear-gradient(110deg, #202945, #354365);
          box-shadow: 0 13px 30px #2029451a;
          color: white;
        }

        .pfd-welcome::after {
          content: "";
          position: absolute;
          width: 190px;
          height: 190px;
          top: -105px;
          right: -35px;
          border: 1px solid #ffffff25;
          border-radius: 50%;
          box-shadow: 0 0 0 22px #ffffff08, 0 0 0 45px #ffffff06;
          pointer-events: none;
        }

        .pfd-welcome small {
          color: #e6c47f;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .pfd-welcome h2 {
          margin: 8px 0 5px;
          color: white;
          font-size: 21px;
          letter-spacing: -.4px;
        }

        .pfd-welcome p {
          margin: 0;
          color: #c2c9d8;
          font-size: 11px;
          line-height: 1.7;
        }

        .pfd-welcome-icon {
          z-index: 1;
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #e6c47f55;
          border-radius: 16px;
          background: #ffffff0d;
          color: #e6c47f;
        }

        .pfd-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 15px;
        }

        .pfd-section-head h2 {
          margin: 0;
          color: #202945;
          font-size: 17px;
          letter-spacing: -.3px;
        }

        .pfd-section-head p {
          margin: 5px 0 0;
          color: #858ba0;
          font-size: 11px;
        }

        .pfd-section-count {
          color: #9a7a42;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .pfd-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
        }

        .pfd-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 235px;
          padding: 18px 16px 15px;
          border: 1px solid #e7e9ef;
          border-radius: 15px;
          background: white;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 5px 18px #20294508;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }

        .pfd-card:hover {
          transform: translateY(-4px);
          border-color: #d7c294;
          box-shadow: 0 13px 27px #20294512;
        }

        .pfd-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 17px;
        }

        .pfd-card-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
        }

        .pfd-card-icon.gold { background: #fbf4e7; color: #a27c37; }
        .pfd-card-icon.blue { background: #edf2fb; color: #506b9d; }
        .pfd-card-icon.green { background: #edf6f0; color: #4f8a68; }
        .pfd-card-icon.purple { background: #f2effa; color: #7964a5; }
        .pfd-card-icon.orange { background: #fff2e8; color: #bd7a42; }
        .pfd-card-icon.rose { background: #fbf0f2; color: #a96778; }

        .pfd-card-number {
          color: #b2b7c3;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .pfd-card-tag {
          margin: 0 0 7px;
          color: #a27c37;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .pfd-card h3 {
          margin: 0;
          color: #202945;
          font-size: 14px;
          line-height: 1.4;
          letter-spacing: -.2px;
        }

        .pfd-card-description {
          margin: 9px 0 15px;
          color: #858ba0;
          font-size: 10px;
          line-height: 1.7;
        }

        .pfd-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #f0f1f4;
          color: #58647b;
          font-size: 10px;
          font-weight: 700;
        }

        .pfd-card-bottom svg {
          color: #b18b45;
          transition: transform .2s ease;
        }

        .pfd-card:hover .pfd-card-bottom svg {
          transform: translateX(4px);
        }

        .pfd-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 26px;
          padding: 14px 2px 2px;
          border-top: 1px solid #e9ebf0;
          color: #9299a8;
          font-size: 10px;
        }

        .pfd-footer span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .pfd-footer svg {
          color: #a27c37;
        }

        .pfd-overlay {
          position: fixed;
          z-index: 1000;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(15, 23, 42, .58);
          backdrop-filter: blur(5px);
        }

        .pfd-modal {
          width: min(100%, 540px);
          max-height: min(85vh, 720px);
          overflow-y: auto;
          padding: 25px;
          border: 1px solid #ffffff;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 25px 70px #101b3540;
          animation: pfd-modal-in .2s ease both;
        }

        @keyframes pfd-modal-in {
          from { opacity: 0; transform: translateY(8px) scale(.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .pfd-modal-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .pfd-modal-kicker {
          margin: 0 0 7px;
          color: #a27c37;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .pfd-modal h2 {
          margin: 0;
          color: #202945;
          font-size: 21px;
        }

        .pfd-modal-close {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #e7e9ef;
          border-radius: 9px;
          background: white;
          color: #687287;
          cursor: pointer;
        }

        .pfd-modal-copy {
          margin: 14px 0 18px;
          color: #737e92;
          font-size: 12px;
          line-height: 1.8;
        }

        .pfd-detail-list {
          display: grid;
          gap: 9px;
          margin: 0 0 20px;
          padding: 0;
          list-style: none;
        }

        .pfd-detail-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #4e5a70;
          font-size: 11px;
          line-height: 1.6;
        }

        .pfd-detail-list svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: #a27c37;
        }

        .pfd-modal-note {
          padding: 12px 13px;
          border: 1px solid #ead9ae;
          border-radius: 10px;
          background: #fff9eb;
          color: #765a26;
          font-size: 11px;
          line-height: 1.7;
        }

        .pfd-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 20px;
        }

        .pfd-modal-button {
          min-height: 39px;
          padding: 0 16px;
          border: 1px solid #202945;
          border-radius: 9px;
          background: #202945;
          color: white;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .pfd-modal-button.secondary {
          border-color: #e1e5ec;
          background: white;
          color: #59647a;
        }

        .pfd-routine-list {
          display: grid;
          gap: 12px;
          margin-top: 19px;
        }

        .pfd-routine-day {
          padding: 13px;
          border: 1px solid #e9ebf0;
          border-radius: 11px;
          background: #fcfcfd;
        }

        .pfd-routine-day h3 {
          margin: 0 0 9px;
          color: #202945;
          font-size: 12px;
        }

        .pfd-routine-class {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 0;
          border-top: 1px solid #eef0f3;
          color: #697489;
          font-size: 10px;
        }

        .pfd-routine-class strong {
          color: #39465f;
          font-size: 10px;
        }

        @media (max-width: 1150px) {
          .pfd-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        @media (max-width: 760px) {
          .pfd-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .pfd-welcome { padding: 22px; }
        }

        @media (max-width: 480px) {
          .pfd-grid { grid-template-columns: 1fr; }
          .pfd-card { min-height: 205px; }
          .pfd-topbar { align-items: flex-start; }
          .pfd-brand strong { font-size: 10px; }
          .pfd-brand span { font-size: 9px; }
          .pfd-logout { padding: 0 10px; }
          .pfd-date { width: 100%; text-align: left; }
          .pfd-welcome { padding: 19px; }
          .pfd-welcome h2 { font-size: 18px; }
          .pfd-modal { padding: 20px; }
          .pfd-routine-class { flex-direction: column; gap: 4px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pfd-page *,
          .pfd-page *::before,
          .pfd-page *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className="pfd-topbar">
        <div className="pfd-brand">
          <div className="pfd-brand-icon">
            <BookOpen size={22} />
          </div>
          <div>
            <strong>DPP INSTITUTE OF TECHNOLOGY</strong>
            <span>Permanent Faculty Portal</span>
          </div>
        </div>

        <button className="pfd-logout" onClick={handleLogout}>
          <LogOut size={15} />
          Logout
        </button>
      </header>

      <section className="pfd-heading">
        <div>
          <p className="pfd-kicker">PERMANENT FACULTY WORKSPACE</p>
          <h1>
            Welcome back, <span>educator.</span>
          </h1>
          <p className="pfd-heading-copy">
            Manage your academic responsibilities from one place.
          </p>
        </div>

        <div className="pfd-date">
          <span>TODAY</span>
          <strong>{dateLabel}</strong>
        </div>
      </section>

      <section className="pfd-welcome">
        <div>
          <small>FACULTY DASHBOARD</small>
          <h2>Your academic workspace is ready.</h2>
          <p>
            Faculty ID: {teacherId || "Loading..."} · Manage teaching,
            assessments and academic information.
          </p>
        </div>

        <div className="pfd-welcome-icon">
          <ShieldCheck size={27} />
        </div>
      </section>

      <section>
        <div className="pfd-section-head">
          <div>
            <h2>Faculty Services</h2>
            <p>Select a section to continue.</p>
          </div>
          <span className="pfd-section-count">06 SECTIONS</span>
        </div>

        <div className="pfd-grid">
          {FACULTY_SECTIONS.map((section) => {
            const Icon = section.icon;

            return (
              <button
                type="button"
                className="pfd-card"
                key={section.id}
                onClick={() => handleSectionClick(section)}
              >
                <div className="pfd-card-top">
                  <div className={`pfd-card-icon ${section.color}`}>
                    <Icon size={21} />
                  </div>
                  <span className="pfd-card-number">{section.number}</span>
                </div>

                <p className="pfd-card-tag">{section.tag}</p>
                <h3>{section.title}</h3>
                <p className="pfd-card-description">
                  {section.description}
                </p>

                <div className="pfd-card-bottom">
                  <span>Open section</span>
                  <ArrowRight size={15} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="pfd-footer">
        <span>
          <ShieldCheck size={13} />
          Secure Faculty Workspace
        </span>
        <span>© {new Date().getFullYear()} DPP Institute of Technology</span>
      </footer>

      {activeSection && activeSection.id !== "routine" && (
        <div className="pfd-overlay" onClick={closeSection}>
          <section
            className="pfd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pfd-section-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pfd-modal-head">
              <div>
                <p className="pfd-modal-kicker">{activeSection.tag}</p>
                <h2 id="pfd-section-title">{activeSection.title}</h2>
              </div>

              <button
                type="button"
                className="pfd-modal-close"
                onClick={closeSection}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <p className="pfd-modal-copy">
              {activeSection.description}
            </p>

            <ul className="pfd-detail-list">
              {activeSection.details.map((detail) => (
                <li key={detail}>
                  <ShieldCheck size={15} />
                  {detail}
                </li>
              ))}
            </ul>

            <div className="pfd-modal-note">
              This section is part of the dashboard structure. Its complete
              page and backend connection will be implemented separately.
            </div>

            <div className="pfd-modal-actions">
              <button
                type="button"
                className="pfd-modal-button"
                onClick={closeSection}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {showRoutineNotice && (
        <div className="pfd-overlay">
          <section
            className="pfd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pfd-routine-notice-title"
          >
            <div className="pfd-modal-head">
              <div>
                <p className="pfd-modal-kicker">CLASS ROUTINE</p>
                <h2 id="pfd-routine-notice-title">Important notice</h2>
              </div>

              <button
                type="button"
                className="pfd-modal-close"
                onClick={closeSection}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <p className="pfd-modal-copy">
              The timetable currently displayed is sample data for dashboard
              preview only. It is not the official faculty class routine.
            </p>

            <div className="pfd-modal-note">
              The actual department timetable will be connected after the
              official routine is provided.
            </div>

            <div className="pfd-modal-actions">
              <button
                type="button"
                className="pfd-modal-button secondary"
                onClick={closeSection}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pfd-modal-button"
                onClick={handleRoutineConfirm}
              >
                OK, show sample routine
              </button>
            </div>
          </section>
        </div>
      )}

      {showDummyRoutine && (
        <div className="pfd-overlay" onClick={closeSection}>
          <section
            className="pfd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pfd-routine-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pfd-modal-head">
              <div>
                <p className="pfd-modal-kicker">SAMPLE DATA ONLY</p>
                <h2 id="pfd-routine-title">Weekly Class Routine</h2>
              </div>

              <button
                type="button"
                className="pfd-modal-close"
                onClick={closeSection}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="pfd-modal-note">
              This is a dummy timetable. Please do not treat it as the
              official teaching schedule.
            </div>

            <div className="pfd-routine-list">
              {DUMMY_ROUTINE.map((day) => (
                <div className="pfd-routine-day" key={day.day}>
                  <h3>{day.day}</h3>

                  {day.classes.map((item, index) => (
                    <div
                      className="pfd-routine-class"
                      key={`${day.day}-${index}`}
                    >
                      <span>{item.time}</span>
                      <strong>{item.subject}</strong>
                      <span>{item.room}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="pfd-modal-actions">
              <button
                type="button"
                className="pfd-modal-button"
                onClick={closeSection}
              >
                Close routine
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}