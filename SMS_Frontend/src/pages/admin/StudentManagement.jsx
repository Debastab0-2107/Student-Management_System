import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import api from "../../services/api";
import {
  GraduationCap, Users, FileSpreadsheet, Layers3, List, Upload,
  Download, X, CheckCircle2, AlertCircle, LoaderCircle, Search,
  RefreshCw, Printer, FileDown, UserX, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, SlidersHorizontal, ArrowLeft,
  ShieldCheck, Clock3, FileUp, Eye,
  UserRound, CalendarDays, Phone, Mail, GraduationCap as GraduationCapIcon,
  BookOpen, IdCard, Shield, User
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

const UNIVERSITY_IDENTIFIER_COLUMNS = [
  "StudentId", "Name", "Roll", "Reg", "Batch"
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
      <button onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}

/* =========================================================
   ADD STUDENTS EXCEL UPLOAD
   ========================================================= */

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

      const missing = REQUIRED_COLUMNS.filter(
        column => !headers.includes(column)
      );

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

      const response = await api.post(
        "/admin/students/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const message =
        response.data?.message ||
        "Student records imported successfully.";

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
      { wch: 20 },
      { wch: 26 },
      { wch: 18 },
      { wch: 14 },
      { wch: 18 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    XLSX.writeFile(
      workbook,
      "Student_Import_Template.xlsx"
    );
  }

  return (
    <div
      className="sm-modal-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !working) onClose();
      }}
    >
      <section className="sm-modal" role="dialog" aria-modal="true">
        <div className="sm-modal-head">
          <div className="sm-modal-icon">
            <FileSpreadsheet size={25} />
          </div>

          <button
            className="sm-icon-button"
            onClick={onClose}
            disabled={working}
          >
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
            {file
              ? <FileSpreadsheet size={28} />
              : <FileUp size={28} />}
          </div>

          <strong>
            {file ? file.name : "Choose an Excel file"}
          </strong>

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
            <span>
              Download the sample template before preparing your sheet.
            </span>
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

        {error && (
          <div className="sm-inline-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="sm-modal-actions">
          <button
            className="sm-button secondary"
            onClick={onClose}
            disabled={working}
          >
            Cancel
          </button>

          <button
            className="sm-button primary"
            onClick={handleUpload}
            disabled={!file || working}
          >
            {working
              ? <>
                  <LoaderCircle className="sm-spin" size={17} />
                  Importing...
                </>
              : <>
                  <Upload size={17} />
                  Import students
                </>}
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   UNIVERSITY ROLL NUMBER AND REGISTRATION NUMBER UPLOAD
   ========================================================= */

function UniversityIdentifierUploadModal({
  open,
  onClose,
  onUploaded
}) {
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

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, working]);

  if (!open) return null;

  function validateFile(selectedFile) {
    if (!selectedFile) {
      return "Please choose an Excel file.";
    }

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
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array"
      });

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!firstSheet) {
        throw new Error("The Excel workbook has no worksheet.");
      }

      const rows = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
        defval: ""
      });

      const headers = (rows[0] || []).map(value =>
        String(value).trim()
      );

      const validHeaders = UNIVERSITY_IDENTIFIER_COLUMNS.every(
        (column, index) =>
          String(headers[index] || "").toLowerCase() === column.toLowerCase()
      );

      if (!validHeaders) {
        throw new Error(
          "Invalid Excel format. Required columns in this exact order: " +
          UNIVERSITY_IDENTIFIER_COLUMNS.join(", ")
        );
      }

      if (rows.length < 2) {
        throw new Error("The Excel file contains no student records.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/admin/students/university-identifiers/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const message =
        response.data?.message ||
        "University identifiers uploaded successfully.";

      const count = response.data?.updatedCount;

      onUploaded(
        count !== undefined
          ? `${message}. Updated students: ${count}.`
          : message
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "University identifier upload failed. Please check the Excel file."
      );
    } finally {
      setWorking(false);
    }
  }

  function downloadTemplate() {
    const worksheet = XLSX.utils.aoa_to_sheet([
      UNIVERSITY_IDENTIFIER_COLUMNS,
      [
        "REPLACE_WITH_STUDENT_ID",
        "REPLACE_WITH_EXACT_STUDENT_NAME",
        "UNIVERSITY_ROLL_NO",
        "UNIVERSITY_REGISTRATION_NO",
        "REPLACE_WITH_STUDENT_BATCH"
      ]
    ]);

    worksheet["!cols"] = [
      { wch: 24 },
      { wch: 30 },
      { wch: 24 },
      { wch: 30 },
      { wch: 22 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "University Identifiers"
    );

    XLSX.writeFile(
      workbook,
      "University_Identifiers_Template.xlsx"
    );
  }

  return (
    <div
      className="sm-modal-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !working) onClose();
      }}
    >
      <section
        className="sm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="university-upload-title"
      >
        <div className="sm-modal-head">
          <div className="sm-modal-icon">
            <ShieldCheck size={25} />
          </div>

          <button
            className="sm-icon-button"
            onClick={onClose}
            disabled={working}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <span className="sm-eyebrow">
          STUDENT UNIVERSITY INFORMATION
        </span>

        <h2 id="university-upload-title">
          Add University Details
        </h2>

        <p className="sm-modal-description">
          Upload an Excel sheet containing University Roll Numbers and
          University Registration Numbers for existing students.
        </p>

        <div
          className={`sm-dropzone ${file ? "has-file" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={event => event.preventDefault()}
          onDrop={event => {
            event.preventDefault();

            const dropped = event.dataTransfer.files?.[0] || null;

            setFile(dropped);
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
            {file
              ? <FileSpreadsheet size={28} />
              : <FileUp size={28} />}
          </div>

          <strong>
            {file ? file.name : "Choose an Excel file"}
          </strong>

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
            <span>
              Download the university identifiers Excel template.
            </span>
          </div>

          <button className="sm-text-button" onClick={downloadTemplate}>
            <Download size={15} />
            Template
          </button>
        </div>

        <div className="sm-column-note">
          <strong>
            Required Excel columns — in this exact order
          </strong>

          <p>{UNIVERSITY_IDENTIFIER_COLUMNS.join("  ·  ")}</p>

          <small>
            Student ID, name and batch must match the existing student
            record. Replace all sample values before uploading.
          </small>
        </div>

        {error && (
          <div className="sm-inline-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="sm-modal-actions">
          <button
            className="sm-button secondary"
            onClick={onClose}
            disabled={working}
          >
            Cancel
          </button>

          <button
            className="sm-button primary"
            onClick={handleUpload}
            disabled={!file || working}
          >
            {working
              ? <>
                  <LoaderCircle className="sm-spin" size={17} />
                  Uploading...
                </>
              : <>
                  <Upload size={17} />
                  Upload Excel
                </>}
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   COMING SOON MODAL
   ========================================================= */

function ComingSoonModal({ type, onClose }) {
  if (!type) return null;

  const isMarks = type === "marks";

  return (
    <div
      className="sm-modal-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="sm-modal sm-coming-modal"
        role="dialog"
        aria-modal="true"
      >
        <div className="sm-modal-head">
          <div className="sm-modal-icon">
            <Clock3 size={25} />
          </div>

          <button className="sm-icon-button" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <span className="sm-eyebrow">FEATURE NOT CONNECTED</span>

        <h2>
          {isMarks ? "Add semester marks" : "Increase semester"}
        </h2>

        <p className="sm-modal-description">
          {isMarks
            ? "The Excel-based semester marks workflow will be connected after the backend endpoint and spreadsheet format are finalised."
            : "The semester promotion workflow will be connected after its backend operation and batch/session rules are finalised."}
        </p>

        <div className="sm-coming-label">
          <Clock3 size={16} />
          Coming soon
        </div>

        <div className="sm-modal-actions">
          <button
            className="sm-button primary"
            onClick={onClose}
          >
            Understood
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   STUDENT MANAGEMENT STYLES
   ========================================================= */

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

/* =========================================================
   STUDENT MANAGEMENT PAGE
   ========================================================= */

export default function StudentManagement() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [universityUploadOpen, setUniversityUploadOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });

  function handleUploaded(message) {
    setUploadOpen(false);
    setUniversityUploadOpen(false);
    setNotice({ type: "success", text: message });
  }

  return (
    <div className="sm-page">
      <StudentManagementStyles />

      <Notice
        notice={notice}
        onClose={() => setNotice({ type: "", text: "" })}
      />

      <header className="sm-hero">
        <div>
          <span className="sm-eyebrow">
            ADMINISTRATION / STUDENT OPERATIONS
          </span>

          <h1>Student Management</h1>

          <p>
            Manage department student records, import student data, and access
            student listings from one central workspace.
          </p>
        </div>

        <div className="sm-hero-icon">
          <GraduationCap size={38} />
        </div>
      </header>

      <div className="sm-operation-grid">
        <button
          className="sm-operation"
          onClick={() => {
            setNotice({ type: "", text: "" });
            setUploadOpen(true);
          }}
        >
          <div className="sm-operation-icon">
            <FileSpreadsheet size={25} />
          </div>

          <div className="sm-operation-content">
            <h3>Add Students</h3>

            <p>
              Import new student records in bulk using the department Excel sheet.
            </p>

            <div className="sm-operation-meta">
              <span>
                EXCEL IMPORT <Upload size={14} />
              </span>

              <span className="sm-operation-arrow">
                Open option →
              </span>
            </div>
          </div>
        </button>

        <button
          className="sm-operation"
          onClick={() => {
            setNotice({ type: "", text: "" });
            setUniversityUploadOpen(true);
          }}
        >
          <div className="sm-operation-icon">
            <ShieldCheck size={25} />
          </div>

          <div className="sm-operation-content">
            <h3>Add University Details</h3>

            <p>
              Upload University Roll Numbers and Registration Numbers for
              existing students using an Excel sheet.
            </p>

            <div className="sm-operation-meta">
              <span>
                UNIVERSITY IDENTIFIERS <Upload size={14} />
              </span>

              <span className="sm-operation-arrow">
                Open option →
              </span>
            </div>
          </div>
        </button>

        <button
          className="sm-operation disabled"
          onClick={() => setComingSoon("marks")}
        >
          <div className="sm-operation-icon">
            <FileSpreadsheet size={25} />
          </div>

          <div className="sm-operation-content">
            <h3>Add Semester Marks</h3>

            <p>
              Upload semester-wise marks through an authorised Excel workbook.
            </p>

            <div className="sm-operation-meta">
              <span>EXCEL IMPORT</span>
              <span className="sm-soon">COMING SOON</span>
            </div>
          </div>
        </button>

        <button
          className="sm-operation disabled"
          onClick={() => setComingSoon("semester")}
        >
          <div className="sm-operation-icon">
            <Layers3 size={25} />
          </div>

          <div className="sm-operation-content">
            <h3>Increase Semester</h3>

            <p>
              Select a course and batch/session to promote the relevant students.
            </p>

            <div className="sm-operation-meta">
              <span>SESSION MANAGEMENT</span>
              <span className="sm-soon">COMING SOON</span>
            </div>
          </div>
        </button>

        <Link
          className="sm-operation"
          to="/admin/students/list"
        >
          <div className="sm-operation-icon">
            <List size={25} />
          </div>

          <div className="sm-operation-content">
            <h3>Show Student List</h3>

            <p>
              Search, filter, print, export, and manage the status of student records.
            </p>

            <div className="sm-operation-meta">
              <span>STUDENT DIRECTORY</span>

              <span className="sm-operation-arrow">
                View records →
              </span>
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

      <UniversityIdentifierUploadModal
        open={universityUploadOpen}
        onClose={() => setUniversityUploadOpen(false)}
        onUploaded={handleUploaded}
      />

      <ComingSoonModal
        type={comingSoon}
        onClose={() => setComingSoon("")}
      />
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
  const [selectedStudent, setSelectedStudent] = useState(null);
  

  // Close the details dialog with Escape, while keeping the effect hook unconditional.
  useEffect(() => {
    if (!selectedStudent) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setSelectedStudent(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedStudent]);

  // ================= LOAD STUDENTS =================

  async function loadStudents() {
    setLoading(true);

    try {
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
          "Unable to load student records."
      });

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  // ================= HELPER FUNCTIONS =================

  function activeStudent(student) {
    const value = student.status ?? student.active;

    return value === true ||
      String(value).toLowerCase() === "active" ||
      String(value).toLowerCase() === "true";
  }

  function displayValue(value) {
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      return "-";
    }

    return String(value);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  // ================= FILTER STUDENTS =================

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sessionQuery = session.trim().toLowerCase();

    return students.filter(student => {
      const studentCourse = String(
        student.courseId || student.course || ""
      ).toUpperCase();

      const studentSession = String(
        student.sessionId ||
        student.session ||
        student.admissionYear ||
        ""
      );

      const studentStatus = activeStudent(student)
        ? "ACTIVE"
        : "INACTIVE";

      const matchesCourse =
        course === "ALL" || studentCourse.includes(course);

      const matchesStatus =
        status === "ALL" || studentStatus === status;

      const matchesSession =
        !sessionQuery ||
        studentSession.toLowerCase().includes(sessionQuery);

      const searchable = [
        student.studentId,
        student.name,
        student.phoneNumber,
        student.email,
        student.courseId,
        student.sessionId,
        student.admissionYear,
        student.universityRollNo,
        student.universityRegistrationNo
      ].some(value =>
        String(value ?? "").toLowerCase().includes(query)
      );

      return (
        matchesCourse &&
        matchesStatus &&
        matchesSession &&
        (!query || searchable)
      );
    });
  }, [students, search, course, status, session]);

  // ================= PAGINATION =================

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
    setPage(current => Math.min(current, totalPages));
  }, [totalPages]);

  const activeCount = filteredStudents.filter(activeStudent).length;
  const inactiveCount = filteredStudents.length - activeCount;

  // ================= RESET FILTERS =================

  function resetFilters() {
    setSearch("");
    setCourse("ALL");
    setStatus("ALL");
    setSession("");
    setPage(1);
  }

  // ================= DEACTIVATE STUDENT =================

  async function deactivateStudent(student) {
    const id = String(student.studentId || "").trim();

    if (!id) {
      setNotice({
        type: "error",
        text: "This record does not contain a student ID."
      });
      return;
    }

    if (!window.confirm(
      `Deactivate ${student.name || id} (${id})?\n\nThe student record will not be deleted.`
    )) {
      return;
    }

    setWorkingId(id);

    try {
      await api.put(
        `/admin/students/${encodeURIComponent(id)}/deactivate`
      );

      setStudents(previous =>
        previous.map(item =>
          item.studentId === id
            ? { ...item, status: false, active: false }
            : item
        )
      );

      // Keep the opened popup status synchronized too.
      setSelectedStudent(previous =>
        previous && previous.studentId === id
          ? { ...previous, status: false, active: false }
          : previous
      );

      setNotice({
        type: "success",
        text: `${student.name || id} has been deactivated.`
      });

    } catch (error) {
      setNotice({
        type: "error",
        text: error.response?.data?.message ||
          "Unable to deactivate this student."
      });

    } finally {
      setWorkingId("");
    }
  }

  // ================= EXPORT EXCEL =================

  const filterName = [
    course === "ALL" ? "AllCourses" : course,
    status === "ALL" ? "AllStatus" : status,
    session.trim()
      ? session.trim().replace(/[^a-z0-9_-]/gi, "-")
      : "AllSessions"
  ].join("_");

  function exportExcel() {
    if (!filteredStudents.length) {
      setNotice({
        type: "error",
        text: "There are no matching student records to export."
      });
      return;
    }

    const rows = filteredStudents.map(student => ({
      "Student ID": student.studentId || "",
      "Student Name": student.name || "",
      "University Roll No.": displayValue(student.universityRollNo),
      "Course": student.courseId || student.course || "",
      "Session / Admission Year":
        student.sessionId ||
        student.session ||
        student.admissionYear ||
        "",
      "Status": activeStudent(student) ? "Active" : "Inactive"
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 28 },
      { wch: 24 },
      { wch: 14 },
      { wch: 24 },
      { wch: 14 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    XLSX.writeFile(
      workbook,
      `Student_List_${filterName}.xlsx`
    );
  }

  // ================= PRINT STUDENTS =================

  function printStudents() {
    if (!filteredStudents.length) {
      setNotice({
        type: "error",
        text: "There are no matching student records to print."
      });
      return;
    }

    const rows = filteredStudents.map((student, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(student.studentId)}</td>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.universityRollNo || "-")}</td>
        <td>${escapeHtml(student.courseId || student.course)}</td>
        <td>${escapeHtml(student.sessionId || student.session || student.admissionYear)}</td>
        <td>${activeStudent(student) ? "Active" : "Inactive"}</td>
      </tr>
    `).join("");

    const printWindow = window.open(
      "",
      "_blank",
      "width=1100,height=750"
    );

    if (!printWindow) {
      setNotice({
        type: "error",
        text: "Please allow pop-ups to print the student list."
      });
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
      <head>
        <title>Student List - ${filterName}</title>
        <style>
          body{font-family:Arial,sans-serif;padding:28px;color:#202945}
          h1{font-size:22px;margin:0 0 6px}
          p{font-size:12px;color:#666;margin:0 0 20px}
          table{width:100%;border-collapse:collapse;font-size:11px}
          th,td{border:1px solid #d8dce4;padding:9px;text-align:left}
          th{background:#202945;color:white}
          tr{page-break-inside:avoid}
          @media print{
            body{padding:0}
            thead{display:table-header-group}
          }
        </style>
      </head>
      <body>
        <h1>Student Directory</h1>
        <p>
          Filters: ${filterName} ·
          Total matching records: ${filteredStudents.length}
        </p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>University Roll No.</th>
              <th>Course</th>
              <th>Session</th>
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

  // ================= POPUP DETAILS =================

  // The field names below follow the student object returned by /admin/students.
  // Missing values are displayed as "-" without changing the API data.
  const detailSections = selectedStudent
    ? [
        {
          title: "PERSONAL INFORMATION",
          icon: <UserRound size={17} />,
          fields: [
            { label: "Name", value: selectedStudent.name, icon: <UserRound size={17} /> },
            { label: "Date of Birth", value: selectedStudent.dateOfBirth, icon: <CalendarDays size={17} /> },
            { label: "Phone", value: selectedStudent.phoneNumber, icon: <Phone size={17} /> },
            { label: "Email", value: selectedStudent.email, icon: <Mail size={17} /> }
          ]
        },
        {
          title: "ACADEMIC & UNIVERSITY DETAILS",
          icon: <GraduationCapIcon size={17} />,
          fields: [
            { label: "Student ID", value: selectedStudent.studentId, icon: <IdCard size={17} /> },
            { label: "Course / Dept", value: selectedStudent.courseId || selectedStudent.course, icon: <GraduationCapIcon size={17} /> },
            { label: "Admission Session", value: selectedStudent.sessionId || selectedStudent.session || selectedStudent.admissionYear, icon: <CalendarDays size={17} /> },
            { label: "Current Semester", value: selectedStudent.currentSemesterId, icon: <BookOpen size={17} /> },
            { label: "University Roll No.", value: selectedStudent.universityRollNo, icon: <Shield size={17} /> },
            { label: "University Reg. No.", value: selectedStudent.universityRegistrationNo, icon: <IdCard size={17} /> }
          ]
        },
        {
          title: "PARENT / GUARDIAN INFORMATION",
          icon: <Users size={17} />,
          fields: [
            { label: "Father's Name", value: selectedStudent.fatherName, icon: <User size={17} /> },
            { label: "Father's Phone", value: selectedStudent.fatherPhoneNumber, icon: <Phone size={17} /> },
            { label: "Mother's Name", value: selectedStudent.motherName, icon: <User size={17} /> },
            { label: "Mother's Phone", value: selectedStudent.motherPhoneNumber, icon: <Phone size={17} /> }
          ]
        }
      ]
    : [];


  // ================= COMPONENT UI =================

  return (
    <div className="sm-page">
      <StudentManagementStyles />

      <style>{`
        .sl-back{display:inline-flex;align-items:center;gap:8px;margin:0 0 17px;color:#8d713e;text-decoration:none;font-size:11px;font-weight:800;}
        .sl-top{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:20px;flex-wrap:wrap;}
        .sl-top h1{margin:7px 0;color:${COLORS.navy};font-size:clamp(25px,3vw,32px);letter-spacing:-.8px;}
        .sl-top p{margin:0;color:${COLORS.muted};font-size:12px;line-height:1.7;}
        .sl-actions{display:flex;gap:9px;flex-wrap:wrap;}
        
/* ===== STATISTICS CARDS ===== */

.sl-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
  margin-bottom: 18px;
}

.sl-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  padding: 15px 18px;
  border: 1.5px solid #d9c69e;
  border-radius: 13px;
  background: #fffaf0;
  box-shadow: 0 5px 15px rgba(32,41,69,.07);
  animation: slStatEnter .55s ease both;
  transition: transform .25s ease, box-shadow .25s ease;
}

.sl-stat:nth-child(2) {
  animation-delay: .08s;
}

.sl-stat:nth-child(3) {
  animation-delay: .16s;
}

.sl-stat:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(32,41,69,.14);
}

/* Matching - cream and gold */

.sl-stat:nth-child(1) {
  background: linear-gradient(120deg,#fffdf6,#f8efd9);
  border-color: #d6c18e;
}

.sl-stat:nth-child(1) span {
  color: #806637;
}

.sl-stat:nth-child(1) strong {
  color: #26314e;
}

/* Active - DEEP GREEN with WHITE TEXT */

.sl-stat:nth-child(2) {
  background: linear-gradient(120deg, #20734D, #31915F);
  border-color: #104d32;
}

.sl-stat:nth-child(2) span,
.sl-stat:nth-child(2) strong {
  color: #ffffff;
}

/* Inactive - DEEP RED with WHITE TEXT */

.sl-stat:nth-child(3) {
  background: linear-gradient(120deg, #A33D43, #C45459);
  border-color: #76262c;
}

.sl-stat:nth-child(3) span,
.sl-stat:nth-child(3) strong {
  color: #ffffff;
}

.sl-stat span {
  display: block;
  font-size: 15px;
  font-weight: 750;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sl-stat strong {
  display: block;
  margin-top: 8px;
  font-size: 26px;
  font-weight: 850;
  font-variant-numeric: tabular-nums;
}

/* ===== MAIN CREAM PANEL ===== */

.sl-panel {
  padding: 18px;
  border: 1.5px solid #cdb987;
  border-radius: 17px;
  background: linear-gradient(145deg,#fffdf6,#fff9e9);
  box-shadow: 0 9px 25px rgba(32,41,69,.10);
}

/* ===== REFINE STUDENT LISTING HEADER ===== */

.sl-filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.sl-filter-head h3 {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  padding: 10px 15px;
  border: 1px solid #303c60;
  border-radius: 10px;
  color: #ffffff;
  background: linear-gradient(110deg,#172342,#303d64);
  font-size: 13px;
  font-weight: 850;
  box-shadow: 0 3px 9px rgba(23,35,66,.15);
}

.sl-filter-head h3 svg {
  color: #ffffff;
}

/* Reset button */

.sl-filter-head .sm-text-button {
  padding: 8px 16px;
  border: 1px solid #a68a53;
  border-radius: 9px;
  color: #e8d19a;
  background: #172342;
  font-size: 10px;
  font-weight: 800;
  transition: all .2s ease;
}

.sl-filter-head .sm-text-button:hover {
  color: #ffffff;
  border-color: #d6b875;
  background: #303d64;
  transform: translateY(-2px);
}

/* ===== NAVY FILTER CONTAINER ===== */

.sl-filter-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.2fr;
  gap: 12px;
  padding: 12px;
  border: 1px solid #303d61;
  border-radius: 11px;
  background: linear-gradient(110deg,#172342,#202e50);
  box-shadow: 0 4px 12px rgba(23,35,66,.13);
}

.sl-field label {
  display: block;
  margin-bottom: 7px;
  color: #ffffff;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: .8px;
  text-transform: uppercase;
}

.sl-field input,
.sl-field select,
.sl-search input {
  width: 100%;
  height: 39px;
  padding: 0 12px;
  border: 1.5px solid #d6c9a9;
  border-radius: 8px;
  outline: none;
  color: #26314e;
  background: #fffdf5;
  font: inherit;
  font-size: 11px;
  transition: border-color .2s, box-shadow .2s;
}

.sl-field input:focus,
.sl-field select:focus,
.sl-search input:focus {
  border-color: #c5a55f;
  box-shadow: 0 0 0 3px rgba(197,165,95,.2);
}

/* ===== SEARCH TOOLBAR ===== */

.sl-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 14px;
  flex-wrap: wrap;
}

.sl-search {
  position: relative;
  flex: 1;
  min-width: 230px;
  max-width: 560px;
}

.sl-search svg {
  position: absolute;
  left: 13px;
  top: 11px;
  color: #a18a58;
}

.sl-search input {
  height: 38px;
  padding-left: 39px;
  background: #fffdf6;
}

.sl-count {
  color: #586078;
  font-size: 10px;
}

.sl-count strong {
  color: #202945;
}

/* ===== TABLE OUTER BORDER ===== */

.sl-table-wrap {
  overflow-x: auto;
  border: 1.8px solid #c6b17f;
  border-radius: 12px;
  background: #fffdf5;
  box-shadow: 0 3px 12px rgba(88,69,34,.09);
}

.sl-table {
  width: 100%;
  min-width: 790px;
  border-collapse: separate;
  border-spacing: 0;
}

/* Navy to gold table heading */

.sl-table thead {
  background: linear-gradient(
    105deg,
    #202945 0%,
    #303b5d 65%,
    #a28b59 100%
  );
}

.sl-table th {
  padding: 13px 14px;
  border: none;
  color: #ffffff;
  background: transparent;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: .65px;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Clearly visible gold row borders */

.sl-table td {
  padding: 13px 14px;
  border-bottom: 1.3px solid #d9c9a3;
  color: #303950;
  font-size: 11px;
  white-space: nowrap;
  transition: background .2s ease;
}

.sl-table tbody tr:last-child td {
  border-bottom: none;
}

.sl-table td strong {
  color: #202945;
  font-size: 11px;
  font-weight: 800;
}

/* Cream and pale yellow alternating rows */

.sl-table tbody tr:nth-child(odd) {
  background: #fffdf5;
}

.sl-table tbody tr:nth-child(even) {
  background: #f8f1df;
}

.sl-table tbody tr {
  transition: background .2s ease;
  animation: slTableRowEnter .35s ease both;
}

.sl-table tbody tr:hover {
  background: #f0e5c9;
}

/* Status labels */

.sl-status {
  display: inline-flex;
  padding: 5px 9px;
  border: 1px solid transparent;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 850;
}

.sl-status.active {
  color: #28714d;
  border-color: #c4e2cc;
  background: #e1f1e5;
}

.sl-status.inactive {
  color: #a04a4a;
  border-color: #e9c2bf;
  background: #fce8e6;
}

/* Action buttons */

.sl-deactivate {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  border: 1.3px solid #bd8580;
  border-radius: 8px;
  color: #a34b46;
  background: #fffaf4;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
  transition: all .2s ease;
}

.sl-deactivate:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: #a34b46;
  background: #fff0ed;
  box-shadow: 0 4px 10px rgba(163,75,70,.12);
}

.sl-deactivate:disabled {
  opacity: .5;
  cursor: wait;
}

.sl-row-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.sl-view {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1.3px solid #cbb98f;
  border-radius: 9px;
  color: #303b5d;
  background: #fffaf0;
  cursor: pointer;
  transition: all .2s ease;
}

.sl-view:hover {
  transform: translateY(-2px);
  border-color: #a68a53;
  color: #ffffff;
  background: #202945;
  box-shadow: 0 5px 13px #20294522;
}

/* ===== EMPTY STATE AND PAGINATION ===== */

.sl-empty {
  padding: 45px 15px;
  text-align: center;
  color: #9299a8;
  font-size: 12px;
}

.sl-empty svg {
  display: block;
  margin: 0 auto 10px;
  color: #b6a47e;
}

.sl-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.sl-page-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
}

.sl-page-buttons button {
  min-width: 31px;
  height: 31px;
  border: 1px solid #d5c8a8;
  border-radius: 8px;
  color: #303b5d;
  background: #fffdf5;
  font-size: 10px;
  cursor: pointer;
  transition: all .2s ease;
}

.sl-page-buttons button:hover:not(:disabled) {
  border-color: #a68a53;
  transform: translateY(-2px);
}

.sl-page-buttons button.current {
  border-color: #202945;
  color: #ffffff;
  background: #202945;
}

.sl-page-buttons button:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.sl-page-size {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d5c8a8;
  border-radius: 8px;
  color: #303b5d;
  background: #fffdf5;
  font-size: 10px;
}

.sl-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 45px;
  color: #858ba0;
  font-size: 12px;
}

/* ===== LIST ANIMATIONS ===== */

@keyframes slStatEnter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slTableRowEnter {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== RESPONSIVE ===== */

@media(max-width:760px) {
  .sl-filter-grid {
    grid-template-columns: 1fr 1fr;
  }

  .sl-stats {
    gap: 9px;
  }
}

@media(max-width:520px) {
  .sl-stats {
    grid-template-columns: 1fr;
  }

  .sl-filter-grid {
    grid-template-columns: 1fr;
  }

  .sl-panel {
    padding: 12px;
  }

  .sl-filter-head {
    align-items: flex-start;
  }

  .sl-search {
    max-width: none;
    min-width: 100%;
  }
}

@media(prefers-reduced-motion:reduce) {
  .sl-stat,
  .sl-table tbody tr {
    animation: none !important;
    transition: none !important;
  }
}

        /* STUDENT DETAILS POPUP */
        .sl-modal-backdrop{
          position:fixed;
          inset:0;
          z-index:1000;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:18px;
          background:rgba(20,29,49,.72);
          backdrop-filter:blur(8px);
          animation:slBackdropIn .25s ease-out both;
        }

        .sl-modal{
          position:relative;
          width:min(780px,100%);
          max-height:min(88vh,920px);
          overflow:auto;
          border:2.5px solid ${COLORS.gold};
          border-radius:21px;
          background:linear-gradient(145deg,#fff 0%,#fffdf9 100%);
          box-shadow:0 0 0 5px #c19a521a,0 25px 80px #0c162a59;
          animation:slModalIn .38s cubic-bezier(.2,.8,.2,1) both;
        }

        .sl-modal::before{
          content:"";
          position:absolute;
          top:0;
          left:12%;
          width:76%;
          height:3px;
          border-radius:0 0 10px 10px;
          background:linear-gradient(90deg,transparent,#c19a52,#e7cc91,#c19a52,transparent);
        }

        .sl-modal-head{
          position:sticky;
          top:0;
          z-index:2;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:15px;
          padding:23px 26px;
          border-bottom:1px solid #eee6d7;
          background:linear-gradient(110deg,#fff,#fffaf0);
        }

        .sl-modal-head h2{
          margin:0 0 6px;
          color:${COLORS.navy};
          font-size:21px;
          font-weight:850;
          letter-spacing:-.5px;
        }

        .sl-modal-head p{
          margin:0;
          color:${COLORS.muted};
          font-size:11px;
        }

        .sl-modal-close{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          width:39px;
          height:39px;
          flex-shrink:0;
          border:1px solid #e9dfcb;
          border-radius:11px;
          color:#6f7585;
          background:#fff;
          cursor:pointer;
          transition:all .22s ease;
        }

        .sl-modal-close:hover{
          transform:rotate(90deg);
          border-color:${COLORS.gold};
          color:#fff;
          background:${COLORS.navy};
          box-shadow:0 5px 14px #2029452e;
        }

        .sl-detail-grid{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:13px;
          padding:23px 26px 27px;
        }

        .sl-detail-item{
          position:relative;
          min-width:0;
          padding:16px 17px;
          overflow:hidden;
          border:2px solid #e9e9ed;
          border-radius:13px;
          background:linear-gradient(135deg,#fff,#faf9f6);
          transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease;
          animation:slCardIn .4s ease both;
        }

        .sl-detail-item::before{
          content:"";
          position:absolute;
          top:13px;
          bottom:13px;
          left:0;
          width:3px;
          border-radius:0 5px 5px 0;
          background:${COLORS.gold};
          opacity:.75;
        }

        .sl-detail-item:hover{
          transform:translateY(-3px);
          border-color:#d7bd87;
          background:#fffdf8;
          box-shadow:0 8px 20px #20294512;
        }

        .sl-detail-item span{
          display:block;
          margin-bottom:8px;
          color:#8a8fa0;
          font-size:9px;
          font-weight:850;
          letter-spacing:1px;
          text-transform:uppercase;
        }

        .sl-detail-item strong{
          display:block;
          overflow-wrap:anywhere;
          color:${COLORS.ink};
          font-size:12px;
          font-weight:750;
          line-height:1.6;
        }

        /* ACTIVE STATUS - GREEN */
        .sl-detail-item.status-active{
          border-color:#b9e3ca;
          background:linear-gradient(135deg,#f4fff7,#eaf8ef);
        }

        .sl-detail-item.status-active::before{
          background:#26965c;
          opacity:1;
        }

        .sl-detail-item.status-active span{
          color:#39845b;
        }

        .sl-detail-item.status-active strong{
          display:inline-flex;
          align-items:center;
          gap:7px;
          width:fit-content;
          padding:6px 12px;
          border:1px solid #b9e3ca;
          border-radius:30px;
          color:#167443;
          background:#dff5e7;
          font-size:10px;
          letter-spacing:.5px;
        }

        .sl-detail-item.status-active strong::before{
          content:"";
          width:7px;
          height:7px;
          border-radius:50%;
          background:#26965c;
          box-shadow:0 0 0 3px #26965c21;
        }

        /* INACTIVE STATUS - RED */
        .sl-detail-item.status-inactive{
          border-color:#f0c5c5;
          background:linear-gradient(135deg,#fff8f8,#fff0f0);
        }

        .sl-detail-item.status-inactive::before{
          background:#d34d4d;
          opacity:1;
        }

        .sl-detail-item.status-inactive span{
          color:#a95c5c;
        }

        .sl-detail-item.status-inactive strong{
          display:inline-flex;
          align-items:center;
          gap:7px;
          width:fit-content;
          padding:6px 12px;
          border:1px solid #f0c5c5;
          border-radius:30px;
          color:#b52f2f;
          background:#ffe5e5;
          font-size:10px;
          letter-spacing:.5px;
        }

        .sl-detail-item.status-inactive strong::before{
          content:"";
          width:7px;
          height:7px;
          border-radius:50%;
          background:#d34d4d;
          box-shadow:0 0 0 3px #d34d4d1f;
        }

        @keyframes slBackdropIn{
          from{opacity:0}
          to{opacity:1}
        }

        @keyframes slModalIn{
          from{opacity:0;transform:translateY(22px) scale(.96)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }

        @keyframes slCardIn{
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }

        @media(max-width:760px){
          .sl-filter-grid{grid-template-columns:1fr 1fr;}
          .sl-stats{grid-template-columns:1fr 1fr;}
        }

        @media(max-width:520px){
          .sl-modal-backdrop{padding:10px;}
          .sl-modal{border-radius:16px;max-height:92vh;}
          .sl-modal-head{padding:17px;}
          .sl-modal-head h2{font-size:18px;}
          .sl-detail-grid{grid-template-columns:1fr;gap:10px;padding:16px;}
          .sl-detail-item{padding:14px 15px;}
        }

        @media(max-width:480px){
          .sl-filter-grid{grid-template-columns:1fr;}
          .sl-stats{grid-template-columns:1fr;}
          .sl-actions{width:100%;}
          .sl-actions button{flex:1;}
        }

        @media(prefers-reduced-motion:reduce){
          .sl-modal-backdrop,.sl-modal,.sl-detail-item{
            animation:none!important;
            transition:none!important;
          }
        }

        /* ===== REFINED STUDENT DETAILS DIALOG ===== */
        .sl-modal-backdrop{
          background:rgba(17,25,43,.66);
          backdrop-filter:blur(9px) saturate(115%);
          -webkit-backdrop-filter:blur(9px) saturate(115%);
        }
        .sl-modal{
          width:min(780px,100%);
          max-height:min(90vh,940px);
          padding:0;
          overflow:auto;
          border:1.5px solid #d8bd80;
          border-radius:22px;
          background:#fffdf8;
          box-shadow:0 0 0 5px rgba(193,154,82,.13),0 30px 90px rgba(8,17,35,.42);
          transform-origin:center center;
          animation:slModalSpring .62s cubic-bezier(.18,.89,.32,1.22) both;
          scrollbar-width:thin;
          scrollbar-color:#d5c294 #f8f5ed;
        }
        .sl-modal::before{display:none;}
        .sl-modal-head{
          padding:21px 24px 17px;
          background:linear-gradient(115deg,#fffdf7,#fff8e9);
          border-bottom:1px solid #eee4d0;
        }
        .sl-modal-head h2{
          margin:0 0 5px;
          font-size:22px;
          letter-spacing:-.55px;
        }
        .sl-modal-head p{font-size:11px;}
        .sl-modal-close{
          width:39px;height:39px;border-radius:50%;
          border:1px solid #e9dfcb;background:#fffdf8;
        }
        .sl-modal-close:hover{transform:rotate(90deg) scale(1.04);}
        .sl-profile-banner{
          display:flex;align-items:center;justify-content:space-between;
          gap:16px;margin:16px 21px 13px;padding:14px 17px;
          border:1px solid rgba(255,255,255,.14);
          border-radius:13px;color:#fff;
          background:linear-gradient(105deg,#202945 0%,#303b5d 100%);
          box-shadow:0 7px 18px rgba(32,41,69,.16);
          animation:slBannerSettle .55s .12s both;
        }
        .sl-profile-identity{min-width:0;display:flex;align-items:baseline;gap:7px;flex-wrap:wrap;}
        .sl-profile-identity strong{color:#fff;font-size:16px;font-weight:850;letter-spacing:-.2px;}
        .sl-profile-identity span{color:#d5d9e3;font-size:12px;}
        .sl-profile-status-wrap{display:flex;align-items:center;gap:10px;flex-shrink:0;}
        .sl-profile-status-label{color:#e7e9ef;font-size:9px;font-weight:800;letter-spacing:.6px;}
        .sl-profile-status{
          display:inline-flex;align-items:center;gap:7px;padding:6px 11px;
          border:1px solid rgba(255,255,255,.16);border-radius:30px;
          font-size:9px;font-weight:850;letter-spacing:.5px;
        }
        .sl-profile-status::before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 0 3px rgba(255,255,255,.1);}
        .sl-profile-status.active{color:#c9f4d8;background:rgba(44,151,91,.24);}
        .sl-profile-status.inactive{color:#ffd1d1;background:rgba(191,65,65,.22);}
        .sl-detail-sections{display:grid;gap:12px;padding:0 21px 22px;}
        .sl-detail-section{
          padding:12px 12px 13px;
          border:1.5px solid #cbb27c;
          border-radius:13px;
          background:linear-gradient(145deg,#fffefa 0%,#fff9ed 100%);
          box-shadow:0 4px 11px rgba(32,41,69,.055),inset 0 1px 0 #fff;
          animation:slSectionBounce .58s cubic-bezier(.2,.82,.28,1.18) both;
        }
        .sl-detail-section:nth-child(2){animation-delay:.09s;}
        .sl-detail-section:nth-child(3){animation-delay:.17s;}
        .sl-detail-section-head{
          display:flex;align-items:center;gap:8px;margin:0 0 10px;
          color:#27324d;font-size:10px;font-weight:900;letter-spacing:.45px;
        }
        .sl-detail-section-head-icon{
          width:27px;height:27px;display:grid;place-items:center;flex-shrink:0;
          border:1px solid #e8d9b8;border-radius:8px;color:#987638;background:#f8f0df;
        }
        .sl-detail-fields{
          display:grid;grid-template-columns:repeat(4,minmax(0,1fr));
          gap:9px 11px;
        }
        .sl-detail-field{
          min-width:0;display:flex;align-items:center;gap:8px;
          padding:8px 8px;border:1px solid #eee4cf;border-radius:10px;
          background:rgba(255,255,255,.66);
          transition:transform .24s cubic-bezier(.2,.8,.2,1),border-color .24s,box-shadow .24s,background .24s;
          animation:slFieldAppear .45s ease both;
        }
        .sl-detail-field:hover{
          transform:translateY(-2px) scale(1.012);
          border-color:#d5bd8c;background:#fff;
          box-shadow:0 5px 13px rgba(32,41,69,.08);
        }
        .sl-detail-field-icon{
          width:32px;height:32px;display:grid;place-items:center;flex-shrink:0;
          border:1px solid #e9ddc3;border-radius:10px;color:#987638;
          background:linear-gradient(145deg,#fbf5e8,#f2e8d2);
        }
        .sl-detail-field-copy{min-width:0;display:grid;gap:3px;}
        .sl-detail-field-copy span{
          color:#72788a;font-size:9px;font-weight:600;line-height:1.25;
        }
        .sl-detail-field-copy strong{
          display:block;overflow-wrap:anywhere;color:#252c43;
          font-size:11px;font-weight:800;line-height:1.35;
        }
        @keyframes slModalSpring{
          0%{opacity:0;transform:translateY(28px) scale(.78)}
          62%{opacity:1;transform:translateY(-4px) scale(1.018)}
          82%{transform:translateY(2px) scale(.995)}
          100%{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes slBannerSettle{
          0%{opacity:0;transform:translateY(9px) scale(.985)}
          70%{opacity:1;transform:translateY(-2px) scale(1.005)}
          100%{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes slSectionBounce{
          0%{opacity:0;transform:translateY(13px) scale(.975)}
          72%{opacity:1;transform:translateY(-2px) scale(1.004)}
          100%{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes slFieldAppear{
          from{opacity:0;transform:translateY(7px)}
          to{opacity:1;transform:translateY(0)}
        }
        @media(max-width:760px){
          .sl-detail-fields{grid-template-columns:repeat(2,minmax(0,1fr));}
        }
        @media(max-width:520px){
          .sl-modal{width:100%;max-height:93vh;border-radius:17px;}
          .sl-modal-head{padding:17px;}
          .sl-profile-banner{align-items:flex-start;flex-direction:column;margin:12px 13px;padding:12px 13px;gap:9px;}
          .sl-profile-status-wrap{width:100%;justify-content:space-between;}
          .sl-detail-sections{padding:0 13px 15px;gap:10px;}
          .sl-detail-section{padding:11px 10px;}
          .sl-detail-fields{grid-template-columns:1fr 1fr;gap:7px;}
          .sl-detail-field{padding:7px 6px;gap:6px;}
          .sl-detail-field-icon{width:29px;height:29px;}
          .sl-detail-field-copy span{font-size:8px;}
          .sl-detail-field-copy strong{font-size:10px;}
        }
        @media(max-width:360px){
          .sl-detail-fields{grid-template-columns:1fr;}
        }
        @media(prefers-reduced-motion:reduce){
          .sl-modal,.sl-profile-banner,.sl-detail-section,.sl-detail-field{
            animation:none!important;transition:none!important;
          }
        }
      `}</style>

      {/* PAGE HEADER */}

      <Link to="/admin/students" className="sl-back">
        <ArrowLeft size={15} />
        Back to Student Operations
      </Link>

      <div className="sl-top">
        <div>
          <span className="sm-eyebrow">
            ADMINISTRATION / STUDENT DIRECTORY
          </span>

          <h1>Student List</h1>

          <p>
            Browse student records, refine the listing, and manage student status.
          </p>
        </div>

        <div className="sl-actions">
          <button
            className="sm-button secondary"
            onClick={loadStudents}
            disabled={loading}
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          <button
            className="sm-button secondary"
            onClick={printStudents}
          >
            <Printer size={15} />
            Print
          </button>

          <button
            className="sm-button primary"
            onClick={exportExcel}
          >
            <FileDown size={15} />
            Excel
          </button>
        </div>
      </div>

      <Notice
        notice={notice}
        onClose={() => setNotice({ type: "", text: "" })}
      />

      {/* STATISTICS */}

      <div className="sl-stats">
        <div className="sl-stat">
          <span>Matching Students</span>
          <strong>{filteredStudents.length}</strong>
        </div>

        <div className="sl-stat">
          <span>Active Students</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="sl-stat">
          <span>Inactive Students</span>
          <strong>{inactiveCount}</strong>
        </div>
      </div>

      {/* FILTERS AND TABLE */}

      <section className="sl-panel">
        <div className="sl-filter-head">
          <h3>
            <SlidersHorizontal size={18} />
            Refine Student Listing
          </h3>

          <button
            className="sm-text-button"
            onClick={resetFilters}
          >
            Reset all
          </button>
        </div>

        <div className="sl-filter-grid">
          <div className="sl-field">
            <label>Course / Department</label>

            <select
              value={course}
              onChange={event => setCourse(event.target.value)}
            >
              <option value="ALL">All Courses</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
            </select>
          </div>

          <div className="sl-field">
            <label>Student Status</label>

            <select
              value={status}
              onChange={event => setStatus(event.target.value)}
            >
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
              placeholder="Search student ID, name, roll number, course..."
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
                <th>Student ID</th>
                <th>Student Name</th>
                <th>University Roll No.</th>
                <th>Course</th>
                <th>Session</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">
                    <div className="sl-loading">
                      <LoaderCircle className="sm-spin" size={19} />
                      Loading student records...
                    </div>
                  </td>
                </tr>
              ) : pageStudents.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="sl-empty">
                      <Users size={30} />

                      {students.length === 0
                        ? "Student records will appear here when the Admin list API is connected."
                        : "No students match the selected filters."}
                    </div>
                  </td>
                </tr>
              ) : (
                pageStudents.map(student => {
                  const active = activeStudent(student);
                  const id = String(student.studentId || "");

                  return (
                    <tr key={id}>
                      <td>
                        <strong>{displayValue(id)}</strong>
                      </td>

                      <td>{displayValue(student.name)}</td>

                      <td>
                        {displayValue(student.universityRollNo)}
                      </td>

                      <td>
                        {displayValue(student.courseId || student.course)}
                      </td>

                      <td>
                        {displayValue(
                          student.sessionId ||
                          student.session ||
                          student.admissionYear
                        )}
                      </td>

                      <td>
                        <span
                          className={`sl-status ${active ? "active" : "inactive"}`}
                        >
                          {active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>

                      <td>
                        <div className="sl-row-actions">
                          <button
                            type="button"
                            className="sl-view"
                            title="View full student details"
                            aria-label={`View details for ${student.name || id}`}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye size={15} />
                          </button>

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
                          ) : (
                            <span className="sl-count">Inactive</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="sl-pagination">
          <div className="sl-count">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            {" · "}
            {filteredStudents.length} records
          </div>

          <div className="sl-page-buttons">
            <select
              className="sl-page-size"
              value={pageSize}
              onChange={event => setPageSize(Number(event.target.value))}
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              title="First page"
            >
              <ChevronsLeft size={14} />
            </button>

            <button
              onClick={() => setPage(value => Math.max(1, value - 1))}
              disabled={page === 1}
              title="Previous page"
            >
              <ChevronLeft size={14} />
            </button>

            <button className="current">
              {page}
            </button>

            <button
              onClick={() => setPage(value => Math.min(totalPages, value + 1))}
              disabled={page === totalPages}
              title="Next page"
            >
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              title="Last page"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* STUDENT DETAILS POPUP */}
      {selectedStudent && (
        <div
          className="sl-modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setSelectedStudent(null);
            }
          }}
        >
          <section
            className="sl-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-detail-title"
          >
            <div className="sl-modal-head">
              <div>
                <h2 id="student-detail-title">Student Details</h2>
                <p>Read-only student information</p>
              </div>

              <button
                type="button"
                className="sl-modal-close"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close student details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="sl-profile-banner">
              <div className="sl-profile-identity">
                <strong>{displayValue(selectedStudent.name)}</strong>
                <span>({displayValue(selectedStudent.studentId)})</span>
              </div>

              <div className="sl-profile-status-wrap">
                <span className="sl-profile-status-label">ACCOUNT STATUS</span>
                <span className={`sl-profile-status ${activeStudent(selectedStudent) ? "active" : "inactive"}`}>
                  {activeStudent(selectedStudent) ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>

            <div className="sl-detail-sections">
              {detailSections.map((section, sectionIndex) => (
                <section className="sl-detail-section" key={section.title}>
                  <h3 className="sl-detail-section-head">
                    <span className="sl-detail-section-head-icon">
                      {section.icon}
                    </span>
                    {section.title}
                  </h3>

                  <div className="sl-detail-fields">
                    {section.fields.map((field, fieldIndex) => (
                      <div
                        className="sl-detail-field"
                        key={field.label}
                        style={{
                          animationDelay: `${0.12 + sectionIndex * 0.08 + fieldIndex * 0.045}s`
                        }}
                      >
                        <span className="sl-detail-field-icon">
                          {field.icon}
                        </span>
                        <span className="sl-detail-field-copy">
                          <span>{field.label}</span>
                          <strong>{displayValue(field.value)}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

