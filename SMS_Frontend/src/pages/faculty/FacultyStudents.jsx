
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Users,
  Search,
  RefreshCw,
  Printer,
  FileDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  GraduationCap,
  ShieldCheck,
  Mail,
  Phone,
  CalendarDays,
  BookOpen,
  UserRound,
  Hash,
  RotateCcw,
  ArrowLeft,
  Filter,
  UserCheck,
  UserX,
  Download,
  SearchX,
} from "lucide-react";
import api from "../../services/api";

const COLORS = {
  navy: "#202945",
  navy2: "#303b5d",
  gold: "#c19a52",
  goldLight: "#fbf4e7",
  ink: "#252c43",
  muted: "#858ba0",
};

function Notice({ notice, onClose }) {
  if (!notice.text) return null;

  return (
    <div className={`fs-notice ${notice.type}`} role="alert">
      {notice.type === "success" ? (
        <CheckCircle2 size={18} />
      ) : (
        <AlertCircle size={18} />
      )}

      <span>{notice.text}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function isActiveStudent(student) {
  const value = student.active ?? student.status;

  return (
    value === true ||
    String(value).toLowerCase() === "true" ||
    String(value).toLowerCase() === "active"
  );
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function StudentDetailsModal({ student, onClose }) {
  if (!student) return null;

  const fields = [
    ["Student ID", student.studentId, Hash],
    ["Full Name", student.name, UserRound],
    ["Phone Number", student.phoneNumber, Phone],
    ["Email Address", student.email, Mail],
    ["Date of Birth", student.dateOfBirth, CalendarDays],
    ["Course", student.courseId || student.course, BookOpen],
    ["Admission Session", student.sessionId || student.session, GraduationCap],
    ["Current Semester", student.currentSemesterId, BookOpen],
    ["Father's Name", student.fatherName, UserRound],
    ["Father's Phone", student.fatherPhoneNumber, Phone],
    ["Mother's Name", student.motherName, UserRound],
    ["Mother's Phone", student.motherPhoneNumber, Phone],
  ];

  const active = isActiveStudent(student);

  return (
    <div
      className="fs-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="fs-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fs-modal-title"
      >
        <div className="fs-modal-head">
          <div>
            <span className="fs-eyebrow">STUDENT DIRECTORY</span>
            <h2 id="fs-modal-title">Student Details</h2>
            <p>Personal and academic information</p>
          </div>

          <button
            type="button"
            className="fs-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={19} />
          </button>
        </div>

        <div className="fs-modal-student">
          <div className="fs-modal-avatar">
            {(student.name || "S").trim().charAt(0).toUpperCase()}
          </div>

          <div className="fs-modal-identity">
            <strong>{student.name || "Student Name unavailable"}</strong>
            <span>{student.studentId || "Student ID unavailable"}</span>
          </div>

          <span className={`fs-status ${active ? "active" : "inactive"}`}>
            {active ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        <div className="fs-detail-section">
          <div className="fs-detail-section-title">
            <UserRound size={16} />
            Student Information
          </div>

          <div className="fs-detail-grid">
            {fields.map(([label, value, Icon]) => (
              <div className="fs-detail-item" key={label}>
                <span className="fs-detail-icon">
                  <Icon size={16} />
                </span>

                <div>
                  <small>{label}</small>
                  <strong>{value || "Not provided"}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fs-readonly-note">
          <ShieldCheck size={17} />
          <span>
            This is a read-only student record. Faculty cannot modify student
            information from this page.
          </span>
        </div>

        <div className="fs-modal-footer">
          <button
            type="button"
            className="fs-button primary"
            onClick={onClose}
          >
            Close Details
          </button>
        </div>
      </section>
    </div>
  );
}

export default function FacultyStudents() {
  const navigate = useNavigate();
  const location = useLocation();

  const base = location.pathname.includes("/visiting/")
    ? "/faculty/visiting"
    : "/faculty/permanent";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [session, setSession] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notice, setNotice] = useState({ type: "", text: "" });

  // Only Permanent Faculty can use this page.
  async function loadStudents() {
    const token = localStorage.getItem("sms_token");
    const role = localStorage.getItem("sms_role");

    if (!token || role !== "TEACHER") {
      navigate("/login/faculty", { replace: true });
      return;
    }

    setLoading(true);
    setNotice({ type: "", text: "" });

    try {
      // First verify the faculty type using the existing profile endpoint.
      const profileResponse = await api.get("/faculty/profile");
      const profile = profileResponse?.data || {};

      const facultyType = String(
        profile.facultyType ||
        profile.faculty_type ||
        profile.type ||
        localStorage.getItem("sms_faculty_type") ||
        ""
      )
        .trim()
        .toUpperCase();

      const permanentTypes = [
        "REGULAR",
        "PERMANENT",
        "PERMANENT FACULTY",
      ];

      const visitingTypes = [
        "VISITING",
        "VISITING FACULTY",
      ];

      if (visitingTypes.includes(facultyType)) {
        localStorage.setItem("sms_faculty_type", facultyType);
        navigate("/faculty/visiting/dashboard", { replace: true });
        return;
      }

      if (!permanentTypes.includes(facultyType)) {
        setStudents([]);
        setNotice({
          type: "error",
          text: "Your faculty category could not be verified. Please contact the administrator.",
        });
        return;
      }

      localStorage.setItem("sms_faculty_type", facultyType);

      // Existing faculty-specific, read-only endpoint.
      const response = await api.get("/faculty/students");
      const payload = response?.data;

      const records = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.students)
          ? payload.students
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

      setStudents(records);
    } catch (error) {
      setStudents([]);

      const statusCode = error.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        if (statusCode === 401) {
          [
            "sms_token",
            "sms_role",
            "sms_teacher_id",
            "sms_faculty_type",
            "sms_must_change_password",
          ].forEach((key) => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
          });

          navigate("/login/faculty", { replace: true });
          return;
        }

        setNotice({
          type: "error",
          text:
            error.response?.data?.message ||
            "You are not authorised to view the student directory.",
        });

        return;
      }

      setNotice({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to load student records. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
    // Load once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sessionQuery = session.trim().toLowerCase();

    return students.filter((student) => {
      const studentCourse = String(
        student.courseId || student.course || ""
      ).toUpperCase();

      const studentSession = String(
        student.sessionId ||
        student.session ||
        student.admissionYear ||
        ""
      );

      const studentStatus = isActiveStudent(student)
        ? "ACTIVE"
        : "INACTIVE";

      const matchesCourse =
        course === "ALL" || studentCourse.includes(course);

      const matchesStatus =
        status === "ALL" || studentStatus === status;

      const matchesSession =
        !sessionQuery ||
        studentSession.toLowerCase().includes(sessionQuery);

      const searchableValues = [
        student.studentId,
        student.name,
        student.phoneNumber,
        student.email,
        student.dateOfBirth,
        student.courseId,
        student.course,
        student.sessionId,
        student.session,
        student.currentSemesterId,
        student.fatherName,
        student.fatherPhoneNumber,
        student.motherName,
        student.motherPhoneNumber,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      return (
        matchesCourse &&
        matchesStatus &&
        matchesSession &&
        matchesSearch
      );
    });
  }, [students, search, course, status, session]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / pageSize)
  );

  const pageStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, course, status, session, pageSize]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const activeCount = filteredStudents.filter(isActiveStudent).length;
  const inactiveCount = filteredStudents.length - activeCount;

  function resetFilters() {
    setSearch("");
    setCourse("ALL");
    setStatus("ALL");
    setSession("");
    setPage(1);
  }

  function exportExcel() {
    if (!filteredStudents.length) {
      setNotice({
        type: "error",
        text: "There are no matching student records to export.",
      });
      return;
    }

    const rows = filteredStudents.map((student) => ({
      "Student ID": student.studentId || "",
      "Student Name": student.name || "",
      "Phone Number": student.phoneNumber || "",
      Email: student.email || "",
      "Date of Birth": student.dateOfBirth || "",
      Course: student.courseId || student.course || "",
      "Admission Session": student.sessionId || student.session || "",
      "Current Semester": student.currentSemesterId || "",
      "Father's Name": student.fatherName || "",
      "Father's Phone": student.fatherPhoneNumber || "",
      "Mother's Name": student.motherName || "",
      "Mother's Phone": student.motherPhoneNumber || "",
      Status: isActiveStudent(student) ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 26 },
      { wch: 17 },
      { wch: 28 },
      { wch: 16 },
      { wch: 13 },
      { wch: 19 },
      { wch: 18 },
      { wch: 25 },
      { wch: 17 },
      { wch: 25 },
      { wch: 17 },
      { wch: 13 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    XLSX.writeFile(
      workbook,
      "Faculty_Student_List.xlsx"
    );

    setNotice({
      type: "success",
      text: "The filtered student list has been exported successfully.",
    });
  }

  function printStudents() {
    if (!filteredStudents.length) {
      setNotice({
        type: "error",
        text: "There are no matching student records to print.",
      });
      return;
    }

    const rows = filteredStudents
      .map(
        (student, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(student.studentId)}</td>
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.phoneNumber)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td>${escapeHtml(student.courseId || student.course)}</td>
            <td>${escapeHtml(student.sessionId || student.session)}</td>
            <td>${escapeHtml(student.currentSemesterId)}</td>
            <td>${isActiveStudent(student) ? "Active" : "Inactive"}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open(
      "",
      "_blank",
      "width=1100,height=750"
    );

    if (!printWindow) {
      setNotice({
        type: "error",
        text: "Please allow pop-ups to print the student list.",
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Faculty Student Directory</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 25px;
              color: #252c43;
            }

            h1 {
              color: #202945;
              margin-bottom: 5px;
            }

            p {
              color: #697286;
              font-size: 12px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 22px;
            }

            th, td {
              padding: 9px;
              border: 1px solid #ddd;
              text-align: left;
              font-size: 10px;
            }

            th {
              background: #f4f5f8;
              color: #202945;
            }

            @media print {
              body { padding: 0; }
            }
          </style>
        </head>

        <body>
          <h1>Faculty Student Directory</h1>
          <p>MCA Department · Read-only student listing</p>
          <p>Matching records: ${filteredStudents.length}</p>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Course</th>
                <th>Session</th>
                <th>Semester</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <div className="fs-page">
      <style>{`
        .fs-page,
        .fs-page * {
          box-sizing: border-box;
        }

        .fs-page {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 30px clamp(16px, 3vw, 42px) 42px;
          overflow: hidden;
          color: ${COLORS.ink};
          font-family: Inter, Arial, sans-serif;
          background:
            radial-gradient(ellipse at 5% 5%, #e8eaf1 0%, transparent 32%),
            radial-gradient(ellipse at 95% 15%, #f4ead8 0%, transparent 29%),
            linear-gradient(135deg, #f7f8fb 0%, #f2f3f7 50%, #faf7f0 100%);
          animation: fsPageEnter .45s ease both;
        }

        .fs-page::before,
        .fs-page::after {
          position: absolute;
          z-index: -1;
          content: "";
          pointer-events: none;
          border-radius: 50%;
        }

        .fs-page::before {
          width: 330px;
          height: 330px;
          top: 170px;
          right: -210px;
          border: 45px solid #c19a520d;
        }

        .fs-page::after {
          width: 250px;
          height: 250px;
          bottom: 30px;
          left: -180px;
          border: 35px solid #303b5d0b;
        }

        @keyframes fsPageEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fsCardEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fsSpin {
          to { transform: rotate(360deg); }
        }

        /* Back button */

        .fs-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 23px;
          padding: 10px 15px;
          border: 1px solid #d9c49e;
          border-radius: 10px;
          background: #ffffffd9;
          color: #87672f;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: .22s ease;
          box-shadow: 0 3px 12px #20294508;
        }

        .fs-back:hover {
          transform: translateX(-3px);
          border-color: ${COLORS.gold};
          background: ${COLORS.goldLight};
          box-shadow: 0 6px 15px #c19a5220;
        }

        /* Header */

        .fs-top {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          margin-bottom: 23px;
          padding: 25px 27px;
          overflow: hidden;
          border: 1px solid #ffffff;
          border-radius: 18px;
          background:
            linear-gradient(110deg, #ffffff 0%, #ffffffed 65%, #fbf5e9 100%);
          box-shadow: 0 8px 28px #2029450c;
        }

        .fs-top::after {
          position: absolute;
          top: -70px;
          right: -35px;
          width: 210px;
          height: 210px;
          border: 30px solid #c19a5215;
          border-radius: 50%;
          content: "";
          pointer-events: none;
        }

        .fs-top-content {
          position: relative;
          z-index: 1;
        }

        .fs-eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #a27c37;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .fs-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${COLORS.gold};
        }

        .fs-top h1 {
          margin: 9px 0 7px;
          color: ${COLORS.navy};
          font-size: clamp(24px, 3vw, 33px);
          font-weight: 850;
          letter-spacing: -.9px;
        }

        .fs-top p {
          max-width: 620px;
          margin: 0;
          color: ${COLORS.muted};
          font-size: 11px;
          line-height: 1.8;
        }

        .fs-header-icon {
          position: relative;
          z-index: 1;
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #e8d7b8;
          border-radius: 19px;
          background: linear-gradient(145deg, #fbf4e7, #f1e4ca);
          color: #92713b;
          box-shadow: 0 7px 18px #c19a5218;
        }

        .fs-actions {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .fs-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 39px;
          padding: 9px 13px;
          border: 1px solid #dedfe5;
          border-radius: 9px;
          background: white;
          color: #59647a;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
          transition: .22s ease;
        }

        .fs-button:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: ${COLORS.gold};
          color: #8b6b38;
          box-shadow: 0 5px 13px #20294510;
        }

        .fs-button:active:not(:disabled) {
          transform: scale(.97);
        }

        .fs-button:disabled {
          opacity: .48;
          cursor: not-allowed;
        }

        .fs-button.primary {
          border-color: ${COLORS.navy};
          background: ${COLORS.navy};
          color: white;
        }

        .fs-button.primary:hover:not(:disabled) {
          border-color: ${COLORS.navy2};
          background: ${COLORS.navy2};
          color: white;
        }

        /* Notifications */

        .fs-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 18px;
          padding: 13px 15px;
          border: 1px solid;
          border-radius: 11px;
          font-size: 11px;
          line-height: 1.6;
          animation: fsCardEnter .3s ease both;
        }

        .fs-notice span {
          flex: 1;
        }

        .fs-notice button {
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .fs-notice.success {
          border-color: #b9dfc9;
          background: #eff9f2;
          color: #28714d;
        }

        .fs-notice.error {
          border-color: #e8c0bd;
          background: #fff5f4;
          color: #a04a4a;
        }

        /* Statistics */

        .fs-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 19px;
        }

        .fs-stat {
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
          padding: 19px 20px;
          overflow: hidden;
          border: 1px solid #e3e5ec;
          border-radius: 15px;
          background: #ffffffed;
          box-shadow: 0 5px 18px #20294508;
          animation: fsCardEnter .45s ease both;
          transition: transform .23s ease, box-shadow .23s ease;
        }

        .fs-stat:nth-child(2) { animation-delay: .07s; }
        .fs-stat:nth-child(3) { animation-delay: .14s; }

        .fs-stat:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px #20294512;
        }

        .fs-stat-icon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #edf0f7;
          color: ${COLORS.navy2};
        }

        .fs-stat.active .fs-stat-icon {
          background: #eaf6ef;
          color: #32835d;
        }

        .fs-stat.inactive .fs-stat-icon {
          background: #fff0ef;
          color: #b15c5c;
        }

        .fs-stat-info {
          min-width: 0;
        }

        .fs-stat-info span {
          display: block;
          color: #858da0;
          font-size: 10px;
          font-weight: 700;
        }

        .fs-stat-info strong {
          display: block;
          margin-top: 5px;
          color: ${COLORS.navy};
          font-size: 25px;
          font-weight: 850;
          letter-spacing: -.6px;
        }

        .fs-stat.active .fs-stat-info strong { color: #32835d; }
        .fs-stat.inactive .fs-stat-info strong { color: #b15c5c; }

        /* Main panel */

        .fs-panel {
          padding: 23px;
          border: 1px solid #e1e3eb;
          border-radius: 17px;
          background: #ffffffed;
          box-shadow: 0 7px 25px #20294509;
          animation: fsCardEnter .5s .1s ease both;
        }

        .fs-filter-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 17px;
        }

        .fs-filter-head h3 {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0;
          color: ${COLORS.navy};
          font-size: 14px;
          font-weight: 850;
        }

        .fs-filter-head h3 svg {
          color: #a27c37;
        }

        .fs-text-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          background: transparent;
          color: #96743c;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
          transition: .2s ease;
        }

        .fs-text-button:hover {
          color: ${COLORS.navy};
          transform: translateY(-1px);
        }

        .fs-filter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.2fr;
          gap: 14px;
          padding: 17px;
          border: 1px solid #e9eaf0;
          border-radius: 12px;
          background: #f9fafc;
        }

        .fs-field label {
          display: block;
          margin-bottom: 8px;
          color: #778095;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        .fs-field input,
        .fs-field select,
        .fs-search input {
          width: 100%;
          height: 42px;
          padding: 0 12px;
          border: 1px solid #dfe2e9;
          border-radius: 9px;
          outline: none;
          color: ${COLORS.ink};
          background: white;
          font: inherit;
          font-size: 11px;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .fs-field input:focus,
        .fs-field select:focus,
        .fs-search input:focus {
          border-color: ${COLORS.gold};
          box-shadow: 0 0 0 3px #c19a5220;
        }

        .fs-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 13px;
          margin: 19px 0 15px;
          flex-wrap: wrap;
        }

        .fs-search {
          position: relative;
          flex: 1;
          min-width: 230px;
          max-width: 570px;
        }

        .fs-search svg {
          position: absolute;
          left: 13px;
          top: 13px;
          color: #8d95a5;
          pointer-events: none;
        }

        .fs-search input {
          height: 44px;
          padding-left: 40px;
        }

        .fs-count {
          color: #858ba0;
          font-size: 10px;
        }

        .fs-count strong {
          color: ${COLORS.navy};
          font-weight: 850;
        }

        /* Table */

        .fs-table-wrap {
          overflow-x: auto;
          border: 1px solid #e0e3eb;
          border-radius: 12px;
          background: white;
        }

        .fs-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
        }

        .fs-table th {
          padding: 15px 13px;
          border-bottom: 1px solid #e2e4eb;
          background: #f5f6f9;
          color: #778095;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .7px;
          text-align: left;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .fs-table td {
          padding: 14px 13px;
          border-top: 1px solid #eceef2;
          color: #596176;
          font-size: 10.5px;
          white-space: nowrap;
          transition: background .2s ease;
        }

        .fs-table tbody tr {
          transition: background .2s ease;
        }

        .fs-table tbody tr:hover {
          background: #fcfaf5;
        }

        .fs-table td strong {
          color: ${COLORS.navy};
          font-size: 10.5px;
          font-weight: 800;
        }

        .fs-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .5px;
        }

        .fs-status.active {
          background: #eaf6ef;
          color: #28714d;
        }

        .fs-status.inactive {
          background: #fff0ef;
          color: #a04a4a;
        }

        .fs-view {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border: 1px solid #e2d3b8;
          border-radius: 8px;
          background: #fffaf0;
          color: #8b6b38;
          font-size: 9px;
          font-weight: 850;
          cursor: pointer;
          transition: .2s ease;
        }

        .fs-view:hover {
          transform: translateY(-2px);
          border-color: ${COLORS.gold};
          background: ${COLORS.goldLight};
          box-shadow: 0 4px 10px #c19a5220;
        }

        .fs-empty {
          padding: 48px 15px;
          text-align: center;
          color: #9299a8;
          font-size: 11px;
          white-space: normal;
        }

        .fs-empty svg {
          display: block;
          margin: 0 auto 12px;
          color: #b6a47e;
        }

        .fs-empty strong {
          display: block;
          margin-bottom: 5px;
          color: ${COLORS.navy};
          font-size: 12px;
        }

        .fs-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 45px;
          color: #858ba0;
          font-size: 11px;
        }

        .fs-spin {
          animation: fsSpin 1s linear infinite;
        }

        /* Pagination */

        .fs-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 17px;
          flex-wrap: wrap;
        }

        .fs-page-buttons {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .fs-page-buttons button {
          min-width: 33px;
          height: 33px;
          display: grid;
          place-items: center;
          border: 1px solid #dedfe5;
          border-radius: 8px;
          color: #677087;
          background: white;
          font-size: 10px;
          cursor: pointer;
          transition: .2s ease;
        }

        .fs-page-buttons button:hover:not(:disabled) {
          border-color: ${COLORS.gold};
          color: #8b6b38;
          transform: translateY(-2px);
        }

        .fs-page-buttons button.current {
          border-color: ${COLORS.navy};
          background: ${COLORS.navy};
          color: white;
        }

        .fs-page-buttons button:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        .fs-page-size {
          height: 33px;
          padding: 0 9px;
          border: 1px solid #dedfe5;
          border-radius: 8px;
          color: #626b80;
          background: white;
          font-size: 10px;
          outline: none;
        }

        /* Read-only information */

        .fs-readonly-banner {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-top: 19px;
          padding: 15px 17px;
          border: 1px solid #e5d5b5;
          border-radius: 12px;
          background: #fffaf0e8;
          color: #82683c;
          font-size: 10px;
          line-height: 1.8;
        }

        .fs-readonly-banner svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Student details modal */

        .fs-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1500;
          display: grid;
          place-items: center;
          padding: 18px;
          background: #111a30a8;
          backdrop-filter: blur(6px);
          animation: fsFadeIn .2s ease both;
        }

        @keyframes fsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .fs-modal {
          width: 100%;
          max-width: 720px;
          max-height: 90vh;
          overflow: auto;
          padding: 25px;
          border: 1px solid #e2d5bd;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 25px 80px #0003;
          animation: fsModalEnter .3s ease both;
        }

        @keyframes fsModalEnter {
          from {
            opacity: 0;
            transform: translateY(15px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .fs-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 19px;
        }

        .fs-modal-head h2 {
          margin: 7px 0 4px;
          color: ${COLORS.navy};
          font-size: 22px;
        }

        .fs-modal-head p {
          margin: 0;
          color: ${COLORS.muted};
          font-size: 10px;
        }

        .fs-close {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid #dedfe5;
          border-radius: 10px;
          background: white;
          color: #687286;
          cursor: pointer;
          transition: .2s ease;
        }

        .fs-close:hover {
          border-color: #d5a7a2;
          background: #fff5f4;
          color: #a04a4a;
          transform: rotate(5deg);
        }

        .fs-modal-student {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 15px;
          border: 1px solid #e4e5e9;
          border-radius: 13px;
          background: #f8f9fb;
        }

        .fs-modal-avatar {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #eee5d5;
          color: #826536;
          font-size: 18px;
          font-weight: 900;
        }

        .fs-modal-identity {
          min-width: 0;
          flex: 1;
        }

        .fs-modal-identity strong,
        .fs-modal-identity span {
          display: block;
        }

        .fs-modal-identity strong {
          color: ${COLORS.navy};
          font-size: 12px;
        }

        .fs-modal-identity span {
          margin-top: 5px;
          color: #858da0;
          font-size: 10px;
        }

        .fs-detail-section {
          margin-top: 20px;
        }

        .fs-detail-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 11px;
          color: ${COLORS.navy};
          font-size: 11px;
          font-weight: 850;
        }

        .fs-detail-section-title svg {
          color: #99753b;
        }

        .fs-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .fs-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-width: 0;
          padding: 13px;
          border: 1px solid #e5e6eb;
          border-radius: 11px;
          background: white;
          transition: .2s ease;
        }

        .fs-detail-item:hover {
          transform: translateY(-2px);
          border-color: #d8c49f;
          background: #fdfbf7;
        }

        .fs-detail-icon {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 8px;
          background: #f7f0e3;
          color: #99753b;
        }

        .fs-detail-item small {
          display: block;
          margin: 1px 0 5px;
          color: #858da0;
          font-size: 9px;
        }

        .fs-detail-item strong {
          display: block;
          overflow-wrap: anywhere;
          color: ${COLORS.navy};
          font-size: 10px;
          line-height: 1.5;
        }

        .fs-readonly-note {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 17px;
          padding: 13px;
          border: 1px solid #cfe4d6;
          border-radius: 10px;
          background: #f0f5f2;
          color: #47785d;
          font-size: 10px;
          line-height: 1.7;
        }

        .fs-readonly-note svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .fs-modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 19px;
        }

        /* Responsive */

        @media (max-width: 850px) {
          .fs-top {
            align-items: flex-start;
          }

          .fs-actions {
            justify-content: flex-start;
          }

          .fs-filter-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .fs-field:last-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 650px) {
          .fs-page {
            padding: 19px 13px 30px;
          }

          .fs-top {
            padding: 20px;
          }

          .fs-header-icon {
            width: 49px;
            height: 49px;
            border-radius: 14px;
          }

          .fs-header-icon svg {
            width: 23px;
          }

          .fs-stats {
            gap: 9px;
          }

          .fs-stat {
            gap: 9px;
            padding: 13px 11px;
          }

          .fs-stat-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
          }

          .fs-stat-icon svg {
            width: 17px;
          }

          .fs-stat-info span {
            font-size: 9px;
          }

          .fs-stat-info strong {
            font-size: 21px;
          }

          .fs-panel {
            padding: 15px;
          }

          .fs-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .fs-search {
            max-width: none;
          }
        }

        @media (max-width: 480px) {
          .fs-top {
            flex-direction: column;
          }

          .fs-header-icon {
            display: none;
          }

          .fs-actions {
            width: 100%;
          }

          .fs-actions .fs-button {
            flex: 1;
          }

          .fs-stats {
            grid-template-columns: 1fr;
          }

          .fs-stat {
            padding: 13px 15px;
          }

          .fs-filter-grid {
            grid-template-columns: 1fr;
            padding: 13px;
          }

          .fs-field:last-child {
            grid-column: auto;
          }

          .fs-filter-head {
            align-items: flex-start;
          }

          .fs-pagination {
            align-items: flex-start;
            flex-direction: column;
          }

          .fs-page-buttons {
            width: 100%;
            flex-wrap: wrap;
          }

          .fs-detail-grid {
            grid-template-columns: 1fr;
          }

          .fs-modal {
            padding: 17px;
          }

          .fs-modal-student {
            flex-wrap: wrap;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fs-page *,
          .fs-page *::before,
          .fs-page *::after,
          .fs-modal,
          .fs-modal-backdrop {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Back to Dashboard */}
      <button
        type="button"
        className="fs-back"
        onClick={() => navigate(`${base}/dashboard`)}
      >
        <ArrowLeft size={15} />
        Back to Dashboard
      </button>

      {/* Page Header */}
      <header className="fs-top">
        <div className="fs-top-content">
          <span className="fs-eyebrow">
            <span className="fs-eyebrow-dot" />
            FACULTY / DEPARTMENT DIRECTORY
          </span>

          <h1>View All Students</h1>

          <p>
            Browse student records and academic details for the department.
            Search, filter, view individual records, and export the required
            student information.
          </p>
        </div>

        <div className="fs-header-icon">
          <Users size={29} />
        </div>
      </header>

      {/* Action Buttons */}
      <div className="fs-actions" style={{ marginBottom: 19 }}>
        <button
          type="button"
          className="fs-button"
          onClick={loadStudents}
          disabled={loading}
        >
          <RefreshCw size={14} />
          Refresh
        </button>

        <button
          type="button"
          className="fs-button"
          onClick={printStudents}
          disabled={loading || !filteredStudents.length}
        >
          <Printer size={14} />
          Print
        </button>

        <button
          type="button"
          className="fs-button primary"
          onClick={exportExcel}
          disabled={loading || !filteredStudents.length}
        >
          <Download size={14} />
          Export Excel
        </button>
      </div>

      <Notice
        notice={notice}
        onClose={() => setNotice({ type: "", text: "" })}
      />

      {/* Statistics */}
      <section className="fs-stats">
        <div className="fs-stat">
          <div className="fs-stat-icon">
            <Users size={21} />
          </div>

          <div className="fs-stat-info">
            <span>Matching Students</span>
            <strong>{filteredStudents.length}</strong>
          </div>
        </div>

        <div className="fs-stat active">
          <div className="fs-stat-icon">
            <UserCheck size={21} />
          </div>

          <div className="fs-stat-info">
            <span>Active Students</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="fs-stat inactive">
          <div className="fs-stat-icon">
            <UserX size={21} />
          </div>

          <div className="fs-stat-info">
            <span>Inactive Students</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </section>

      {/* Student Listing */}
      <section className="fs-panel">
        <div className="fs-filter-head">
          <h3>
            <SlidersHorizontal size={17} />
            Refine Student Listing
          </h3>

          <button
            type="button"
            className="fs-text-button"
            onClick={resetFilters}
          >
            <RotateCcw size={13} />
            Reset all
          </button>
        </div>

        {/* Filters */}
        <div className="fs-filter-grid">
          <div className="fs-field">
            <label htmlFor="fs-course">Course / Department</label>

            <select
              id="fs-course"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            >
              <option value="ALL">All Courses</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
            </select>
          </div>

          <div className="fs-field">
            <label htmlFor="fs-status">Student Status</label>

            <select
              id="fs-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="fs-field">
            <label htmlFor="fs-session">Admission Session / Year</label>

            <input
              id="fs-session"
              value={session}
              onChange={(event) => setSession(event.target.value)}
              placeholder="Type session or year..."
            />
          </div>
        </div>

        {/* Search */}
        <div className="fs-toolbar">
          <div className="fs-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ID, name, phone, email, semester..."
              aria-label="Search students"
            />
          </div>

          <span className="fs-count">
            Showing <strong>{filteredStudents.length}</strong> matching
            records
          </span>
        </div>

        {/* Student Table */}
        <div className="fs-table-wrap">
          <table className="fs-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Phone Number</th>
                <th>Course</th>
                <th>Session</th>
                <th>Semester</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">
                    <div className="fs-loading">
                      <LoaderCircle className="fs-spin" size={20} />
                      Loading student records...
                    </div>
                  </td>
                </tr>
              ) : pageStudents.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="fs-empty">
                      {students.length === 0 ? (
                        <>
                          <Users size={32} />
                          <strong>No student records available</strong>
                          Student records will appear here when they are
                          available from the server.
                        </>
                      ) : (
                        <>
                          <SearchX size={32} />
                          <strong>No matching students found</strong>
                          Try changing your search text or filters.
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                pageStudents.map((student, index) => {
                  const active = isActiveStudent(student);
                  const id = student.studentId || `student-${index}`;

                  return (
                    <tr key={id}>
                      <td>
                        <strong>{student.studentId || "—"}</strong>
                      </td>

                      <td>{student.name || "—"}</td>

                      <td>{student.phoneNumber || "—"}</td>

                      <td>
                        {student.courseId || student.course || "—"}
                      </td>

                      <td>
                        {student.sessionId || student.session || "—"}
                      </td>

                      <td>{student.currentSemesterId || "—"}</td>

                      <td>
                        <span
                          className={`fs-status ${
                            active ? "active" : "inactive"
                          }`}
                        >
                          {active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="fs-view"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="fs-pagination">
          <div className="fs-count">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            {" · "}
            {filteredStudents.length} records
          </div>

          <div className="fs-page-buttons">
            <select
              className="fs-page-size"
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              aria-label="Records per page"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={page === 1}
              aria-label="First page"
            >
              <ChevronsLeft size={14} />
            </button>

            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              className="current"
              aria-current="page"
            >
              {page}
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              aria-label="Last page"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Read-only notice */}
      <div className="fs-readonly-banner">
        <ShieldCheck size={18} />

        <span>
          <strong>Read-only access:</strong> Permanent Faculty can view student
          information and export or print the filtered list. Student records
          cannot be edited, deleted, deactivated, or uploaded from this
          section.
        </span>
      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
