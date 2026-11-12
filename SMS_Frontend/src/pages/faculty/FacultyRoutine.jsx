import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, CalendarDays, Clock3, MapPin, BookOpen,
  Info, GraduationCap, ChevronRight, Monitor,
  FlaskConical, CalendarCheck,
} from "lucide-react";

export default function FacultyRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const base = location.pathname.includes("/visiting/")
    ? "/faculty/visiting"
    : "/faculty/permanent";

  const [showWarning, setShowWarning] = useState(true);
  const [selectedDay, setSelectedDay] = useState("All");

  useEffect(() => {
    if (
      !localStorage.getItem("sms_token") ||
      localStorage.getItem("sms_role") !== "TEACHER"
    ) {
      navigate("/login/faculty", { replace: true });
    }
  }, [navigate]);

  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const classes = [
    {
      id: 1,
      day: "Monday",
      start: "10:00 AM",
      end: "11:00 AM",
      subject: "MCA Subject",
      semester: "Semester details pending",
      room: "Room details pending",
      type: "Lecture",
    },
    {
      id: 2,
      day: "Tuesday",
      start: "11:00 AM",
      end: "12:00 PM",
      subject: "MCA Subject",
      semester: "Semester details pending",
      room: "Room details pending",
      type: "Lecture",
    },
    {
      id: 3,
      day: "Wednesday",
      start: "02:00 PM",
      end: "03:00 PM",
      subject: "MCA Subject",
      semester: "Semester details pending",
      room: "Room details pending",
      type: "Practical",
    },
  ];

  const visibleClasses =
    selectedDay === "All"
      ? classes
      : classes.filter((item) => item.day === selectedDay);

  const dayCounts = days
    .filter((day) => day !== "All")
    .map((day) => ({
      day,
      count: classes.filter((item) => item.day === day).length,
    }));

  return (
    <div className="fr-page">
      <style>{`
        .fr-page,.fr-page *{box-sizing:border-box}
        .fr-page{
          min-height:100vh;
          padding:26px clamp(14px,4vw,48px) 45px;
          color:#202945;
          font-family:Inter,Arial,sans-serif;
          background:
            radial-gradient(ellipse at 5% 5%,#e4e9f4 0,transparent 35%),
            radial-gradient(ellipse at 95% 90%,#f0e5d2 0,transparent 34%),
            #f4f5f9;
        }
        .fr-wrap{max-width:1200px;margin:auto}
        .fr-back{
          display:inline-flex;align-items:center;gap:8px;
          margin-bottom:23px;padding:8px 0;border:0;
          background:none;color:#92713b;font-size:12px;
          font-weight:800;cursor:pointer;
        }
        .fr-heading{margin-bottom:24px}
        .fr-kicker{
          margin:0 0 8px;color:#a17c3e;font-size:10px;
          font-weight:800;letter-spacing:1.8px;
        }
        .fr-heading h1{
          margin:0;font-size:clamp(28px,4vw,40px);
          letter-spacing:-1.2px;
        }
        .fr-heading p{
          margin:9px 0 0;color:#81899b;font-size:12px;line-height:1.8;
        }
        .fr-hero{
          position:relative;overflow:hidden;display:flex;
          align-items:center;justify-content:space-between;
          gap:20px;margin-bottom:22px;padding:30px;
          border-radius:20px;
          background:
            radial-gradient(circle at 85% 20%,#c19a5235,transparent 25%),
            linear-gradient(115deg,#202945,#344366);
          color:white;box-shadow:0 15px 40px #20294518;
        }
        .fr-hero:after{
          content:"";position:absolute;width:240px;height:240px;
          right:-60px;top:-120px;border:1px solid #ffffff25;
          border-radius:50%;box-shadow:0 0 0 25px #ffffff08,0 0 0 55px #ffffff06;
        }
        .fr-hero-content{position:relative;z-index:1}
        .fr-hero-label{
          display:flex;align-items:center;gap:8px;
          color:#e9ce99;font-size:10px;font-weight:800;
          letter-spacing:1.5px;
        }
        .fr-hero h2{margin:14px 0 8px;font-size:clamp(19px,3vw,25px)}
        .fr-hero p{max-width:600px;margin:0;color:#d3d9e5;font-size:12px;line-height:1.8}
        .fr-hero-icon{
          position:relative;z-index:1;width:65px;height:65px;
          display:grid;place-items:center;flex-shrink:0;
          border:1px solid #ffffff35;border-radius:18px;
          background:#ffffff15;color:#efd49c;
        }
        .fr-summary{
          display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
          gap:13px;margin-bottom:24px;
        }
        .fr-summary-card{
          display:flex;align-items:center;gap:13px;padding:17px;
          border:1px solid #e8eaf0;border-radius:13px;background:white;
        }
        .fr-summary-icon{
          width:42px;height:42px;display:grid;place-items:center;
          flex-shrink:0;border-radius:12px;background:#f7f0e3;color:#a17c3e;
        }
        .fr-summary-card strong{display:block;color:#293550;font-size:18px}
        .fr-summary-card span{display:block;margin-top:4px;color:#9299a8;font-size:10px}
        .fr-section-head{
          display:flex;align-items:center;justify-content:space-between;
          gap:12px;margin-bottom:13px;
        }
        .fr-section-head h3{margin:0;font-size:14px}
        .fr-section-head span{color:#9299a8;font-size:10px}
        .fr-filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:17px}
        .fr-filter{
          display:flex;align-items:center;gap:7px;padding:9px 13px;
          border:1px solid #e3e6ed;border-radius:30px;
          background:white;color:#687286;font-size:10px;
          font-weight:800;cursor:pointer;
        }
        .fr-filter.active{border-color:#202945;background:#202945;color:white}
        .fr-filter-count{
          min-width:18px;height:18px;display:grid;place-items:center;
          padding:0 5px;border-radius:20px;background:#f0f1f4;color:#657087;
          font-size:9px;
        }
        .fr-filter.active .fr-filter-count{background:#ffffff25;color:white}
        .fr-table-card{
          overflow:hidden;border:1px solid #e8eaf0;border-radius:15px;
          background:white;box-shadow:0 5px 20px #20294508;
        }
        .fr-table-head{
          display:flex;align-items:center;justify-content:space-between;
          gap:12px;padding:19px 20px;border-bottom:1px solid #eef0f4;
        }
        .fr-table-head h3{margin:0;font-size:14px}
        .fr-table-head span{color:#9a855d;font-size:10px;font-weight:800}
        .fr-table-wrap{width:100%;overflow-x:auto}
        .fr-table{width:100%;min-width:740px;border-collapse:collapse;text-align:left}
        .fr-table th{
          padding:14px 16px;background:#f8f7f3;color:#8b7449;
          font-size:9px;letter-spacing:.7px;text-transform:uppercase;
        }
        .fr-table td{
          padding:17px 16px;border-bottom:1px solid #eef0f4;
          color:#687286;font-size:11px;
        }
        .fr-table tr:last-child td{border-bottom:0}
        .fr-day{color:#293550!important;font-weight:800}
        .fr-time{display:flex;align-items:center;gap:7px;white-space:nowrap;color:#52617c}
        .fr-subject{color:#35415a;font-weight:800}
        .fr-type{
          display:inline-flex;align-items:center;gap:5px;padding:6px 9px;
          border-radius:20px;background:#f7f0e3;color:#9b7639;
          font-size:9px;font-weight:800;
        }
        .fr-mobile-list{display:none;padding:12px}
        .fr-class-card{
          margin-bottom:10px;padding:15px;border:1px solid #eceef3;
          border-radius:12px;background:#fff;
        }
        .fr-class-top{
          display:flex;align-items:center;justify-content:space-between;
          gap:10px;margin-bottom:13px;
        }
        .fr-class-top strong{font-size:12px;color:#293550}
        .fr-class-card h4{margin:0 0 12px;color:#35415a;font-size:14px}
        .fr-class-meta{
          display:grid;grid-template-columns:1fr 1fr;gap:10px;
          color:#778196;font-size:10px;
        }
        .fr-class-meta span{display:flex;align-items:center;gap:6px}
        .fr-empty{padding:40px 15px;text-align:center;color:#8991a1;font-size:12px}
        .fr-empty svg{display:block;margin:0 auto 10px;color:#b28a47}
        .fr-info{
          display:flex;align-items:flex-start;gap:10px;margin-top:18px;
          padding:14px;border:1px solid #eee8dc;border-radius:10px;
          background:#fbf9f4;color:#747f92;font-size:11px;line-height:1.7;
        }
        .fr-info svg{flex-shrink:0;color:#a17c3e}
        .fr-footer{margin-top:25px;color:#9ba2af;font-size:10px;text-align:center}
        .fr-overlay{
          position:fixed;z-index:1000;inset:0;display:grid;place-items:center;
          padding:18px;background:#101a31b8;backdrop-filter:blur(8px);
        }
        .fr-modal{
          width:100%;max-width:450px;padding:28px;border:1px solid #eee8dc;
          border-radius:18px;background:white;box-shadow:0 25px 80px #0003;
        }
        .fr-modal-icon{
          width:55px;height:55px;display:grid;place-items:center;
          margin-bottom:18px;border-radius:16px;background:#f7f0e3;color:#a27b38;
        }
        .fr-modal h2{margin:0;color:#202945;font-size:21px}
        .fr-modal p{margin:12px 0 22px;color:#778196;font-size:12px;line-height:1.8}
        .fr-modal button{
          width:100%;padding:13px;border:0;border-radius:9px;
          background:#202945;color:white;font-size:12px;font-weight:800;cursor:pointer;
        }
        @media(max-width:850px){
          .fr-summary{grid-template-columns:1fr 1fr}
          .fr-table-wrap{display:none}
          .fr-mobile-list{display:block}
        }
        @media(max-width:560px){
          .fr-page{padding:18px 13px 35px}
          .fr-hero{padding:22px}
          .fr-hero-icon{width:49px;height:49px}
          .fr-summary{grid-template-columns:1fr}
          .fr-table-head{align-items:flex-start;flex-direction:column}
          .fr-class-meta{grid-template-columns:1fr}
        }
      `}</style>

      <div className="fr-wrap">
        <button className="fr-back" onClick={() => navigate(`${base}/dashboard`)}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <header className="fr-heading">
          <p className="fr-kicker">FACULTY SCHEDULE</p>
          <h1>Class Routine</h1>
          <p>View your weekly teaching schedule, class timings and classroom information.</p>
        </header>

        <section className="fr-hero">
          <div className="fr-hero-content">
            <div className="fr-hero-label"><CalendarCheck size={14} /> WEEKLY SCHEDULE</div>
            <h2>Your Teaching Week, Organised.</h2>
            <p>Keep track of your lectures, practical sessions and assigned classrooms from one place.</p>
          </div>
          <div className="fr-hero-icon"><CalendarDays size={30} /></div>
        </section>

        <section className="fr-summary">
          <div className="fr-summary-card">
            <div className="fr-summary-icon"><BookOpen size={19} /></div>
            <div><strong>{classes.length}</strong><span>Sample classes listed</span></div>
          </div>
          <div className="fr-summary-card">
            <div className="fr-summary-icon"><CalendarDays size={19} /></div>
            <div><strong>{dayCounts.filter((item) => item.count > 0).length}</strong><span>Days with classes</span></div>
          </div>
          <div className="fr-summary-card">
            <div className="fr-summary-icon"><Clock3 size={19} /></div>
            <div><strong>Weekly</strong><span>Schedule overview</span></div>
          </div>
        </section>

        <div className="fr-section-head">
          <h3>Weekly Timetable</h3>
          <span>Filter by day</span>
        </div>

        <div className="fr-filters">
          {days.map((day) => {
            const count = day === "All"
              ? classes.length
              : classes.filter((item) => item.day === day).length;

            return (
              <button
                key={day}
                className={`fr-filter ${selectedDay === day ? "active" : ""}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
                <span className="fr-filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        <section className="fr-table-card">
          <div className="fr-table-head">
            <h3>{selectedDay === "All" ? "All Scheduled Classes" : `${selectedDay}'s Classes`}</h3>
            <span>DEMONSTRATION SCHEDULE</span>
          </div>

          {visibleClasses.length > 0 ? (
            <>
              <div className="fr-table-wrap">
                <table className="fr-table">
                  <thead>
                    <tr>
                      <th>Day</th><th>Time</th><th>Subject</th>
                      <th>Semester</th><th>Room</th><th>Class Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleClasses.map((item) => (
                      <tr key={item.id}>
                        <td className="fr-day">{item.day}</td>
                        <td><span className="fr-time"><Clock3 size={13} />{item.start} – {item.end}</span></td>
                        <td className="fr-subject">{item.subject}</td>
                        <td>{item.semester}</td>
                        <td><span className="fr-time"><MapPin size={13} />{item.room}</span></td>
                        <td>
                          <span className="fr-type">
                            {item.type === "Practical" ? <FlaskConical size={12} /> : <Monitor size={12} />}
                            {item.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="fr-mobile-list">
                {visibleClasses.map((item) => (
                  <article className="fr-class-card" key={item.id}>
                    <div className="fr-class-top">
                      <strong>{item.day}</strong>
                      <span className="fr-type">
                        {item.type === "Practical" ? <FlaskConical size={12} /> : <Monitor size={12} />}
                        {item.type}
                      </span>
                    </div>
                    <h4>{item.subject}</h4>
                    <div className="fr-class-meta">
                      <span><Clock3 size={13} />{item.start} – {item.end}</span>
                      <span><MapPin size={13} />{item.room}</span>
                      <span><GraduationCap size={13} />{item.semester}</span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="fr-empty">
              <CalendarDays size={28} />
              No demonstration classes are listed for {selectedDay}.
            </div>
          )}
        </section>

        <div className="fr-info">
          <Info size={17} />
          This is sample timetable data for page design and testing. It is not the official MCA department routine. The actual timetable can be added when you provide the department timetable.
        </div>

        <div className="fr-footer">DPP Institute of Technology · Faculty Portal</div>
      </div>

      {showWarning && (
        <div className="fr-overlay">
          <div className="fr-modal">
            <div className="fr-modal-icon"><Info size={25} /></div>
            <h2>Routine Preview</h2>
            <p>
              This page currently contains a sample weekly timetable for demonstration.
              It is not your official teaching schedule. The actual routine will be added
              when the department timetable is provided.
            </p>
            <button onClick={() => setShowWarning(false)}>Okay, continue</button>
          </div>
        </div>
      )}
    </div>
  );
}
