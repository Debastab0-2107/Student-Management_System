import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  CalendarDays,
  ArrowUpRight,
  ShieldCheck,
  KeyRound,
  BookPlus,
} from "lucide-react";

const ADMIN_CARDS = [
  {
    title: "Student Section",
    description:
      "Manage student-related administrative operations and student records.",
    features: [
      "Import student records",
      "Manage student status",
      "Add Semester Marks",
    ],
    path: "/admin/students",
    icon: GraduationCap,
    tag: "STUDENT MANAGEMENT",
    number: "01",
  },
  {
    title: "Faculty Section",
    description:
      "Manage Permanent/Regular and Visiting Faculty from one workspace.",
    features: [
      "View faculty records and status",
      "Add and update Visiting Faculty",
      "Import or deactivate Regular Faculty",
    ],
    path: "/admin/faculty",
    icon: Users,
    tag: "FACULTY MANAGEMENT",
    number: "02",
  },
  {
    title: "Update Password",
    description:
      "Secure your administrator account by updating your login password.",
    features: [
      "Verify your current password",
      "Set a new password",
      "Confirm your password securely",
    ],
    path: "/admin/password",
    icon: KeyRound,
    tag: "ACCOUNT SECURITY",
    number: "03",
  },
  {
    title: "Add Subject",
    description:
      "View, import, update, and deactivate subjects for the department.",
    features: [
      "View the subject directory",
      "Import and update subjects using Excel",
      "Deactivate subjects using subject IDs",
    ],
    path: "/admin/subjects",
    icon: BookPlus,
    tag: "SUBJECT MANAGEMENT",
    number: "04",
  },
];

export default function AdminDashboard() {
  const today = new Date();

  const dateLabel = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="ad-page">
      <style>{`
        .ad-page {
          width: 100%;
          max-width: none;
          margin: 0;
          animation: ad-enter .55s ease both;
        }

        .ad-page * {
          box-sizing: border-box;
        }

        @keyframes ad-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ad-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .ad-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          color: #a27c37;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ad-heading h1 {
          margin: 0;
          color: #202945;
          font-size: clamp(27px, 3vw, 37px);
          line-height: 1.2;
          letter-spacing: -1.2px;
        }

        .ad-heading > div > p:last-child {
          margin: 8px 0 0;
          color: #858ba0;
          font-size: 12px;
          line-height: 1.7;
        }

        .ad-date {
          min-width: 180px;
          padding: 12px 15px;
          border: 1px solid #d8c397;
          border-radius: 14px;
          background: #fbf4e7;
          text-align: center;
          box-shadow: 0 8px 25px #2029450c;
        }

        .ad-date span {
          display: block;
          margin-bottom: 5px;
          color: #a27c37;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .ad-date strong {
          color: #202945;
          font-size: 12px;
        }

        .ad-welcome {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 22px 25px;
          margin-bottom: 23px;
          border: 1px solid #ffffffa8;
          border-radius: 17px;
          color: white;
          background: linear-gradient(110deg, #202945, #354365);
          box-shadow: 0 14px 34px #20294520;
        }

        .ad-welcome::after {
          content: "";
          position: absolute;
          width: 230px;
          height: 230px;
          right: -65px;
          top: -120px;
          border: 1px solid #ffffff25;
          border-radius: 50%;
          box-shadow:
            0 0 0 25px #ffffff08,
            0 0 0 52px #ffffff06;
          pointer-events: none;
        }

        .ad-welcome small {
          color: #e6c47f;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .ad-welcome h2 {
          margin: 7px 0 5px;
          color: white;
          font-size: 22px;
          letter-spacing: -.5px;
        }

        .ad-welcome p {
          margin: 0;
          color: #c2c9d8;
          font-size: 11px;
          line-height: 1.7;
        }

        .ad-welcome-icon {
          z-index: 1;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid #e6c47f55;
          border-radius: 16px;
          color: #e6c47f;
          background: #ffffff0d;
        }

        .ad-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 13px;
        }

        .ad-section-heading h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          color: #202945;
          font-size: 16px;
          font-weight: 800;
        }

        .ad-section-heading h2::before {
          content: "";
          width: 4px;
          height: 19px;
          border-radius: 5px;
          background: #c19a52;
        }

        .ad-section-heading span {
          color: #858ba0;
          font-size: 10px;
        }

        .ad-card-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          width: 100%;
        }

        .ad-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 290px;
          padding: 17px 15px;
          overflow: hidden;
          border: 1px solid #ffffffd6;
          border-radius: 16px;
          color: #202945;
          background: #ffffffd9;
          box-shadow: 0 10px 28px #2029450d;
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease,
            background .25s ease;
          animation: ad-card-enter .55s ease both;
        }

        .ad-card:nth-child(2) {
          animation-delay: .07s;
        }

        .ad-card:nth-child(3) {
          animation-delay: .14s;
        }

        .ad-card:nth-child(4) {
          animation-delay: .21s;
        }

        @keyframes ad-card-enter {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ad-card:hover {
          transform: translateY(-5px);
          border-color: #c19a5280;
          background: #ffffffed;
          box-shadow: 0 19px 35px #20294518;
        }

        .ad-card::after {
          content: "";
          position: absolute;
          width: 130px;
          height: 130px;
          right: -70px;
          bottom: -75px;
          border: 1px solid #c19a521c;
          border-radius: 50%;
          box-shadow: 0 0 0 18px #c19a5208;
          transition: transform .35s ease;
        }

        .ad-card:hover::after {
          transform: scale(1.2);
        }

        .ad-card-top {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .ad-card-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid #e9d9b6;
          border-radius: 13px;
          color: #a27c37;
          background: #fbf4e7;
          transition:
            background .22s ease,
            color .22s ease,
            transform .22s ease;
        }

        .ad-card:hover .ad-card-icon {
          color: white;
          background: #c19a52;
          transform: rotate(-4deg);
        }

        .ad-card-tag {
          color: #a27c37;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .8px;
          text-align: left;
          overflow-wrap: anywhere;
        }

        .ad-card-number {
          position: absolute;
          top: 15px;
          right: 13px;
          color: #2029450b;
          font-size: 34px;
          font-weight: 900;
          line-height: 1;
          pointer-events: none;
        }

        .ad-card h3 {
          position: relative;
          z-index: 1;
          margin: 17px 0 8px;
          color: #202945;
          font-size: 16px;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .ad-card > p {
          position: relative;
          z-index: 1;
          margin: 0;
          color: #858ba0;
          font-size: 11px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .ad-card ul {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 9px;
          padding: 0;
          margin: 15px 0 17px;
          list-style: none;
        }

        .ad-card li {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          color: #4f5870;
          font-size: 10px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .ad-card li::before {
          content: "";
          width: 5px;
          height: 5px;
          flex-shrink: 0;
          margin-top: 5px;
          border-radius: 50%;
          background: #c19a52;
        }

        .ad-card-link {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: auto;
          color: #a27c37;
          font-size: 10px;
          font-weight: 800;
        }

        .ad-bottom-note {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          margin-top: 17px;
          border: 1px solid #ffffffc9;
          border-radius: 13px;
          color: #727b91;
          background: #ffffff8c;
          font-size: 10px;
          line-height: 1.7;
        }

        .ad-bottom-note svg {
          flex-shrink: 0;
          color: #a27c37;
        }

        @media(max-width: 1150px) {
          .ad-card-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media(max-width: 760px) {
          .ad-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .ad-welcome {
            padding: 19px;
          }

          .ad-heading {
            margin-bottom: 20px;
          }

          .ad-card {
            min-height: 275px;
          }
        }

        @media(max-width: 480px) {
          .ad-card-grid {
            grid-template-columns: 1fr;
          }

          .ad-date {
            width: 100%;
          }

          .ad-card {
            min-height: 235px;
            padding: 19px;
          }

          .ad-card-top {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .ad-card-tag {
            text-align: right;
          }

          .ad-card-number {
            right: 20px;
          }
        }

        @media(prefers-reduced-motion: reduce) {
          .ad-page,
          .ad-card,
          .ad-card-icon,
          .ad-card::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="ad-heading">
        <div>
          <p className="ad-kicker">
            <ShieldCheck size={14} />
            ADMINISTRATION WORKSPACE
          </p>

          <h1>Admin Portal Overview</h1>

          <p>
            Manage your department's academic and administrative operations
            from one place.
          </p>
        </div>

        <div className="ad-date">
          <span>TODAY</span>
          <strong>{dateLabel}</strong>
        </div>
      </div>

      <section className="ad-welcome">
        <div>
          <small>WELCOME TO YOUR WORKSPACE</small>
          <h2>Good to see you, Admin.</h2>
          <p>
            Select a section below to continue managing department operations.
          </p>
        </div>

        <div className="ad-welcome-icon">
          <ShieldCheck size={28} />
        </div>
      </section>

      <div className="ad-section-heading">
        <h2>Administration Sections</h2>
        <span>04 WORKSPACES</span>
      </div>

      <div className="ad-card-grid">
        {ADMIN_CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              to={card.path}
              className="ad-card"
              key={card.path}
            >
              <div className="ad-card-top">
                <div className="ad-card-icon">
                  <Icon size={23} />
                </div>

                <span className="ad-card-tag">
                  {card.tag}
                </span>
              </div>

              <span className="ad-card-number">
                {card.number}
              </span>

              <h3>{card.title}</h3>

              <p>{card.description}</p>

              <ul>
                {card.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <span className="ad-card-link">
                Open section
                <ArrowUpRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="ad-bottom-note">
        <CalendarDays size={18} />
        <span>
          <strong>Administration:</strong> Use the navigation menu to move
          between the dashboard and the different management sections.
        </span>
      </div>
    </div>
  );
}