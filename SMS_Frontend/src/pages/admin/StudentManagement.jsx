import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import api from "../../services/api";
import {
  GraduationCap, Users, FileSpreadsheet, Layers3, List, Upload,
  Download, X, CheckCircle2, AlertCircle, LoaderCircle, Search,
  RefreshCw, Printer, FileDown, UserX, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, SlidersHorizontal, ArrowLeft,
  ShieldCheck, Clock3, FileUp
} from "lucide-react";

const COLORS = {
  navy: "#202945",
  navy2: "#303b5d",
  gold: "#c19a52",
  goldLight: "#fbf4e7",
  ink: "#252c43",
  muted: "#858ba0"
};

const REQUIRED_COLUMNS = [
  "studentId", "name", "phoneNumber", "courseId", "sessionId"
];

const EMPTY_FILTERS = {
  course: "ALL",
  status: "ALL",
  session: ""
};

function Notice({ notice, onClose }) {
  if (!notice.text) return null;

  return (
    <div className={`sm-notice ${notice.type}`}>
      {notice.type === "success"
        ? <CheckCircle2 size={18} />
        : <AlertCircle size={18} />}
      <span>{notice.text}</span>
      <button onClick={onClose} aria-label="Close notification"><X size={16} /></button>
    </div>
  );
}

function StudentUploadModal({ open, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setError("");
      setWorking(false);
    }
  }, [open]);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape" && !working) onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, working]);

  if (!open) return null;

  function validateFile(selectedFile) {
    if (!selectedFile) return "Please choose an Excel file.";
    const extension = selectedFile.name.split(".").pop().toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      return "Only .xlsx and .xls files are supported.";
    }

    return "";
  }

  async function handleUpload() {
    const validationMessage = validateFile(file);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setWorking(true);
    setError("");

    try {
      // Check the spreadsheet headers before sending it to the backend.
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!firstSheet) {
        throw new Error("The Excel workbook does not contain a worksheet.");
      }

      const rows = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
        defval: ""
      });

      const headers = (rows[0] || []).map(value => String(value).trim());
      const missing = REQUIRED_COLUMNS.filter(column => !headers.includes(column));

      if (missing.length) {
        throw new Error(
          `Missing required column(s): ${missing.join(", ")}. Please check the Excel template.`
        );
      }

      if (rows.length < 2) {
        throw new Error("The Excel file has no student records.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/admin/students/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const message =
        response.data?.message || "Student records imported successfully.";

      onUploaded(message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Student import failed. Please check the Excel file."
      );
    } finally {
      setWorking(false);
    }
  }

  function downloadTemplate() {
    const worksheet = XLSX.utils.aoa_to_sheet([
      REQUIRED_COLUMNS,
      ["MCA2026007", "Student Name", "9876543210", "MCA", "2026-2028"]
    ]);

    worksheet["!cols"] = [
      { wch: 20 }, { wch: 26 }, { wch: 18 }, { wch: 14 }, { wch: 18 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Student_Import_Template.xlsx");
  }

  return (
    <div className="sm-modal-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget && !working) onClose();
    }}>
      <section className="sm-modal" role="dialog" aria-modal="true">
        <div className="sm-modal-head">
          <div className="sm-modal-icon"><FileSpreadsheet size={25} /></div>
          <button className="sm-icon-button" onClick={onClose} disabled={working}>
            <X size={19} />
          </button>
        </div>

        <span className="sm-eyebrow">STUDENT RECORDS</span>
        <h2>Import students</h2>
        <p className="sm-modal-description">
          Upload the department-authorised Excel sheet to add student records
          to the system.
        </p>

        <div
          className={`sm-dropzone ${file ? "has-file" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={event => event.preventDefault()}
          onDrop={event => {
            event.preventDefault();
            const dropped = event.dataTransfer.files?.[0];
            setFile(dropped || null);
            setError(validateFile(dropped));
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={event => {
              const selected = event.target.files?.[0] || null;
              setFile(selected);
              setError(validateFile(selected));
            }}
          />
          <div className="sm-upload-symbol">
            {file ? <FileSpreadsheet size={28} /> : <FileUp size={28} />}
          </div>
          <strong>{file ? file.name : "Choose an Excel file"}</strong>
          <span>
            {file
              ? `${(file.size / 1024).toFixed(1)} KB · Click to change`
              : "Drag and drop your file here, or click to browse"}
          </span>
          <small>Supported formats: .xlsx and .xls</small>
        </div>

        <div className="sm-template-note">
          <div>
            <strong>Need the correct format?</strong>
            <span>Download the sample template before preparing your sheet.</span>
          </div>
          <button className="sm-text-button" onClick={downloadTemplate}>
            <Download size={15} /> Template
          </button>
        </div>

        <div className="sm-column-note">
          <strong>Required Excel columns</strong>
          <p>{REQUIRED_COLUMNS.join("  ·  ")}</p>
          <small>
            Do not add a password column. The backend handles the initial password.
          </small>
        </div>

        {error && <div className="sm-inline-error"><AlertCircle size={15} />{error}</div>}

        <div className="sm-modal-actions">
          <button className="sm-button secondary" onClick={onClose} disabled={working}>
            Cancel
          </button>
          <button
            className="sm-button primary"
            onClick={handleUpload}
            disabled={!file || working}
          >
            {working
              ? <><LoaderCircle className="sm-spin" size={17} /> Importing...</>
              : <><Upload size={17} /> Import students</>}
          </button>
        </div>
      </section>
    </div>
  );
}

function ComingSoonModal({ type, onClose }) {
  if (!type) return null;

  const isMarks = type === "marks";

  return (
    <div className="sm-modal-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="sm-modal sm-coming-modal" role="dialog" aria-modal="true">
        <div className="sm-modal-head">
          <div className="sm-modal-icon"><Clock3 size={25} /></div>
          <button className="sm-icon-button" onClick={onClose}><X size={19} /></button>
        </div>
        <span className="sm-eyebrow">FEATURE NOT CONNECTED</span>
        <h2>{isMarks ? "Add semester marks" : "Increase semester"}</h2>
        <p className="sm-modal-description">
          {isMarks
            ? "The Excel-based semester marks workflow will be connected after the backend endpoint and spreadsheet format are finalised."
            : "The semester promotion workflow will be connected after its backend operation and batch/session rules are finalised."}
        </p>
        <div className="sm-coming-label"><Clock3 size={16} /> Coming soon</div>
        <div className="sm-modal-actions">
          <button className="sm-button primary" onClick={onClose}>Understood</button>
        </div>
      </section>
    </div>
  );
}

function StudentManagementStyles() {
  return (
    <style>{`
      .sm-page{max-width:1240px;margin:0 auto;color:${COLORS.ink};}
      .sm-page *{box-sizing:border-box;}
      .sm-eyebrow{display:block;color:#a27c37;font-size:10px;font-weight:850;letter-spacing:1.8px;}
      .sm-hero{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:25px;padding:30px 34px;margin-bottom:25px;border:1px solid #ffffffa8;border-radius:22px;color:white;background:linear-gradient(112deg,${COLORS.navy},${COLORS.navy2});box-shadow:0 15px 36px #20294520;}
      .sm-hero:after{content:"";position:absolute;width:260px;height:260px;right:80px;top:-190px;border:1px solid #ffffff24;border-radius:50%;box-shadow:0 0 0 35px #ffffff08,0 0 0 70px #ffffff06;pointer-events:none;}
      .sm-hero h1{margin:9px 0 8px;color:white;font-size:clamp(25px,3vw,34px);letter-spacing:-1px;}
      .sm-hero p{max-width:680px;margin:0;color:#c5ccda;font-size:13px;line-height:1.8;}
      .sm-hero-icon{z-index:1;width:76px;height:76px;display:grid;place-items:center;flex-shrink:0;border:1px solid #e6c47f66;border-radius:22px;color:#e6c47f;background:#ffffff0b;}
      .sm-operation-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;}
      .sm-operation{position:relative;display:flex;gap:17px;align-items:flex-start;min-height:190px;padding:23px;border:1px solid #ffffffd9;border-radius:18px;background:#ffffffd9;box-shadow:0 10px 28px #2029450c;transition:.22s ease;text-align:left;color:inherit;}
      button.sm-operation{width:100%;font:inherit;cursor:pointer;}
      .sm-operation:not(.disabled):hover{transform:translateY(-3px);border-color:#c19a5280;box-shadow:0 16px 34px #20294516;}
      .sm-operation.disabled{opacity:.72;cursor:not-allowed;background:#f8f7f4;}
      .sm-operation-icon{width:54px;height:54px;display:grid;place-items:center;flex-shrink:0;border:1px solid #e9d9b6;border-radius:16px;color:#a27c37;background:${COLORS.goldLight};}
      .sm-operation-content{min-width:0;flex:1;}
      .sm-operation-content h3{margin:3px 0 8px;color:${COLORS.navy};font-size:17px;}
      .sm-operation-content p{margin:0;color:${COLORS.muted};font-size:12px;line-height:1.75;}
      .sm-operation-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:17px;color:#a27c37;font-size:10px;font-weight:800;}
      .sm-soon{padding:5px 9px;border:1px solid #e7dfcf;border-radius:20px;color:#8b8069;background:#f7f3eb;font-size:9px;letter-spacing:.5px;}
      .sm-operation-arrow{color:#a27c37;}
      .sm-bottom-info{display:flex;align-items:center;gap:12px;margin-top:21px;padding:15px 17px;border:1px solid #ffffffbd;border-radius:14px;background:#ffffffa8;color:#737c90;font-size:11px;line-height:1.7;}
      .sm-bottom-info svg{flex-shrink:0;color:#a27c37;}
      .sm-notice{display:flex;align-items:center;gap:10px;padding:13px 15px;margin-bottom:17px;border:1px solid;border-radius:12px;font-size:12px;line-height:1.5;}
      .sm-notice span{flex:1;}
      .sm-notice button{border:0;background:transparent;color:inherit;cursor:pointer;}
      .sm-notice.success{color:#276c4b;background:#edf8f1;border-color:#ccebd7;}
      .sm-notice.error{color:#a33d3d;background:#fff1f0;border-color:#f2d1cf;}
      .sm-modal-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:18px;background:#111a30a8;backdrop-filter:blur(7px);animation:smFade .18s ease;}
      .sm-modal{width:min(100%,550px);max-height:92vh;overflow:auto;padding:27px;border:1px solid #ffffffd9;border-radius:22px;background:#fffdfa;box-shadow:0 28px 90px #10182d55;animation:smPop .24s cubic-bezier(.2,.8,.2,1);}
      @keyframes smFade{from{opacity:0}to{opacity:1}}
      @keyframes smPop{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      .sm-modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
      .sm-modal-icon{width:52px;height:52px;display:grid;place-items:center;border:1px solid #eadbbd;border-radius:16px;color:#a27c37;background:${COLORS.goldLight};}
      .sm-icon-button{width:36px;height:36px;display:grid;place-items:center;border:1px solid #e7e4dc;border-radius:11px;color:#687087;background:white;cursor:pointer;}
      .sm-modal h2{margin:8px 0;color:${COLORS.navy};font-size:25px;letter-spacing:-.6px;}
      .sm-modal-description{margin:0 0 20px;color:${COLORS.muted};font-size:12px;line-height:1.8;}
      .sm-dropzone{display:flex;flex-direction:column;align-items:center;gap:8px;padding:25px 18px;border:1.5px dashed #cfc6b2;border-radius:16px;background:#fcfaf5;text-align:center;cursor:pointer;transition:.2s;}
      .sm-dropzone:hover,.sm-dropzone.has-file{border-color:${COLORS.gold};background:#fbf6eb;}
      .sm-upload-symbol{width:48px;height:48px;display:grid;place-items:center;border-radius:15px;color:#a27c37;background:#f3ead7;}
      .sm-dropzone strong{max-width:100%;overflow-wrap:anywhere;color:${COLORS.navy};font-size:13px;}
      .sm-dropzone span{color:#737c90;font-size:11px;}
      .sm-dropzone small{color:#9a9eaa;font-size:10px;}
      .sm-template-note{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid #eeece6;}
      .sm-template-note div{display:grid;gap:4px;}
      .sm-template-note strong,.sm-column-note strong{color:${COLORS.navy};font-size:11px;}
      .sm-template-note span{color:${COLORS.muted};font-size:10px;line-height:1.5;}
      .sm-text-button{display:flex;align-items:center;gap:6px;flex-shrink:0;padding:9px 11px;border:1px solid #e8dfce;border-radius:10px;color:#92713a;background:#fffaf0;font-size:10px;font-weight:800;cursor:pointer;}
      .sm-column-note{padding:14px 0 2px;}
      .sm-column-note p{margin:8px 0;color:#536078;font-family:monospace;font-size:10px;line-height:1.8;overflow-wrap:anywhere;}
      .sm-column-note small{color:#9298a5;font-size:10px;}
      .sm-inline-error{display:flex;gap:8px;align-items:flex-start;margin-top:13px;padding:10px 12px;border-radius:10px;color:#a33d3d;background:#fff1f0;font-size:11px;line-height:1.6;}
      .sm-modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px;}
      .sm-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 17px;border:1px solid transparent;border-radius:11px;font-size:11px;font-weight:800;cursor:pointer;transition:.2s;}
      .sm-button:disabled{opacity:.55;cursor:not-allowed;}
      .sm-button.primary{color:white;background:${COLORS.navy};}
      .sm-button.primary:hover:not(:disabled){background:${COLORS.navy2};}
      .sm-button.secondary{border-color:#e4e1d9;color:#626b80;background:white;}
      .sm-coming-label{display:inline-flex;align-items:center;gap:8px;padding:10px 13px;border:1px solid #e9dfcb;border-radius:12px;color:#8d7445;background:#fbf5e9;font-size:11px;font-weight:800;}
      .sm-spin{animation:smSpin 1s linear infinite;}
      @keyframes smSpin{to{transform:rotate(360deg)}}
      @media(max-width:700px){.sm-hero{padding:23px;}.sm-hero-icon{width:58px;height:58px;}.sm-operation-grid{grid-template-columns:1fr;}.sm-operation{min-height:160px;padding:19px;}.sm-modal{padding:21px;}}
      @media(max-width:420px){.sm-hero-icon{display:none;}.sm-template-note{align-items:flex-start;flex-direction:column;}.sm-modal-actions{flex-direction:column-reverse;}.sm-button{width:100%;}}
    `}</style>
  );
}

export default function StudentManagement() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });

  function handleUploaded(message) {
    setUploadOpen(false);
    setNotice({ type: "success", text: message });
  }

  return (
    <div className="sm-page">
      <StudentManagementStyles />

      <Notice notice={notice} onClose={() => setNotice({ type: "", text: "" })} />

      <header className="sm-hero">
        <div>
          <span className="sm-eyebrow">ADMINISTRATION / STUDENT OPERATIONS</span>
          <h1>Student Management</h1>
          <p>
            Manage department student records, import student data, and access
            student listings from one central workspace.
          </p>
        </div>
        <div className="sm-hero-icon"><GraduationCap size={38} /></div>
      </header>

      <div className="sm-operation-grid">
        <button className="sm-operation" onClick={() => {
          setNotice({ type: "", text: "" });
          setUploadOpen(true);
        }}>
          <div className="sm-operation-icon"><FileSpreadsheet size={25} /></div>
          <div className="sm-operation-content">
            <h3>Add Students</h3>
            <p>Import new student records in bulk using the department Excel sheet.</p>
            <div className="sm-operation-meta">
              <span>EXCEL IMPORT <Upload size={14} /></span>
              <span className="sm-operation-arrow">Open option →</span>
            </div>
          </div>
        </button>

        <button className="sm-operation disabled" onClick={() => setComingSoon("marks")}>
          <div className="sm-operation-icon"><FileSpreadsheet size={25} /></div>
          <div className="sm-operation-content">
            <h3>Add Semester Marks</h3>
            <p>Upload semester-wise marks through an authorised Excel workbook.</p>
            <div className="sm-operation-meta">
              <span>EXCEL IMPORT</span><span className="sm-soon">COMING SOON</span>
            </div>
          </div>
        </button>

        <button className="sm-operation disabled" onClick={() => setComingSoon("semester")}>
          <div className="sm-operation-icon"><Layers3 size={25} /></div>
          <div className="sm-operation-content">
            <h3>Increase Semester</h3>
            <p>Select a course and batch/session to promote the relevant students.</p>
            <div className="sm-operation-meta">
              <span>SESSION MANAGEMENT</span><span className="sm-soon">COMING SOON</span>
            </div>
          </div>
        </button>

        <Link className="sm-operation" to="/admin/students/list">
          <div className="sm-operation-icon"><List size={25} /></div>
          <div className="sm-operation-content">
            <h3>Show Student List</h3>
            <p>Search, filter, print, export, and manage the status of student records.</p>
            <div className="sm-operation-meta">
              <span>STUDENT DIRECTORY</span>
              <span className="sm-operation-arrow">View records →</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="sm-bottom-info">
        <ShieldCheck size={19} />
        <span>
          Student records are controlled by the department administrator.
          Imported student details are managed through the authorised Excel format.
        </span>
      </div>

      <StudentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />
      <ComingSoonModal type={comingSoon} onClose={() => setComingSoon("")} />
    </div>
  );
}

/* =========================================================
   STUDENT LIST PAGE
   ========================================================= */

export function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [session, setSession] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadStudents() {
    setLoading(true);
    try {
      // This endpoint must be added to the backend.
      const response = await api.get("/admin/students");
      const payload = response.data;
      const records = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.students)
          ? payload.students
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

      setStudents(records);
      setNotice({ type: "", text: "" });
    } catch (error) {
      setStudents([]);
      setNotice({
        type: "error",
        text: error.response?.data?.message ||
          "Unable to load student records. The Admin student-list API may not be available yet."
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(); }, []);

  function activeStudent(student) {
    const value = student.status ?? student.active;
    return value === true ||
      String(value).toLowerCase() === "active" ||
      String(value).toLowerCase() === "true";
  }

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sessionQuery = session.trim().toLowerCase();

    return students.filter(student => {
      const studentCourse = String(student.courseId || student.course || "").toUpperCase();
      const studentSession = String(student.sessionId || student.session || student.admissionYear || "");
      const studentStatus = activeStudent(student) ? "ACTIVE" : "INACTIVE";

      const matchesCourse = course === "ALL" || studentCourse.includes(course);
      const matchesStatus = status === "ALL" || studentStatus === status;
      const matchesSession = !sessionQuery || studentSession.toLowerCase().includes(sessionQuery);

      const searchable = [
        student.studentId, student.name, student.phoneNumber,
        student.email, student.courseId, student.sessionId,
        student.admissionYear
      ].some(value => String(value ?? "").toLowerCase().includes(query));

      return matchesCourse && matchesStatus && matchesSession && (!query || searchable);
    });
  }, [students, search, course, status, session]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const pageStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [search, course, status, session, pageSize]);
  useEffect(() => { setPage(current => Math.min(current, totalPages)); }, [totalPages]);

  const activeCount = filteredStudents.filter(activeStudent).length;
  const inactiveCount = filteredStudents.length - activeCount;

  function resetFilters() {
    setSearch("");
    setCourse("ALL");
    setStatus("ALL");
    setSession("");
    setPage(1);
  }

  async function deactivateStudent(student) {
    const id = String(student.studentId || "").trim();
    if (!id) {
      setNotice({ type: "error", text: "This record does not contain a student ID." });
      return;
    }

    if (!window.confirm(
      `Deactivate ${student.name || id} (${id})?\n\nThe student record will not be deleted.`
    )) return;

    setWorkingId(id);
    try {
      await api.put(`/admin/students/${encodeURIComponent(id)}/deactivate`);
      setStudents(previous => previous.map(item =>
        item.studentId === id
          ? { ...item, status: false, active: false }
          : item
      ));
      setNotice({ type: "success", text: `${student.name || id} has been deactivated.` });
    } catch (error) {
      setNotice({
        type: "error",
        text: error.response?.data?.message || "Unable to deactivate this student."
      });
    } finally {
      setWorkingId("");
    }
  }

  const filterName = [
    course === "ALL" ? "AllCourses" : course,
    status === "ALL" ? "AllStatus" : status,
    session.trim() ? session.trim().replace(/[^a-z0-9_-]/gi, "-") : "AllSessions"
  ].join("_");

  function exportExcel() {
    if (!filteredStudents.length) {
      setNotice({ type: "error", text: "There are no matching student records to export." });
      return;
    }

    const rows = filteredStudents.map(student => ({
      "Student ID": student.studentId || "",
      "Student Name": student.name || "",
      "Phone Number": student.phoneNumber || "",
      "Course": student.courseId || student.course || "",
      "Session / Admission Year": student.sessionId || student.session || student.admissionYear || "",
      "Status": activeStudent(student) ? "Active" : "Inactive"
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 20 }, { wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 24 }, { wch: 14 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `Student_List_${filterName}.xlsx`);
  }

  function printStudents() {
    if (!filteredStudents.length) {
      setNotice({ type: "error", text: "There are no matching student records to print." });
      return;
    }

    const rows = filteredStudents.map((student, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(student.studentId)}</td>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.phoneNumber)}</td>
        <td>${escapeHtml(student.courseId || student.course)}</td>
        <td>${escapeHtml(student.sessionId || student.session || student.admissionYear)}</td>
        <td>${activeStudent(student) ? "Active" : "Inactive"}</td>
      </tr>
    `).join("");

    const printWindow = window.open("", "_blank", "width=1100,height=750");
    if (!printWindow) {
      setNotice({ type: "error", text: "Please allow pop-ups to print the student list." });
      return;
    }

    printWindow.document.write(`
      <!doctype html><html><head><title>Student List - ${filterName}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:28px;color:#202945}
        h1{font-size:22px;margin:0 0 6px}p{font-size:12px;color:#666;margin:0 0 20px}
        table{width:100%;border-collapse:collapse;font-size:11px}
        th,td{border:1px solid #d8dce4;padding:9px;text-align:left}
        th{background:#202945;color:white}
        tr{page-break-inside:avoid}
        @media print{body{padding:0}thead{display:table-header-group}}
      </style></head><body>
      <h1>DPP Institute of Technology — Student Directory</h1>
      <p>Filters: ${filterName} · Total matching records: ${filteredStudents.length}</p>
      <table><thead><tr><th>#</th><th>Student ID</th><th>Name</th><th>Phone</th><th>Course</th><th>Session</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody></table>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  return (
    <div className="sm-page">
      <StudentManagementStyles />
      <style>{`
        .sl-back{display:inline-flex;align-items:center;gap:8px;margin:0 0 17px;color:#8d713e;text-decoration:none;font-size:11px;font-weight:800;}
        .sl-top{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:20px;flex-wrap:wrap;}
        .sl-top h1{margin:7px 0;color:${COLORS.navy};font-size:clamp(25px,3vw,32px);letter-spacing:-.8px;}
        .sl-top p{margin:0;color:${COLORS.muted};font-size:12px;line-height:1.7;}
        .sl-actions{display:flex;gap:9px;flex-wrap:wrap;}
        .sl-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin-bottom:18px;}
        .sl-stat{padding:17px 19px;border:1px solid #ffffffd9;border-radius:15px;background:#ffffffd9;box-shadow:0 8px 22px #2029450b;}
        .sl-stat span{display:block;color:#82899b;font-size:9px;font-weight:850;letter-spacing:1px;text-transform:uppercase;}
        .sl-stat strong{display:block;margin-top:8px;color:${COLORS.navy};font-size:25px;}
        .sl-panel{padding:20px;border:1px solid #ffffffd9;border-radius:18px;background:#ffffffdc;box-shadow:0 10px 28px #2029450c;}
        .sl-filter-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;}
        .sl-filter-head h3{display:flex;align-items:center;gap:9px;margin:0;color:${COLORS.navy};font-size:14px;}
        .sl-filter-grid{display:grid;grid-template-columns:1.2fr 1fr 1.2fr;gap:12px;}
        .sl-field label{display:block;margin-bottom:7px;color:#687187;font-size:9px;font-weight:850;letter-spacing:1px;text-transform:uppercase;}
        .sl-field input,.sl-field select,.sl-search input{width:100%;height:42px;padding:0 12px;border:1px solid #e2e3e6;border-radius:10px;outline:none;color:${COLORS.ink};background:#fff;font:inherit;font-size:11px;}
        .sl-field input:focus,.sl-field select:focus,.sl-search input:focus{border-color:${COLORS.gold};box-shadow:0 0 0 3px #c19a521b;}
        .sl-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:17px 0;flex-wrap:wrap;}
        .sl-search{position:relative;flex:1;min-width:230px;max-width:560px;}
        .sl-search svg{position:absolute;left:13px;top:13px;color:#8d95a5;}
        .sl-search input{padding-left:39px;height:44px;}
        .sl-count{color:#858ba0;font-size:11px;}
        .sl-count strong{color:${COLORS.navy};}
        .sl-table-wrap{overflow-x:auto;border:1px solid #ececf0;border-radius:13px;background:white;}
        .sl-table{width:100%;border-collapse:collapse;min-width:790px;}
        .sl-table th{padding:13px 14px;color:#778095;background:#f8f8f7;font-size:9px;letter-spacing:.8px;text-align:left;text-transform:uppercase;white-space:nowrap;}
        .sl-table td{padding:14px;border-top:1px solid #f0f0f1;color:#596176;font-size:11px;white-space:nowrap;}
        .sl-table td strong{color:${COLORS.navy};font-size:11px;}
        .sl-status{display:inline-flex;padding:5px 9px;border-radius:20px;font-size:9px;font-weight:850;}
        .sl-status.active{color:#28714d;background:#eaf6ef;}
        .sl-status.inactive{color:#a04a4a;background:#fff0ef;}
        .sl-deactivate{display:inline-flex;align-items:center;gap:5px;padding:7px 9px;border:1px solid #f0d4d1;border-radius:8px;color:#a34b46;background:#fff8f7;font-size:9px;font-weight:800;cursor:pointer;}
        .sl-deactivate:disabled{opacity:.5;cursor:wait;}
        .sl-empty{padding:45px 15px;text-align:center;color:#9299a8;font-size:12px;}
        .sl-empty svg{display:block;margin:0 auto 10px;color:#b6a47e;}
        .sl-pagination{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:15px;flex-wrap:wrap;}
        .sl-page-buttons{display:flex;align-items:center;gap:5px;}
        .sl-page-buttons button{min-width:31px;height:31px;border:1px solid #e5e5e7;border-radius:8px;color:#677087;background:white;font-size:10px;cursor:pointer;}
        .sl-page-buttons button.current{border-color:${COLORS.navy};color:white;background:${COLORS.navy};}
        .sl-page-buttons button:disabled{opacity:.4;cursor:not-allowed;}
        .sl-page-size{height:32px;padding:0 8px;border:1px solid #e5e5e7;border-radius:8px;color:#626b80;background:white;font-size:10px;}
        .sl-loading{display:flex;justify-content:center;align-items:center;gap:10px;padding:45px;color:#858ba0;font-size:12px;}
        @media(max-width:760px){.sl-filter-grid{grid-template-columns:1fr 1fr;}.sl-stats{grid-template-columns:1fr 1fr;}}
        @media(max-width:480px){.sl-filter-grid{grid-template-columns:1fr;}.sl-stats{grid-template-columns:1fr;}.sl-actions{width:100%;}.sl-actions button{flex:1;}}
      `}</style>

      <Link to="/admin/students" className="sl-back"><ArrowLeft size={15} /> Back to Student Operations</Link>

      <div className="sl-top">
        <div>
          <span className="sm-eyebrow">ADMINISTRATION / STUDENT DIRECTORY</span>
          <h1>Student List</h1>
          <p>Browse student records, refine the listing, and manage student status.</p>
        </div>
        <div className="sl-actions">
          <button className="sm-button secondary" onClick={loadStudents} disabled={loading}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="sm-button secondary" onClick={printStudents}>
            <Printer size={15} /> Print
          </button>
          <button className="sm-button primary" onClick={exportExcel}>
            <FileDown size={15} /> Excel
          </button>
        </div>
      </div>

      <Notice notice={notice} onClose={() => setNotice({ type: "", text: "" })} />

      <div className="sl-stats">
        <div className="sl-stat"><span>Matching Students</span><strong>{filteredStudents.length}</strong></div>
        <div className="sl-stat"><span>Active Students</span><strong>{activeCount}</strong></div>
        <div className="sl-stat"><span>Inactive Students</span><strong>{inactiveCount}</strong></div>
      </div>

      <section className="sl-panel">
        <div className="sl-filter-head">
          <h3><SlidersHorizontal size={18} /> Refine Student Listing</h3>
          <button className="sm-text-button" onClick={resetFilters}>Reset all</button>
        </div>

        <div className="sl-filter-grid">
          <div className="sl-field">
            <label>Course / Department</label>
            <select value={course} onChange={event => setCourse(event.target.value)}>
              <option value="ALL">All Courses</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
            </select>
          </div>
          <div className="sl-field">
            <label>Student Status</label>
            <select value={status} onChange={event => setStatus(event.target.value)}>
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="sl-field">
            <label>Admission Session / Year</label>
            <input
              value={session}
              onChange={event => setSession(event.target.value)}
              placeholder="Type session or year..."
            />
          </div>
        </div>

        <div className="sl-toolbar">
          <div className="sl-search">
            <Search size={17} />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search student ID, name, phone, course..."
            />
          </div>
          <span className="sl-count">
            Showing <strong>{filteredStudents.length}</strong> matching records
          </span>
        </div>

        <div className="sl-table-wrap">
          <table className="sl-table">
            <thead>
              <tr>
                <th>Student ID</th><th>Student Name</th><th>Phone Number</th>
                <th>Course</th><th>Session</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7"><div className="sl-loading"><LoaderCircle className="sm-spin" size={19} /> Loading student records...</div></td></tr>
              ) : pageStudents.length === 0 ? (
                <tr><td colSpan="7">
                  <div className="sl-empty">
                    <Users size={30} />
                    {students.length === 0
                      ? "Student records will appear here when the Admin list API is connected."
                      : "No students match the selected filters."}
                  </div>
                </td></tr>
              ) : pageStudents.map(student => {
                const active = activeStudent(student);
                const id = String(student.studentId || "");
                return (
                  <tr key={id}>
                    <td><strong>{id || "—"}</strong></td>
                    <td>{student.name || "—"}</td>
                    <td>{student.phoneNumber || "—"}</td>
                    <td>{student.courseId || student.course || "—"}</td>
                    <td>{student.sessionId || student.session || student.admissionYear || "—"}</td>
                    <td><span className={`sl-status ${active ? "active" : "inactive"}`}>{active ? "ACTIVE" : "INACTIVE"}</span></td>
                    <td>
                      {active ? (
                        <button
                          className="sl-deactivate"
                          onClick={() => deactivateStudent(student)}
                          disabled={workingId === id}
                        >
                          {workingId === id
                            ? <LoaderCircle className="sm-spin" size={13} />
                            : <UserX size={13} />}
                          Deactivate
                        </button>
                      ) : <span className="sl-count">No action</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="sl-pagination">
          <div className="sl-count">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            {" · "} {filteredStudents.length} records
          </div>
          <div className="sl-page-buttons">
            <select className="sl-page-size" value={pageSize} onChange={event => setPageSize(Number(event.target.value))}>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <button onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft size={14} /></button>
            <button onClick={() => setPage(value => Math.max(1, value - 1))} disabled={page === 1}><ChevronLeft size={14} /></button>
            <button className="current">{page}</button>
            <button onClick={() => setPage(value => Math.min(totalPages, value + 1))} disabled={page === totalPages}><ChevronRight size={14} /></button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}><ChevronsRight size={14} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}