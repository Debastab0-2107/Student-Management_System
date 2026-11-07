
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import api from "../../services/api";
import {
  BookOpen,
  Search,
  RefreshCw,
  Upload,
  Download,
  Printer,
  FileSpreadsheet,
  FileUp,
  X,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileDown,
  Layers3,
  BookPlus,
} from "lucide-react";

const COLORS = {
  navy: "#202945",
  navyLight: "#303b5d",
  gold: "#c19a52",
  goldLight: "#fbf4e7",
  ink: "#252c43",
  muted: "#858ba0",
};

const SUBJECT_COLUMNS = [
  "subjectId",
  "subjectName",
  "courseId",
  "semesterId",
];

const EMPTY_FILTERS = {
  course: "ALL",
  semester: "ALL",
  status: "ALL",
};

function safeText(value) {
  return String(value ?? "").trim();
}

function isActive(subject) {
  return (
    subject.active === true ||
    String(subject.active).toLowerCase() === "true"
  );
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function Notice({ notice, onClose }) {
  if (!notice.text) return null;

  return (
    <div className={`sub-notice ${notice.type}`}>
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
        <X size={16} />
      </button>
    </div>
  );
}

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const [notice, setNotice] = useState({
    type: "",
    text: "",
  });

  const [uploadType, setUploadType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fileInputRef = useRef(null);

  // --------------------------------------------------
  // LOAD SUBJECTS
  // --------------------------------------------------

  async function loadSubjects(showLoader = true) {
    if (showLoader) setLoading(true);

    try {
      const response = await api.get("/subject");

      setSubjects(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      if (showLoader) setLoading(false);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  // --------------------------------------------------
  // FILTER OPTIONS
  // --------------------------------------------------

  const courseOptions = useMemo(() => {
    return [
      ...new Set(
        subjects
          .map((subject) => safeText(subject.courseId))
          .filter(Boolean)
      ),
    ].sort();
  }, [subjects]);

  const semesterOptions = useMemo(() => {
    return [
      ...new Set(
        subjects
          .map((subject) => safeText(subject.semesterId))
          .filter(Boolean)
      ),
    ].sort();
  }, [subjects]);

  // --------------------------------------------------
  // SEARCH AND FILTER
  // --------------------------------------------------

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !query ||
        safeText(subject.subjectId).toLowerCase().includes(query) ||
        safeText(subject.subjectName).toLowerCase().includes(query) ||
        safeText(subject.courseId).toLowerCase().includes(query) ||
        safeText(subject.semesterId).toLowerCase().includes(query);

      const matchesCourse =
        filters.course === "ALL" ||
        safeText(subject.courseId) === filters.course;

      const matchesSemester =
        filters.semester === "ALL" ||
        safeText(subject.semesterId) === filters.semester;

      const matchesStatus =
        filters.status === "ALL" ||
        (filters.status === "ACTIVE" && isActive(subject)) ||
        (filters.status === "INACTIVE" && !isActive(subject));

      return (
        matchesSearch &&
        matchesCourse &&
        matchesSemester &&
        matchesStatus
      );
    });
  }, [subjects, search, filters]);

  // --------------------------------------------------
  // SUMMARY COUNTS
  // --------------------------------------------------

  const activeCount = subjects.filter(isActive).length;
  const inactiveCount = subjects.length - activeCount;

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubjects.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedSubjects = filteredSubjects.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, pageSize]);

  // --------------------------------------------------
  // RESET FILTERS
  // --------------------------------------------------

  function resetFilters() {
    setSearch("");
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  }

  // --------------------------------------------------
  // OPEN EXCEL UPLOAD
  // --------------------------------------------------

  function openUpload(type) {
    setUploadType(type);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function closeUpload() {
    if (working) return;

    setUploadType("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // --------------------------------------------------
  // EXCEL HEADER VALIDATION
  // --------------------------------------------------

  async function validateExcelFile(file, type) {
    if (!file) {
      throw new Error("Please select an Excel file.");
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      throw new Error("Only .xlsx and .xls files are supported.");
    }

    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
      type: "array",
    });

    if (!workbook.SheetNames.length) {
      throw new Error("The Excel workbook has no worksheet.");
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    if (!rows.length || !rows[0]) {
      throw new Error("The Excel file is empty.");
    }

    const headers = rows[0].map((value) =>
      safeText(value)
    );

    const requiredHeaders =
      type === "deactivate"
        ? ["subjectId"]
        : SUBJECT_COLUMNS;

    const headersMatch =
      headers.length === requiredHeaders.length &&
      requiredHeaders.every(
        (header, index) => headers[index] === header
      );

    if (!headersMatch) {
      throw new Error(
        type === "deactivate"
          ? "Incorrect Excel columns. Required order: subjectId"
          : "Incorrect Excel columns. Required order: subjectId, subjectName, courseId, semesterId"
      );
    }

    if (rows.length < 2) {
      throw new Error("The Excel file contains no subject records.");
    }

    return rows;
  }

  // --------------------------------------------------
  // EXCEL UPLOAD
  // --------------------------------------------------

  async function handleUpload() {
    if (!selectedFile) {
      setNotice({
        type: "error",
        text: "Please choose an Excel file first.",
      });
      return;
    }

    setWorking(true);
    setNotice({ type: "", text: "" });

    try {
      await validateExcelFile(selectedFile, uploadType);

      const formData = new FormData();
      formData.append("file", selectedFile);

      let endpoint = "";
      let successMessage = "";

      if (uploadType === "import") {
        endpoint = "/admin/subjects/upload";
        successMessage = "Subjects imported successfully.";
      } else if (uploadType === "update") {
        endpoint = "/admin/subjects/update-upload";
        successMessage = "Subjects updated successfully.";
      } else if (uploadType === "deactivate") {
        endpoint = "/admin/subjects/deactivate-upload";
        successMessage = "Subject deactivation completed.";
      } else {
        throw new Error("Invalid upload operation.");
      }

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const serverMessage =
        response.data?.message || successMessage;

      setNotice({
        type: "success",
        text: serverMessage,
      });

      closeUpload();

      await loadSubjects(false);
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setWorking(false);
    }
  }

  // --------------------------------------------------
  // EXPORT EXCEL
  // --------------------------------------------------

  function exportExcel() {
    if (!filteredSubjects.length) {
      setNotice({
        type: "error",
        text: "There are no subjects to export.",
      });
      return;
    }

    const rows = filteredSubjects.map((subject) => ({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      courseId: subject.courseId,
      semesterId: subject.semesterId,
      status: isActive(subject) ? "ACTIVE" : "INACTIVE",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 35 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Subjects"
    );

    XLSX.writeFile(
      workbook,
      "Subject_List.xlsx"
    );
  }

  // --------------------------------------------------
  // PRINT SUBJECT LIST
  // --------------------------------------------------

  function printSubjects() {
    if (!filteredSubjects.length) {
      setNotice({
        type: "error",
        text: "There are no subjects to print.",
      });
      return;
    }

    window.print();
  }

  // --------------------------------------------------
  // DOWNLOAD EXCEL TEMPLATES
  // --------------------------------------------------

  function downloadTemplate(type) {
    let headers;
    let sample;
    let filename;

    if (type === "deactivate") {
      headers = [["subjectId"]];
      sample = [["SUB001"]];
      filename = "Subject_Deactivation_Template.xlsx";
    } else {
      headers = [SUBJECT_COLUMNS];
      sample = [
        [
          "SUB001",
          "Example Subject",
          "MCA",
          "SEM1",
        ],
      ];

      filename =
        type === "update"
          ? "Subject_Update_Template.xlsx"
          : "Subject_Import_Template.xlsx";
    }

    const worksheet = XLSX.utils.aoa_to_sheet([
      ...headers,
      ...sample,
    ]);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Subjects"
    );

    XLSX.writeFile(workbook, filename);
  }

  // --------------------------------------------------
  // UPLOAD MODAL CONTENT
  // --------------------------------------------------

  const uploadInformation = {
    import: {
      title: "Import Subjects",
      description:
        "Upload an Excel file to add new subjects to the department.",
      endpoint: "POST /admin/subjects/upload",
      columns:
        "subjectId | subjectName | courseId | semesterId",
      button: "Import Subjects",
    },
    update: {
      title: "Update Subjects",
      description:
        "Upload an Excel file to update existing subject information.",
      endpoint: "POST /admin/subjects/update-upload",
      columns:
        "subjectId | subjectName | courseId | semesterId",
      button: "Update Subjects",
    },
    deactivate: {
      title: "Deactivate Subjects",
      description:
        "Upload an Excel file containing the IDs of subjects to deactivate.",
      endpoint: "POST /admin/subjects/deactivate-upload",
      columns: "subjectId",
      button: "Deactivate Subjects",
    },
  };

  const currentUpload = uploadInformation[uploadType];

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="subject-page">
      <style>{`
        .subject-page {
          max-width: 1250px;
          margin: 0 auto;
          color: ${COLORS.ink};
          animation: subject-enter .4s ease both;
        }

        .subject-page * {
          box-sizing: border-box;
        }

        @keyframes subject-enter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .subject-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 23px;
        }

        .subject-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          color: #a27c37;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .subject-heading h1 {
          margin: 0;
          color: ${COLORS.navy};
          font-size: clamp(25px, 3vw, 34px);
          letter-spacing: -.8px;
        }

        .subject-heading p:last-child {
          margin: 9px 0 0;
          color: ${COLORS.muted};
          font-size: 12px;
          line-height: 1.7;
        }

        .subject-heading-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .subject-btn {
          min-height: 39px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid #e0e3eb;
          border-radius: 9px;
          color: ${COLORS.navy};
          background: white;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
          transition: .2s ease;
        }

        .subject-btn:hover {
          border-color: ${COLORS.gold};
          transform: translateY(-1px);
        }

        .subject-btn.primary {
          border-color: ${COLORS.navy};
          color: white;
          background: ${COLORS.navy};
        }

        .subject-btn.primary:hover {
          background: ${COLORS.navyLight};
        }

        .subject-btn.gold {
          border-color: ${COLORS.gold};
          color: #725522;
          background: ${COLORS.goldLight};
        }

        .subject-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 21px;
        }

        .subject-stat {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          padding: 17px;
          border: 1px solid #ffffffd6;
          border-radius: 14px;
          background: #ffffffd9;
          box-shadow: 0 7px 22px #20294509;
        }

        .subject-stat-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #a27c37;
          background: ${COLORS.goldLight};
        }

        .subject-stat span {
          display: block;
          color: ${COLORS.muted};
          font-size: 10px;
          font-weight: 700;
        }

        .subject-stat strong {
          display: block;
          margin-top: 4px;
          color: ${COLORS.navy};
          font-size: 23px;
          line-height: 1;
        }

        .sub-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          margin-bottom: 17px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.5;
        }

        .sub-notice.success {
          border: 1px solid #b9dfc7;
          color: #236a3c;
          background: #edf8f0;
        }

        .sub-notice.error {
          border: 1px solid #efc3c3;
          color: #a52e2e;
          background: #fff1f1;
        }

        .sub-notice span {
          flex: 1;
        }

        .sub-notice button {
          display: grid;
          place-items: center;
          padding: 3px;
          border: 0;
          color: inherit;
          background: transparent;
          cursor: pointer;
        }

        .subject-toolbar {
          padding: 18px;
          margin-bottom: 17px;
          border: 1px solid #ffffffd6;
          border-radius: 15px;
          background: #ffffffd9;
          box-shadow: 0 7px 22px #20294509;
        }

        .subject-toolbar-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .subject-toolbar-title {
          display: flex;
          align-items: center;
          gap: 9px;
          color: ${COLORS.navy};
          font-size: 13px;
          font-weight: 800;
        }

        .subject-search {
          position: relative;
          flex: 1;
          max-width: 460px;
        }

        .subject-search svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #969caf;
        }

        .subject-search input {
          width: 100%;
          height: 41px;
          padding: 0 13px 0 39px;
          border: 1px solid #e0e3eb;
          border-radius: 9px;
          outline: none;
          color: ${COLORS.ink};
          background: #fff;
          font-size: 12px;
        }

        .subject-search input:focus,
        .subject-filter select:focus {
          border-color: ${COLORS.gold};
          box-shadow: 0 0 0 3px #c19a521c;
        }

        .subject-filter-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
          gap: 12px;
          align-items: end;
        }

        .subject-filter label {
          display: block;
          margin-bottom: 6px;
          color: #697188;
          font-size: 10px;
          font-weight: 750;
        }

        .subject-filter select {
          width: 100%;
          height: 39px;
          padding: 0 10px;
          border: 1px solid #e0e3eb;
          border-radius: 8px;
          outline: none;
          color: ${COLORS.ink};
          background: white;
          font-size: 11px;
        }

        .subject-table-card {
          overflow: hidden;
          border: 1px solid #ffffffd6;
          border-radius: 15px;
          background: #ffffffdf;
          box-shadow: 0 8px 25px #2029450a;
        }

        .subject-table-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 17px 19px;
          border-bottom: 1px solid #eceef3;
        }

        .subject-table-heading h2 {
          margin: 0;
          color: ${COLORS.navy};
          font-size: 14px;
        }

        .subject-table-heading span {
          color: ${COLORS.muted};
          font-size: 10px;
        }

        .subject-table-scroll {
          overflow-x: auto;
          width: 100%;
        }

        .subject-table {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
          text-align: left;
        }

        .subject-table th {
          padding: 13px 16px;
          color: #687189;
          background: #f7f8fb;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .4px;
          white-space: nowrap;
        }

        .subject-table td {
          padding: 14px 16px;
          border-top: 1px solid #eef0f4;
          color: #4d566d;
          font-size: 11px;
        }

        .subject-table tbody tr:hover {
          background: #fbf9f4;
        }

        .subject-id {
          color: ${COLORS.navy};
          font-weight: 800;
        }

        .subject-name {
          color: ${COLORS.ink};
          font-weight: 700;
        }

        .subject-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 800;
        }

        .subject-status.active {
          color: #247044;
          background: #e9f7ee;
        }

        .subject-status.inactive {
          color: #9c4d36;
          background: #fff0e9;
        }

        .subject-status::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .subject-empty {
          padding: 48px 20px;
          color: ${COLORS.muted};
          text-align: center;
          font-size: 12px;
        }

        .subject-empty svg {
          display: block;
          margin: 0 auto 12px;
          color: #c19a52;
        }

        .subject-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding: 14px 17px;
          border-top: 1px solid #eceef3;
        }

        .subject-pagination-info {
          color: ${COLORS.muted};
          font-size: 10px;
        }

        .subject-pagination-controls {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .subject-pagination-controls button {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid #e3e6ed;
          border-radius: 7px;
          color: ${COLORS.navy};
          background: white;
          cursor: pointer;
        }

        .subject-pagination-controls button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .subject-pagination-controls button.current {
          border-color: ${COLORS.navy};
          color: white;
          background: ${COLORS.navy};
        }

        .subject-page-size {
          height: 30px;
          padding: 0 8px;
          border: 1px solid #e3e6ed;
          border-radius: 7px;
          color: ${COLORS.ink};
          background: white;
          font-size: 10px;
        }

        .subject-upload-overlay {
          position: fixed;
          z-index: 2000;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 18px;
          background: #151d31a6;
          backdrop-filter: blur(5px);
        }

        .subject-upload-modal {
          width: 100%;
          max-width: 510px;
          padding: 24px;
          border: 1px solid #ffffff;
          border-radius: 17px;
          background: #fff;
          box-shadow: 0 25px 80px #10182c55;
          animation: subject-modal-enter .2s ease both;
        }

        @keyframes subject-modal-enter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .subject-modal-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .subject-modal-icon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #a27c37;
          background: ${COLORS.goldLight};
        }

        .subject-modal-top h2 {
          margin: 13px 0 5px;
          color: ${COLORS.navy};
          font-size: 20px;
        }

        .subject-modal-top p {
          margin: 0;
          color: ${COLORS.muted};
          font-size: 11px;
          line-height: 1.7;
        }

        .subject-modal-close {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid #e5e7ed;
          border-radius: 8px;
          color: #687189;
          background: white;
          cursor: pointer;
        }

        .subject-format-box {
          padding: 13px;
          margin: 19px 0;
          border: 1px solid #eadbb9;
          border-radius: 10px;
          background: #fcf8ef;
        }

        .subject-format-box strong {
          display: block;
          margin-bottom: 7px;
          color: #80612b;
          font-size: 10px;
        }

        .subject-format-box code {
          display: block;
          overflow-wrap: anywhere;
          color: #5b4b2c;
          font-size: 10px;
          line-height: 1.8;
        }

        .subject-template-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 10px;
          padding: 0;
          border: 0;
          color: #8a682d;
          background: transparent;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .subject-file-label {
          display: block;
          margin-bottom: 7px;
          color: ${COLORS.ink};
          font-size: 11px;
          font-weight: 800;
        }

        .subject-file-input {
          width: 100%;
          padding: 12px;
          border: 1px dashed #cbd0dc;
          border-radius: 10px;
          color: #59627a;
          background: #fafbfc;
          font-size: 11px;
        }

        .subject-selected-file {
          margin-top: 8px;
          color: #247044;
          font-size: 10px;
          overflow-wrap: anywhere;
        }

        .subject-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 21px;
        }

        .subject-modal-actions button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        @media(max-width: 800px) {
          .subject-heading-actions {
            width: 100%;
          }

          .subject-filter-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media(max-width: 560px) {
          .subject-stats {
            grid-template-columns: 1fr;
          }

          .subject-stat {
            padding: 13px;
          }

          .subject-toolbar-top {
            align-items: stretch;
            flex-direction: column;
          }

          .subject-search {
            max-width: none;
          }

          .subject-filter-grid {
            grid-template-columns: 1fr;
          }

          .subject-heading-actions .subject-btn {
            flex: 1 1 45%;
          }

          .subject-pagination {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media print {
          @page {
            size: landscape;
            margin: 12mm;
          }

          body * {
            visibility: hidden !important;
          }

          .subject-print-area,
          .subject-print-area * {
            visibility: visible !important;
          }

          .subject-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
          }

          .subject-no-print {
            display: none !important;
          }

          .subject-table-card {
            border: 0 !important;
            box-shadow: none !important;
          }

          .subject-table {
            min-width: 0 !important;
          }

          .subject-table th,
          .subject-table td {
            color: black !important;
            border: 1px solid #ccc !important;
          }

          .subject-table th {
            background: #eee !important;
          }
        }

        @media(prefers-reduced-motion: reduce) {
          .subject-page,
          .subject-upload-modal {
            animation: none !important;
          }
        }
      `}</style>

      {/* PAGE HEADER */}

      <div className="subject-heading">
        <div>
          <p className="subject-kicker">
            <BookOpen size={14} />
            ACADEMIC MANAGEMENT
          </p>

          <h1>Subject Management</h1>

          <p>
            View and manage the subjects offered under the department's
            academic courses.
          </p>
        </div>

        <div className="subject-heading-actions subject-no-print">
          <button
            type="button"
            className="subject-btn"
            onClick={() => loadSubjects()}
            disabled={loading}
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          <button
            type="button"
            className="subject-btn"
            onClick={printSubjects}
          >
            <Printer size={15} />
            Print
          </button>

          <button
            type="button"
            className="subject-btn"
            onClick={exportExcel}
          >
            <FileDown size={15} />
            Export Excel
          </button>
        </div>
      </div>

      <Notice
        notice={notice}
        onClose={() => setNotice({ type: "", text: "" })}
      />

      {/* SUMMARY CARDS */}

      <div className="subject-stats">
        <div className="subject-stat">
          <div className="subject-stat-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <span>Total Subjects</span>
            <strong>{subjects.length}</strong>
          </div>
        </div>

        <div className="subject-stat">
          <div className="subject-stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Active Subjects</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="subject-stat">
          <div className="subject-stat-icon">
            <Layers3 size={21} />
          </div>

          <div>
            <span>Inactive Subjects</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </div>

      {/* EXCEL ACTIONS */}

      <div className="subject-toolbar subject-no-print">
        <div className="subject-toolbar-top">
          <div className="subject-toolbar-title">
            <FileSpreadsheet size={18} />
            Excel Operations
          </div>
        </div>

        <div className="subject-heading-actions">
          <button
            type="button"
            className="subject-btn primary"
            onClick={() => openUpload("import")}
          >
            <Upload size={15} />
            Import Subjects
          </button>

          <button
            type="button"
            className="subject-btn"
            onClick={() => openUpload("update")}
          >
            <FileSpreadsheet size={15} />
            Update Subjects
          </button>

          <button
            type="button"
            className="subject-btn gold"
            onClick={() => openUpload("deactivate")}
          >
            <FileUp size={15} />
            Delete Subjects via Excel
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}

      <div className="subject-toolbar subject-no-print">
        <div className="subject-toolbar-top">
          <div className="subject-toolbar-title">
            <SlidersHorizontal size={18} />
            Search and Filters
          </div>

          <button
            type="button"
            className="subject-btn"
            onClick={() => setFiltersExpanded((value) => !value)}
          >
            {filtersExpanded ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="subject-search" style={{ maxWidth: "none" }}>
          <Search size={17} />

          <input
            type="text"
            placeholder="Search by subject ID, name, course ID or semester ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {filtersExpanded && (
          <div
            className="subject-filter-grid"
            style={{ marginTop: 15 }}
          >
            <div className="subject-filter">
              <label>COURSE</label>

              <select
                value={filters.course}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    course: event.target.value,
                  }))
                }
              >
                <option value="ALL">All Courses</option>

                {courseOptions.map((course) => (
                  <option value={course} key={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="subject-filter">
              <label>SEMESTER</label>

              <select
                value={filters.semester}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    semester: event.target.value,
                  }))
                }
              >
                <option value="ALL">All Semesters</option>

                {semesterOptions.map((semester) => (
                  <option value={semester} key={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>

            <div className="subject-filter">
              <label>STATUS</label>

              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    status: event.target.value,
                  }))
                }
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <button
              type="button"
              className="subject-btn"
              onClick={resetFilters}
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* SUBJECT TABLE */}

      <div className="subject-table-card subject-print-area">
        <div className="subject-table-heading">
          <div>
            <h2>Subject Directory</h2>
            <span>
              {filteredSubjects.length} matching subject(s)
            </span>
          </div>

          <span>DEPARTMENT SUBJECT RECORDS</span>
        </div>

        {loading ? (
          <div className="subject-empty">
            <LoaderCircle
              size={28}
              className="subject-spin"
            />
            Loading subjects...
          </div>
        ) : (
          <>
            <div className="subject-table-scroll">
              <table className="subject-table">
                <thead>
                  <tr>
                    <th>SL. NO.</th>
                    <th>SUBJECT ID</th>
                    <th>SUBJECT NAME</th>
                    <th>COURSE ID</th>
                    <th>SEMESTER ID</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedSubjects.length ? (
                    paginatedSubjects.map((subject, index) => (
                      <tr key={subject.subjectId}>
                        <td>
                          {(safePage - 1) * pageSize + index + 1}
                        </td>

                        <td className="subject-id">
                          {subject.subjectId}
                        </td>

                        <td className="subject-name">
                          {subject.subjectName}
                        </td>

                        <td>{subject.courseId}</td>

                        <td>{subject.semesterId}</td>

                        <td>
                          <span
                            className={`subject-status ${
                              isActive(subject)
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {isActive(subject)
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <div className="subject-empty">
                          <BookOpen size={30} />

                          {subjects.length
                            ? "No subjects match your search or filters."
                            : "No subjects are available in the database yet."}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="subject-pagination subject-no-print">
              <div className="subject-pagination-info">
                Showing{" "}
                {filteredSubjects.length
                  ? (safePage - 1) * pageSize + 1
                  : 0}
                {" - "}
                {Math.min(safePage * pageSize, filteredSubjects.length)}
                {" of "}
                {filteredSubjects.length} subjects
              </div>

              <div className="subject-pagination-controls">
                <select
                  className="subject-page-size"
                  value={pageSize}
                  onChange={(event) =>
                    setPageSize(Number(event.target.value))
                  }
                  aria-label="Rows per page"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>

                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage(1)}
                  aria-label="First page"
                >
                  <ChevronsLeft size={15} />
                </button>

                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>

                <button type="button" className="current">
                  {safePage}
                </button>

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  aria-label="Next page"
                >
                  <ChevronRight size={15} />
                </button>

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  aria-label="Last page"
                >
                  <ChevronsRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* EXCEL UPLOAD MODAL */}

      {uploadType && currentUpload && (
        <div
          className="subject-upload-overlay subject-no-print"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeUpload();
            }
          }}
        >
          <div
            className="subject-upload-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subject-upload-title"
          >
            <div className="subject-modal-top">
              <div>
                <div className="subject-modal-icon">
                  <FileSpreadsheet size={23} />
                </div>

                <h2 id="subject-upload-title">
                  {currentUpload.title}
                </h2>

                <p>{currentUpload.description}</p>
              </div>

              <button
                type="button"
                className="subject-modal-close"
                onClick={closeUpload}
                disabled={working}
                aria-label="Close upload window"
              >
                <X size={17} />
              </button>
            </div>

            <div className="subject-format-box">
              <strong>REQUIRED EXCEL COLUMN ORDER</strong>

              <code>{currentUpload.columns}</code>

              <button
                type="button"
                className="subject-template-link"
                onClick={() => downloadTemplate(uploadType)}
              >
                <Download size={14} />
                Download Excel Template
              </button>
            </div>

            <label className="subject-file-label">
              Select Excel File (.xlsx / .xls)
            </label>

            <input
              ref={fileInputRef}
              className="subject-file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] || null)
              }
            />

            {selectedFile && (
              <div className="subject-selected-file">
                Selected: {selectedFile.name}
              </div>
            )}

            <div className="subject-modal-actions">
              <button
                type="button"
                className="subject-btn"
                onClick={closeUpload}
                disabled={working}
              >
                Cancel
              </button>

              <button
                type="button"
                className="subject-btn primary"
                onClick={handleUpload}
                disabled={working || !selectedFile}
              >
                {working ? (
                  <>
                    <LoaderCircle size={15} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    {currentUpload.button}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectManagement;
