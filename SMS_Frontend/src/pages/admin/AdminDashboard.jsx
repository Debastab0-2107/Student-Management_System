
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  CalendarDays,
  ArrowUpRight,
  ShieldCheck,
  Clock3,
} from "lucide-react";

export default function AdminDashboard() {
  const today = new Date();

  const dateLabel = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const cards = [
    {
      title: "Student Operations",
      description:
        "Manage student records and work with authority-provided student data.",
      features: [
        "Import student records through Excel",
        "Access student operations workspace",
        "Prepare for session-wise management",
      ],
      path: "/admin/students",
      icon: GraduationCap,
      tag: "STUDENT MANAGEMENT",
    },
    {
      title: "Faculty Operations",
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
    },
  ];

  return (
    <div className="ad-page">
      <style>{`
        .ad-page { max-width:1200px; margin:0 auto; }
        .ad-page * { box-sizing:border-box; }

        .ad-heading {
          display:flex; justify-content:space-between; align-items:flex-start;
          gap:20px; flex-wrap:wrap; margin-bottom:30px;
        }

        .ad-kicker {
          display:flex; align-items:center; gap:8px; margin:0 0 12px;
          color:#a27c37; font-size:10px; font-weight:800; letter-spacing:2px;
        }

        .ad-heading h1 {
          margin:0; color:#202945; font-size:clamp(27px,4vw,39px);
          line-height:1.2; letter-spacing:-1.4px;
        }

        .ad-heading p {
          margin:10px 0 0; color:#858ba0; font-size:13px; line-height:1.7;
        }

        .ad-date {
          min-width:190px; padding:14px 18px; border:1px solid #d8c397;
          border-radius:14px; background:#fbf4e7; text-align:center;
          box-shadow:0 8px 25px #2029450c;
        }

        .ad-date span {
          display:block; margin-bottom:5px; color:#a27c37;
          font-size:10px; font-weight:800; letter-spacing:1.3px;
        }

        .ad-date strong { color:#202945; font-size:13px; }

        .ad-welcome {
          position:relative; overflow:hidden; display:flex; align-items:center;
          justify-content:space-between; gap:20px; padding:25px 28px;
          margin-bottom:30px; border:1px solid #ffffffa8; border-radius:19px;
          color:white; background:linear-gradient(110deg,#202945,#354365);
          box-shadow:0 14px 34px #20294520;
        }

        .ad-welcome::after {
          content:""; position:absolute; width:220px; height:220px;
          right:-65px; top:-115px; border:1px solid #ffffff25;
          border-radius:50%;
          box-shadow:0 0 0 24px #ffffff08,0 0 0 50px #ffffff06;
          pointer-events:none;
        }

        .ad-welcome small {
          color:#e6c47f; font-size:9px; font-weight:800; letter-spacing:1.7px;
        }

        .ad-welcome h2 {
          margin:8px 0 5px; color:white; font-size:22px; letter-spacing:-.5px;
        }

        .ad-welcome p {
          margin:0; color:#c2c9d8; font-size:11px; line-height:1.7;
        }

        .ad-welcome-icon {
          z-index:1; width:54px; height:54px; flex-shrink:0;
          display:grid; place-items:center; border:1px solid #e6c47f55;
          border-radius:16px; color:#e6c47f; background:#ffffff0d;
        }

        .ad-section-title {
          display:flex; align-items:center; gap:10px; margin:0 0 16px;
          color:#202945; font-size:16px; font-weight:800;
        }

        .ad-section-title::before {
          content:""; width:4px; height:19px; border-radius:5px;
          background:#c19a52;
        }

        .ad-card-grid {
          display:grid; grid-template-columns:repeat(2,minmax(0,1fr));
          gap:20px;
        }

        .ad-card {
          position:relative; display:flex; flex-direction:column;
          min-height:310px; padding:25px; overflow:hidden;
          border:1px solid #ffffffd6; border-radius:18px;
          color:#202945; background:#ffffffc9;
          box-shadow:0 10px 28px #2029450d;
          text-decoration:none; backdrop-filter:blur(12px);
          transition:transform .24s ease,box-shadow .24s ease,border-color .24s ease;
        }

        .ad-card:hover {
          transform:translateY(-4px); border-color:#c19a5270;
          box-shadow:0 18px 38px #20294518;
        }

        .ad-card-top {
          display:flex; justify-content:space-between; align-items:center;
          gap:10px;
        }

        .ad-card-icon {
          width:56px; height:56px; display:grid; place-items:center;
          border:1px solid #e9d9b6; border-radius:16px;
          color:#a27c37; background:#fbf4e7;
          transition:background .2s,color .2s;
        }

        .ad-card:hover .ad-card-icon {
          color:white; background:#c19a52;
        }

        .ad-card-tag {
          color:#a27c37; font-size:9px; font-weight:800; letter-spacing:1.2px;
        }

        .ad-card h3 {
          margin:23px 0 8px; color:#202945; font-size:20px;
        }

        .ad-card p {
          max-width:440px; margin:0; color:#858ba0;
          font-size:12px; line-height:1.8;
        }

        .ad-card ul {
          display:grid; gap:9px; padding:0; margin:19px 0 22px;
          list-style:none;
        }

        .ad-card li {
          display:flex; align-items:center; gap:9px;
          color:#4f5870; font-size:11px;
        }

        .ad-card li::before {
          content:""; width:5px; height:5px; flex-shrink:0;
          border-radius:50%; background:#c19a52;
        }

        .ad-card-link {
          display:flex; align-items:center; gap:8px; margin-top:auto;
          color:#a27c37; font-size:11px; font-weight:800;
        }

        .ad-bottom-note {
          display:flex; align-items:center; gap:12px; padding:15px 17px;
          margin-top:24px; border:1px solid #ffffffc9; border-radius:13px;
          color:#727b91; background:#ffffff8c; font-size:10px; line-height:1.7;
        }

        .ad-bottom-note svg { flex-shrink:0; color:#a27c37; }

        @media(max-width:760px) {
          .ad-card-grid { grid-template-columns:1fr; }
          .ad-welcome { padding:21px; }
          .ad-heading { margin-bottom:23px; }
        }

        @media(max-width:430px) {
          .ad-date { width:100%; }
          .ad-card { padding:20px; }
        }

        @media(prefers-reduced-motion:reduce) {
          .ad-card, .ad-card-icon { transition:none; }
        }
      `}</style>

      <div className="ad-heading">
        <div>
          <p className="ad-kicker">
            <ShieldCheck size={14} /> ADMINISTRATION WORKSPACE
          </p>
          <h1>Admin Portal Overview</h1>
          <p>Manage department operations from one place.</p>
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
            Choose an operation below to continue managing your department.
          </p>
        </div>
        <div className="ad-welcome-icon">
          <ShieldCheck size={27} />
        </div>
      </section>

      <h2 className="ad-section-title">Workspace</h2>

      <div className="ad-card-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link to={card.path} className="ad-card" key={card.path}>
              <div className="ad-card-top">
                <div className="ad-card-icon">
                  <Icon size={27} />
                </div>
                <span className="ad-card-tag">{card.tag}</span>
              </div>

              <h3>{card.title}</h3>
              <p>{card.description}</p>

              <ul>
                {card.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <span className="ad-card-link">
                Open workspace <ArrowUpRight size={15} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="ad-bottom-note">
        <CalendarDays size={18} />
        <span>
          <strong>Calendar:</strong> The dashboard date is live. We can add
          event and holiday management after defining the calendar data and
          workflow.
        </span>
        <Clock3 size={16} />
      </div>
    </div>
  );
}

