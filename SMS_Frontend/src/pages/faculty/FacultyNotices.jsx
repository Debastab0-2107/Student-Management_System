
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell, CalendarDays, X, Info, ArrowLeft,
  ArrowUpRight, Megaphone, BookOpen, Users,
  PartyPopper, ClipboardList, Clock3, Pin,
} from "lucide-react";

export default function FacultyNotices() {
  const navigate = useNavigate();
  const location = useLocation();

  const base = location.pathname.includes("/visiting/")
    ? "/faculty/visiting"
    : "/faculty/permanent";

  const [showWarning, setShowWarning] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (
      !localStorage.getItem("sms_token") ||
      localStorage.getItem("sms_role") !== "TEACHER"
    ) {
      navigate("/login/faculty", { replace: true });
    }
  }, [navigate]);

  const notices = [
    {
      id: 1,
      category: "Academic",
      date: "12 November 2026",
      title: "Academic Schedule Announcement",
      description: "Faculty members are requested to review the academic schedule and coordinate their respective classes.",
      details: "Please review the academic calendar and make the necessary arrangements for your scheduled classes. This is sample announcement content for the faculty portal preview. The final schedule and any official instructions will be published by the department.",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=85",
      size: "large",
      icon: BookOpen,
      pinned: true,
    },
    {
      id: 2,
      category: "Department",
      date: "10 November 2026",
      title: "Department Faculty Meeting",
      description: "A demonstration announcement for a department meeting, agenda and faculty coordination.",
      details: "Faculty members are requested to keep time available for the upcoming department meeting. The meeting date, venue and agenda will be updated by the department. This notice is currently for design preview only.",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=85",
      size: "small",
      icon: Users,
    },
    {
      id: 3,
      category: "Events",
      date: "06 November 2026",
      title: "Academic Event Information",
      description: "Information about an upcoming academic event and faculty participation.",
      details: "This sample notice represents event-related updates such as seminars, workshops, academic celebrations and department programmes. Official event details will be published here when the notice module is connected.",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=85",
      size: "medium",
      icon: PartyPopper,
    },
    {
      id: 4,
      category: "Academic",
      date: "04 November 2026",
      title: "Internal Assessment Coordination",
      description: "A sample reminder about internal assessment planning and academic coordination.",
      details: "Faculty members may use this section for internal assessment-related announcements, evaluation schedules and coordination instructions. No actual assessment date or instruction is being announced through this demonstration notice.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85",
      size: "small",
      icon: ClipboardList,
    },
    {
      id: 5,
      category: "Department",
      date: "02 November 2026",
      title: "Faculty Information Update",
      description: "Keep your registered contact and educational information up to date.",
      details: "This sample notice reminds faculty members to review the information displayed in their Teacher Profile. If any protected information needs correction, please contact the administrator. Editable profile fields can be updated through the Profile page, subject to backend support.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
      size: "medium",
      icon: Users,
    },
    {
      id: 6,
      category: "Events",
      date: "29 October 2026",
      title: "Workshop and Seminar Updates",
      description: "A place for upcoming workshops, seminars and academic enrichment activities.",
      details: "The faculty notice board can be used to publish workshop invitations, seminar schedules, participation information and related academic activities. This is only sample content.",
      image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1000&q=85",
      size: "small",
      icon: PartyPopper,
    },
    {
      id: 7,
      category: "Academic",
      date: "26 October 2026",
      title: "Teaching Plan Reminder",
      description: "Review the teaching plan and keep course-related academic records organised.",
      details: "This demonstration announcement represents reminders about teaching plans, syllabus progress and academic documentation. Official instructions will be added by the department when the notice system is available.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=85",
      size: "medium",
      icon: BookOpen,
    },
    {
      id: 8,
      category: "Department",
      date: "22 October 2026",
      title: "Department Coordination Notice",
      description: "General department updates and information for faculty members.",
      details: "This sample notice represents general departmental communication. The department may publish administrative reminders, faculty coordination information and other important updates in this space.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=85",
      size: "small",
      icon: Megaphone,
    },
  ];

  const categories = ["All", "Academic", "Department", "Events"];

  const visibleNotices =
    activeCategory === "All"
      ? notices
      : notices.filter((item) => item.category === activeCategory);

  const featuredNotice = notices[0];

  return (
    <div className="fn-page">
      <style>{`
        .fn-page,.fn-page *{box-sizing:border-box}
        .fn-page{
          min-height:100vh;
          padding:26px clamp(14px,4vw,48px) 45px;
          background:
            radial-gradient(ellipse at 5% 5%,#e7eaf3 0,transparent 34%),
            radial-gradient(ellipse at 95% 90%,#f1e7d8 0,transparent 35%),
            #f4f5f9;
          color:#202945;
          font-family:Inter,Arial,sans-serif;
        }
        .fn-wrap{max-width:1200px;margin:auto}
        .fn-back{
          display:inline-flex;align-items:center;gap:8px;
          margin-bottom:23px;padding:8px 0;border:0;
          background:none;color:#92713b;font-size:12px;
          font-weight:800;cursor:pointer;
        }
        .fn-heading{
          display:flex;align-items:flex-end;justify-content:space-between;
          gap:15px;margin-bottom:25px;
        }
        .fn-kicker{
          margin:0 0 8px;color:#a17c3e;font-size:10px;
          font-weight:800;letter-spacing:1.8px;
        }
        .fn-heading h1{
          margin:0;font-size:clamp(28px,4vw,40px);
          letter-spacing:-1.2px;
        }
        .fn-heading p{
          margin:9px 0 0;color:#81899b;font-size:12px;line-height:1.8;
        }
        .fn-count{
          padding:9px 13px;border:1px solid #eadfc9;
          border-radius:30px;background:#fbf5e9;color:#8c6b32;
          font-size:10px;font-weight:800;white-space:nowrap;
        }
        .fn-feature{
          position:relative;overflow:hidden;min-height:300px;
          display:flex;align-items:flex-end;margin-bottom:25px;
          border-radius:21px;
          background:
            linear-gradient(90deg,#18233bed 0%,#18233b9c 55%,#18233b20 100%),
            url("https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1600&q=85") center/cover;
          color:white;box-shadow:0 18px 40px #20294520;
        }
        .fn-feature:after{
          content:"";position:absolute;width:250px;height:250px;
          right:-70px;top:-125px;border:1px solid #ffffff30;
          border-radius:50%;box-shadow:0 0 0 25px #ffffff0a,0 0 0 55px #ffffff08;
        }
        .fn-feature-content{position:relative;z-index:1;max-width:680px;padding:32px}
        .fn-feature-label{
          display:inline-flex;align-items:center;gap:7px;padding:8px 11px;
          border:1px solid #ffffff45;border-radius:30px;
          background:#ffffff18;font-size:9px;font-weight:800;letter-spacing:1px;
        }
        .fn-feature h2{margin:17px 0 9px;font-size:clamp(23px,3vw,32px)}
        .fn-feature p{margin:0;color:#e0e5ef;font-size:12px;line-height:1.8}
        .fn-feature-meta{
          display:flex;align-items:center;gap:8px;margin-top:17px;
          color:#f0d7a7;font-size:10px;font-weight:700;
        }
        .fn-feature-open{
          display:inline-flex;align-items:center;gap:7px;margin-top:19px;
          padding:10px 13px;border:1px solid #ffffff50;border-radius:8px;
          background:#ffffff18;color:white;font-size:10px;font-weight:800;cursor:pointer;
        }
        .fn-section-head{
          display:flex;align-items:center;justify-content:space-between;
          gap:12px;margin-bottom:14px;
        }
        .fn-section-head h2{margin:0;font-size:16px}
        .fn-section-head span{color:#9299a8;font-size:10px}
        .fn-filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
        .fn-filter{
          padding:9px 14px;border:1px solid #e3e6ed;
          border-radius:30px;background:white;color:#687286;
          font-size:10px;font-weight:800;cursor:pointer;
        }
        .fn-filter.active{border-color:#202945;background:#202945;color:white}
        .fn-grid{
          columns:3 270px;
          column-gap:17px;
        }
        .fn-card{
          display:inline-block;width:100%;overflow:hidden;
          margin:0 0 17px;break-inside:avoid;
          border:1px solid #e8eaf0;border-radius:15px;
          background:white;box-shadow:0 5px 20px #20294508;
          transition:transform .2s,box-shadow .2s;
        }
        .fn-card:hover{
          transform:translateY(-4px);
          box-shadow:0 12px 28px #20294514;
        }
        .fn-image{position:relative;height:165px;overflow:hidden;background:#e8eaf0}
        .fn-card.large .fn-image{height:220px}
        .fn-card.medium .fn-image{height:185px}
        .fn-image img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .fn-card:hover .fn-image img{transform:scale(1.045)}
        .fn-image-tag{
          position:absolute;left:13px;top:13px;padding:7px 10px;
          border-radius:30px;background:#202945e8;color:white;
          font-size:9px;font-weight:800;
        }
        .fn-pin{
          position:absolute;right:12px;top:12px;width:30px;height:30px;
          display:grid;place-items:center;border-radius:9px;
          background:#ffffffeb;color:#a17c3e;
        }
        .fn-card-body{padding:18px}
        .fn-date{display:flex;align-items:center;gap:6px;color:#9a855d;font-size:10px;font-weight:700}
        .fn-card h3{margin:11px 0 8px;color:#26314b;font-size:15px;line-height:1.45}
        .fn-card p{margin:0;color:#81899b;font-size:11px;line-height:1.8}
        .fn-read{
          display:inline-flex;align-items:center;gap:7px;margin-top:15px;
          padding:0;border:0;background:none;color:#9b7639;
          font-size:10px;font-weight:800;cursor:pointer;
        }
        .fn-footer{margin-top:25px;color:#9ba2af;font-size:10px;text-align:center}
        .fn-overlay{
          position:fixed;z-index:1000;inset:0;display:grid;
          place-items:center;padding:18px;background:#101a31b8;
          backdrop-filter:blur(8px);
        }
        .fn-modal{
          width:100%;max-width:520px;max-height:90vh;overflow:auto;
          padding:25px;border:1px solid #eee8dc;border-radius:18px;
          background:white;box-shadow:0 25px 80px #0003;
        }
        .fn-modal-icon{
          width:55px;height:55px;display:grid;place-items:center;
          margin-bottom:18px;border-radius:16px;background:#f7f0e3;color:#a27b38;
        }
        .fn-modal h2{margin:0;color:#202945;font-size:21px}
        .fn-modal p{margin:12px 0 22px;color:#778196;font-size:12px;line-height:1.8}
        .fn-modal-action{
          width:100%;padding:13px;border:0;border-radius:9px;
          background:#202945;color:white;font-size:12px;font-weight:800;cursor:pointer;
        }
        .fn-detail-image{
          width:100%;max-height:250px;object-fit:cover;
          border-radius:11px;margin:10px 0 16px;
        }
        .fn-detail-close{
          float:right;width:34px;height:34px;display:grid;place-items:center;
          border:0;border-radius:8px;background:#f1f2f5;color:#59647a;cursor:pointer;
        }
        .fn-detail-category{
          display:inline-block;margin:12px 0 0;padding:6px 10px;
          border-radius:20px;background:#f7f0e3;color:#9b7639;
          font-size:9px;font-weight:800;
        }
        @media(max-width:650px){
          .fn-page{padding:18px 13px 35px}
          .fn-heading{align-items:flex-start;flex-direction:column}
          .fn-feature{min-height:260px}
          .fn-feature-content{padding:23px}
          .fn-grid{columns:1}
          .fn-image,.fn-card.large .fn-image,.fn-card.medium .fn-image{height:190px}
        }
      `}</style>

      <div className="fn-wrap">
        <button className="fn-back" onClick={() => navigate(`${base}/dashboard`)}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <header className="fn-heading">
          <div>
            <p className="fn-kicker">FACULTY INFORMATION CENTRE</p>
            <h1>Notice Board</h1>
            <p>Department announcements, academic updates and important information.</p>
          </div>
          <span className="fn-count">{notices.length} Sample Notices</span>
        </header>

        <section className="fn-feature">
          <div className="fn-feature-content">
            <span className="fn-feature-label"><Bell size={13} /> DEPARTMENT UPDATES</span>
            <h2>Stay informed. Stay connected.</h2>
            <p>Keep up with academic announcements, faculty activities and department information in one place.</p>
            <div className="fn-feature-meta"><Pin size={13} /> Featured department announcement</div>
            <button className="fn-feature-open" onClick={() => setSelectedNotice(featuredNotice)}>
              Read featured notice <ArrowUpRight size={14} />
            </button>
          </div>
        </section>

        <div className="fn-section-head">
          <h2>Latest Announcements</h2>
          <span>{visibleNotices.length} notices displayed</span>
        </div>

        <div className="fn-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`fn-filter ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <section className="fn-grid">
          {visibleNotices.map((notice) => {
            const Icon = notice.icon;

            return (
              <article className={`fn-card ${notice.size}`} key={notice.id}>
                <div className="fn-image">
                  <img src={notice.image} alt={notice.title} />
                  <span className="fn-image-tag">{notice.category}</span>
                  {notice.pinned && <span className="fn-pin"><Pin size={14} /></span>}
                </div>

                <div className="fn-card-body">
                  <div className="fn-date"><CalendarDays size={13} /> {notice.date}</div>
                  <h3>{notice.title}</h3>
                  <p>{notice.description}</p>
                  <button className="fn-read" onClick={() => setSelectedNotice(notice)}>
                    <Icon size={13} /> Read full notice <ArrowUpRight size={13} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <div className="fn-footer">DPP Institute of Technology · Faculty Notice Board</div>
      </div>

      {showWarning && (
        <div className="fn-overlay">
          <div className="fn-modal">
            <div className="fn-modal-icon"><Info size={25} /></div>
            <h2>Notice Board Preview</h2>
            <p>
              This is a demonstration page. The notices and dates currently shown are sample content.
              Live department notices will be connected after the backend notice module is ready.
            </p>
            <button className="fn-modal-action" onClick={() => setShowWarning(false)}>
              Okay, continue
            </button>
          </div>
        </div>
      )}

      {selectedNotice && (
        <div className="fn-overlay" onClick={() => setSelectedNotice(null)}>
          <div className="fn-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fn-detail-close" onClick={() => setSelectedNotice(null)}>
              <X size={17} />
            </button>
            <img className="fn-detail-image" src={selectedNotice.image} alt={selectedNotice.title} />
            <div className="fn-date"><CalendarDays size={13} /> {selectedNotice.date}</div>
            <span className="fn-detail-category">{selectedNotice.category}</span>
            <h2 style={{ marginTop: 12 }}>{selectedNotice.title}</h2>
            <p>{selectedNotice.details}</p>
            <button className="fn-modal-action" onClick={() => setSelectedNotice(null)}>
              Close Notice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
