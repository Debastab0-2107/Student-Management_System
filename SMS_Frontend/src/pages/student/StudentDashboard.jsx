
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  GraduationCap,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  Clock3,
  LayoutDashboard,
  CalendarCheck,
  LockKeyhole,
} from "lucide-react";

import { useStudentLayout } from "../../components/layout/StudentLayout";
import { getClassesForDay, SECTION_NAMES } from "./routineData";
import api from "../../services/api";

function getInitials(name = "Student") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "ST"
  );
}

function formatDate(date, options) {
  return date.toLocaleDateString("en-IN", options);
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { openSidebar } = useStudentLayout();

  const [profile, setProfile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showHelp, setShowHelp] = useState(false);

  const today = new Date();

  // =========================================
  // AUTHENTICATION AND PROFILE
  // =========================================

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

        if (active) {
          setProfile(response.data);
        }
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
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  // =========================================
  // STUDENT DETAILS
  // =========================================

  const shownProfile = profile || {
    name: "Student Name",
    studentId:
      localStorage.getItem("sms_student_id") || "STUDENT-XXXX",
    sessionId: "Session details pending",
  };

  const displayName =
    shownProfile.name ||
    shownProfile.studentName ||
    "Student";

  const studentId =
    shownProfile.studentId ||
    shownProfile.studentID ||
    localStorage.getItem("sms_student_id") ||
    "Student ID pending";

  const session =
    shownProfile.sessionId ||
    shownProfile.session ||
    "Session not available";

  const semesterValue =
    shownProfile.currentSemesterName ||
    shownProfile.semesterName ||
    shownProfile.currentSemester ||
    shownProfile.currentSemesterId ||
    shownProfile.semesterId ||
    null;

  const getSemesterLabel = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Semester not assigned";
    }

    if (
      typeof value === "string" &&
      /semester/i.test(value)
    ) {
      return value;
    }

    const semesterNumber = Number(value);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1
    ) {
      return String(value);
    }

    const suffix =
      semesterNumber % 100 >= 11 &&
      semesterNumber % 100 <= 13
        ? "th"
        : semesterNumber % 10 === 1
        ? "st"
        : semesterNumber % 10 === 2
        ? "nd"
        : semesterNumber % 10 === 3
        ? "rd"
        : "th";

    return `${semesterNumber}${suffix} Semester`;
  };

  const currentSemesterLabel =
    getSemesterLabel(semesterValue);

  const courseCode = String(
    shownProfile.courseId ||
      shownProfile.courseCode ||
      shownProfile.course?.courseId ||
      shownProfile.course?.courseCode ||
      ""
  )
    .trim()
    .toUpperCase();

  const courseDetails = {
    MCA: {
      name: "MCA",
      fullName: "Master of Computer Applications",
      department: "MCA DEPARTMENT",
    },
    BCA: {
      name: "BCA",
      fullName: "Bachelor of Computer Applications",
      department: "BCA DEPARTMENT",
    },
  };

  const course = courseDetails[courseCode] || {
    name: courseCode || "Course",
    fullName: "Course details unavailable",
    department: "STUDENT DEPARTMENT",
  };

  const courseDisplay =
    `${course.name} — ${course.fullName}`;

  // =========================================
  // CALENDAR
  // =========================================

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

  // =========================================
  // TODAY'S CLASSES
  // =========================================

  const getTodayClasses = (section) => {
    return getClassesForDay(
      today.getDay(),
      section,
      courseCode
    );
  };

  const totalClasses = SECTION_NAMES.reduce(
    (total, section) =>
      total + getTodayClasses(section).length,
    0
  );

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="academic-dashboard">

      <style>{`

        /* =========================================
           DESIGN SYSTEM
        ========================================= */

        .academic-dashboard {
          --navy: #202945;
          --navy-2: #303b5d;
          --navy-3: #3c4b72;

          --gold: #c19a52;
          --gold-light: #fbf4e7;

          --mint: #e4f5ed;
          --mint-dark: #398a69;

          --blue-light: #e9efff;
          --blue-dark: #526eae;

          --lavender: #f0edff;
          --lavender-dark: #7966bb;

          --ink: #252c43;
          --muted: #858ba0;

          --border: #dce1ec;
          --surface: #ffffff;

          min-height: 100vh;
          width: 100%;
          position: relative;
          isolation: isolate;
          overflow: hidden;

          color: var(--ink);

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background:
            radial-gradient(
              circle at 5% 5%,
              rgba(193,154,82,.12),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 30%,
              rgba(103,129,190,.14),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #f0f3fa 0%,
              #e9eef8 48%,
              #f5f2ec 100%
            );
        }

        .academic-dashboard *,
        .academic-dashboard *::before,
        .academic-dashboard *::after {
          box-sizing: border-box;
        }

        .academic-dashboard button,
        .academic-dashboard a,
        .academic-dashboard select {
          font: inherit;
        }

        .academic-dashboard button {
          cursor: pointer;
        }

        .academic-dashboard a {
          text-decoration: none;
          color: inherit;
        }

        /* =========================================
           BACKGROUND DECORATIONS
        ========================================= */

        .ad-background {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }

        .ad-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
          animation: orbFloat 10s ease-in-out infinite;
        }

        .ad-orb-one {
          width: 360px;
          height: 360px;
          background: rgba(193,154,82,.09);
          top: 100px;
          left: -190px;
        }

        .ad-orb-two {
          width: 450px;
          height: 450px;
          background: rgba(101,124,188,.09);
          right: -220px;
          top: 420px;
          animation-delay: -4s;
        }

        .ad-orb-three {
          width: 220px;
          height: 220px;
          background: rgba(85,170,132,.07);
          left: 40%;
          bottom: -120px;
          animation-delay: -7s;
        }

        @keyframes orbFloat {
          0%,100% {
            transform: translate3d(0,0,0);
          }
          50% {
            transform: translate3d(18px,-22px,0);
          }
        }

        /* =========================================
           MAIN CONTAINER
        ========================================= */

        .ad-main {
          width: 100%;
          max-width: 1580px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .ad-content {
          padding: 25px 36px 35px;
        }

        /* =========================================
           TOP NAVIGATION
        ========================================= */

        .ad-topbar {
          height: 72px;
          padding: 0 36px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: rgba(255,255,255,.78);
          border-bottom: 1px solid rgba(32,41,69,.10);

          backdrop-filter: blur(18px);
        }

        .ad-top-left,
        .ad-top-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ad-brand-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;

          color: white;
          background: var(--navy);
          border-radius: 14px;

          box-shadow: 0 5px 14px rgba(32,41,69,.2);
        }

        .ad-brand-copy strong {
          display: block;
          font-size: 14px;
          font-weight: 850;
          color: var(--navy);
        }

        .ad-brand-copy span {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
        }

        .ad-breadcrumb {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-left: 24px;
          color: var(--muted);
          font-size: 12px;
        }

        .ad-breadcrumb strong {
          color: var(--navy);
        }

        .ad-menu-button,
        .ad-notification,
        .ad-avatar {
          display: grid;
          place-items: center;
          border: 1px solid var(--border);
          transition: .25s ease;
        }

        .ad-menu-button {
          width: 40px;
          height: 40px;
          color: var(--navy);
          background: white;
          border-radius: 12px;
        }

        .ad-menu-button:hover {
          background: var(--navy);
          color: white;
        }

        .ad-notification {
          width: 42px;
          height: 42px;
          position: relative;
          color: var(--navy);
          background: white;
          border-radius: 14px;
        }

        .ad-notification:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 17px rgba(32,41,69,.12);
        }

        .ad-notification-dot {
          position: absolute;
          top: 8px;
          right: 9px;
          width: 8px;
          height: 8px;
          border: 2px solid white;
          background: #e16c6c;
          border-radius: 50%;
        }

        .ad-avatar {
          width: 43px;
          height: 43px;
          color: white;
          font-size: 13px;
          font-weight: 850;
          background: linear-gradient(
            140deg,
            var(--navy),
            #52628c
          );
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(32,41,69,.16);
        }

        .ad-avatar:hover {
          transform: rotate(-5deg) scale(1.06);
        }

        .ad-secure {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--mint-dark);
          font-size: 11px;
          font-weight: 750;
        }

        /* =========================================
           PREVIEW NOTICE
        ========================================= */

        .ad-preview {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 13px 17px;
          margin-bottom: 20px;

          border: 1px solid #e6c87f;
          border-radius: 13px;

          background: #fff8e8;
          color: #8b692a;

          font-size: 12px;
          font-weight: 600;
        }

        /* =========================================
           HERO SECTION
        ========================================= */

        .ad-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;

          min-height: 265px;
          padding: 40px 48px;

          color: white;

          background:
            radial-gradient(
              circle at 78% 30%,
              rgba(193,154,82,.19),
              transparent 24%
            ),
            linear-gradient(
              115deg,
              #17213e 0%,
              #202945 52%,
              #344365 100%
            );

          border: 1px solid rgba(255,255,255,.15);
          border-radius: 27px;

          box-shadow:
            0 18px 42px rgba(32,41,69,.20),
            inset 0 1px rgba(255,255,255,.13);

          animation: heroEnter .75s cubic-bezier(.2,.8,.2,1) both;
        }

        @keyframes heroEnter {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ad-hero::before {
          content: "";
          position: absolute;
          z-index: -1;
          width: 430px;
          height: 430px;
          right: 5%;
          top: -280px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          box-shadow:
            0 0 0 30px rgba(255,255,255,.025),
            0 0 0 65px rgba(255,255,255,.025),
            0 0 0 100px rgba(255,255,255,.02);
        }

        .ad-hero::after {
          content: "✦";
          position: absolute;
          right: 34%;
          top: 24%;
          color: #e9c77f;
          font-size: 26px;
          opacity: .75;
          animation: sparkle 3s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%,100% {
            opacity: .45;
            transform: scale(.8) rotate(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.25) rotate(35deg);
          }
        }

        .ad-hero-copy {
          max-width: 730px;
          position: relative;
          z-index: 2;
        }

        .ad-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;

          padding: 8px 13px;

          border: 1px solid rgba(255,255,255,.17);
          border-radius: 30px;

          background: rgba(255,255,255,.09);

          color: #e9cb8c;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.7px;
        }

        .ad-hero h1 {
          margin: 22px 0 9px;
          font-size: clamp(31px, 4vw, 47px);
          line-height: 1.12;
          font-weight: 850;
          letter-spacing: -1.8px;
        }

        .ad-hero h1 span {
          color: #e6c47d;
        }

        .ad-hero-description {
          margin: 0;
          max-width: 590px;
          color: rgba(255,255,255,.72);
          font-size: 13px;
          line-height: 1.8;
        }

        .ad-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 23px;
        }

        .ad-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 9px 13px;

          border: 1px solid rgba(255,255,255,.16);
          border-radius: 30px;

          background: rgba(255,255,255,.09);

          color: #fff;
          font-size: 11px;
          font-weight: 650;
        }

        .ad-meta-pill svg {
          color: #e8c67f;
        }

        .ad-hero-art {
          position: relative;
          flex-shrink: 0;

          width: 185px;
          height: 185px;

          display: grid;
          place-items: center;
        }

        .ad-hero-ring {
          position: absolute;
          border: 1px solid rgba(235,204,141,.45);
          border-radius: 50%;
          animation: ringRotate 17s linear infinite;
        }

        .ad-hero-ring.one {
          inset: 0;
        }

        .ad-hero-ring.two {
          inset: 18px;
          border-style: dashed;
          animation-direction: reverse;
        }

        @keyframes ringRotate {
          to {
            transform: rotate(360deg);
          }
        }

        .ad-hero-book {
          width: 105px;
          height: 105px;

          display: grid;
          place-items: center;

          color: #f4d99e;

          border: 1px solid rgba(255,255,255,.3);
          border-radius: 30px;

          background: linear-gradient(
            145deg,
            #485b82,
            #202945
          );

          box-shadow:
            0 12px 35px rgba(0,0,0,.25),
            inset 0 1px rgba(255,255,255,.3);

          transform: rotate(-8deg);
          animation: bookFloat 4s ease-in-out infinite;
        }

        @keyframes bookFloat {
          0%,100% {
            transform: translateY(0) rotate(-8deg);
          }
          50% {
            transform: translateY(-10px) rotate(-3deg);
          }
        }

        .ad-hero-ribbon {
          position: absolute;
          top: 0;
          right: 34px;

          padding: 10px 17px;

          border-radius: 0 0 12px 12px;

          color: var(--navy);
          background: #f0d99f;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        /* =========================================
           SECTION LABELS
        ========================================= */

        .ad-section-title {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .ad-section-title > div > span {
          display: block;
          margin-bottom: 7px;

          color: #a17c3d;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .ad-section-title h2 {
          margin: 0;
          color: var(--navy);
          font-size: 24px;
          font-weight: 850;
          letter-spacing: -.6px;
        }

        .ad-section-title p {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .ad-text-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;

          color: var(--navy);
          font-size: 12px;
          font-weight: 800;

          transition: .25s ease;
        }

        .ad-text-link:hover {
          gap: 12px;
          color: #a47b35;
        }

        /* =========================================
           OVERVIEW CAPSULES
        ========================================= */

        .ad-overview {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 17px;
          margin: 23px 0 34px;
        }

        .ad-overview-card {
          position: relative;
          overflow: hidden;

          min-height: 124px;
          padding: 21px;

          display: flex;
          align-items: center;
          gap: 16px;

          border: 1px solid var(--border);
          border-radius: 20px;

          background: rgba(255,255,255,.91);

          box-shadow: 0 6px 18px rgba(32,41,69,.06);

          transition:
            transform .35s cubic-bezier(.2,.8,.2,1),
            box-shadow .35s ease,
            border-color .35s ease;

          animation: cardEnter .65s both;
        }

        .ad-overview-card:nth-child(2) {
          animation-delay: .1s;
        }

        .ad-overview-card:nth-child(3) {
          animation-delay: .2s;
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(17px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ad-overview-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 28px rgba(32,41,69,.11);
          border-color: #c3cddd;
        }

        .ad-overview-icon {
          width: 53px;
          height: 53px;
          flex-shrink: 0;

          display: grid;
          place-items: center;

          border-radius: 17px;
        }

        .ad-overview-icon.gold {
          color: #a27a32;
          background: var(--gold-light);
        }

        .ad-overview-icon.blue {
          color: var(--blue-dark);
          background: var(--blue-light);
        }

        .ad-overview-icon.mint {
          color: var(--mint-dark);
          background: var(--mint);
        }

        .ad-overview-copy {
          min-width: 0;
        }

        .ad-overview-copy span {
          display: block;
          margin-bottom: 6px;

          color: var(--muted);
          font-size: 11px;
          font-weight: 700;
        }

        .ad-overview-copy strong {
          display: block;
          color: var(--navy);
          font-size: 18px;
          font-weight: 850;
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        .ad-overview-copy small {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: 10px;
          line-height: 1.5;
        }

        .ad-overview-check {
          position: absolute;
          top: 15px;
          right: 15px;
          color: #4caa7c;
        }

        /* =========================================
           MAIN WORKSPACE
        ========================================= */

        .ad-workspace {
          display: grid;
          grid-template-columns:
            minmax(0, 1.65fr)
            minmax(290px, .8fr);
          gap: 23px;
          align-items: start;
        }

        .ad-primary-column,
        .ad-side-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
          min-width: 0;
        }

        /* =========================================
           PANEL SURFACE
        ========================================= */

        .ad-panel {
          min-width: 0;
          padding: 24px;

          border: 1px solid #d9dfeb;
          border-radius: 21px;

          background: rgba(255,255,255,.93);

          box-shadow:
            0 7px 22px rgba(32,41,69,.07),
            inset 0 1px rgba(255,255,255,.9);

          transition:
            transform .3s ease,
            box-shadow .3s ease,
            border-color .3s ease;
        }

        .ad-panel:hover {
          border-color: #c5cede;
          box-shadow: 0 13px 29px rgba(32,41,69,.10);
        }

        /* =========================================
           TODAY'S TIMETABLE
        ========================================= */

        .ad-routine-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 19px;
        }

        .ad-routine-date {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 8px 12px;

          color: var(--navy-2);
          background: #eef1f8;

          border: 1px solid #e1e5ef;
          border-radius: 30px;

          font-size: 10px;
          font-weight: 750;
        }

        .ad-routine-sections {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 14px;
        }

        .ad-section-card {
          min-width: 0;
          padding: 17px;

          border: 1px solid #dfe4ee;
          border-radius: 17px;

          background: linear-gradient(
            145deg,
            #ffffff,
            #f8f9fc
          );

          transition: .3s ease;
        }

        .ad-section-card:hover {
          transform: translateY(-3px);
          border-color: #c3cde0;
          box-shadow: 0 9px 20px rgba(32,41,69,.07);
        }

        .ad-section-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;

          padding-bottom: 13px;
          border-bottom: 1px solid #e9edf3;
        }

        .ad-section-card-header strong {
          color: var(--navy);
          font-size: 13px;
          font-weight: 850;
        }

        .ad-class-count {
          padding: 6px 9px;
          border-radius: 30px;
          color: #8e6b2d;
          background: #f9efd9;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .ad-class-list {
          display: flex;
          flex-direction: column;
        }

        .ad-class-item {
          display: grid;
          grid-template-columns: 73px minmax(0,1fr);
          gap: 12px;

          padding: 15px 0;

          border-bottom: 1px solid #edf0f5;
        }

        .ad-class-item:last-child {
          border-bottom: none;
          padding-bottom: 2px;
        }

        .ad-class-time {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;

          color: #997535;
          font-size: 10px;
          font-weight: 850;
        }

        .ad-class-time small {
          color: var(--muted);
          font-size: 9px;
          font-weight: 600;
        }

        .ad-class-details {
          min-width: 0;
        }

        .ad-class-details strong {
          display: block;
          color: var(--navy);
          font-size: 12px;
          font-weight: 850;
        }

        .ad-class-details p {
          margin: 5px 0;
          color: #50596f;
          font-size: 11px;
          line-height: 1.5;
        }

        .ad-class-details small {
          display: inline-block;
          padding: 5px 8px;
          border-radius: 7px;

          color: #59745f;
          background: #eaf5ed;

          font-size: 9px;
          font-weight: 700;
          line-height: 1.5;
        }

        .ad-empty-classes {
          display: flex;
          align-items: center;
          gap: 10px;

          min-height: 100px;

          color: var(--muted);
          font-size: 11px;
          line-height: 1.7;
        }

        .ad-empty-classes svg {
          flex-shrink: 0;
          color: var(--gold);
        }

        /* =========================================
           DATE WIDGET
        ========================================= */

        .ad-date-widget {
          position: relative;
          overflow: hidden;

          padding: 24px;

          border: 1px solid #e5d9bd;
          border-radius: 21px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(193,154,82,.15),
              transparent 42%
            ),
            linear-gradient(
              145deg,
              #fffdf8,
              #f7efdf
            );

          box-shadow: 0 9px 23px rgba(32,41,69,.07);

          transition: .3s ease;
        }

        .ad-date-widget:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 27px rgba(32,41,69,.11);
        }

        .ad-date-widget-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ad-date-widget-top > span {
          color: #98753c;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .ad-date-widget-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;

          color: #a47d39;
          background: #f5e9cf;
          border: 1px solid #e8d9b8;
          border-radius: 14px;
        }

        .ad-date-main {
          display: flex;
          align-items: center;
          gap: 17px;
          margin-top: 20px;
        }

        .ad-date-number {
          width: 78px;
          height: 83px;
          flex-shrink: 0;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;

          color: white;
          background: linear-gradient(
            145deg,
            #303b5d,
            #17213e
          );

          border-radius: 16px;

          box-shadow: 0 7px 16px rgba(32,41,69,.22);
        }

        .ad-date-number strong {
          font-size: 34px;
          line-height: 1;
          font-weight: 900;
        }

        .ad-date-number span {
          color: #e8c982;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .ad-date-copy h3 {
          margin: 0 0 6px;
          color: var(--navy);
          font-size: 18px;
          font-weight: 850;
        }

        .ad-date-copy p {
          margin: 0 0 5px;
          color: #777f91;
          font-size: 10px;
          line-height: 1.5;
        }

        .ad-date-footer {
          display: flex;
          align-items: center;
          gap: 8px;

          margin-top: 20px;
          padding-top: 15px;

          border-top: 1px solid #e9dfcb;

          color: #54816b;
          font-size: 10px;
          font-weight: 700;
        }

        /* =========================================
           CALENDAR
        ========================================= */

        .ad-calendar-panel {
          padding: 22px;

          border: 1px solid #d9dfeb;
          border-radius: 21px;

          background: white;

          box-shadow: 0 8px 23px rgba(32,41,69,.07);
        }

        .ad-calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .ad-calendar-header span {
          display: block;
          margin-bottom: 5px;

          color: #a17c3d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .ad-calendar-header h3 {
          margin: 0;
          color: var(--navy);
          font-size: 19px;
          font-weight: 850;
        }

        .ad-today-button {
          padding: 7px 11px;
          border: 1px solid #e6d5ae;
          border-radius: 30px;

          color: #987333;
          background: #fcf5e8;

          font-size: 10px;
          font-weight: 800;

          transition: .2s ease;
        }

        .ad-today-button:hover {
          color: white;
          background: var(--navy);
          border-color: var(--navy);
        }

        .ad-calendar-controls {
          display: grid;
          grid-template-columns: 34px minmax(0,1fr) minmax(0,.8fr) 34px;
          gap: 7px;
          margin-bottom: 17px;
        }

        .ad-calendar-controls button {
          width: 34px;
          height: 34px;

          border: 1px solid #e1e5ed;
          border-radius: 10px;

          color: var(--navy);
          background: #f7f8fb;

          font-size: 20px;
          line-height: 1;

          transition: .2s ease;
        }

        .ad-calendar-controls button:hover {
          color: white;
          background: var(--navy);
        }

        .ad-calendar-controls select {
          width: 100%;
          min-width: 0;
          padding: 0 7px;

          border: 1px solid #e1e5ed;
          border-radius: 9px;

          color: var(--navy);
          background: #f7f8fb;

          font-size: 10px;
          font-weight: 700;
          outline: none;
        }

        .ad-calendar-controls select:focus {
          border-color: var(--gold);
        }

        .ad-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7,minmax(0,1fr));
          gap: 5px;
        }

        .ad-calendar-weekdays {
          margin-bottom: 8px;
        }

        .ad-calendar-weekdays span {
          display: grid;
          place-items: center;
          height: 28px;

          color: #9299a9;
          font-size: 9px;
          font-weight: 850;
        }

        .ad-calendar-days button,
        .ad-calendar-blank {
          width: 100%;
          aspect-ratio: 1;
          min-width: 0;

          display: grid;
          place-items: center;

          border-radius: 10px;
        }

        .ad-calendar-days button {
          border: 1px solid transparent;
          color: #4d566c;
          background: transparent;

          font-size: 10px;
          font-weight: 650;

          transition: .2s ease;
        }

        .ad-calendar-days button:hover {
          color: var(--navy);
          background: #f2f4fa;
          border-color: #dfe4ee;
          transform: scale(1.07);
        }

        .ad-calendar-days button.is-today {
          border: 1px solid #c6a35e;
          color: #997333;
          background: #fbf4e7;
          font-weight: 900;
        }

        .ad-calendar-days button.is-selected {
          color: white;
          background: var(--navy);
          border-color: var(--navy);
          box-shadow: 0 4px 10px rgba(32,41,69,.22);
        }

        .ad-calendar-days button.is-selected:hover {
          color: white;
          background: var(--navy-2);
        }

        .ad-selected-date {
          margin-top: 17px;
          padding: 13px;

          border: 1px solid #dce5f3;
          border-radius: 12px;

          background: #f3f6fc;
        }

        .ad-selected-date span {
          display: block;
          margin-bottom: 6px;

          color: #7082a8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .ad-selected-date strong {
          color: var(--navy);
          font-size: 11px;
          line-height: 1.6;
        }

        /* =========================================
           MARKS SECTION
        ========================================= */

        .ad-marks-section {
          margin-top: 31px;
        }

        .ad-marks-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 17px;
        }

        .ad-mark-card {
          position: relative;
          overflow: hidden;

          min-height: 230px;
          padding: 24px;

          display: flex;
          flex-direction: column;
          align-items: flex-start;

          text-align: left;

          border: 1px solid #dce1ec;
          border-radius: 21px;

          background: white;

          box-shadow: 0 7px 20px rgba(32,41,69,.06);

          transition:
            transform .35s cubic-bezier(.2,.8,.2,1),
            box-shadow .35s ease,
            border-color .35s ease;
        }

        .ad-mark-card::after {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          right: -65px;
          bottom: -85px;
          border-radius: 50%;
          background: rgba(193,154,82,.09);
          transition: .4s ease;
        }

        .ad-mark-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 16px 30px rgba(32,41,69,.12);
          border-color: #c1cada;
        }

        .ad-mark-card:hover::after {
          transform: scale(1.7);
        }

        .ad-mark-card.ca {
          border-top: 4px solid #c19a52;
          background: linear-gradient(
            145deg,
            #fffefa,
            #fbf7ed
          );
        }

        .ad-mark-card.university {
          border-top: 4px solid #7186c1;
          background: linear-gradient(
            145deg,
            #ffffff,
            #f1f4fc
          );
        }

        .ad-mark-icon {
          width: 52px;
          height: 52px;

          display: grid;
          place-items: center;

          margin-bottom: 19px;

          border-radius: 17px;
        }

        .ad-mark-card.ca .ad-mark-icon {
          color: #a47c35;
          background: #f7ecd3;
        }

        .ad-mark-card.university .ad-mark-icon {
          color: #5872ad;
          background: #e3eafa;
        }

        .ad-mark-kicker {
          color: #9a7a44;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .ad-mark-card > strong {
          margin-top: 8px;
          color: var(--navy);
          font-size: 21px;
          font-weight: 900;
        }

        .ad-mark-card > p {
          margin: 9px 0 19px;
          color: #777f91;
          font-size: 11px;
          line-height: 1.7;
        }

        .ad-mark-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-top: auto;

          color: var(--navy);
          font-size: 11px;
          font-weight: 850;

          transition: .25s ease;
        }

        .ad-mark-card:hover .ad-mark-action {
          gap: 13px;
          color: #a47c35;
        }

        .ad-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 8px;

          margin: 14px 0 0;

          color: #858ba0;
          font-size: 10px;
          line-height: 1.7;
        }

        .ad-disclaimer svg {
          flex-shrink: 0;
          color: var(--mint-dark);
        }

        /* =========================================
           SECURITY STRIP
        ========================================= */

        .ad-security {
          display: flex;
          align-items: center;
          gap: 18px;

          margin-top: 30px;
          padding: 22px 25px;

          border: 1px solid #cbd4e6;
          border-radius: 19px;

          background: linear-gradient(
            110deg,
            #202945,
            #303d62
          );

          color: white;

          box-shadow: 0 8px 20px rgba(32,41,69,.13);

          transition: .3s ease;
        }

        .ad-security:hover {
          transform: translateY(-3px);
          box-shadow: 0 13px 26px rgba(32,41,69,.18);
        }

        .ad-security-icon {
          width: 51px;
          height: 51px;
          flex-shrink: 0;

          display: grid;
          place-items: center;

          color: #e8ca8c;
          background: rgba(255,255,255,.1);

          border: 1px solid rgba(255,255,255,.14);
          border-radius: 16px;
        }

        .ad-security-copy strong {
          display: block;
          color: white;
          font-size: 13px;
          font-weight: 850;
        }

        .ad-security-copy p {
          margin: 6px 0 0;
          color: rgba(255,255,255,.69);
          font-size: 10px;
          line-height: 1.7;
        }

        .ad-security-badge {
          margin-left: auto;
          flex-shrink: 0;

          display: flex;
          align-items: center;
          gap: 7px;

          padding: 9px 13px;

          color: #b9e7cf;
          background: rgba(89,178,130,.14);

          border: 1px solid rgba(130,210,163,.23);
          border-radius: 30px;

          font-size: 10px;
          font-weight: 800;
        }

        /* =========================================
           FOOTER
        ========================================= */

        .ad-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;

          margin-top: 27px;
          padding: 19px 5px 5px;

          border-top: 1px solid rgba(32,41,69,.12);

          color: #858ba0;
          font-size: 10px;
        }

        .ad-footer button {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          padding: 9px 15px;

          color: var(--navy);
          background: white;

          border: 1px solid #dce1ec;
          border-radius: 30px;

          font-size: 10px;
          font-weight: 800;

          transition: .25s ease;
        }

        .ad-footer button:hover {
          color: white;
          background: var(--navy);
          transform: translateY(-2px);
        }

        /* =========================================
           HELP PANEL
        ========================================= */

        .ad-help-panel {
          position: fixed;
          z-index: 100;
          right: 25px;
          bottom: 25px;

          width: min(350px, calc(100vw - 30px));

          padding: 21px;

          border: 1px solid #d9dfeb;
          border-radius: 19px;

          background: white;

          box-shadow: 0 18px 50px rgba(32,41,69,.2);

          animation: helpEnter .3s ease both;
        }

        @keyframes helpEnter {
          from {
            opacity: 0;
            transform: translateY(15px) scale(.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .ad-help-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .ad-help-header h3 {
          margin: 0;
          color: var(--navy);
          font-size: 18px;
          font-weight: 850;
        }

        .ad-help-close {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;

          color: var(--navy);
          background: #f0f2f7;
          border: none;
          border-radius: 10px;
        }

        .ad-help-panel p {
          margin: 15px 0;
          color: #777f91;
          font-size: 12px;
          line-height: 1.8;
        }

        .ad-help-done {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          padding: 9px 15px;

          color: white;
          background: var(--navy);
          border: none;
          border-radius: 30px;

          font-size: 11px;
          font-weight: 800;
        }

        /* =========================================
           ACCESSIBILITY
        ========================================= */

        .academic-dashboard button:focus-visible,
        .academic-dashboard a:focus-visible,
        .academic-dashboard select:focus-visible {
          outline: 3px solid rgba(193,154,82,.7);
          outline-offset: 3px;
        }

        /* =========================================
           LARGE SCREENS
        ========================================= */

        @media (min-width: 1450px) {
          .ad-content {
            padding-left: 48px;
            padding-right: 48px;
          }

          .ad-hero {
            min-height: 290px;
          }

          .ad-panel {
            padding: 28px;
          }
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1050px) {
          .ad-content {
            padding: 23px 23px 30px;
          }

          .ad-topbar {
            padding: 0 23px;
          }

          .ad-hero {
            padding: 35px;
          }

          .ad-hero-art {
            width: 145px;
            height: 145px;
          }

          .ad-hero-book {
            width: 85px;
            height: 85px;
          }

          .ad-workspace {
            grid-template-columns:
              minmax(0,1fr)
              minmax(270px,.8fr);
            gap: 17px;
          }

          .ad-panel {
            padding: 19px;
          }

          .ad-section-card {
            padding: 13px;
          }
        }

        @media (max-width: 820px) {
          .ad-workspace {
            grid-template-columns: 1fr;
          }

          .ad-side-column {
            display: grid;
            grid-template-columns: repeat(2,minmax(0,1fr));
            align-items: start;
          }

          .ad-calendar-panel {
            grid-column: span 2;
          }

          .ad-date-widget {
            min-height: 100%;
          }

          .ad-overview {
            gap: 11px;
          }

          .ad-overview-card {
            padding: 15px;
            gap: 11px;
          }

          .ad-overview-icon {
            width: 44px;
            height: 44px;
          }

          .ad-overview-copy strong {
            font-size: 15px;
          }
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 600px) {
          .ad-content {
            padding: 17px 13px 25px;
          }

          .ad-topbar {
            height: 64px;
            padding: 0 13px;
          }

          .ad-top-left,
          .ad-top-right {
            gap: 9px;
          }

          .ad-brand-icon {
            width: 37px;
            height: 37px;
          }

          .ad-brand-copy strong {
            font-size: 12px;
          }

          .ad-brand-copy span {
            font-size: 8px;
          }

          .ad-breadcrumb,
          .ad-secure {
            display: none;
          }

          .ad-avatar,
          .ad-notification {
            width: 37px;
            height: 37px;
          }

          .ad-hero {
            min-height: 0;
            padding: 27px 21px;
            border-radius: 20px;
          }

          .ad-hero h1 {
            margin-top: 19px;
            font-size: 32px;
          }

          .ad-hero-description {
            font-size: 11px;
          }

          .ad-hero-art {
            display: none;
          }

          .ad-hero-ribbon {
            right: 13px;
            font-size: 8px;
          }

          .ad-hero-meta {
            margin-top: 17px;
            gap: 8px;
          }

          .ad-meta-pill {
            padding: 8px 10px;
            font-size: 9px;
          }

          .ad-overview {
            grid-template-columns: 1fr;
            gap: 10px;
            margin: 17px 0 27px;
          }

          .ad-overview-card {
            min-height: 91px;
            padding: 15px;
            border-radius: 16px;
          }

          .ad-overview-copy strong {
            font-size: 16px;
          }

          .ad-section-title h2 {
            font-size: 21px;
          }

          .ad-section-title p {
            font-size: 11px;
          }

          .ad-workspace {
            gap: 22px;
          }

          .ad-primary-column,
          .ad-side-column {
            gap: 22px;
          }

          .ad-panel {
            padding: 16px;
            border-radius: 17px;
          }

          .ad-routine-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .ad-routine-sections {
            grid-template-columns: 1fr;
          }

          .ad-section-card {
            padding: 15px;
          }

          .ad-side-column {
            display: flex;
          }

          .ad-calendar-panel {
            width: 100%;
          }

          .ad-date-widget {
            padding: 20px;
          }

          .ad-marks-section {
            margin-top: 26px;
          }

          .ad-marks-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .ad-mark-card {
            min-height: 205px;
            padding: 20px;
          }

          .ad-security {
            align-items: flex-start;
            padding: 17px;
            gap: 12px;
          }

          .ad-security-icon {
            width: 42px;
            height: 42px;
          }

          .ad-security-badge {
            display: none;
          }

          .ad-footer {
            justify-content: center;
            text-align: center;
            flex-direction: column;
            gap: 12px;
          }

          .ad-help-panel {
            right: 15px;
            bottom: 15px;
          }
        }

        /* =========================================
           VERY SMALL MOBILE
        ========================================= */

        @media (max-width: 360px) {
          .ad-content {
            padding-left: 10px;
            padding-right: 10px;
          }

          .ad-hero h1 {
            font-size: 28px;
          }

          .ad-hero {
            padding: 25px 16px;
          }

          .ad-calendar-controls {
            grid-template-columns: 30px minmax(0,1fr) minmax(0,.8fr) 30px;
            gap: 4px;
          }

          .ad-calendar-controls button {
            width: 30px;
          }

          .ad-calendar-grid {
            gap: 3px;
          }
        }

        /* =========================================
           REDUCED MOTION
        ========================================= */

        @media (prefers-reduced-motion: reduce) {
          .academic-dashboard *,
          .academic-dashboard *::before,
          .academic-dashboard *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }
        }

      `}</style>

      {/* BACKGROUND */}
      <div className="ad-background" aria-hidden="true">
        <div className="ad-orb ad-orb-one" />
        <div className="ad-orb ad-orb-two" />
        <div className="ad-orb ad-orb-three" />
      </div>

      <main className="ad-main">

        {/* =====================================
            TOP NAVIGATION
        ===================================== */}

        <header className="ad-topbar">

          <div className="ad-top-left">

            <button
              type="button"
              className="ad-menu-button"
              onClick={openSidebar}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div className="ad-brand-icon">
              <GraduationCap size={23} />
            </div>

            <div className="ad-brand-copy">
              <strong>Student Portal</strong>
              <span>ACADEMIC MANAGEMENT</span>
            </div>

            <div className="ad-breadcrumb">
              <ChevronRight size={14} />
              <strong>Dashboard</strong>
            </div>

          </div>

          <div className="ad-top-right">

            <span className="ad-secure">
              <ShieldCheck size={16} />
              Secure Access
            </span>

            <button
              type="button"
              className="ad-notification"
              aria-label="Open announcements"
              onClick={() => navigate("/student/notices")}
              title="Announcements"
            >
              <Bell size={18} />
              <span className="ad-notification-dot" />
            </button>

            <button
              type="button"
              className="ad-avatar"
              onClick={() => navigate("/student/profile")}
              aria-label="Open my profile"
              title="My Profile"
            >
              {getInitials(displayName)}
            </button>

          </div>

        </header>

        <div className="ad-content">

          {/* =====================================
              PROFILE PREVIEW NOTICE
          ===================================== */}

          {profilePreview && (
            <div className="ad-preview" role="status">
              <ShieldCheck size={17} />

              Live profile details are unavailable right now.
              Preview information is shown where needed.
            </div>
          )}

          {/* =====================================
              HERO
          ===================================== */}

          <section className="ad-hero">

            <div className="ad-hero-copy">

              <span className="ad-eyebrow">
                <Sparkles size={14} />
                YOUR ACADEMIC SPACE
              </span>

              <h1>
                Welcome back,
                <br />
                <span>{displayName}</span>
              </h1>

              <p className="ad-hero-description">
                Everything you need for your {course.name} journey,
                thoughtfully brought together in one place.
              </p>

              <div className="ad-hero-meta">

                <span className="ad-meta-pill">
                  <UserRound size={14} />
                  {studentId}
                </span>

                <span className="ad-meta-pill">
                  <GraduationCap size={15} />
                  {courseDisplay}
                </span>

              </div>

            </div>

            <div className="ad-hero-art" aria-hidden="true">

              <div className="ad-hero-ring one" />
              <div className="ad-hero-ring two" />

              <div className="ad-hero-book">
                <BookOpen size={48} />
              </div>

            </div>

            <div className="ad-hero-ribbon">
              ✦ {course.department}
            </div>

          </section>

          {/* =====================================
              OVERVIEW CARDS
          ===================================== */}

          <section
            className="ad-overview"
            aria-label="Student overview"
          >

            <article className="ad-overview-card">

              <div className="ad-overview-icon gold">
                <GraduationCap size={25} />
              </div>

              <div className="ad-overview-copy">
                <span>Current semester</span>
                <strong>{currentSemesterLabel}</strong>
                <small>{course.fullName}</small>
              </div>

              <CheckCircle2
                className="ad-overview-check"
                size={17}
              />

            </article>

            <article className="ad-overview-card">

              <div className="ad-overview-icon blue">
                <CalendarDays size={24} />
              </div>

              <div className="ad-overview-copy">
                <span>Academic session</span>
                <strong>{session}</strong>
                <small>Department registration</small>
              </div>

            </article>

            <article className="ad-overview-card">

              <div className="ad-overview-icon mint">
                <CheckCircle2 size={24} />
              </div>

              <div className="ad-overview-copy">
                <span>Portal status</span>
                <strong>Signed in</strong>
                <small>Student account session</small>
              </div>

              <CheckCircle2
                className="ad-overview-check"
                size={17}
              />

            </article>

          </section>

          {/* =====================================
              MAIN WORKSPACE
          ===================================== */}

          <div className="ad-workspace">

            {/* LEFT COLUMN */}

            <div className="ad-primary-column">

              {/* =================================
                  TODAY'S ROUTINE
              ================================= */}

              <section className="ad-section-block">

                <div className="ad-section-title">

                  <div>
                    <span>YOUR TIMETABLE</span>

                    <h2>Today's classes</h2>

                    <p>
                      Your daily academic schedule and classroom details.
                    </p>
                  </div>

                  <Link
                    className="ad-text-link"
                    to="/student/routine"
                  >
                    Full routine <ArrowRight size={16} />
                  </Link>

                </div>

                <div className="ad-panel">

                  <div className="ad-routine-heading">

                    <div className="ad-routine-date">
                      <CalendarCheck size={15} />

                      {formatDate(today, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <div className="ad-routine-date">
                      <Clock3 size={14} />
                      {totalClasses}{" "}
                      {totalClasses === 1 ? "Class" : "Classes"} Today
                    </div>

                  </div>

                  <div className="ad-routine-sections">

                    {SECTION_NAMES.map((section) => {
                      const classes = getTodayClasses(section);

                      return (
                        <section
                          className="ad-section-card"
                          key={section}
                        >

                          <div className="ad-section-card-header">

                            <strong>{section}</strong>

                            <span className="ad-class-count">
                              {classes.length}{" "}
                              {classes.length === 1
                                ? "class"
                                : "classes"}
                            </span>

                          </div>

                          {classes.length ? (

                            <div className="ad-class-list">

                              {classes.map((item) => (

                                <article
                                  className="ad-class-item"
                                  key={`${section}-${item.start}-${item.code}`}
                                >

                                  <div className="ad-class-time">
                                    {item.start}

                                    <small>{item.end}</small>
                                  </div>

                                  <div className="ad-class-details">

                                    <strong>{item.code}</strong>

                                    <p>{item.name}</p>

                                    <small>
                                      {item.faculty} · Room {item.room}
                                    </small>

                                  </div>

                                </article>

                              ))}

                            </div>

                          ) : (

                            <div className="ad-empty-classes">
                              <CalendarDays size={20} />

                              No classes scheduled for today.
                            </div>

                          )}

                        </section>
                      );
                    })}

                  </div>

                </div>

              </section>

              {/* =================================
                  MARKS SECTION
              ================================= */}

              <section className="ad-marks-section">

                <div className="ad-section-title">

                  <div>
                    <span>ACADEMIC RECORDS</span>

                    <h2>Academic performance</h2>

                    <p>
                      Access your internal assessment and university
                      examination records separately.
                    </p>
                  </div>

                </div>

                <div className="ad-marks-grid">

                  {/* CA MARKS */}

                  <button
                    type="button"
                    className="ad-mark-card ca"
                    onClick={() => navigate("/student/ca-marks")}
                  >

                    <span className="ad-mark-icon">
                      <ClipboardList size={25} />
                    </span>

                    <span className="ad-mark-kicker">
                      CONTINUOUS ASSESSMENT
                    </span>

                    <strong>CA Marks</strong>

                    <p>
                      View your internal assessment marks
                      subject by subject.
                    </p>

                    <span className="ad-mark-action">
                      Explore CA marks
                      <ArrowRight size={17} />
                    </span>

                  </button>

                  {/* UNIVERSITY MARKS */}

                  <button
                    type="button"
                    className="ad-mark-card university"
                    onClick={() =>
                      navigate("/student/university-marks")
                    }
                  >

                    <span className="ad-mark-icon">
                      <BookOpenCheck size={25} />
                    </span>

                    <span className="ad-mark-kicker">
                      UNIVERSITY EXAMINATION
                    </span>

                    <strong>University Marks</strong>

                    <p>
                      View your university examination marks
                      and result status.
                    </p>

                    <span className="ad-mark-action">
                      Explore university marks
                      <ArrowRight size={17} />
                    </span>

                  </button>

                </div>

                <p className="ad-disclaimer">
                  <ShieldCheck size={15} />

                  No real marks or CGPA are displayed here.
                  Marks will be shown when student-specific data
                  is connected.
                </p>

              </section>

            </div>

            {/* RIGHT COLUMN */}

            <aside className="ad-side-column">

              {/* =================================
                  DATE CARD
              ================================= */}

              <section className="ad-date-widget">

                <div className="ad-date-widget-top">

                  <span>TODAY'S DATE</span>

                  <div className="ad-date-widget-icon">
                    <CalendarDays size={21} />
                  </div>

                </div>

                <div className="ad-date-main">

                  <div className="ad-date-number">

                    <strong>{today.getDate()}</strong>

                    <span>
                      {formatDate(today, {
                        month: "short",
                      })}
                    </span>

                  </div>

                  <div className="ad-date-copy">

                    <h3>
                      {formatDate(today, {
                        weekday: "long",
                      })}
                    </h3>

                    <p>
                      {formatDate(today, {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

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

                <div className="ad-date-footer">
                  <CheckCircle2 size={16} />
                  Your dashboard is ready for today
                </div>

              </section>

              {/* =================================
                  CALENDAR
              ================================= */}

              <section
                className="ad-calendar-panel"
                aria-label="Interactive calendar"
              >

                <div className="ad-calendar-header">

                  <div>
                    <span>CALENDAR</span>
                    <h3>Explore dates</h3>
                  </div>

                  <button
                    type="button"
                    className="ad-today-button"
                    onClick={goToToday}
                  >
                    Today
                  </button>

                </div>

                <div className="ad-calendar-controls">

                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => changeMonth(-1)}
                  >
                    <ChevronLeft size={17} />
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

                    {Array.from(
                      { length: 12 },
                      (_, month) => (
                        <option key={month} value={month}>
                          {new Date(2000, month, 1).toLocaleDateString(
                            "en-IN",
                            { month: "long" }
                          )}
                        </option>
                      )
                    )}

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
                      (_, index) =>
                        new Date().getFullYear() - 40 + index
                    ).map((year) => (

                      <option key={year} value={year}>
                        {year}
                      </option>

                    ))}

                  </select>

                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => changeMonth(1)}
                  >
                    <ChevronRight size={17} />
                  </button>

                </div>

                <div className="ad-calendar-grid ad-calendar-weekdays">

                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    )
                  )}

                </div>

                <div className="ad-calendar-grid ad-calendar-days">

                  {Array.from(
                    { length: calendarStartDay },
                    (_, index) => (
                      <span
                        className="ad-calendar-blank"
                        key={`blank-${index}`}
                      />
                    )
                  )}

                  {Array.from(
                    { length: daysInMonth },
                    (_, index) => {
                      const day = index + 1;

                      const date = new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth(),
                        day
                      );

                      const isToday =
                        date.toDateString() ===
                        today.toDateString();

                      const isSelected =
                        date.toDateString() ===
                        selectedDate.toDateString();

                      return (
                        <button
                          type="button"
                          key={day}
                          className={`
                            ${isToday ? "is-today" : ""}
                            ${isSelected ? "is-selected" : ""}
                          `}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedDate(date)}
                        >
                          {day}
                        </button>
                      );
                    }
                  )}

                </div>

                <div className="ad-selected-date">

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

          {/* =====================================
              SECURITY STRIP
          ===================================== */}

          <section className="ad-security">

            <div className="ad-security-icon">
              <LockKeyhole size={24} />
            </div>

            <div className="ad-security-copy">

              <strong>Your student records stay protected</strong>

              <p>
                Never share your password or login token.
                Your academic information should only be
                accessible to your authenticated account.
              </p>

            </div>

            <div className="ad-security-badge">
              <ShieldCheck size={15} />
              Secure Portal
            </div>

          </section>

          {/* =====================================
              FOOTER
          ===================================== */}

          <footer className="ad-footer">

            <span>
              © {today.getFullYear()} DPP Institute
            </span>

            <span>
              {course.name} Department Student Portal
            </span>

            <button
              type="button"
              onClick={() => setShowHelp(true)}
            >
              <CircleHelp size={15} />
              Need help?
            </button>

          </footer>

        </div>

      </main>

      {/* =====================================
          HELP PANEL
      ===================================== */}

      {showHelp && (

        <div
          className="ad-help-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="ad-help-title"
        >

          <div className="ad-help-header">

            <h3 id="ad-help-title">
              Need help?
            </h3>

            <button
              type="button"
              className="ad-help-close"
              aria-label="Close help"
              onClick={() => setShowHelp(false)}
            >
              <X size={17} />
            </button>

          </div>

          <p>
            For account support, profile issues, or student
            record questions, please contact your department
            administrator.
          </p>

          <button
            type="button"
            className="ad-help-done"
            onClick={() => setShowHelp(false)}
          >
            Got it <ArrowRight size={15} />
          </button>

        </div>

      )}

    </div>
  );
}
