
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Clock3,
  Megaphone,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  PartyPopper,
  FileText,
  Pin,
  Sparkles,
} from "lucide-react";

const announcements = [
  {
    id: 1,
    category: "Academic",
    tag: "IMPORTANT",
    title: "Internal Assessment Examination Schedule",
    description:
      "The tentative schedule for the upcoming internal assessment examinations has been prepared. Students are advised to check their respective subject schedules and begin their preparation.",
    date: "05 November 2026",
    time: "10:30 AM",
    pinned: true,
    icon: GraduationCap,
  },
  {
    id: 2,
    category: "Department",
    tag: "UPDATE",
    title: "Department Notice – Student Information Update",
    description:
      "Students are requested to review their profile information and ensure that their contact details and academic information are up to date.",
    date: "03 November 2026",
    time: "02:15 PM",
    pinned: true,
    icon: FileText,
  },
  {
    id: 3,
    category: "Events",
    tag: "EVENT",
    title: "Department Tech Fest – Registrations Open",
    description:
      "The department is planning a technical event featuring coding activities, project demonstrations and interactive sessions. Interested students can register when the registration process opens.",
    date: "01 November 2026",
    time: "11:00 AM",
    pinned: false,
    icon: PartyPopper,
  },
  {
    id: 4,
    category: "Academic",
    tag: "REMINDER",
    title: "Project Progress Review",
    description:
      "Students working on their academic projects should keep their progress reports and project documentation ready for the upcoming review.",
    date: "29 October 2026",
    time: "09:45 AM",
    pinned: false,
    icon: BookOpen,
  },
];

const upcomingEvents = [
  {
    id: 1,
    day: "08",
    month: "NOV",
    title: "Internal Assessment Preparation",
    type: "Academic",
    time: "As per class schedule",
    location: "Department",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=85",
  },
  {
    id: 2,
    day: "12",
    month: "NOV",
    title: "Project Review Session",
    type: "Department",
    time: "11:00 AM onwards",
    location: "Computer Lab",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=85",
  },
  {
    id: 3,
    day: "18",
    month: "NOV",
    title: "Technical Event",
    type: "Events",
    time: "To be announced",
    location: "Department Campus",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=85",
  },
];

const filters = ["All", "Academic", "Department", "Events"];

export default function Announcements() {
  const [showPreview, setShowPreview] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredAnnouncements =
    activeFilter === "All"
      ? announcements
      : announcements.filter(
          (item) => item.category === activeFilter
        );

  return (
    <div className="announcement-page">
      <style>{`
        .announcement-page {
          min-height: 100vh;
          padding: 30px clamp(16px, 3vw, 40px) 50px;
          color: #252c43;
          background:
            radial-gradient(circle at 4% 5%, rgba(193,154,82,.09), transparent 25%),
            radial-gradient(circle at 95% 90%, rgba(48,59,93,.07), transparent 28%),
            #f4f5f9;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .announcement-wrap {
          max-width: 1450px;
          margin: 0 auto;
        }

        .announcement-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 27px;
          gap: 15px;
        }

        .announcement-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          color: #76582d;
          background: #fff;
          border: 1.5px solid #d9c59f;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          transition: .2s;
        }

        .announcement-back:hover {
          color: white;
          background: #202945;
          border-color: #202945;
        }

        .announcement-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #a77e36;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        /* HERO WITH IMAGE */

        .announcement-hero {
          position: relative;
          display: grid;
          grid-template-columns: 1.4fr .8fr;
          align-items: center;
          gap: 25px;
          overflow: hidden;
          padding: 34px 38px;
          color: white;
          background: linear-gradient(115deg, #202945, #303c60 65%, #46516e);
          border: 1px solid #3b486a;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(32,41,69,.13);
        }

        .announcement-hero::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          right: 4%;
          top: -170px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          box-shadow:
            0 0 0 35px rgba(255,255,255,.035),
            0 0 0 70px rgba(255,255,255,.025);
        }

        .announcement-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .announcement-hero-small {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #e7c98f;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        .announcement-hero h1 {
          margin: 13px 0 10px;
          color: #fff;
          font-size: clamp(28px, 4vw, 43px);
          font-weight: 850;
          letter-spacing: -1.3px;
        }

        .announcement-hero p {
          max-width: 610px;
          margin: 0;
          color: #d5dbea;
          font-size: 13px;
          line-height: 1.9;
        }

        .announcement-hero-bottom {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 23px;
        }

        .announcement-hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          color: #f4e7ca;
          background: rgba(255,255,255,.09);
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
        }

        .announcement-hero-image {
          position: relative;
          z-index: 1;
          height: 235px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 15px;
          box-shadow: 0 12px 30px rgba(0,0,0,.25);
        }

        .announcement-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: .88;
        }

        .announcement-image-caption {
          position: absolute;
          inset: auto 0 0;
          padding: 30px 15px 14px;
          color: white;
          background: linear-gradient(transparent, rgba(15,22,42,.85));
          font-size: 11px;
          font-weight: 800;
        }

        /* STATS */

        .announcement-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin: 19px 0 28px;
        }

        .announcement-stat {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 17px;
          background: #fff;
          border: 1.5px solid #d9deea;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(35,45,75,.035);
        }

        .announcement-stat-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          color: #9b753c;
          background: #fbf4e7;
          border: 1px solid #ead9b9;
          border-radius: 11px;
        }

        .announcement-stat strong {
          display: block;
          color: #202945;
          font-size: 21px;
          font-weight: 900;
        }

        .announcement-stat span {
          color: #858da1;
          font-size: 10px;
          font-weight: 700;
        }

        /* SECTION */

        .announcement-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 15px;
          margin: 31px 0 16px;
        }

        .announcement-section-heading h2 {
          margin: 0;
          color: #202945;
          font-size: 20px;
          font-weight: 850;
        }

        .announcement-section-heading p {
          margin: 5px 0 0;
          color: #858da1;
          font-size: 11px;
        }

        .announcement-content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(280px, .85fr);
          gap: 22px;
          align-items: start;
        }

        .announcement-main,
        .announcement-side {
          min-width: 0;
        }

        /* FILTERS */

        .announcement-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
          padding: 10px;
          background: #fff;
          border: 1.5px solid #d9deea;
          border-radius: 11px;
        }

        .announcement-filter {
          padding: 8px 13px;
          color: #69738a;
          background: #f5f6fa;
          border: 1px solid #dfe3ec;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s;
        }

        .announcement-filter:hover {
          border-color: #b18b4d;
        }

        .announcement-filter.active {
          color: white;
          background: #202945;
          border-color: #202945;
        }

        /* ANNOUNCEMENT CARDS */

        .announcement-list {
          display: grid;
          gap: 13px;
        }

        .announcement-card {
          position: relative;
          padding: 19px 20px;
          background: #fff;
          border: 1.5px solid #d8deea;
          border-radius: 13px;
          box-shadow: 0 4px 13px rgba(35,45,75,.035);
          transition: .2s;
        }

        .announcement-card:hover {
          border-color: #b6a078;
          box-shadow: 0 8px 22px rgba(35,45,75,.075);
          transform: translateY(-2px);
        }

        .announcement-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 13px;
        }

        .announcement-card-category {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #98713a;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .5px;
        }

        .announcement-tag {
          padding: 5px 8px;
          color: #66718a;
          background: #f0f2f7;
          border: 1px solid #dce1eb;
          border-radius: 5px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .6px;
        }

        .announcement-card h3 {
          margin: 0 0 8px;
          color: #27314d;
          font-size: 14px;
          font-weight: 850;
          line-height: 1.5;
        }

        .announcement-card-description {
          margin: 0;
          color: #788197;
          font-size: 11px;
          line-height: 1.85;
        }

        .announcement-card-footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 17px;
          padding-top: 12px;
          border-top: 1px solid #e6e9f0;
        }

        .announcement-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          color: #9299aa;
          font-size: 9px;
          font-weight: 700;
        }

        .announcement-card-meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .announcement-pinned {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #a27a3d;
          font-size: 9px;
          font-weight: 800;
        }

        .announcement-empty {
          padding: 35px 20px;
          color: #858da1;
          background: #fff;
          border: 1.5px dashed #cbd2e0;
          border-radius: 12px;
          text-align: center;
          font-size: 12px;
        }

        /* UPCOMING EVENTS */

        .announcement-upcoming {
          overflow: hidden;
          background: #fff;
          border: 1.5px solid #d8deea;
          border-radius: 13px;
          box-shadow: 0 4px 13px rgba(35,45,75,.035);
        }

        .announcement-upcoming-header {
          padding: 17px 18px;
          color: white;
          background: #303b5d;
        }

        .announcement-upcoming-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 850;
        }

        .announcement-upcoming-header p {
          margin: 5px 0 0;
          color: #cbd2e3;
          font-size: 10px;
        }

        .announcement-event {
          padding: 14px;
          border-bottom: 1px solid #e6e9f0;
          transition: .2s;
        }

        .announcement-event:last-child {
          border-bottom: 0;
        }

        .announcement-event:hover {
          background: #fafbfe;
        }

        .announcement-event-image {
          width: 100%;
          height: 115px;
          overflow: hidden;
          margin-bottom: 12px;
          border-radius: 9px;
        }

        .announcement-event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .35s;
        }

        .announcement-event:hover img {
          transform: scale(1.05);
        }

        .announcement-event-details {
          display: flex;
          align-items: flex-start;
          gap: 11px;
        }

        .announcement-event-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 49px;
          min-width: 49px;
          height: 55px;
          color: #8c672e;
          background: #fbf4e7;
          border: 1px solid #e7d6b5;
          border-radius: 9px;
        }

        .announcement-event-date strong {
          font-size: 19px;
          font-weight: 900;
          line-height: 1.1;
        }

        .announcement-event-date span {
          margin-top: 3px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .announcement-event-info {
          min-width: 0;
        }

        .announcement-event-info h4 {
          margin: 1px 0 6px;
          color: #303954;
          font-size: 11px;
          font-weight: 850;
          line-height: 1.5;
        }

        .announcement-event-info p {
          margin: 0 0 5px;
          color: #9299aa;
          font-size: 9px;
        }

        .announcement-event-type {
          color: #9a753e;
          font-size: 9px;
          font-weight: 800;
        }

        /* SIDE NOTE */

        .announcement-side-note {
          margin-top: 15px;
          padding: 17px;
          background: #fff;
          border: 1.5px solid #d8deea;
          border-left: 4px solid #b18b4d;
          border-radius: 11px;
        }

        .announcement-side-note h4 {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0 0 8px;
          color: #303954;
          font-size: 12px;
          font-weight: 850;
        }

        .announcement-side-note p {
          margin: 0;
          color: #7d879c;
          font-size: 10px;
          line-height: 1.8;
        }

        /* BOTTOM IMAGE BANNER */

        .announcement-image-banner {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 155px;
          overflow: hidden;
          margin-top: 25px;
          padding: 25px 30px;
          color: white;
          background: #202945;
          border-radius: 14px;
        }

        .announcement-image-banner img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: .28;
        }

        .announcement-image-banner::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #202945 0%, rgba(32,41,69,.8) 55%, rgba(32,41,69,.25));
        }

        .announcement-banner-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
        }

        .announcement-banner-content h3 {
          margin: 0 0 8px;
          font-size: 19px;
          font-weight: 850;
        }

        .announcement-banner-content p {
          margin: 0;
          color: #d5dbea;
          font-size: 11px;
          line-height: 1.8;
        }

        .announcement-footer {
          margin-top: 30px;
          padding: 17px;
          color: #9299aa;
          border-top: 1px solid #dfe3eb;
          text-align: center;
          font-size: 10px;
          line-height: 1.8;
        }

        /* PREVIEW POPUP */

        .preview-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(15,22,42,.72);
          backdrop-filter: blur(6px);
        }

        .preview-modal {
          position: relative;
          width: 100%;
          max-width: 440px;
          padding: 32px;
          background: #fff;
          border: 1.5px solid #d9c59f;
          border-radius: 18px;
          box-shadow: 0 25px 75px rgba(0,0,0,.25);
          text-align: center;
          animation: previewAppear .25s ease-out;
        }

        @keyframes previewAppear {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .preview-icon {
          display: grid;
          place-items: center;
          width: 62px;
          height: 62px;
          margin: 0 auto 18px;
          color: #a27a3d;
          background: #fbf4e7;
          border: 1px solid #ead8b5;
          border-radius: 18px;
        }

        .preview-modal h2 {
          margin: 0 0 10px;
          color: #202945;
          font-size: 21px;
          font-weight: 900;
        }

        .preview-modal p {
          margin: 0;
          color: #788197;
          font-size: 12px;
          line-height: 1.9;
        }

        .preview-warning {
          margin-top: 17px;
          padding: 11px;
          color: #8a6a36;
          background: #fbf6ec;
          border: 1px solid #eadcc1;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.7;
        }

        .preview-ok {
          width: 100%;
          margin-top: 22px;
          padding: 13px;
          color: #fff;
          background: #202945;
          border: 1px solid #202945;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
          transition: .2s;
        }

        .preview-ok:hover {
          background: #a27a3d;
          border-color: #a27a3d;
          transform: translateY(-1px);
        }

        @media(max-width: 900px) {
          .announcement-hero {
            grid-template-columns: 1fr;
          }

          .announcement-hero-image {
            height: 200px;
          }

          .announcement-content-grid {
            grid-template-columns: 1fr;
          }

          .announcement-side {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          .announcement-side-note {
            margin-top: 0;
          }
        }

        @media(max-width: 600px) {
          .announcement-page {
            padding: 20px 13px 35px;
          }

          .announcement-hero {
            padding: 25px 21px;
          }

          .announcement-stats {
            grid-template-columns: 1fr;
            gap: 9px;
          }

          .announcement-stat {
            padding: 12px;
          }

          .announcement-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .announcement-side {
            display: grid;
            grid-template-columns: 1fr;
          }

          .announcement-card {
            padding: 16px;
          }

          .announcement-image-banner {
            padding: 22px;
          }

          .preview-modal {
            padding: 25px 21px;
          }
        }
      `}</style>

      {/* DUMMY PREVIEW POPUP */}
      {showPreview && (
        <div className="preview-overlay">
          <div
            className="preview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
          >
            <div className="preview-icon">
              <Megaphone size={29} />
            </div>

            <h2 id="preview-title">Announcement Preview</h2>

            <p>
              Welcome to the Student Announcements page. This page is currently
              displaying sample announcements and dummy event information to
              demonstrate how department updates will appear.
            </p>

            <div className="preview-warning">
              This is a dummy preview. The notices, dates, events and other
              information shown here are for demonstration only and are not
              official department announcements.
            </div>

            <button
              className="preview-ok"
              type="button"
              onClick={() => setShowPreview(false)}
            >
              OK, Continue
            </button>
          </div>
        </div>
      )}

      <div className="announcement-wrap">
        {/* TOP BAR */}
        <div className="announcement-top">
          <div className="announcement-label">
            <Megaphone size={15} />
            STUDENT NOTICE BOARD
          </div>

          <Link className="announcement-back" to="/student/dashboard">
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>
        </div>

        {/* HERO */}
        <section className="announcement-hero">
          <div className="announcement-hero-content">
            <div className="announcement-hero-small">
              <Sparkles size={13} />
              DEPARTMENT UPDATES & NOTICES
            </div>

            <h1>Stay Informed. Stay Ahead.</h1>

            <p>
              Keep up with everything happening in your department. Find the
              latest academic updates, important notices, upcoming activities
              and events — all in one place.
            </p>

            <div className="announcement-hero-bottom">
              <span className="announcement-hero-pill">
                <Bell size={13} /> Latest Notices
              </span>
              <span className="announcement-hero-pill">
                <CalendarDays size={13} /> Upcoming Events
              </span>
              <span className="announcement-hero-pill">
                <BookOpen size={13} /> Academic Updates
              </span>
            </div>
          </div>

          <div className="announcement-hero-image">
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=90"
              alt="Students collaborating on campus"
            />
            <div className="announcement-image-caption">
              Learning, collaboration and department activities
            </div>
          </div>
        </section>

        {/* SUMMARY */}
        <div className="announcement-stats">
          <div className="announcement-stat">
            <div className="announcement-stat-icon">
              <Bell size={19} />
            </div>
            <div>
              <strong>{announcements.length}</strong>
              <span>Recent Announcements</span>
            </div>
          </div>

          <div className="announcement-stat">
            <div className="announcement-stat-icon">
              <CalendarCheck size={19} />
            </div>
            <div>
              <strong>{upcomingEvents.length}</strong>
              <span>Upcoming Activities</span>
            </div>
          </div>

          <div className="announcement-stat">
            <div className="announcement-stat-icon">
              <Pin size={19} />
            </div>
            <div>
              <strong>
                {announcements.filter((item) => item.pinned).length}
              </strong>
              <span>Pinned Notices</span>
            </div>
          </div>
        </div>

        {/* ANNOUNCEMENTS HEADING */}
        <div className="announcement-section-heading">
          <div>
            <h2>What's happening?</h2>
            <p>Recent announcements and department updates.</p>
          </div>
        </div>

        <div className="announcement-content-grid">
          {/* ANNOUNCEMENT LIST */}
          <main className="announcement-main">
            <div className="announcement-filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={
                    activeFilter === filter
                      ? "announcement-filter active"
                      : "announcement-filter"
                  }
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="announcement-list">
              {filteredAnnouncements.length === 0 ? (
                <div className="announcement-empty">
                  No announcements available in this category.
                </div>
              ) : (
                filteredAnnouncements.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      className="announcement-card"
                      key={item.id}
                    >
                      <div className="announcement-card-top">
                        <span className="announcement-card-category">
                          <Icon size={14} />
                          {item.category}
                        </span>

                        <span className="announcement-tag">
                          {item.tag}
                        </span>
                      </div>

                      <h3>{item.title}</h3>

                      <p className="announcement-card-description">
                        {item.description}
                      </p>

                      <div className="announcement-card-footer">
                        <div className="announcement-card-meta">
                          <span>
                            <CalendarDays size={12} />
                            {item.date}
                          </span>
                          <span>
                            <Clock3 size={12} />
                            {item.time}
                          </span>
                        </div>

                        {item.pinned && (
                          <span className="announcement-pinned">
                            <Pin size={11} />
                            Pinned notice
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </main>

          {/* UPCOMING EVENTS */}
          <aside className="announcement-side">
            <div className="announcement-upcoming">
              <div className="announcement-upcoming-header">
                <h3>What's coming up?</h3>
                <p>Upcoming activities and important dates.</p>
              </div>

              {upcomingEvents.map((event) => (
                <div className="announcement-event" key={event.id}>
                  <div className="announcement-event-image">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="announcement-event-details">
                    <div className="announcement-event-date">
                      <strong>{event.day}</strong>
                      <span>{event.month}</span>
                    </div>

                    <div className="announcement-event-info">
                      <h4>{event.title}</h4>
                      <p>
                        <Clock3
                          size={10}
                          style={{ verticalAlign: "middle" }}
                        />
                        {" "}{event.time}
                      </p>
                      <p>{event.location}</p>
                      <span className="announcement-event-type">
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="announcement-side-note">
              <h4>
                <Sparkles size={14} />
                Stay Updated
              </h4>
              <p>
                Check this page regularly so you don't miss important
                department notices, academic updates, event announcements
                and upcoming activities.
              </p>
            </div>
          </aside>
        </div>

        {/* BOTTOM IMAGE BANNER */}
        <section className="announcement-image-banner">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=85"
            alt=""
            loading="lazy"
          />

          <div className="announcement-banner-content">
            <h3>Ideas. Innovation. Together.</h3>
            <p>
              Stay connected with your department and be part of the academic
              activities, technical events and collaborative opportunities
              happening around you.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <div className="announcement-footer">
          Student Management System · Department Announcement Board
          <br />
          Sample content for demonstration only. Official notices will be
          displayed here after integration.
        </div>
      </div>
    </div>
  );
}
