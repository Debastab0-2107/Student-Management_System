
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  GraduationCap,
  UserRound,
  Bell,
  CalendarDays,
  FileSpreadsheet,
  Users,
  Award,
  LogOut,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  LockKeyhole,
  Ban,
} from "lucide-react";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const isVisitingRoute = location.pathname.includes("/visiting/");

  const facultyBase = isVisitingRoute
    ? "/faculty/visiting"
    : "/faculty/permanent";

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showLogout, setShowLogout] = useState(false);
  const [showRestricted, setShowRestricted] = useState(false);

  const [restrictedTitle, setRestrictedTitle] = useState("");
  const [restrictedMessage, setRestrictedMessage] = useState("");

  const loginPath = "/login/faculty";

  // Current date, formatted using the browser's local date.
  const todayDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const clearSession = () => {
    [
      "sms_token",
      "sms_role",
      "sms_teacher_id",
      "sms_must_change_password",
      "sms_faculty_type",
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  };

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const token = localStorage.getItem("sms_token");
      const role = localStorage.getItem("sms_role");

      if (!token || role !== "TEACHER") {
        navigate(loginPath, { replace: true });
        return;
      }

      try {
        const response = await api.get("/faculty/profile");

        if (!active) return;

        const profile = response?.data;

        if (!profile?.facultyType) {
          setError("Faculty type was not returned by the server.");
          return;
        }

        const type = String(profile.facultyType)
          .trim()
          .toUpperCase();

        const visiting = [
          "VISITING",
          "VISITING FACULTY",
        ].includes(type);

        const permanent = [
          "REGULAR",
          "PERMANENT",
          "PERMANENT FACULTY",
        ].includes(type);

        if (!visiting && !permanent) {
          setError(
            "Your faculty type is not recognised. Please contact the administrator."
          );
          return;
        }

        if (
          (isVisitingRoute && !visiting) ||
          (!isVisitingRoute && !permanent)
        ) {
          navigate(
            visiting
              ? "/faculty/visiting/dashboard"
              : "/faculty/permanent/dashboard",
            { replace: true }
          );
          return;
        }

        localStorage.setItem("sms_faculty_type", type);
        setFaculty(profile);
      } catch (err) {
        if (!active) return;

        if ([401, 403].includes(err.response?.status)) {
          clearSession();
          navigate(loginPath, { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load your faculty profile. Please refresh the page."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate, isVisitingRoute]);

  const type = String(faculty?.facultyType || "").toUpperCase();

  const isPermanent = [
    "REGULAR",
    "PERMANENT",
    "PERMANENT FACULTY",
  ].includes(type);

  const displayName = faculty?.name || "Faculty Member";

  const facultyId =
    faculty?.teacherId ||
    localStorage.getItem("sms_teacher_id") ||
    "Faculty ID unavailable";

  const logout = () => {
    clearSession();
    navigate(loginPath, { replace: true });
  };

  const services = [
    {
      id: "ca",
      title: "CA Result Upload",
      description:
        "Upload continuous assessment marks for assigned subjects.",
      icon: FileSpreadsheet,
      tag: "Academic",
      tone: "gold",
      permanentOnly: true,
    },
    {
      id: "profile",
      title: "Teacher Profile",
      description:
        "View and update your personal and professional details.",
      icon: UserRound,
      tag: "My Account",
      tone: "blue",
    },
    {
      id: "students",
      title: "View All Students",
      description:
        "View department student details and academic information.",
      icon: Users,
      tag: "Department",
      tone: "purple",
      permanentOnly: true,
    },
    {
      id: "results",
      title: "Semester Results",
      description:
        "Access semester-wise academic result information.",
      icon: Award,
      tag: "Academic",
      tone: "green",
      permanentOnly: true,
    },
    {
      id: "routine",
      title: "Class Routine",
      description:
        "Check your weekly teaching schedule and timetable.",
      icon: CalendarDays,
      tag: "Schedule",
      tone: "orange",
    },
    {
      id: "notices",
      title: "Notices",
      description:
        "Read department and academic announcements.",
      icon: Bell,
      tag: "Updates",
      tone: "pink",
    },
  ];

  const availableCount = isPermanent ? 6 : 3;

  
const openService = (service) => {
  // Visiting Faculty cannot access Permanent Faculty services.
  if (service.permanentOnly && !isPermanent) {
    return;
  }

  // Common services available to both faculty types.
  if (["profile", "routine", "notices"].includes(service.id)) {
    navigate(`${facultyBase}/${service.id}`);
    return;
  }

  // Permanent Faculty services.
  if (isPermanent) {
    if (service.id === "students") {
      navigate("/faculty/permanent/students");
      return;
    }

    if (service.id === "ca") {
      navigate("/faculty/permanent/ca-results");
      return;
    }

    if (service.id === "results") {
      navigate("/faculty/permanent/semester-results");
      return;
    }
  }
};


  if (loading) {
    return (
      <div className="fd-loading-screen">
        <div className="fd-loader" />
        <p>Loading your faculty dashboard...</p>

        <style>{`
          .fd-loading-screen {
            min-height: 100vh;
            display: grid;
            place-content: center;
            justify-items: center;
            gap: 14px;
            background: #f5f6fa;
            color: #303b5d;
            font: 13px Arial;
          }

          .fd-loader {
            width: 40px;
            height: 40px;
            border: 3px solid #c19a5230;
            border-top-color: #c19a52;
            border-radius: 50%;
            animation: fdspin .8s linear infinite;
          }

          @keyframes fdspin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fd-page">
      <style>{`

        /* ==================================
           GLOBAL BACKGROUND
        ================================== */

        .fd-page,
        .fd-page * {
          box-sizing: border-box;
        }

        .fd-page {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              ellipse at 8% 8%,
              #e5eaf5 0%,
              transparent 38%
            ),
            radial-gradient(
              ellipse at 93% 15%,
              #f4ead7 0%,
              transparent 34%
            ),
            radial-gradient(
              ellipse at 80% 92%,
              #e6edf7 0%,
              transparent 38%
            ),
            linear-gradient(
              135deg,
              #f8f9fc 0%,
              #f3f5fa 48%,
              #faf8f3 100%
            );
          color: #202945;
          font-family: Inter, Arial, sans-serif;
        }

        .fd-background {
          position: absolute;
          z-index: -1;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .fd-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(85px);
          animation: fdFloat 15s ease-in-out infinite alternate;
        }

        .fd-orb-one {
          width: 360px;
          height: 360px;
          top: -130px;
          left: -110px;
          background: #cbd7ec;
          opacity: .65;
        }

        .fd-orb-two {
          width: 330px;
          height: 330px;
          top: 18%;
          right: -150px;
          background: #e9d3a9;
          opacity: .42;
          animation-delay: -5s;
        }

        .fd-orb-three {
          width: 420px;
          height: 420px;
          bottom: -210px;
          left: 34%;
          background: #d4dfef;
          opacity: .55;
          animation-delay: -8s;
        }

        .fd-orb-four {
          width: 200px;
          height: 200px;
          bottom: 25%;
          left: -100px;
          background: #ead8b8;
          opacity: .38;
          animation-delay: -3s;
        }

        .fd-abstract-ring {
          position: absolute;
          border: 1px solid #303b5d12;
          border-radius: 50%;
        }

        .fd-ring-one {
          width: 650px;
          height: 650px;
          top: -330px;
          right: 5%;
          box-shadow:
            0 0 0 35px #303b5d05,
            0 0 0 80px #303b5d04;
        }

        .fd-ring-two {
          width: 480px;
          height: 480px;
          bottom: -300px;
          left: 12%;
          box-shadow:
            0 0 0 30px #303b5d05,
            0 0 0 65px #303b5d04;
        }

        .fd-background-grid {
          position: absolute;
          inset: 0;
          opacity: .35;
          background-image:
            linear-gradient(#303b5d08 1px, transparent 1px),
            linear-gradient(90deg, #303b5d08 1px, transparent 1px);
          background-size: 65px 65px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        @keyframes fdFloat {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(35px, -30px, 0) scale(1.12);
          }
        }

        /* ==================================
           MAIN CONTAINER
        ================================== */

        .fd-main {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1600px;
          margin: auto;
          padding: 30px clamp(20px, 4vw, 65px) 24px;
        }

        /* ==================================
           TOP BAR
        ================================== */

        .fd-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 36px;
        }

        .fd-brand {
          display: flex;
          align-items: center;
          gap: 13px;
          flex-shrink: 0;
        }

        .fd-brand-icon {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          border: 1.5px solid #c19a5270;
          border-radius: 15px;
          background: #ffffffdc;
          color: #a27b38;
          box-shadow: 0 5px 16px #2029450b;
          backdrop-filter: blur(12px);
        }

        .fd-brand-name {
          color: #202945;
          font-size: 12px;
          font-weight: 900;
          line-height: 1.5;
          letter-spacing: 1px;
        }

        .fd-brand-sub {
          margin-top: 3px;
          color: #858ba0;
          font-size: 10px;
          letter-spacing: .6px;
        }

        /* Right side: sign out above, role/date below */

        .fd-top-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 9px;
          min-width: 0;
        }

        .fd-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 41px;
          padding: 0 16px;
          border: 1.5px solid #c19a5270;
          border-radius: 11px;
          background: #ffffffed;
          color: #303b5d;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s;
        }

        .fd-logout:hover {
          border-color: #b78b3e;
          background: #fbf4e7;
          color: #98743b;
          transform: translateY(-2px);
          box-shadow: 0 7px 18px #20294512;
        }

        .fd-top-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .fd-role {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 16px;
          border: 1.5px solid #c19a5275;
          border-radius: 30px;
          background: #fbf4e7;
          color: #98743b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .8px;
          white-space: nowrap;
        }

        /* Date card */

        .fd-date-card {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 61px;
          padding: 9px 14px;
          border: 1.5px solid #c19a5275;
          border-radius: 14px;
          background: #fffaf0eF;
          box-shadow: 0 6px 18px #20294509;
        }

        .fd-date-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #c19a5250;
          border-radius: 11px;
          background: #ffffff;
          color: #a27b38;
        }

        .fd-date-content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .fd-date-label {
          color: #a27b38;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .fd-date-value {
          color: #303b5d;
          font-size: 12px;
          font-weight: 850;
          white-space: nowrap;
        }

        /* ==================================
           PAGE HEADING
        ================================== */

        .fd-heading {
          margin-bottom: 25px;
        }

        .fd-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 12px;
          color: #858ba0;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2.2px;
        }

        .fd-eyebrow:before {
          content: "";
          width: 27px;
          height: 2px;
          border-radius: 5px;
          background: #c19a52;
        }

        .fd-heading h1 {
          margin: 0;
          color: #202945;
          font-size: clamp(30px, 4vw, 43px);
          font-weight: 850;
          letter-spacing: -1.5px;
        }

        .fd-heading p {
          max-width: 570px;
          margin: 11px 0 0;
          color: #858ba0;
          font-size: 13px;
          line-height: 1.8;
        }

        /* ==================================
           WELCOME BANNER
        ================================== */

        .fd-welcome {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 34px;
          padding: 29px 32px;
          border: 1.5px solid #c19a52;
          border-radius: 18px;
          background: linear-gradient(115deg, #ffffffed, #f5f7fbe8);
          backdrop-filter: blur(18px);
          box-shadow: 0 12px 35px #2029450d;
        }

        .fd-welcome:before {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          right: 10%;
          top: -200px;
          border: 1px solid #c19a5250;
          border-radius: 50%;
          box-shadow:
            0 0 0 25px #c19a5210,
            0 0 0 55px #c19a5208,
            0 0 0 85px #c19a5205;
        }

        .fd-welcome-content {
          position: relative;
          z-index: 1;
        }

        .fd-welcome h2 {
          margin: 0;
          color: #202945;
          font-size: clamp(18px, 2.3vw, 23px);
          font-weight: 800;
        }

        .fd-welcome p {
          margin: 10px 0 0;
          color: #858ba0;
          font-size: 12px;
          line-height: 1.8;
        }

        .fd-welcome-icon {
          position: relative;
          z-index: 1;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1.5px solid #c19a5275;
          border-radius: 18px;
          background: #fbf4e7;
          color: #a27b38;
        }

        /* ==================================
           SECTION HEADING
        ================================== */

        .fd-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 17px;
        }

        .fd-section-heading h2 {
          margin: 0;
          color: #202945;
          font-size: 17px;
          font-weight: 800;
        }

        .fd-section-heading span {
          color: #858ba0;
          font-size: 11px;
        }

        /* ==================================
           RESPONSIVE SERVICE GRID
        ================================== */

        .fd-grid {
          display: grid;

          /*
            Automatically creates as many columns as
            can comfortably fit in the available width.
          */

          grid-template-columns:
            repeat(auto-fit, minmax(min(100%, 280px), 1fr));

          gap: 18px;
          width: 100%;
          align-items: stretch;
        }

        .fd-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          min-width: 0;
          min-height: 230px;
          padding: 21px;
          border: 1.5px solid #c19a5270;
          border-radius: 16px;
          background: linear-gradient(145deg, #ffffff, #f8f9fc);
          box-shadow: 0 8px 25px #2029450d;
          text-align: left;
          cursor: pointer;
          transition:
            transform .25s,
            box-shadow .25s,
            border-color .25s;
        }

        .fd-card:after {
          content: "";
          position: absolute;
          width: 130px;
          height: 130px;
          top: -85px;
          right: -70px;
          border: 1px solid #c19a5250;
          border-radius: 50%;
          box-shadow: 0 0 0 17px #c19a520c;
          pointer-events: none;
        }

        .fd-card:not(:disabled):hover {
          transform: translateY(-5px);
          border-color: #a77c32;
          box-shadow: 0 16px 32px #20294518;
        }

        .fd-card:focus-visible {
          outline: 3px solid #c19a52;
          outline-offset: 3px;
        }

        .fd-card.restricted {
          background: #eef0f4;
          border-color: #c9b98f;
          opacity: .78;
          cursor: not-allowed;
          box-shadow: none;
        }

        .fd-card-icon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-bottom: 17px;
          border-radius: 13px;
        }

        .fd-card-icon.gold {
          background: #f7f0e3;
          color: #a27b38;
        }

        .fd-card-icon.blue {
          background: #eaf1fc;
          color: #5276b5;
        }

        .fd-card-icon.purple {
          background: #f0ecfb;
          color: #8066b8;
        }

        .fd-card-icon.green {
          background: #e8f5ee;
          color: #428b63;
        }

        .fd-card-icon.orange {
          background: #fff0e5;
          color: #c27a42;
        }

        .fd-card-icon.pink {
          background: #f9ebf1;
          color: #b45e83;
        }

        .fd-card-tag {
          color: #9a855d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .fd-card h3 {
          margin: 9px 0;
          color: #26314b;
          font-size: 14px;
          font-weight: 850;
        }

        .fd-card p {
          flex: 1;
          width: 100%;
          min-height: 37px;
          margin: 0;
          color: #8991a1;
          font-size: 11px;
          line-height: 1.7;
        }

        .fd-card-action {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 15px;
          color: #a17c3e;
          font-size: 10px;
          font-weight: 900;
        }

        .fd-card.restricted .fd-card-action {
          color: #858b99;
        }

        .fd-restricted-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 12px;
          padding: 6px 9px;
          border: 1px solid #c9b98f;
          border-radius: 20px;
          background: #e9e5dc;
          color: #737b8c;
          font-size: 9px;
          font-weight: 900;
        }

        /* ==================================
           LOWER PANELS
        ================================== */

        .fd-lower {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
          gap: 18px;
          margin-top: 27px;
        }

        .fd-panel {
          min-width: 0;
          padding: 22px;
          border: 1.5px solid #c19a5265;
          border-radius: 15px;
          background: #ffffffdf;
          backdrop-filter: blur(15px);
          box-shadow: 0 8px 25px #2029450b;
        }

        .fd-panel h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 15px;
          color: #202945;
          font-size: 13px;
        }

        .fd-panel h3 svg {
          color: #b18b4b;
        }

        .fd-notice {
          display: flex;
          gap: 12px;
          padding: 13px 0;
          border-top: 1px solid #e9ecf2;
        }

        .fd-notice-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #c19a5240;
          border-radius: 10px;
          background: #fbf4e7;
          color: #a27b38;
        }

        .fd-notice strong {
          display: block;
          color: #303b5d;
          font-size: 11px;
        }

        .fd-notice p {
          margin: 5px 0 0;
          color: #858ba0;
          font-size: 10px;
          line-height: 1.8;
        }

        .fd-account-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #e9ecf2;
          font-size: 11px;
        }

        .fd-account-row span {
          color: #858ba0;
        }

        .fd-account-row strong {
          color: #303b5d;
          overflow-wrap: anywhere;
          text-align: right;
        }

        /* ==================================
           ERROR AND FOOTER
        ================================== */

        .fd-error {
          padding: 15px;
          border: 1px solid #e9bcbc;
          border-radius: 11px;
          background: #fff0f0;
          color: #a43c3c;
          font-size: 12px;
          line-height: 1.8;
        }

        .fd-footer {
          margin-top: 30px;
          color: #9299aa;
          font-size: 10px;
          text-align: center;
          letter-spacing: .3px;
        }

        /* ==================================
           MODALS
        ================================== */

        .fd-overlay {
          position: fixed;
          z-index: 1000;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #20294588;
          backdrop-filter: blur(9px);
          animation: fdfade .2s ease;
        }

        .fd-modal {
          width: 100%;
          max-width: 430px;
          padding: 29px;
          border: 1.5px solid #c19a5275;
          border-radius: 18px;
          background: white;
          box-shadow: 0 25px 70px #0003;
          animation: fdmodal .25s ease;
        }

        .fd-modal-icon {
          width: 53px;
          height: 53px;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
          border-radius: 15px;
          background: #f7f0e3;
          color: #a27b38;
        }

        .fd-modal h2 {
          margin: 0;
          color: #202945;
          font-size: 21px;
        }

        .fd-modal p {
          margin: 12px 0 22px;
          color: #778196;
          font-size: 12px;
          line-height: 1.8;
        }

        .fd-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .fd-modal-actions button {
          min-height: 41px;
          padding: 10px 16px;
          border: 1px solid #e2e5eb;
          border-radius: 9px;
          background: white;
          color: #4c5870;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .fd-modal-actions .primary {
          border-color: #202945;
          background: #202945;
          color: white;
        }

        .fd-modal-actions .danger {
          border-color: #a83f3f;
          background: #a83f3f;
          color: white;
        }

        @keyframes fdfade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fdmodal {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        /* ==================================
           RESPONSIVE LAYOUT
        ================================== */

        @media (max-width: 900px) {
          .fd-lower {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .fd-main {
            padding: 22px 17px;
          }

          .fd-topbar {
            align-items: flex-start;
            margin-bottom: 28px;
          }

          .fd-brand-icon {
            width: 43px;
            height: 43px;
          }

          .fd-top-meta {
            gap: 7px;
          }

          .fd-role {
            min-height: 37px;
            padding: 0 10px;
            font-size: 9px;
          }

          .fd-date-card {
            min-height: 54px;
            gap: 8px;
            padding: 7px 9px;
          }

          .fd-date-icon {
            width: 33px;
            height: 33px;
          }

          .fd-date-value {
            font-size: 10px;
          }

          .fd-date-label {
            font-size: 8px;
          }

          .fd-logout {
            min-height: 37px;
            padding: 0 11px;
            font-size: 10px;
          }

          .fd-welcome {
            padding: 22px;
          }

          .fd-welcome-icon {
            width: 50px;
            height: 50px;
          }
        }

        @media (max-width: 480px) {
          .fd-topbar {
            flex-direction: column;
            gap: 18px;
          }

          .fd-top-right {
            width: 100%;
            align-items: stretch;
          }

          .fd-logout {
            align-self: flex-end;
          }

          .fd-top-meta {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            align-items: center;
          }

          .fd-role {
            white-space: normal;
            text-align: center;
            line-height: 1.5;
          }

          .fd-date-card {
            min-width: 0;
          }

          .fd-date-value {
            white-space: normal;
            line-height: 1.4;
          }

          .fd-welcome {
            padding: 20px;
          }

          .fd-welcome h2 {
            font-size: 18px;
          }

          .fd-section-heading h2 {
            font-size: 15px;
          }

          .fd-modal {
            padding: 22px;
          }
        }

        @media (max-width: 340px) {
          .fd-top-meta {
            grid-template-columns: 1fr;
          }

          .fd-role {
            justify-self: start;
          }

          .fd-date-card {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fd-page *,
          .fd-loading-screen * {
            animation: none !important;
            transition: none !important;
          }
        }

      `}</style>

      {/* ABSTRACT BACKGROUND */}

      <div className="fd-background">
        <div className="fd-background-grid" />

        <div className="fd-orb fd-orb-one" />
        <div className="fd-orb fd-orb-two" />
        <div className="fd-orb fd-orb-three" />
        <div className="fd-orb fd-orb-four" />

        <div className="fd-abstract-ring fd-ring-one" />
        <div className="fd-abstract-ring fd-ring-two" />
      </div>

      <main className="fd-main">

        {/* TOP BAR */}

        <header className="fd-topbar">

          <div className="fd-brand">
            <div className="fd-brand-icon">
              <GraduationCap size={24} />
            </div>

            <div>
              <div className="fd-brand-name">
                DPP INSTITUTE
                <br />
                OF TECHNOLOGY
              </div>

              <div className="fd-brand-sub">
                Faculty Portal
              </div>
            </div>
          </div>

          <div className="fd-top-right">

            {/* SIGN OUT ON TOP */}

            <button
              className="fd-logout"
              onClick={() => setShowLogout(true)}
              title="Sign out"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>

            {/* FACULTY TYPE AND DATE ALIGNED BELOW */}

            <div className="fd-top-meta">

              <span className="fd-role">
                {isPermanent
                  ? "PERMANENT FACULTY"
                  : "VISITING FACULTY"}
              </span>

              <div className="fd-date-card">
                <div className="fd-date-icon">
                  <CalendarDays size={20} />
                </div>

                <div className="fd-date-content">
                  <span className="fd-date-label">
                    TODAY'S DATE
                  </span>

                  <span className="fd-date-value">
                    {todayDate}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </header>

        {/* PAGE HEADING */}

        <div className="fd-heading">
          <p className="fd-eyebrow">
            FACULTY WORKSPACE
          </p>

          <h1>Dashboard</h1>

          <p>
            Manage your academic activities and stay connected
            with your department.
          </p>
        </div>

        {error && (
          <div className="fd-error">
            {error}
          </div>
        )}

        {!error && (
          <>

            {/* WELCOME */}

            <section className="fd-welcome">

              <div className="fd-welcome-content">
                <h2>
                  Welcome back, {displayName}!
                </h2>

                <p>
                  Your faculty workspace is ready.
                  Choose a section below to continue.
                </p>
              </div>

              <div className="fd-welcome-icon">
                <GraduationCap size={30} />
              </div>

            </section>

            {/* SERVICES */}

            <div className="fd-section-heading">
              <h2>Faculty Services</h2>

              <span>
                {availableCount} available sections
              </span>
            </div>

            <section className="fd-grid">

              {services.map((service) => {
                const Icon = service.icon;

                const blocked =
                  service.permanentOnly && !isPermanent;

                return (
                  <button
                    key={service.id}
                    type="button"
                    disabled={blocked}
                    className={`fd-card ${
                      blocked ? "restricted" : ""
                    }`}
                    onClick={() => openService(service)}
                    title={
                      blocked
                        ? "Not applicable to Visiting Faculty"
                        : `Open ${service.title}`
                    }
                  >

                    <div className={`fd-card-icon ${service.tone}`}>
                      <Icon size={21} />
                    </div>

                    <span className="fd-card-tag">
                      {service.tag}
                    </span>

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    {blocked ? (
                      <span className="fd-restricted-label">
                        <Ban size={12} />
                        Not Applicable
                      </span>
                    ) : (
                      <span className="fd-card-action">
                        Open section
                        <ArrowRight size={13} />
                      </span>
                    )}

                  </button>
                );
              })}

            </section>

            {/* LOWER PANELS */}

            <section className="fd-lower">

              <div className="fd-panel">

                <h3>
                  <Bell size={17} />
                  Department Updates
                </h3>

                <div className="fd-notice">

                  <div className="fd-notice-icon">
                    <BookOpen size={16} />
                  </div>

                  <div>
                    <strong>Academic Notice Board</strong>

                    <p>
                      Visit the Notices section to view
                      department announcements and updates.
                    </p>
                  </div>

                </div>

                <div className="fd-notice">

                  <div className="fd-notice-icon">
                    <CalendarDays size={16} />
                  </div>

                  <div>
                    <strong>Teaching Schedule</strong>

                    <p>
                      Open Class Routine to view your
                      weekly timetable.
                    </p>
                  </div>

                </div>

              </div>

              {/* ACCOUNT INFORMATION */}

              <div className="fd-panel">

                <h3>
                  <ShieldCheck size={17} />
                  Account Information
                </h3>

                <div className="fd-account-row">
                  <span>Faculty ID</span>
                  <strong>{facultyId}</strong>
                </div>

                <div className="fd-account-row">
                  <span>Name</span>
                  <strong>{displayName}</strong>
                </div>

                <div className="fd-account-row">
                  <span>Department</span>
                  <strong>
                    {faculty?.deptId || "MCA Department"}
                  </strong>
                </div>

                <div className="fd-account-row">
                  <span>Account type</span>
                  <strong>
                    {isPermanent ? "Permanent" : "Visiting"}
                  </strong>
                </div>

              </div>

            </section>

          </>
        )}

        <footer className="fd-footer">
          © {new Date().getFullYear()} DPP Institute of Technology
          · Faculty Portal
        </footer>

      </main>

      {/* RESTRICTED MODULE NOTICE */}

      {showRestricted && (
        <div
          className="fd-overlay"
          onClick={() => setShowRestricted(false)}
        >
          <div
            className="fd-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="fd-modal-icon">
              <LockKeyhole size={24} />
            </div>

            <h2>{restrictedTitle}</h2>

            <p>{restrictedMessage}</p>

            <div className="fd-modal-actions">
              <button
                className="primary"
                onClick={() => setShowRestricted(false)}
              >
                Okay
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION */}

      {showLogout && (
        <div
          className="fd-overlay"
          onClick={() => setShowLogout(false)}
        >
          <div
            className="fd-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="fd-modal-icon">
              <AlertTriangle size={24} />
            </div>

            <h2>Sign out?</h2>

            <p>
              Are you sure you want to sign out of your
              faculty account?
            </p>

            <div className="fd-modal-actions">

              <button
                onClick={() => setShowLogout(false)}
              >
                Stay here
              </button>

              <button
                className="danger"
                onClick={logout}
              >
                Sign out
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
