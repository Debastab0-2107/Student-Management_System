import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getClassesForNamedDay,
  ROUTINE_DAYS,
  SECTION_NAMES,
} from "./routineData";
import api from "../../services/api";

export default function ClassRoutine() {
  const [section, setSection] = useState("Section A");
  const [dayFilter, setDayFilter] = useState("All days");
  const [courseCode, setCourseCode] = useState("MCA");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadStudentCourse = async () => {
      try {
        const response = await api.get("/student/profile");
        const profile = response.data || {};

        const detectedCourse = String(
          profile.courseId ||
            profile.courseCode ||
            profile.course?.courseId ||
            profile.course?.courseCode ||
            "MCA"
        )
          .trim()
          .toUpperCase();

        if (active) {
          setCourseCode(detectedCourse === "BCA" ? "BCA" : "MCA");
        }
      } catch (error) {
        console.error("Unable to load student course:", error);
        if (active) setCourseCode("MCA");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStudentCourse();

    return () => {
      active = false;
    };
  }, []);

  const visibleDays = useMemo(
    () => (dayFilter === "All days" ? ROUTINE_DAYS : [dayFilter]),
    [dayFilter]
  );

  const isBCA = courseCode === "BCA";

  return (
    <div className="routine-page">
      <style>{`
        .routine-page {
          min-height: 100vh;
          padding: 32px clamp(16px, 3vw, 42px) 48px;
          color: #252c43;
          background:
            radial-gradient(circle at 5% 5%, rgba(193,154,82,.09), transparent 25%),
            radial-gradient(circle at 95% 90%, rgba(48,59,93,.07), transparent 28%),
            #f4f5f9;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        }

        .routine-wrap {
          max-width: 1500px;
          margin: 0 auto;
        }

        .routine-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .routine-heading {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .routine-heading-mark {
          width: 5px;
          min-width: 5px;
          height: 66px;
          margin-top: 5px;
          border-radius: 10px;
          background: linear-gradient(180deg, #c19a52, #8c672e);
        }

        .routine-eyebrow {
          color: #a77e36;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .routine-page h1 {
          margin: 8px 0 7px;
          color: #202945;
          font-size: clamp(25px, 3vw, 36px);
          font-weight: 850;
          letter-spacing: -1px;
        }

        .routine-intro {
          max-width: 720px;
          margin: 0;
          color: #737d94;
          font-size: 13px;
          line-height: 1.8;
        }

        .routine-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 15px;
          color: #76582d;
          background: #fff;
          border: 1.5px solid #d9c59f;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 3px 10px rgba(32,41,69,.04);
          transition: .2s ease;
          white-space: nowrap;
        }

        .routine-back:hover {
          color: #fff;
          background: #202945;
          border-color: #202945;
          transform: translateY(-2px);
        }

        .routine-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 18px;
          margin: 28px 0 18px;
          padding: 19px 20px;
          background: #fff;
          border: 1.5px solid #d8dce6;
          border-radius: 15px;
          box-shadow: 0 5px 18px rgba(35,45,75,.055);
        }

        .routine-control-label {
          display: grid;
          gap: 8px;
          color: #626d85;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .routine-control-label select {
          min-width: 180px;
          padding: 11px 35px 11px 13px;
          color: #303752;
          background: #fafbfe;
          border: 1.5px solid #cbd1df;
          border-radius: 9px;
          outline: none;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .routine-control-label select:focus {
          border-color: #a77e36;
          box-shadow: 0 0 0 3px rgba(167,126,54,.12);
        }

        .routine-section-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-left: auto;
          padding: 5px;
          background: #f1f3f8;
          border: 1px solid #dce0e9;
          border-radius: 11px;
        }

        .routine-section-tabs button {
          min-width: 105px;
          padding: 10px 15px;
          color: #667089;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
          transition: .2s ease;
        }

        .routine-section-tabs button:hover:not(.active) {
          color: #202945;
          background: #fff;
          border-color: #d6dbe6;
        }

        .routine-section-tabs button.active {
          color: #fff;
          background: #202945;
          border-color: #202945;
          box-shadow: 0 3px 8px rgba(32,41,69,.18);
        }

        .routine-table-card {
          overflow: hidden;
          background: #fff;
          border: 1.5px solid #cbd1df;
          border-radius: 15px;
          box-shadow: 0 8px 26px rgba(35,45,75,.065);
        }

        .routine-table-scroll {
          overflow-x: auto;
        }

        .routine-table {
          width: 100%;
          min-width: 950px;
          border-collapse: separate;
          border-spacing: 0;
          table-layout: fixed;
        }

        .routine-table th {
          padding: 16px 13px;
          color: #fff;
          background: #202945;
          border-right: 1px solid rgba(255,255,255,.18);
          border-bottom: 2px solid #b18b4d;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .8px;
          text-align: left;
          text-transform: uppercase;
        }

        .routine-table th:last-child {
          border-right: 0;
        }

        .routine-table th:first-child {
          width: 125px;
        }

        .routine-table th:nth-child(2) {
          width: 145px;
        }

        .routine-table th:nth-child(3) {
          width: 145px;
        }

        .routine-table th:nth-child(5) {
          width: 180px;
        }

        .routine-table th:nth-child(6) {
          width: 115px;
        }

        .routine-table td {
          padding: 15px 13px;
          vertical-align: middle;
          border-right: 1px solid #dfe3ec;
          border-bottom: 1px solid #dfe3ec;
          transition: background .15s ease;
        }

        .routine-table td:last-child {
          border-right: 0;
        }

        .routine-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .routine-table tbody tr:nth-child(even) td:not(.routine-day) {
          background: #fafbfe;
        }

        .routine-table tbody tr:hover td:not(.routine-day) {
          background: #f4f6fb;
        }

        .routine-day {
          color: #303954;
          background: #f0f2f7;
          border-right: 1.5px solid #cbd1df !important;
          font-size: 12px;
          font-weight: 900;
        }

        .routine-empty {
          color: #858da1;
          background: #fcfcfe;
          font-size: 12px;
          font-style: italic;
        }

        .routine-class-name {
          margin: 4px 0;
          color: #737d94;
          font-size: 11px;
          line-height: 1.6;
        }

        .routine-class-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 5px 8px;
          color: #96733d;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.6;
        }

        .routine-class-code {
          display: inline-block;
          padding: 5px 8px;
          color: #303954;
          background: #f0f2f7;
          border: 1px solid #d9deea;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 900;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .routine-note {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-top: 18px;
          padding: 15px 17px;
          color: #68738a;
          background: #fff;
          border: 1px solid #d8dce6;
          border-left: 4px solid #b18b4d;
          border-radius: 10px;
          box-shadow: 0 3px 12px rgba(35,45,75,.035);
          font-size: 11px;
          line-height: 1.8;
        }

        .routine-note svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: #a77e36;
        }

        .routine-loading {
          padding: 45px 20px;
          color: #737d94;
          background: #fff;
          border: 1.5px solid #d8dce6;
          border-radius: 15px;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
        }

        @media(max-width: 650px) {
          .routine-page {
            padding: 22px 13px 35px;
          }

          .routine-topline {
            align-items: flex-start;
            flex-direction: column;
          }

          .routine-back {
            align-self: flex-start;
          }

          .routine-controls {
            align-items: stretch;
            flex-direction: column;
            padding: 15px;
          }

          .routine-control-label select {
            width: 100%;
          }

          .routine-section-tabs {
            margin-left: 0;
          }

          .routine-section-tabs button {
            flex: 1;
          }
        }
      `}</style>

      <div className="routine-wrap">
        <div className="routine-topline">
          <div className="routine-heading">
            <div className="routine-heading-mark" />
            <div>
              <span className="routine-eyebrow">
                {isBCA ? "BCA DEPARTMENT" : "MCA DEPARTMENT"}
              </span>

              <h1>
                {isBCA ? "BCA Class Routine" : "MCA Class Routine"}
              </h1>

              <p className="routine-intro">
                {loading
                  ? "Loading your department timetable..."
                  : `Complete weekly timetable for ${courseCode} Sections A and B. Choose a section and a day to view the scheduled classes.`}
              </p>
            </div>
          </div>

          <Link className="routine-back" to="/student/dashboard">
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>

        {loading ? (
          <div className="routine-loading">
            Loading your department timetable...
          </div>
        ) : (
          <>
            <div className="routine-controls">
              <label className="routine-control-label">
                VIEW DAY
                <select
                  value={dayFilter}
                  onChange={(event) => setDayFilter(event.target.value)}
                >
                  <option>All days</option>
                  {ROUTINE_DAYS.map((day) => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </label>

              <div className="routine-section-tabs" aria-label="Choose section">
                {SECTION_NAMES.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={section === item ? "active" : ""}
                    aria-pressed={section === item}
                    onClick={() => setSection(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="routine-table-card">
              <div className="routine-table-scroll">
                <table className="routine-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Course</th>
                      <th>Details</th>
                      <th>Faculty / Section</th>
                      <th>Room</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleDays.map((day) => {
                      const classes = getClassesForNamedDay(
                        day,
                        section,
                        courseCode
                      );

                      if (!classes.length) {
                        return (
                          <tr key={day}>
                            <td className="routine-day">{day}</td>
                            <td colSpan="5" className="routine-empty">
                              No classes scheduled.
                            </td>
                          </tr>
                        );
                      }

                      return classes.map((item, index) => (
                        <tr key={`${day}-${item.start}-${item.code}`}>
                          {index === 0 && (
                            <td
                              className="routine-day"
                              rowSpan={classes.length}
                            >
                              {day}
                            </td>
                          )}

                          <td>
                            <span className="routine-class-meta">
                              <Clock3 size={12} />
                              {item.start} – {item.end}
                            </span>
                          </td>

                          <td>
                            <strong className="routine-class-code">
                              {item.code}
                            </strong>
                          </td>

                          <td>
                            <div className="routine-class-name">
                              {item.name}
                            </div>
                          </td>

                          <td>
                            <div className="routine-class-meta">
                              {item.faculty}
                            </div>
                          </td>

                          <td>
                            <div className="routine-class-meta">
                              {item.room}
                            </div>
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="routine-note">
              <CalendarDays size={16} />
              <span>
                {isBCA
                  ? "This is a dummy BCA timetable for demonstration. Class codes, faculty names, timings, and rooms can be changed in routineData.js when the department provides the actual schedule."
                  : "Monday, Thursday and Friday have no classes listed in the supplied MCA timetable. Please verify elective and practical-group assignments with the department before treating this transcription as the official schedule."}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
