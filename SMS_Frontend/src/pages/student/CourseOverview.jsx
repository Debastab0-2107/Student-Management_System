import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FULL_SYLLABUS_URL =
  "https://makautexam.net/aicte_details/Syllabus/MCA/AllSem.pdf";

const semesterData = {
  I: {
    title: "Semester I",
    subtitle: "Build your foundation in computer applications",
    totalHours: "31",
    totalCredits: "25",
    sections: [
      {
        name: "Theory",
        rows: [
          { no: "1", code: "MCAN-101", name: "Programming Concept through Python", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          { no: "2", code: "MCAN-102", name: "Relational Database Management System", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          { no: "3", code: "MCAN-103", name: "Computer Organization and Architecture", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          { no: "4", code: "MCAN-104", name: "Discrete Mathematics and Combinatorics", l: "3", t: "1", p: "-", total: "4", credit: "3" },
          {
            no: "5",
            code: "Audit Elective",
            name: "Choose from the following options",
            l: "2",
            t: "1",
            p: "-",
            total: "3",
            credit: "2",
            options: [
              ["MCAN-E105A", "Environment and Ecology"],
              ["MCAN-E105B", "Management Accounting"],
              ["MCAN-E105C", "Constitution of India"],
              ["MCAN-E105D", "Stress Management through Yoga"],
            ],
          },
        ],
      },
      {
        name: "Practical",
        rows: [
          { no: "1", code: "MCAN-191", name: "Python Programming Lab", l: "-", t: "-", p: "4", total: "4", credit: "3" },
          { no: "2", code: "MCAN-192", name: "Relational Database Management System Lab", l: "-", t: "-", p: "4", total: "4", credit: "3" },
        ],
      },
      {
        name: "Sessional",
        rows: [
          { no: "1", code: "MCAN-181", name: "Soft Skill and Interpersonal Communication", l: "-", t: "-", p: "4", total: "4", credit: "2" },
        ],
      },
    ],
    bridge: "A minimum 8-week Online Course on Fundamentals of ‘Computer Science’ or ‘Computer Application’ or ‘Information Technology’ or so.",
  },

  II: {
    title: "Semester II",
    subtitle: "Explore programming, operating systems and networking",
    totalHours: "36",
    totalCredits: "30",
    sections: [
      {
        name: "Theory",
        rows: [
          { no: "1", code: "MCAN-201", name: "Data Structure through Python", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          { no: "2", code: "MCAN-202", name: "Modern Operating System", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          { no: "3", code: "MCAN-203", name: "Object Oriented Programming with JAVA", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          { no: "4", code: "MCAN-204", name: "Networking and TCP Suite", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          {
            no: "5",
            code: "Mathematical Elective",
            name: "Choose one of the following options",
            l: "3",
            t: "1",
            p: "-",
            total: "4",
            credit: "3",
            options: [
              ["MCAN-E205A", "Numerical and Statistical Analysis"],
              ["MCAN-E205B", "Operation Research and Optimization Techniques"],
            ],
          },
        ],
      },
      {
        name: "Practical",
        rows: [
          { no: "1", code: "MCAN-291", name: "Data Structure Lab using Python", l: "-", t: "-", p: "4", total: "4", credit: "3" },
          { no: "2", code: "MCAN-292", name: "Operating System Lab (Unix)", l: "-", t: "-", p: "4", total: "4", credit: "3" },
          { no: "3", code: "MCAN-293", name: "Object Oriented Programming Lab using JAVA", l: "-", t: "-", p: "4", total: "4", credit: "3" },
        ],
      },
      {
        name: "Sessional",
        rows: [
          { no: "1", code: "MCAN-281", name: "Web Technology", l: "-", t: "-", p: "4", total: "4", credit: "2" },
        ],
      },
    ],
    bridge: "A minimum 8-week Online Course on Fundamentals of ‘Software Engineering’ or ‘Systems Analysis and Design’ or ‘Business Systems Applications’ or so.",
  },

  III: {
    title: "Semester III",
    subtitle: "Move into advanced concepts and professional electives",
    totalHours: "34",
    totalCredits: "29",
    sections: [
      {
        name: "Theory",
        rows: [
          { no: "1", code: "MCAN-301", name: "Software Engineering using UML", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          { no: "2", code: "MCAN-302", name: "Artificial Intelligence and Expert System", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          { no: "3", code: "MCAN-303", name: "Formal Language and Automata Theory", l: "3", t: "1", p: "-", total: "4", credit: "4" },
          {
            no: "4",
            code: "Professional Elective - I",
            name: "Choose one of the following options",
            l: "3",
            t: "1",
            p: "-",
            total: "4",
            credit: "3",
            options: [
              ["MCAN-E304A", "ASP.Net using C#"],
              ["MCAN-E304B", "Web Enabled JAVA Programming"],
              ["MCAN-E304C", "Web Technology through PHP"],
              ["MCAN-E304D", "Android Application Development"],
            ],
          },
          {
            no: "5",
            code: "Professional Elective - II",
            name: "Choose one of the following options",
            l: "3",
            t: "1",
            p: "-",
            total: "4",
            credit: "3",
            options: [
              ["MCAN-E305A", "Design and Analysis of Algorithm"],
              ["MCAN-E305B", "Data Warehousing and Data Mining"],
              ["MCAN-E305C", "Image Processing"],
            ],
          },
        ],
      },
      {
        name: "Practical",
        rows: [
          { no: "1", code: "MCAN-E394", name: "Professional Elective – I Lab (A/B/C/D)", l: "-", t: "-", p: "4", total: "4", credit: "3" },
        ],
      },
      {
        name: "Sessional",
        rows: [
          { no: "1", code: "MCAN-381", name: "Minor Project and Viva-voce", l: "-", t: "-", p: "10", total: "10", credit: "8" },
        ],
      },
    ],
  },

  IV: {
    title: "Semester IV",
    subtitle: "Complete your programme with an open elective and major project",
    totalHours: "30",
    totalCredits: "26",
    sections: [
      {
        name: "Theory",
        rows: [
          {
            no: "1",
            code: "Open Elective",
            name: "Open Elective",
            l: "-",
            t: "-",
            p: "-",
            total: "-",
            credit: "4",
            options: [["MCAN-OE401", "Open Elective"]],
          },
        ],
      },
      {
        name: "Sessional",
        rows: [
          { no: "1", code: "MCAN-481", name: "Major Project and Viva-voce", l: "-", t: "-", p: "26", total: "26", credit: "22" },
        ],
      },
    ],
  },
};

function CourseOverview() {
  const [selectedSemester, setSelectedSemester] = useState("I");
  const currentSemester = semesterData[selectedSemester];

  return (
    <div className="course-page">
      <style>{`
        .course-page {
          --navy: #202945;
          --navy-light: #303B5D;
          --gold: #C19A52;
          --cream: #FBF4E7;
          --lavender: #D8DFF8;
          --muted: #858BA0;
          min-height: 100vh;
          padding: 30px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 8% 10%, rgba(216,223,248,.65), transparent 28%),
            radial-gradient(circle at 95% 75%, rgba(193,154,82,.14), transparent 30%),
            linear-gradient(135deg, #FBF4E7 0%, #F7F5F3 48%, #EEF0FA 100%);
          color: var(--navy);
          font-family: "Segoe UI", Arial, sans-serif;
          box-sizing: border-box;
        }
        
        .course-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.course-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #86632c;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
}

.course-back:hover {
  color: #202945;
}

@media (max-width: 650px) {
  .course-topline {
    align-items: flex-start;
    flex-direction: column;
  }
} 
  
        .course-page * {
          box-sizing: border-box;
        }

        .course-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .course-orb.one {
          width: 300px;
          height: 300px;
          top: -130px;
          right: -80px;
          border: 1px solid rgba(193,154,82,.25);
          box-shadow: 0 0 0 25px rgba(193,154,82,.035),
                      0 0 0 55px rgba(193,154,82,.025);
        }

        .course-orb.two {
          width: 230px;
          height: 230px;
          bottom: 5%;
          left: -140px;
          background: rgba(216,223,248,.28);
          border: 1px solid rgba(48,59,93,.08);
        }

        .course-content {
          position: relative;
          z-index: 1;
          max-width: 1250px;
          margin: 0 auto;
        }

        .course-heading {
          margin-bottom: 25px;
        }

        .course-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #98763D;
          background: rgba(193,154,82,.13);
          border: 1px solid rgba(193,154,82,.25);
          border-radius: 30px;
          padding: 7px 13px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .course-heading h1 {
          color: var(--navy);
          font-size: clamp(27px, 4vw, 38px);
          margin: 13px 0 7px;
          font-weight: 750;
          letter-spacing: -.7px;
        }

        .course-heading p {
          color: #73798D;
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }

        .course-top-grid {
          display: grid;
          grid-template-columns: minmax(230px, .8fr) minmax(300px, 1.6fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .semester-selector,
        .course-info-card {
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(48,59,93,.09);
          border-radius: 17px;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(32,41,69,.055);
          backdrop-filter: blur(10px);
        }

        .field-label {
          display: block;
          color: #747B90;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .semester-select {
          width: 100%;
          padding: 13px 14px;
          border: 1px solid #D9DCE7;
          border-radius: 10px;
          background: #fff;
          color: var(--navy);
          font-size: 15px;
          font-weight: 650;
          outline: none;
          cursor: pointer;
          transition: border .2s, box-shadow .2s;
        }

        .semester-select:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(193,154,82,.15);
        }

        .course-info-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .course-info-card h2 {
          margin: 0 0 7px;
          font-size: 21px;
          color: var(--navy);
        }

        .course-info-card p {
          margin: 0;
          color: #777D90;
          font-size: 13px;
          line-height: 1.6;
        }

        .course-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        .course-stat {
          background: #F3F1EC;
          border: 1px solid #EAE5DA;
          border-radius: 9px;
          padding: 8px 12px;
          color: #646B80;
          font-size: 12px;
        }

        .course-stat strong {
          color: var(--navy);
          margin-left: 5px;
        }

        .syllabus-notice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 19px 21px;
          margin-bottom: 23px;
          border-radius: 15px;
          color: white;
          background: linear-gradient(110deg, #202945, #354365);
          box-shadow: 0 9px 23px rgba(32,41,69,.15);
          position: relative;
          overflow: hidden;
        }

        .syllabus-notice:after {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.12);
          right: 18%;
          top: -100px;
          box-shadow: 0 0 0 22px rgba(255,255,255,.025),
                      0 0 0 45px rgba(255,255,255,.02);
          pointer-events: none;
        }

        .notice-text {
          position: relative;
          z-index: 1;
        }

        .notice-text strong {
          display: block;
          font-size: 15px;
          margin-bottom: 5px;
        }

        .notice-text span {
          color: #D8DFF8;
          font-size: 12px;
          line-height: 1.5;
        }

        .syllabus-link {
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 15px;
          border-radius: 9px;
          background: var(--gold);
          color: #202945;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          transition: background .2s, transform .2s;
        }

        .syllabus-link:hover {
          background: #D8B66F;
          transform: translateY(-2px);
        }

        .section-card {
          background: rgba(255,255,255,.9);
          border: 1px solid rgba(48,59,93,.09);
          border-radius: 16px;
          margin-bottom: 18px;
          overflow: hidden;
          box-shadow: 0 7px 22px rgba(32,41,69,.045);
          animation: courseFade .3s ease both;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 19px;
          border-bottom: 1px solid #E9EAF0;
          background: linear-gradient(90deg, #F6F3EC, #F5F6FB);
          color: var(--navy);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: .5px;
          text-transform: uppercase;
        }

        .section-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 0 4px rgba(193,154,82,.13);
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .course-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 740px;
          font-size: 13px;
          text-align: left;
        }

        .course-table th {
          background: #303B5D;
          color: white;
          padding: 12px 11px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .35px;
          white-space: nowrap;
        }

        .course-table td {
          padding: 12px 11px;
          border-bottom: 1px solid #ECECF1;
          color: #4F566D;
          vertical-align: top;
          line-height: 1.45;
        }

        .course-table tbody tr:last-child td {
          border-bottom: none;
        }

        .course-table tbody tr:hover {
          background: #FBF9F4;
        }

        .course-table .number-cell {
          color: #858BA0;
          width: 48px;
          text-align: center;
        }

        .course-table .code-cell {
          color: #303B5D;
          font-weight: 700;
          white-space: nowrap;
        }

        .course-table .subject-cell {
          min-width: 230px;
          font-weight: 600;
          color: #343D58;
        }

        .course-table .hours-cell,
        .course-table .credit-cell {
          text-align: center;
          white-space: nowrap;
        }

        .course-table .credit-cell {
          color: #98763D;
          font-weight: 800;
        }

        .elective-options {
          margin-top: 9px;
          padding: 9px 11px;
          border-left: 3px solid var(--gold);
          background: #FBF7EF;
          border-radius: 0 8px 8px 0;
        }

        .elective-label {
          display: block;
          font-size: 10px;
          color: #98763D;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .6px;
          margin-bottom: 6px;
        }

        .elective-option {
          display: flex;
          flex-wrap: wrap;
          gap: 5px 9px;
          padding: 3px 0;
          font-size: 11px;
          color: #62697C;
        }

        .elective-option b {
          color: #303B5D;
          white-space: nowrap;
        }

        .semester-total {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          padding: 15px 18px;
          background: #F6F4EF;
          border-top: 1px solid #EAE5DA;
          color: #73798D;
          font-size: 12px;
        }

        .semester-total strong {
          color: var(--navy);
          margin-left: 4px;
        }

        .bridge-card {
          background: rgba(255,255,255,.86);
          border: 1px solid rgba(193,154,82,.3);
          border-radius: 14px;
          padding: 17px 19px;
          margin-bottom: 18px;
        }

        .bridge-card h3 {
          color: #98763D;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .8px;
          margin: 0 0 7px;
        }

        .bridge-card p {
          color: #646B80;
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
        }

        .course-footer {
          text-align: center;
          color: #858BA0;
          font-size: 11px;
          padding: 12px 0 4px;
        }

        @keyframes courseFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 700px) {
          .course-page {
            padding: 19px 13px;
          }

          .course-top-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .syllabus-notice {
            align-items: flex-start;
            flex-direction: column;
          }

          .syllabus-link {
            width: 100%;
            justify-content: center;
          }

          .course-heading h1 {
            font-size: 27px;
          }

          .semester-total {
            justify-content: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .section-card {
            animation: none;
          }

          .syllabus-link {
            transition: none;
          }
        }
      `}</style>

      <div className="course-orb one" />
      <div className="course-orb two" />

      <main className="course-content">
        <div className="course-topline">
  <div>
    <span className="course-eyebrow">MCA DEPARTMENT</span>
  </div>

  <Link
    className="course-back"
    to="/student/dashboard"
  >
    <ArrowLeft size={15} />
    Back to dashboard
  </Link>
</div>
        <header className="course-heading">
          <span className="course-eyebrow">
            <span>✦</span> Academic Programme
          </span>
          <h1>Course Overview</h1>
          <p>
            Master of Computer Applications (MCA) — explore your semester-wise
            subjects, practicals, electives and academic structure.
          </p>
        </header>

        <div className="course-top-grid">
          <div className="semester-selector">
            <label className="field-label" htmlFor="semesterChoice">
              Select Semester
            </label>
            <select
              id="semesterChoice"
              className="semester-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="I">Semester I</option>
              <option value="II">Semester II</option>
              <option value="III">Semester III</option>
              <option value="IV">Semester IV</option>
            </select>
          </div>

          <div className="course-info-card">
            <h2>{currentSemester.title}</h2>
            <p>{currentSemester.subtitle}</p>
            <div className="course-stats">
              <span className="course-stat">
                Weekly Contact Hours:
                <strong>{currentSemester.totalHours}</strong>
              </span>
              <span className="course-stat">
                Total Credits:
                <strong>{currentSemester.totalCredits}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="syllabus-notice">
          <div className="notice-text">
            <strong>Want to explore the detailed syllabus?</strong>
            <span>
              View the complete official MAKAUT MCA syllabus, including
              detailed subject-wise syllabus information.
            </span>
          </div>
          <a
            className="syllabus-link"
            href={FULL_SYLLABUS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Detailed Syllabus <span>↗</span>
          </a>
        </div>

        {currentSemester.sections.map((section, sectionIndex) => (
          <section className="section-card" key={section.name}>
            <div className="section-title">
              <span className="section-dot" />
              {section.name}
            </div>

            <div className="table-wrap">
              <table className="course-table">
                <thead>
                  <tr>
                    <th>Sl. No.</th>
                    <th>Paper Code</th>
                    <th>Paper Name</th>
                    <th>L</th>
                    <th>T</th>
                    <th>P</th>
                    <th>Total Hours</th>
                    <th>Credit</th>
                  </tr>
                </thead>

                <tbody>
                  {section.rows.map((row, rowIndex) => (
                    <tr key={`${row.code}-${rowIndex}`}>
                      <td className="number-cell">{row.no}</td>
                      <td className="code-cell">{row.code}</td>
                      <td className="subject-cell">
                        {row.name}

                        {row.options && (
                          <div className="elective-options">
                            <span className="elective-label">
                              Available options
                            </span>
                            {row.options.map(([code, name]) => (
                              <div className="elective-option" key={code}>
                                <b>{code}</b>
                                <span>{name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="hours-cell">{row.l}</td>
                      <td className="hours-cell">{row.t}</td>
                      <td className="hours-cell">{row.p}</td>
                      <td className="hours-cell">{row.total}</td>
                      <td className="credit-cell">{row.credit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {currentSemester.bridge && (
          <div className="bridge-card">
            <h3>Bridge Course</h3>
            <p>
              <strong>
                Only for students of Category “B” stated in the Eligibility
                Section.
              </strong>
              <br />
              {currentSemester.bridge}
            </p>
          </div>
        )}

        <div className="course-footer">
          MCA — Master of Computer Applications
        </div>
      </main>
    </div>
  );
}

export default CourseOverview;
