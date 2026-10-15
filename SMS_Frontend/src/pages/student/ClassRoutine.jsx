import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { getClassesForNamedDay, ROUTINE_DAYS, SECTION_NAMES } from "./routineData";

export default function ClassRoutine() {
  const [section, setSection] = useState("Section A");
  const [dayFilter, setDayFilter] = useState("All days");

  const visibleDays = useMemo(
    () => dayFilter === "All days" ? ROUTINE_DAYS : [dayFilter],
    [dayFilter]
  );

  return (
    <div className="routine-page">
      <style>{`
        .routine-page { min-height:100vh; padding:30px clamp(18px,3vw,38px) 42px; color:#252c43; background:#f7f8fb; font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; }
        .routine-wrap { max-width:1500px; margin:0 auto; }
        .routine-topline { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:26px; }
        .routine-back { display:inline-flex; align-items:center; gap:8px; color:#86632c; font-size:12px; font-weight:700; text-decoration:none; }
        .routine-eyebrow { color:#a77e36; font-size:10px; font-weight:800; letter-spacing:1.8px; }
        .routine-page h1 { margin:9px 0; color:#202945; font-size:clamp(25px,3vw,36px); letter-spacing:-.8px; }
        .routine-intro { max-width:700px; margin:0; color:#81899d; font-size:13px; line-height:1.8; }
        .routine-controls { display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin:25px 0 20px; padding:16px; background:#fff; border:1px solid #e9ebf1; border-radius:15px; }
        .routine-control-label { display:grid; gap:6px; color:#8b91a4; font-size:10px; font-weight:700; }
        .routine-control-label select { min-width:150px; padding:10px 12px; color:#303752; background:#fff; border:1px solid #e5e8ef; border-radius:8px; font:inherit; font-size:12px; }
        .routine-section-tabs { display:flex; flex-wrap:wrap; gap:8px; margin-left:auto; }
        .routine-section-tabs button { padding:10px 14px; color:#667089; background:#f7f8fb; border:1px solid #e8eaf0; border-radius:9px; font-size:11px; font-weight:800; cursor:pointer; }
        .routine-section-tabs button.active { color:#fff; background:#202945; border-color:#202945; }
        .routine-table-card { overflow:hidden; background:#fff; border:1px solid #e7eaf1; border-radius:15px; box-shadow:0 8px 28px rgba(35,45,75,.035); }
        .routine-table-scroll { overflow-x:auto; }
        .routine-table { width:100%; min-width:950px; border-collapse:collapse; table-layout:fixed; }
        .routine-table th { padding:13px 10px; color:#fff; background:#202945; font-size:11px; font-weight:800; text-align:left; }
        .routine-table th:first-child { width:125px; }
        .routine-table td { padding:12px 10px; vertical-align:top; border-bottom:1px solid #edf0f5; border-right:1px solid #edf0f5; }
        .routine-table tr:last-child td { border-bottom:0; }
        .routine-day { color:#343b57; background:#fafbfe; font-size:12px; font-weight:800; }
        .routine-empty { color:#a1a7b6; font-size:11px; }
        .routine-class { padding:10px; border:1px solid #e9ebf1; border-left:3px solid #c19a52; border-radius:9px; background:#fffdf9; }
        .routine-class + .routine-class { margin-top:8px; }
        .routine-class-code { display:block; color:#303752; font-size:11px; font-weight:800; line-height:1.5; overflow-wrap:anywhere; }
        .routine-class-name { margin:4px 0; color:#7d8498; font-size:10px; line-height:1.5; }
        .routine-class-meta { display:flex; flex-wrap:wrap; gap:5px 10px; color:#9a7b45; font-size:9px; line-height:1.5; }
        .routine-note { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:15px; color:#737c91; background:#f0f2f7; border-radius:10px; font-size:11px; line-height:1.7; }
        .routine-note svg { flex-shrink:0; color:#a77e36; }
        @media(max-width:650px) { .routine-topline { align-items:flex-start; flex-direction:column; } .routine-controls { align-items:stretch; flex-direction:column; } .routine-control-label select { width:100%; } .routine-section-tabs { margin-left:0; } .routine-section-tabs button { flex:1; } }
      `}</style>
      <div className="routine-wrap">
        <div className="routine-topline">
          <div>
            <span className="routine-eyebrow">MCA DEPARTMENT</span>
            <h1>MCA 3rd Semester Class Routine</h1>
            <p className="routine-intro">Complete weekly timetable for Sections A and B. Choose a section and a day to view the scheduled classes.</p>
          </div>
          <Link className="routine-back" to="/student/dashboard"><ArrowLeft size={15} /> Back to dashboard</Link>
        </div>

        <div className="routine-controls">
          <label className="routine-control-label">VIEW DAY
            <select value={dayFilter} onChange={(event) => setDayFilter(event.target.value)}>
              <option>All days</option>
              {ROUTINE_DAYS.map((day) => <option key={day}>{day}</option>)}
            </select>
          </label>
          <div className="routine-section-tabs" aria-label="Choose section">
            {SECTION_NAMES.map((item) => <button type="button" key={item} className={section === item ? "active" : ""} aria-pressed={section === item} onClick={() => setSection(item)}>{item}</button>)}
          </div>
        </div>

        <div className="routine-table-card">
          <div className="routine-table-scroll">
            <table className="routine-table">
              <thead><tr><th>Day</th><th>Time</th><th>Course</th><th>Details</th><th>Faculty / Section</th><th>Room</th></tr></thead>
              <tbody>
                {visibleDays.map((day) => {
                  const classes = getClassesForNamedDay(day, section);
                  if (!classes.length) return <tr key={day}><td className="routine-day">{day}</td><td colSpan="5" className="routine-empty">No classes scheduled.</td></tr>;
                  return classes.map((item, index) => (
                    <tr key={`${day}-${item.start}-${item.code}`}>
                      {index === 0 && <td className="routine-day" rowSpan={classes.length}>{day}</td>}
                      <td><span className="routine-class-meta"><Clock3 size={12} /> {item.start} – {item.end}</span></td>
                      <td><strong className="routine-class-code">{item.code}</strong></td>
                      <td><div className="routine-class-name">{item.name}</div></td>
                      <td><div className="routine-class-meta">{item.faculty}</div></td>
                      <td><div className="routine-class-meta">{item.room}</div></td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="routine-note"><CalendarDays size={16} /><span>Monday, Thursday and Friday have no classes listed in the supplied timetable. Please verify elective and practical-group assignments with the department before treating this transcription as the official schedule.</span></div>
      </div>
    </div>
  );
}
