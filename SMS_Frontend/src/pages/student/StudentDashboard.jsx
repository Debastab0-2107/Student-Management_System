
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  GraduationCap,
  Megaphone,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound,
  Clock,
  X,
} from "lucide-react";
import { useStudentLayout } from "../../components/layout/StudentLayout";
import { getClassesForDay, SECTION_NAMES } from "./routineData";
import api from "../../services/api";

const ANNOUNCEMENTS = [
  {
    tag: "ACADEMIC",
    title: "Welcome to the student portal",
    detail: "Important academic updates will appear here.",
  },
  {
    tag: "REMINDER",
    title: "Keep your profile up to date",
    detail: "Review your student details when profile editing becomes available.",
  },
  {
    tag: "INFORMATION",
    title: "Class routine updates",
    detail: "Your daily classes will appear here after the department routine is added.",
  },
];

function getInitials(name = "Student") {
  return (
    name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() ||
    "ST"
  );
}

function formatDate(date, options) {
  return date.toLocaleDateString("en-IN", options);
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { openSidebar, notify } = useStudentLayout();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePreview, setProfilePreview] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showHelp, setShowHelp] = useState(false);

  const today = new Date();

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const token = localStorage.getItem("sms_token");
      const role = localStorage.getItem("sms_role");

      if (!token || role !== "STUDENT") {
        navigate("/login/student", { replace: true });
        return;
      }

      try {
        const response = await api.get("/student/profile");
        if (active) setProfile(response.data);
      } catch (error) {
        if (!active) return;

        const status = error.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem("sms_token");
          localStorage.removeItem("sms_role");
          localStorage.removeItem("sms_student_id");
          navigate("/login/student", { replace: true });
          return;
        }

        setProfilePreview(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  const shownProfile = profile || {
    name: "Student Name",
    studentId: localStorage.getItem("sms_student_id") || "STUDENT-XXXX",
    sessionId: "Session details pending",
  };

  const displayName =
    shownProfile.name || shownProfile.studentName || "Student";

  const studentId =
    shownProfile.studentId ||
    shownProfile.studentID ||
    localStorage.getItem("sms_student_id") ||
    "Student ID pending";

  const session =
    shownProfile.sessionId ||
    shownProfile.session ||
    "Session not available";

  const monthStart = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    1
  );

  const daysInMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    0
  ).getDate();

  const calendarStartDay = monthStart.getDay();

  const changeMonth = (amount) => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + amount,
        1
      )
    );
  };

  const goToToday = () => {
    const now = new Date();
    setCalendarDate(now);
    setSelectedDate(now);
  };

  return (
    <div className="sd-app">
      <style>{`
        .sd-app {
          --navy: #202945;
          --navy-light: #303b5d;
          --gold: #c19a52;
          --gold-light: #fbf4e7;
          --ink: #252c43;
          --muted: #858ba0;
          --line: #e9ebf1;

          position: relative;
          isolation: isolate;
          min-height: 100vh;
          display: flex;
          overflow: clip;
          color: var(--ink);
          background: linear-gradient(135deg, #f9f4ef, #e9eafa 50%, #dce3f8);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 15px;
        }

        .sd-app *,
        .sd-app *::before,
        .sd-app *::after {
          box-sizing: border-box;
        }

        /* Animated background effects */
        .sd-bg-effects {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .sd-bg-orb {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(75px);
          opacity: .22;
          animation: sdFloat 18s ease-in-out infinite alternate;
        }

        .sd-bg-orb-one {
          top: -160px;
          left: 8%;
          background: #d8b56c;
        }

        .sd-bg-orb-two {
          top: 30%;
          right: -180px;
          background: #8199e8;
          animation-delay: -6s;
        }

        .sd-bg-orb-three {
          bottom: -210px;
          left: 35%;
          background: #b4a2eb;
          animation-delay: -11s;
        }

        .sd-bg-grid {
          position: absolute;
          inset: 0;
          opacity: .15;
          background-image: radial-gradient(#7e89ac 0.7px, transparent 0.7px);
          background-size: 24px 24px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        @keyframes sdFloat {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(45px, 35px, 0) scale(1.12); }
          100% { transform: translate3d(-25px, 65px, 0) scale(.94); }
        }

        @keyframes sdRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sd-app button,
        .sd-app a,
        .sd-app input,
        .sd-app select {
          font: inherit;
        }

        .sd-app button { cursor: pointer; }
        .sd-app a { color: inherit; text-decoration: none; }

        .sd-main {
          flex: 1;
          min-width: 0;
          position: relative;
        }

        .sd-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 76px;
          padding: 0 36px;
          border-bottom: 1px solid #e7e9f0;
          background: rgba(255,255,255,.86);
          backdrop-filter: blur(18px);
        }

        .sd-mobile-menu { display: none !important; }

        .sd-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #9298a9;
          font-size: 13px;
        }

        .sd-breadcrumb strong {
          color: var(--navy);
          font-weight: 750;
        }

        .sd-topbar-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .sd-secure-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #737b91;
          font-size: 12px;
        }

        .sd-secure-label svg { color: #4e967a; }

        .sd-notification-button,
        .sd-icon-button {
          position: relative;
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid var(--line);
          border-radius: 12px;
          color: #505872;
          background: white;
          transition: background .2s, transform .2s;
        }

        .sd-notification-button:hover,
        .sd-icon-button:hover {
          background: #f5f6fa;
          transform: translateY(-2px);
        }

        .sd-notification-button > span {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 7px;
          height: 7px;
          border: 1px solid white;
          border-radius: 50%;
          background: #c39a50;
        }

        .sd-mini-avatar,
        .sd-profile-avatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 50%;
          color: white;
          background: linear-gradient(135deg, #3b496e, #202945);
          font-weight: 800;
        }

        .sd-mini-avatar { width: 40px; height: 40px; }

        .sd-content {
          width: 100%;
          max-width: 2200px;
          padding: 38px 42px 32px;
          margin: 0 auto;
          animation: sdRise .45s ease both;
        }

        .sd-preview-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 17px;
          margin-bottom: 20px;
          border: 1px solid #eadbb9;
          border-radius: 13px;
          color: #80612a;
          background: #fff9ed;
          font-size: 13px;
          line-height: 1.7;
        }

        .sd-preview-notice svg { flex-shrink: 0; margin-top: 2px; }

        .sd-welcome {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          min-height: 285px;
          padding: 42px;
          overflow: hidden;
          border: 1px solid #ffffff1c;
          border-radius: 25px;
          color: white;
          background:
            radial-gradient(circle at 80% 0%, #c9a86936, transparent 33%),
            linear-gradient(120deg, #202945, #303b5b);
          box-shadow: 0 18px 48px #212a451b;
          animation: sdRise .55s ease both;
        }

        .sd-welcome::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          right: 80px;
          bottom: -190px;
          border: 1px solid #e5c37e27;
          border-radius: 50%;
          box-shadow: 0 0 0 35px #e5c37e0c, 0 0 0 70px #e5c37e08;
        }

        .sd-welcome-copy { position: relative; z-index: 2; min-width: 0; }

        .sd-welcome-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #e1c17f;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .sd-welcome h1 {
          margin: 18px 0 13px;
          font-size: clamp(34px, 3.2vw, 48px);
          line-height: 1.16;
          letter-spacing: -1.4px;
        }

        .sd-welcome h1 span { color: #e8ca8b; overflow-wrap: anywhere; }

        .sd-welcome-copy > p {
          max-width: 660px;
          margin: 0;
          color: #c1c8d9;
          font-size: 15px;
          line-height: 1.8;
        }

        .sd-welcome-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
          margin-top: 25px;
          color: #e5e8ef;
          font-size: 13px;
        }

        .sd-welcome-meta span { display: inline-flex; align-items: center; gap: 7px; }
        .sd-welcome-meta i { width: 5px; height: 5px; border-radius: 50%; background: #c5a260; }

        .sd-welcome-art {
          position: relative;
          display: grid;
          place-items: center;
          width: 170px;
          height: 170px;
          flex: 0 0 170px;
          margin-right: 35px;
          color: #e5c37e;
        }

        .sd-art-ring { position: absolute; border: 1px solid #e4c4803d; border-radius: 50%; }
        .sd-ring-a { width: 165px; height: 165px; }
        .sd-ring-b { width: 125px; height: 125px; border-style: dashed; }
        .sd-art-book {
          display: grid;
          place-items: center;
          width: 90px;
          height: 90px;
          border: 1px solid #e6c98f55;
          border-radius: 26px;
          background: #ffffff10;
          transform: rotate(-7deg);
          animation: sdBookFloat 5s ease-in-out infinite;
        }

        @keyframes sdBookFloat {
          0%, 100% { transform: translateY(0) rotate(-7deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }

        .sd-art-star { position: absolute; color: #efd79f; font-size: 27px; }
        .sd-star-a { top: 0; right: 5px; }
        .sd-star-b { bottom: 0; left: 0; }

        .sd-welcome-ribbon {
          position: absolute;
          top: 0;
          right: 28px;
          padding: 10px 14px;
          border-radius: 0 0 10px 10px;
          color: #e9d3a3;
          background: #ffffff12;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .sd-ribbon-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 7px;
          border-radius: 50%;
          background: #d9b66e;
        }

        .sd-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin: 24px 0 36px;
        }

        .sd-stat-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
          padding: 24px;
          border: 1px solid #e8eaf1;
          border-radius: 18px;
          background: #ffffffed;
          box-shadow: 0 8px 25px #212a4507;
          backdrop-filter: blur(10px);
          transition: transform .25s, box-shadow .25s;
        }

        .sd-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 32px #212a4510;
        }

        .sd-stat-icon {
          display: grid;
          place-items: center;
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          border-radius: 14px;
        }

        .stat-gold { color: #a67c34; background: #fbf3e4; }
        .stat-blue { color: #526d9c; background: #eef2fb; }
        .stat-green { color: #44866d; background: #eaf6ef; }

        .sd-stat-copy { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .sd-stat-copy > span { color: #83899d; font-size: 12px; }
        .sd-stat-copy strong { color: var(--navy); font-size: 17px; overflow-wrap: anywhere; }
        .sd-stat-copy small { color: #a0a5b3; font-size: 11px; line-height: 1.5; }

        .sd-status-pulse {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #51a783;
          box-shadow: 0 0 0 5px #e9f6ef;
        }

        .sd-dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 390px);
          align-items: start;
          gap: 28px;
        }

        .sd-left-column,
        .sd-right-column {
          display: flex;
          flex-direction: column;
          gap: 30px;
          min-width: 0;
        }

        .sd-section-block { min-width: 0; }

        .sd-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 17px;
        }

        .sd-section-eyebrow {
          color: #b08a46;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .sd-section-heading h2 {
          margin: 7px 0 7px;
          color: var(--navy);
          font-size: 25px;
          letter-spacing: -.6px;
        }

        .sd-section-heading p {
          margin: 0;
          color: #898fa2;
          font-size: 13px;
          line-height: 1.7;
        }

        .sd-text-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          color: #8b6a2e !important;
          font-size: 13px !important;
          font-weight: 750 !important;
        }

        .sd-text-link:hover { color: #4c5675 !important; }

        .sd-today-routine {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .sd-today-section {
          min-width: 0;
          padding: 20px;
          border: 1px solid #e8eaf1;
          border-radius: 17px;
          background: #ffffffed;
          backdrop-filter: blur(10px);
          transition: box-shadow .2s, transform .2s;
        }

        .sd-today-section:hover { box-shadow: 0 12px 30px #212a450b; }

        .sd-today-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 9px;
          margin-bottom: 13px;
        }

        .sd-today-section-heading strong { color: var(--navy); font-size: 14px; }

        .sd-today-section-heading span {
          padding: 6px 9px;
          color: #94702f;
          background: #fbf4e7;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .sd-today-class-list { display: grid; gap: 10px; }

        .sd-today-class {
          display: grid;
          grid-template-columns: 70px minmax(0, 1fr);
          gap: 12px;
          padding: 13px 0;
          border-top: 1px solid #f0f1f5;
        }

        .sd-today-class-time {
          display: grid;
          align-content: start;
          gap: 5px;
          color: #8e692b;
          font-size: 12px;
          font-weight: 800;
        }

        .sd-today-class-time small { color: #8b91a3; font-size: 11px; font-weight: 500; }
        .sd-today-class strong { color: #303752; font-size: 13px; }
        .sd-today-class p { margin: 5px 0; color: #747c91; font-size: 12px; line-height: 1.5; }
        .sd-today-class div > small { color: #9096a7; font-size: 11px; }

        .sd-no-classes {
          margin: 0;
          padding: 16px 0 7px;
          color: #7e879b;
          font-size: 13px;
          line-height: 1.7;
        }

        .sd-date-panel,
        .sd-panel,
        .sd-calendar-panel {
          padding: 25px;
          border: 1px solid #e8eaf1;
          border-radius: 20px;
          background: #ffffffed;
          box-shadow: 0 8px 26px #212a4508;
          backdrop-filter: blur(12px);
        }

        .sd-date-panel {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #fff, #fcfaf5);
        }

        .sd-date-panel::after {
          position: absolute;
          top: -40px;
          right: -35px;
          width: 130px;
          height: 130px;
          border: 1px solid #f0e3c9;
          border-radius: 50%;
          content: "";
        }

        .sd-date-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .sd-date-top > span {
          color: #a27b37;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .sd-date-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 13px;
          color: #a57e39;
          background: #f7edd9;
        }

        .sd-date-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 22px;
        }

        .sd-date-number {
          display: grid;
          place-items: center;
          width: 92px;
          height: 100px;
          flex-shrink: 0;
          border-radius: 18px;
          color: white;
          background: var(--navy);
          box-shadow: 0 9px 20px #20294525;
        }

        .sd-date-number strong { font-size: 42px; line-height: 1; letter-spacing: -1px; }
        .sd-date-number span { margin-top: -8px; color: #e5c986; font-size: 12px; font-weight: 800; letter-spacing: 1.3px; text-transform: uppercase; }
        .sd-date-copy { min-width: 0; }
        .sd-date-copy h3 { margin: 0 0 7px; color: var(--navy); font-size: 19px; line-height: 1.4; }
        .sd-date-copy p { margin: 0; color: #858ba0; font-size: 12px; line-height: 1.7; }

        .sd-date-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee8dc;
          color: #687e70;
          font-size: 12px;
        }

        .sd-date-footer svg { color: #4f9b7b; }

        .sd-calendar-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .sd-calendar-heading span,
        .sd-calendar-selected span {
          color: #a77e36;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }

        .sd-calendar-heading h3 { margin: 6px 0 0; color: #252c43; font-size: 21px; }

        .sd-calendar-heading button {
          padding: 9px 12px;
          color: #8a6528;
          background: #fbf4e7;
          border: 1px solid #f0e3c9;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 700;
        }

        .sd-calendar-controls {
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr) 86px 38px;
          gap: 7px;
          margin-bottom: 18px;
        }

        .sd-calendar-controls button {
          border: 1px solid #e9ebf1;
          border-radius: 9px;
          background: #f8f9fc;
          color: #29324f;
          font-size: 22px;
        }

        .sd-calendar-controls select {
          min-width: 0;
          padding: 9px 6px;
          border: 1px solid #e9ebf1;
          border-radius: 9px;
          color: #343b57;
          background: white;
          font-size: 12px;
        }

        .sd-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 5px;
          text-align: center;
        }

        .sd-calendar-weekdays {
          margin-bottom: 9px;
          color: #8a91a5;
          font-size: 12px;
          font-weight: 800;
        }

        .sd-calendar-weekdays span { padding: 7px 0; }

        .sd-calendar-days button,
        .sd-calendar-blank {
          display: grid;
          place-items: center;
          aspect-ratio: 1;
          min-width: 0;
          border: 1px solid transparent;
          border-radius: 10px;
          color: #3a415c;
          background: transparent;
          font-size: 12px;
        }

        .sd-calendar-days button:hover { background: #f7f1e6; }
        .sd-calendar-days button.is-today { border-color: #c19a52; color: #946c27; font-weight: 800; }

        .sd-calendar-days button.is-selected {
          color: white;
          background: #202945;
          border-color: #202945;
          box-shadow: 0 5px 12px #20294530;
        }

        .sd-calendar-selected {
          display: grid;
          gap: 7px;
          margin-top: 17px;
          padding-top: 16px;
          border-top: 1px solid #eef0f5;
        }

        .sd-calendar-selected strong { color: #333a55; font-size: 13px; }

        .sd-marks-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .sd-mark-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
          padding: 24px;
          border: 1px solid #e8eaf1;
          border-radius: 18px;
          text-align: left;
          background: #ffffffed;
          transition: transform .25s, box-shadow .25s, border-color .25s;
        }

        .sd-mark-card:hover {
          transform: translateY(-5px);
          border-color: #dfcc9f;
          box-shadow: 0 15px 32px #1e284612;
        }

        .sd-mark-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          margin-bottom: 17px;
          border-radius: 14px;
        }

        .ca-card .sd-mark-icon { color: #a57c35; background: #faf1e1; }
        .uni-card .sd-mark-icon { color: #5974a7; background: #eef2fb; }

        .sd-mark-kicker { color: #9a9fb0; font-size: 10px; font-weight: 800; letter-spacing: 1px; }
        .sd-mark-card > strong { margin-top: 8px; color: var(--navy); font-size: 18px; }
        .sd-mark-card > p { margin: 9px 0 18px; color: #858ba0; font-size: 13px; line-height: 1.7; }

        .sd-mark-action {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: auto;
          color: #92702f;
          font-size: 13px;
          font-weight: 750;
        }

        .sd-demo-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 12px 0 0;
          color: #9298a8;
          font-size: 11px;
          line-height: 1.7;
        }

        .sd-demo-disclaimer svg { flex-shrink: 0; margin-top: 2px; }

        .sd-announcement-list {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e8eaf1;
          border-radius: 17px;
          background: #ffffffed;
        }

        .sd-announcement {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          border-bottom: 1px solid #f0f1f5;
          animation: sdRise .4s ease both;
          animation-delay: calc(var(--announcement-index) * 70ms);
          transition: background .2s;
        }

        .sd-announcement:hover { background: #fafbfe; }
        .sd-announcement:last-child { border-bottom: 0; }

        .sd-announcement-icon {
          display: grid;
          place-items: center;
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          border-radius: 13px;
        }

        .ann-0 { color: #a57d35; background: #faf1e1; }
        .ann-1 { color: #5673a8; background: #eef2fb; }
        .ann-2 { color: #4c9277; background: #eaf5ef; }

        .sd-announcement-body { flex: 1; min-width: 0; }

        .sd-announcement-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; }
        .sd-announcement-meta span { color: #a17c38; font-size: 10px; font-weight: 800; letter-spacing: .8px; }
        .sd-announcement-meta small { color: #a0a5b3; font-size: 11px; }
        .sd-announcement h3 { margin: 7px 0 5px; color: var(--navy); font-size: 14px; line-height: 1.5; }
        .sd-announcement p { margin: 0; color: #858ba0; font-size: 12px; line-height: 1.7; }
        .sd-announcement-arrow { flex-shrink: 0; margin-top: 12px; color: #a5aabb; }

        .sd-bottom-grid { display: grid; grid-template-columns: 1fr; gap: 15px; margin-top: 30px; }

        .sd-security-strip {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
          padding: 22px;
          border: 1px solid #e8eaf1;
          border-radius: 17px;
          background: #ffffffed;
        }

        .sd-security-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 13px;
          color: #4b9277;
          background: #eaf5ef;
        }

        .sd-security-strip strong { color: var(--navy); font-size: 14px; }
        .sd-security-strip p { margin: 6px 0 0; color: #858ba0; font-size: 12px; line-height: 1.7; }

        .sd-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
          padding: 28px 2px 8px;
          color: #858da2;
          font-size: 12px;
        }

        .sd-footer button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0;
          border: 0;
          color: #737b91;
          background: transparent;
          font-size: 12px;
        }

        .sd-footer-star { color: #b48b45; }

        .sd-help-panel {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 80;
          width: min(360px, calc(100vw - 32px));
          padding: 22px;
          border: 1px solid #e8eaf1;
          border-radius: 18px;
          background: white;
          box-shadow: 0 20px 60px #18244225;
          animation: sdRise .25s ease both;
        }

        .sd-help-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .sd-help-panel h3 { margin: 0; color: var(--navy); font-size: 17px; }
        .sd-help-panel p { color: #778197; font-size: 13px; line-height: 1.7; }
        .sd-help-panel .sd-icon-button { width: 32px; height: 32px; }

        @media (max-width: 1150px) {
          .sd-content { padding: 28px 24px; }
          .sd-dashboard-grid { grid-template-columns: minmax(0, 1fr) minmax(280px, 330px); gap: 20px; }
          .sd-welcome { padding: 32px; }
          .sd-welcome-art { margin-right: 10px; transform: scale(.9); }
          .sd-stat-card { padding: 17px; }
          .sd-stat-icon { width: 44px; height: 44px; }
          .sd-date-panel, .sd-calendar-panel { padding: 20px; }
        }

        @media (max-width: 850px) {
          .sd-topbar { padding: 0 20px; }
          .sd-dashboard-grid { grid-template-columns: minmax(0, 1fr); }
          .sd-right-column { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
          .sd-calendar-panel { grid-column: span 2; }
          .sd-welcome-art { width: 120px; height: 120px; flex-basis: 120px; }
          .sd-ring-a { width: 120px; height: 120px; }
          .sd-ring-b { width: 94px; height: 94px; }
          .sd-topbar-right { margin-left: auto; }
        }

        @media (max-width: 650px) {
          .sd-topbar { min-height: 62px; padding: 0 13px; }
          .sd-mobile-menu { display: grid !important; }
          .sd-breadcrumb { gap: 5px; font-size: 11px; }
          .sd-topbar-right { gap: 8px; }
          .sd-secure-label { display: none; }
          .sd-notification-button { width: 35px; height: 35px; }
          .sd-mini-avatar { width: 33px; height: 33px; }
          .sd-content { padding: 17px 13px 20px; }
          .sd-welcome { min-height: auto; padding: 26px 20px 24px; border-radius: 18px; }
          .sd-welcome h1 { font-size: 29px; }
          .sd-welcome-copy > p { font-size: 12px; }
          .sd-welcome-art { display: none; }
          .sd-welcome-ribbon { right: 12px; font-size: 8px; }
          .sd-welcome-meta { gap: 9px; margin-top: 18px; padding-bottom: 10px; font-size: 10px; }
          .sd-stat-grid { grid-template-columns: 1fr; gap: 10px; margin: 15px 0 25px; }
          .sd-stat-card { padding: 15px; }
          .sd-dashboard-grid { grid-template-columns: minmax(0, 1fr); gap: 25px; }
          .sd-left-column, .sd-right-column { gap: 25px; }
          .sd-right-column { display: flex; }
          .sd-calendar-panel { width: 100%; }
          .sd-section-heading { align-items: flex-start; }
          .sd-section-heading h2 { font-size: 21px; }
          .sd-section-heading p { max-width: 260px; }
          .sd-text-link { padding-top: 8px; font-size: 11px !important; }
          .sd-today-routine { grid-template-columns: 1fr; }
          .sd-today-section { padding: 16px; }
          .sd-marks-grid { grid-template-columns: 1fr; }
          .sd-mark-card { padding: 19px; }
          .sd-date-panel, .sd-calendar-panel { padding: 18px; }
          .sd-date-number { width: 76px; height: 83px; }
          .sd-date-number strong { font-size: 36px; }
          .sd-date-copy h3 { font-size: 16px; }
          .sd-calendar-controls { grid-template-columns: 32px minmax(0, 1fr) 76px 32px; }
          .sd-calendar-days button, .sd-calendar-blank { border-radius: 8px; font-size: 11px; }
          .sd-announcement { padding: 15px; gap: 11px; }
          .sd-announcement-icon { width: 38px; height: 38px; }
          .sd-bottom-grid { margin-top: 22px; }
          .sd-security-strip { align-items: flex-start; padding: 16px; }
          .sd-footer { justify-content: flex-start; gap: 12px 17px; }
        }

        @media (max-width: 370px) {
          .sd-content { padding-right: 10px; padding-left: 10px; }
          .sd-welcome { padding: 22px 15px; }
          .sd-welcome h1 { font-size: 25px; }
          .sd-section-heading { flex-direction: column; gap: 7px; }
          .sd-text-link { padding-top: 0; }
          .sd-date-content { gap: 10px; }
          .sd-date-number { width: 64px; height: 74px; }
          .sd-date-number strong { font-size: 30px; }
          .sd-calendar-controls { grid-template-columns: 28px minmax(0, 1fr) 66px 28px; gap: 4px; }
          .sd-calendar-controls select { font-size: 10px; }
          .sd-calendar-grid { gap: 2px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sd-app *,
          .sd-app *::before,
          .sd-app *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="sd-bg-effects" aria-hidden="true">
        <div className="sd-bg-orb sd-bg-orb-one" />
        <div className="sd-bg-orb sd-bg-orb-two" />
        <div className="sd-bg-orb sd-bg-orb-three" />
        <div className="sd-bg-grid" />
      </div>

      <main className="sd-main">
        <header className="sd-topbar">
          <button
            className="sd-icon-button sd-mobile-menu"
            onClick={openSidebar}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div className="sd-breadcrumb">
            <span>Student Portal</span>
            <ChevronRight size={15} />
            <strong>Dashboard</strong>
          </div>

          <div className="sd-topbar-right">
            <span className="sd-secure-label">
              <ShieldCheck size={17} />
              Secure student access
            </span>

            <button
              className="sd-notification-button"
              aria-label="Open announcements"
              onClick={() => navigate("/student/notices")}
            >
              <Bell size={19} />
              <span />
            </button>

            <div className="sd-mini-avatar">{getInitials(displayName)}</div>
          </div>
        </header>

        <div className="sd-content">
          {profilePreview && (
            <div className="sd-preview-notice" role="status">
              <ShieldCheck size={17} />
              Live profile details are unavailable right now. Preview
              information is shown where needed.
            </div>
          )}

          <section className="sd-welcome">
            <div className="sd-welcome-copy">
              <span className="sd-welcome-eyebrow">
                <Sparkles size={16} />
                YOUR ACADEMIC SPACE
              </span>

              <h1>
                {loading ? "Welcome back" : "Welcome back,"}
                <br />
                <span>{displayName}</span>
              </h1>

              <p>
                Everything you need for your MCA journey, thoughtfully
                brought together in one place.
              </p>

              <div className="sd-welcome-meta">
                <span><UserRound size={16} /> {studentId}</span>
                <i />
                <span>
                  <GraduationCap size={17} />
                  MCA — Master of Computer Applications
                </span>
              </div>
            </div>

            <div className="sd-welcome-art" aria-hidden="true">
              <div className="sd-art-ring sd-ring-a" />
              <div className="sd-art-ring sd-ring-b" />
              <div className="sd-art-book"><BookOpen size={52} /></div>
              <div className="sd-art-star sd-star-a">✦</div>
              <div className="sd-art-star sd-star-b">✧</div>
            </div>

            <div className="sd-welcome-ribbon">
              <span className="sd-ribbon-dot" />
              MCA DEPARTMENT
            </div>
          </section>

          <section className="sd-stat-grid" aria-label="Student summary">
            <article className="sd-stat-card">
              <div className="sd-stat-icon stat-gold">
                <GraduationCap size={24} />
              </div>
              <div className="sd-stat-copy">
                <span>Programme</span>
                <strong>MCA</strong>
                <small>Master of Computer Applications</small>
              </div>
            </article>

            <article className="sd-stat-card">
              <div className="sd-stat-icon stat-blue">
                <CalendarDays size={24} />
              </div>
              <div className="sd-stat-copy">
                <span>Academic session</span>
                <strong>{session}</strong>
                <small>Department registration</small>
              </div>
            </article>

            <article className="sd-stat-card">
              <div className="sd-stat-icon stat-green">
                <CheckCircle2 size={24} />
              </div>
              <div className="sd-stat-copy">
                <span>Portal status</span>
                <strong>Signed in</strong>
                <small>Student account session</small>
              </div>
              <span className="sd-status-pulse" />
            </article>
          </section>

          <div className="sd-dashboard-grid">
            <div className="sd-left-column">
              <section className="sd-section-block">
                <div className="sd-section-heading">
                  <div>
                    <span className="sd-section-eyebrow">YOUR TIMETABLE</span>
                    <h2>Today's classes</h2>
                    <p>
                      {formatDate(today, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <Link className="sd-text-link" to="/student/routine">
                    View routine <ArrowRight size={17} />
                  </Link>
                </div>

                <div className="sd-today-routine">
                  {SECTION_NAMES.map((section) => {
                    const classes = getClassesForDay(today.getDay(), section);

                    return (
                      <section className="sd-today-section" key={section}>
                        <div className="sd-today-section-heading">
                          <strong>{section}</strong>
                          <span>
                            {classes.length} {classes.length === 1 ? "class" : "classes"}
                          </span>
                        </div>

                        {classes.length ? (
                          <div className="sd-today-class-list">
                            {classes.map((item) => (
                              <article
                                className="sd-today-class"
                                key={`${section}-${item.start}-${item.code}`}
                              >
                                <span className="sd-today-class-time">
                                  {item.start}
                                  <small>{item.end}</small>
                                </span>
                                <div>
                                  <strong>{item.code}</strong>
                                  <p>{item.name}</p>
                                  <small>{item.faculty} · Room {item.room}</small>
                                </div>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="sd-no-classes">
                            No classes scheduled for today.
                          </p>
                        )}
                      </section>
                    );
                  })}
                </div>
              </section>

              <section className="sd-section-block">
                <div className="sd-section-heading">
                  <div>
                    <span className="sd-section-eyebrow">ACADEMIC RECORDS</span>
                    <h2>Marks at a glance</h2>
                    <p>CA and university marks are kept separate.</p>
                  </div>
                </div>

                <div className="sd-marks-grid">
                  <button
                    className="sd-mark-card ca-card"
                    onClick={() => navigate("/student/ca-marks")}
                  >
                    <span className="sd-mark-icon">
                      <ClipboardList size={24} />
                    </span>
                    <span className="sd-mark-kicker">CONTINUOUS ASSESSMENT</span>
                    <strong>CA Marks</strong>
                    <p>Internal assessment marks by subject.</p>
                    <span className="sd-mark-action">
                      Open CA marks <ArrowRight size={17} />
                    </span>
                  </button>

                  <button
                    className="sd-mark-card uni-card"
                    onClick={() => navigate("/student/university-marks")}
                  >
                    <span className="sd-mark-icon">
                      <BookOpenCheck size={24} />
                    </span>
                    <span className="sd-mark-kicker">UNIVERSITY EXAMINATION</span>
                    <strong>University Marks</strong>
                    <p>University examination marks and result status.</p>
                    <span className="sd-mark-action">
                      Open university marks <ArrowRight size={17} />
                    </span>
                  </button>
                </div>

                <p className="sd-demo-disclaimer">
                  <ShieldCheck size={15} />
                  No real marks or CGPA are displayed here. Marks will be
                  shown when the student-specific data is connected.
                </p>
              </section>

              <section className="sd-section-block">
                <div className="sd-section-heading">
                  <div>
                    <span className="sd-section-eyebrow">FROM YOUR DEPARTMENT</span>
                    <h2>Announcements</h2>
                    <p>Sample notices preview how updates will appear.</p>
                  </div>

                  <Link className="sd-text-link" to="/student/notices">
                    View all <ArrowRight size={17} />
                  </Link>
                </div>

                <div className="sd-announcement-list">
                  {ANNOUNCEMENTS.map((item, index) => (
                    <article
                      className="sd-announcement"
                      key={item.title}
                      style={{ "--announcement-index": index }}
                    >
                      <div className={`sd-announcement-icon ann-${index}`}>
                        <Megaphone size={21} />
                      </div>

                      <div className="sd-announcement-body">
                        <div className="sd-announcement-meta">
                          <span>{item.tag}</span>
                          <small>Sample notice</small>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.detail}</p>
                      </div>

                      <ArrowRight className="sd-announcement-arrow" size={19} />
                    </article>
                  ))}
                </div>

                <p className="sd-demo-disclaimer">
                  <Bell size={15} />
                  These are dummy announcements for interface testing.
                </p>
              </section>
            </div>

            <aside className="sd-right-column">
              <section className="sd-date-panel">
                <div className="sd-date-top">
                  <span>TODAY'S DATE</span>
                  <div className="sd-date-icon">
                    <CalendarDays size={24} />
                  </div>
                </div>

                <div className="sd-date-content">
                  <div className="sd-date-number">
                    <strong>{today.getDate()}</strong>
                    <span>{formatDate(today, { month: "short" })}</span>
                  </div>

                  <div className="sd-date-copy">
                    <h3>{formatDate(today, { weekday: "long" })}</h3>
                    <p>{formatDate(today, { month: "long", year: "numeric" })}</p>
                    <p>
                      {formatDate(today, {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="sd-date-footer">
                  <CheckCircle2 size={17} />
                  Your dashboard is ready for today
                </div>
              </section>

              <section className="sd-calendar-panel" aria-label="Calendar">
                <div className="sd-calendar-heading">
                  <div>
                    <span>CALENDAR</span>
                    <h3>Explore dates</h3>
                  </div>
                  <button type="button" onClick={goToToday}>Today</button>
                </div>

                <div className="sd-calendar-controls">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => changeMonth(-1)}
                  >
                    ‹
                  </button>

                  <select
                    aria-label="Select month"
                    value={calendarDate.getMonth()}
                    onChange={(event) =>
                      setCalendarDate(
                        new Date(
                          calendarDate.getFullYear(),
                          Number(event.target.value),
                          1
                        )
                      )
                    }
                  >
                    {Array.from({ length: 12 }, (_, month) => (
                      <option key={month} value={month}>
                        {new Date(2000, month, 1).toLocaleDateString("en-IN", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Select year"
                    value={calendarDate.getFullYear()}
                    onChange={(event) =>
                      setCalendarDate(
                        new Date(
                          Number(event.target.value),
                          calendarDate.getMonth(),
                          1
                        )
                      )
                    }
                  >
                    {Array.from(
                      { length: 81 },
                      (_, index) => new Date().getFullYear() - 40 + index
                    ).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => changeMonth(1)}
                  >
                    ›
                  </button>
                </div>

                <div className="sd-calendar-grid sd-calendar-weekdays">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="sd-calendar-grid sd-calendar-days">
                  {Array.from({ length: calendarStartDay }, (_, index) => (
                    <span className="sd-calendar-blank" key={`blank-${index}`} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const date = new Date(
                      calendarDate.getFullYear(),
                      calendarDate.getMonth(),
                      day
                    );

                    const isToday = date.toDateString() === today.toDateString();
                    const isSelected =
                      date.toDateString() === selectedDate.toDateString();

                    return (
                      <button
                        type="button"
                        key={day}
                        className={`${isToday ? "is-today" : ""} ${
                          isSelected ? "is-selected" : ""
                        }`}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedDate(date)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="sd-calendar-selected">
                  <span>SELECTED DATE</span>
                  <strong>
                    {formatDate(selectedDate, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </div>
              </section>
            </aside>
          </div>

          <section className="sd-bottom-grid">
            <article className="sd-security-strip">
              <div className="sd-security-icon">
                <ShieldCheck size={26} />
              </div>
              <div>
                <strong>Your records stay personal</strong>
                <p>
                  Never share your password or login token. Student records
                  should only be accessible to the signed-in student.
                </p>
              </div>
            </article>
          </section>

          <footer className="sd-footer">
            <span>© {today.getFullYear()} DPP Institute</span>
            <span>
              MCA Department Student Portal{" "}
              <span className="sd-footer-star">✦</span>
            </span>
            <button onClick={() => setShowHelp(true)}>
              <CircleHelp size={16} /> Help
            </button>
          </footer>
        </div>
      </main>

      {showHelp && (
        <div className="sd-help-panel" role="dialog" aria-modal="false" aria-labelledby="sd-help-title">
          <div className="sd-help-panel-header">
            <h3 id="sd-help-title">Need help?</h3>
            <button
              className="sd-icon-button"
              aria-label="Close help"
              onClick={() => setShowHelp(false)}
            >
              <X size={17} />
            </button>
          </div>
          <p>
            For account support, profile issues, or student record questions,
            please contact your department administrator.
          </p>
          <button className="sd-text-link" onClick={() => setShowHelp(false)}>
            Got it <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
