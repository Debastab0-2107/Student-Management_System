
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import api from "../../services/api";
import {
  BookOpen, Search, RefreshCw, Upload, Download, Printer,
  FileSpreadsheet, FileUp, X, CheckCircle2, AlertCircle,
  LoaderCircle, SlidersHorizontal, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Users, Plus, FilePenLine,
  BookX, UserPlus, UserRoundCog, UserMinus, AlertTriangle
} from "lucide-react";

const COLORS = {
  navy: "#202945",
  navyLight: "#303b5d",
  gold: "#c19a52",
  goldLight: "#fbf4e7",
  ink: "#252c43",
  muted: "#858ba0",
  red: "#ad4146",
  green: "#246747",
};

const SUBJECT_COLUMNS = [
  "subjectId", "subjectName", "courseId", "semesterId"
];

const ASSIGNMENT_COLUMNS = [
  "teacherId", "subjectId", "sessionId", "action"
];

const EMPTY_FILTERS = {
  course: "ALL",
  semester: "ALL",
  status: "ALL",
};

const OPERATIONS = [
  {
    key: "addSubject",
    label: "Add Subject",
    description: "Import new subject records",
    icon: Plus,
    tone: "red",
  },
  {
    key: "updateSubject",
    label: "Update Subject",
    description: "Update existing subject details",
    icon: FilePenLine,
    tone: "navy",
  },
  {
    key: "deleteSubject",
    label: "Delete Subject",
    description: "Delete subjects through Excel",
    icon: BookX,
    tone: "danger",
  },
  {
    key: "assignTeacher",
    label: "Assign Teacher",
    description: "Assign one or multiple teachers",
    icon: UserPlus,
    tone: "green",
  },
  {
    key: "reassignTeacher",
    label: "Reassign Teacher",
    description: "Replace an existing teacher",
    icon: UserRoundCog,
    tone: "gold",
  },
  {
    key: "deleteAssignment",
    label: "Delete Assignment",
    description: "Remove a subject-teacher link",
    icon: UserMinus,
    tone: "plum",
  },
];

const OPERATION_INFO = {
  addSubject: {
    title: "Add Subject",
    description: "Upload an Excel file to add new subjects.",
    endpoint: "/admin/subjects/upload",
    success: "Subjects added successfully.",
    columns: SUBJECT_COLUMNS,
    template: "Subject_Add_Template.xlsx",
    sheet: "Add Subjects",
    sample: [
      ["SUB001", "Example Subject", "MCA", "SEM1"]
    ],
    helper: "Use a unique subjectId for every new subject.",
    action: "Add Subjects",
  },

  updateSubject: {
    title: "Update Subject",
    description: "Update existing subject information.",
    endpoint: "/admin/subjects/update-upload",
    success: "Subjects updated successfully.",
    columns: SUBJECT_COLUMNS,
    template: "Subject_Update_Template.xlsx",
    sheet: "Update Subjects",
    sample: [
      ["SUB001", "Updated Subject Name", "MCA", "SEM1"]
    ],
    helper: "Use the existing subjectId. Do not change the ID.",
    action: "Update Subjects",
  },

  deleteSubject: {
    title: "Delete Subject",
    description: "Upload subject IDs to deactivate subjects.",
    endpoint: "/admin/subjects/deactivate-upload",
    success: "Subject deletion completed.",
    columns: ["subjectId"],
    template: "Subject_Delete_Template.xlsx",
    sheet: "Delete Subjects",
    sample: [["SUB001"]],
    helper: "The existing backend uses deactivation (soft deletion).",
    action: "Delete Subjects",
  },

  assignTeacher: {
    title: "Assign Teacher",
    description: "Assign one or multiple teachers to subjects.",
    endpoint: "/api/admin/upload/assignments",
    success: "Teacher assignments uploaded successfully.",
    columns: ASSIGNMENT_COLUMNS,
    template: "Assign_Teacher_Template.xlsx",
    sheet: "Assign Teachers",
    sample: [
      ["TEACHER001", "SUB001", "2026-2027", "ASSIGN"]
    ],
    helper: "Use the exact teacherId and subjectId. sessionId is the academic session, not a section or batch. Use ASSIGN.",
    action: "Upload Assignments",
  },

  reassignTeacher: {
    title: "Reassign Teacher",
    description: "Replace an existing teacher with another teacher.",
    endpoint: "/api/admin/upload/assignments",
    success: "Teacher reassignment uploaded successfully.",
    columns: ASSIGNMENT_COLUMNS,
    template: "Reassign_Teacher_Template.xlsx",
    sheet: "Reassign Teachers",
    sample: [
      ["OLD_TEACHER_ID", "SUB001", "2026-2027", "DEACTIVATE"],
      ["NEW_TEACHER_ID", "SUB001", "2026-2027", "ASSIGN"],
    ],
    helper: "Use two rows: DEACTIVATE the old teacher and ASSIGN the new teacher. Keep the same subjectId and sessionId.",
    action: "Reassign Teacher",
  },

  deleteAssignment: {
    title: "Delete Teacher Assignment",
    description: "Remove a teacher from a subject without deleting either record.",
    endpoint: "/api/admin/upload/assignments",
    success: "Teacher assignment deleted successfully.",
    columns: ASSIGNMENT_COLUMNS,
    template: "Delete_Teacher_Assignment_Template.xlsx",
    sheet: "Delete Assignments",
    sample: [
      ["TEACHER001", "SUB001", "2026-2027", "DEACTIVATE"]
    ],
    helper: "DEACTIVATE removes only this teacher-subject-session relationship. Other teachers remain assigned.",
    action: "Delete Assignments",
  },
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
  const data = error?.response?.data;

  if (typeof data === "string") return data;

  return (
    data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function Notice({ notice, onClose }) {
  if (!notice.text) return null;

  return (
    <div className={`sub-notice ${notice.type}`} role="status">
      {notice.type === "success"
        ? <CheckCircle2 size={18} />
        : <AlertCircle size={18} />}

      <span>{notice.text}</span>

      <button type="button" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

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
  const [dragging, setDragging] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fileInputRef = useRef(null);

  // -----------------------------------------
  // LOAD SUBJECTS AND FACULTY ASSIGNMENTS
  // -----------------------------------------

  async function loadPage(showLoader = true) {
    if (showLoader) setLoading(true);

    try {
      const [subjectResponse, assignmentResponse] =
        await Promise.all([
          api.get("/subject"),
          api.get("/api/admin/upload/assignments"),
        ]);

      setSubjects(
        Array.isArray(subjectResponse.data)
          ? subjectResponse.data
          : []
      );

      setAssignments(
        Array.isArray(assignmentResponse.data)
          ? assignmentResponse.data
          : []
      );

      setNotice((previous) =>
        previous.type === "error"
          ? { type: "", text: "" }
          : previous
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
    loadPage();
  }, []);

  // -----------------------------------------
  // GROUP FACULTY BY SUBJECT
  // -----------------------------------------

  const assignmentsBySubject = useMemo(() => {
    const grouped = new Map();

    assignments.forEach((assignment) => {
      const subjectId = safeText(assignment.subjectId);

      if (!subjectId) return;

      if (!grouped.has(subjectId)) {
        grouped.set(subjectId, []);
      }

      grouped.get(subjectId).push(assignment);
    });

    return grouped;
  }, [assignments]);

  // -----------------------------------------
  // FILTER OPTIONS
  // -----------------------------------------

  const courseOptions = useMemo(
    () =>
      [
        ...new Set(
          subjects
            .map((subject) => safeText(subject.courseId))
            .filter(Boolean)
        ),
      ].sort(),
    [subjects]
  );

  const semesterOptions = useMemo(
    () =>
      [
        ...new Set(
          subjects
            .map((subject) => safeText(subject.semesterId))
            .filter(Boolean)
        ),
      ].sort(),
    [subjects]
  );

  // -----------------------------------------
  // SEARCH AND FILTER
  // -----------------------------------------

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !query ||
        [
          subject.subjectId,
          subject.subjectName,
          subject.courseId,
          subject.semesterId,
        ].some((value) =>
          safeText(value).toLowerCase().includes(query)
        );

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

  // -----------------------------------------
  // SUMMARY COUNTS
  // -----------------------------------------

  const activeSubjects = subjects.filter(isActive);
  const inactiveSubjects = subjects.length - activeSubjects.length;

  const assignedSubjectCount = activeSubjects.filter(
    (subject) =>
      (assignmentsBySubject.get(subject.subjectId) || []).length > 0
  ).length;

  const unassignedSubjectCount =
    activeSubjects.length - assignedSubjectCount;

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

  // -----------------------------------------
  // RESET FILTERS
  // -----------------------------------------

  function resetFilters() {
    setSearch("");
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  }

  // -----------------------------------------
  // UPLOAD MODAL
  // -----------------------------------------

  function openUpload(type) {
    setUploadType(type);
    setSelectedFile(null);
    setDragging(false);

    setNotice({
      type: "",
      text: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function closeUpload() {
    if (working) return;

    setUploadType("");
    setSelectedFile(null);
    setDragging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // -----------------------------------------
  // EXCEL VALIDATION
  // -----------------------------------------

  async function validateExcelFile(file, type) {
    if (!file) {
      throw new Error("Please select an Excel file.");
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      throw new Error("Only .xlsx and .xls files are supported.");
    }

    const info = OPERATION_INFO[type];

    if (!info) {
      throw new Error("Invalid upload operation.");
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

    const headers = rows[0].map(safeText);

    const matches =
      headers.length === info.columns.length &&
      info.columns.every(
        (column, index) => headers[index] === column
      );

    if (!matches) {
      throw new Error(
        `Incorrect Excel columns. Required order: ${info.columns.join(", ")}`
      );
    }

    if (rows.length < 2) {
      throw new Error("The Excel file contains no data rows.");
    }

    if (type === "reassignTeacher" && rows.length < 3) {
      throw new Error(
        "Reassignment requires two rows: DEACTIVATE the old teacher and ASSIGN the new teacher."
      );
    }

    return rows;
  }

  // -----------------------------------------
  // UPLOAD EXCEL
  // -----------------------------------------

  async function handleUpload() {
    if (!selectedFile || !uploadType) return;

    const info = OPERATION_INFO[uploadType];

    setWorking(true);

    setNotice({
      type: "",
      text: "",
    });

    try {
      await validateExcelFile(selectedFile, uploadType);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post(
        info.endpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const serverMessage =
        typeof response.data === "string"
          ? response.data
          : response.data?.message;

      const count =
        response.data?.count ??
        response.data?.updatedCount ??
        response.data?.deactivatedCount;

      const suffix =
        count !== undefined
          ? ` (${count} record(s) processed).`
          : "";

      setUploadType("");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadPage(false);

      setNotice({
        type: "success",
        text: `${serverMessage || info.success}${suffix}`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setWorking(false);
    }
  }

  // -----------------------------------------
  // DOWNLOAD TEMPLATES
  // -----------------------------------------

  function downloadTemplate(type) {
    const info = OPERATION_INFO[type];

    if (!info) return;

    const worksheet = XLSX.utils.aoa_to_sheet([
      info.columns,
      ...info.sample,
    ]);

    worksheet["!cols"] = info.columns.map((column) => ({
      wch: Math.max(18, column.length + 8),
    }));

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      info.sheet
    );

    XLSX.writeFile(workbook, info.template);
  }

  // -----------------------------------------
  // EXPORT EXCEL
  // -----------------------------------------

  function exportExcel() {
    const rows = filteredSubjects.map((subject) => {
      const assigned =
        assignmentsBySubject.get(subject.subjectId) || [];

      return {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        courseId: subject.courseId,
        semesterId: subject.semesterId,

        faculty: assigned
          .map(
            (item) =>
              `${item.teacherName || item.teacherId} (${item.teacherId})`
          )
          .join("; "),

        academicSessions: [
          ...new Set(
            assigned.map((item) => item.sessionId)
          ),
        ].join("; "),

        status: isActive(subject) ? "ACTIVE" : "INACTIVE",
      };
    });

    if (!rows.length) {
      setNotice({
        type: "error",
        text: "There are no subjects to export.",
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Subject and Faculty"
    );

    XLSX.writeFile(
      workbook,
      "Subject_Faculty_List.xlsx"
    );
  }

  // -----------------------------------------
  // PRINT
  // -----------------------------------------

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

  const currentInfo = uploadType
    ? OPERATION_INFO[uploadType]
    : null;

  // -----------------------------------------
  // PAGE
  // -----------------------------------------

  return (
    <div className="subject-page">
      <style>{`
        .subject-page {
          max-width: 1250px;
          margin: 0 auto;
          color: ${COLORS.ink};
          font-family: "Segoe UI", Arial, sans-serif;
          animation: subject-enter .45s ease both;
        }

        .subject-page * {
          box-sizing: border-box;
        }

        @keyframes subject-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes subject-zigzag-in {
          0% {
            opacity: 0;
            transform: translateY(28px) skewY(-2deg) scale(.97);
            clip-path: polygon(
              0 0,100% 0,100% 8%,0 17%,0 25%,
              100% 34%,100% 42%,0 51%,0 59%,
              100% 68%,100% 76%,0 85%,0 93%,100% 100%,0 100%
            );
          }
          65% {
            opacity: 1;
            transform: translateY(-3px) skewY(.4deg) scale(1.005);
            clip-path: inset(0);
          }
          100% {
            opacity: 1;
            transform: none;
            clip-path: inset(0);
          }
        }

        @keyframes subject-card-in {
          from { opacity: 0; transform: translateY(13px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes subject-spin {
          to { transform: rotate(360deg); }
        }

        .subject-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 27px 30px;
          margin-bottom: 18px;
          border-radius: 18px;
          color: white;
          background: linear-gradient(
            112deg,
            ${COLORS.navy},
            ${COLORS.navyLight}
          );
          box-shadow: 0 13px 30px #20294520;
        }

        .subject-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          color: #e1c78f;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.7px;
        }

        .subject-heading h1 {
          margin: 0;
          color: white;
          font-size: clamp(25px, 3vw, 34px);
        }

        .subject-heading p:last-child {
          margin: 8px 0 0;
          color: #d4d9e5;
          font-size: 12px;
          line-height: 1.6;
        }

        .subject-heading-mark {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #d5b87570;
          border-radius: 16px;
          color: #e6ca91;
          background: #ffffff10;
        }

        .sub-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 15px;
          margin-bottom: 16px;
          border-radius: 11px;
          font-size: 11px;
          line-height: 1.6;
        }

        .sub-notice.success {
          color: #236447;
          border: 1px solid #c8e3d2;
          background: #eff8f2;
        }

        .sub-notice.error {
          color: #9b3434;
          border: 1px solid #edcaca;
          background: #fff2f2;
        }

        .sub-notice span { flex: 1; }

        .sub-notice button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .subject-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 17px;
        }

        .subject-stat {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 91px;
          padding: 15px 17px;
          border: 1px solid #e9e5dc;
          border-radius: 13px;
          background: linear-gradient(145deg, #fff, #fcfaf5);
          box-shadow: 0 5px 16px #20294508;
        }

        .subject-stat-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 11px;
          color: #96733c;
          background: #f4ecd9;
        }

        .subject-stat span {
          display: block;
          color: ${COLORS.muted};
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        .subject-stat strong {
          display: block;
          margin-top: 5px;
          color: ${COLORS.navy};
          font-size: 25px;
          line-height: 1;
        }

        .subject-actions-shell {
          padding: 16px;
          margin-bottom: 17px;
          border: 1px solid #e6dfd1;
          border-radius: 15px;
          background: linear-gradient(110deg, #fffdf9, #faf7ef);
        }

        .subject-actions-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 13px;
          color: ${COLORS.navy};
          font-size: 12px;
          font-weight: 850;
        }

        .subject-operation-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .subject-operation {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 67px;
          padding: 12px;
          border: 1px solid #e9e4d9;
          border-radius: 11px;
          text-align: left;
          background: white;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s, border-color .2s;
        }

        .subject-operation:hover {
          transform: translateY(-3px);
          border-color: ${COLORS.gold};
          box-shadow: 0 8px 18px #20294512;
        }

        .subject-operation:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }

        .subject-operation-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: white;
          background: ${COLORS.navy};
        }

        .subject-operation.red .subject-operation-icon {
          background: ${COLORS.red};
        }

        .subject-operation.danger .subject-operation-icon {
          background: #8e3037;
        }

        .subject-operation.green .subject-operation-icon {
          background: ${COLORS.green};
        }

        .subject-operation.gold .subject-operation-icon {
          background: #98743a;
        }

        .subject-operation.plum .subject-operation-icon {
          background: #70415f;
        }

        .subject-operation strong {
          display: block;
          color: ${COLORS.navy};
          font-size: 11px;
          font-weight: 850;
        }

        .subject-operation small {
          display: block;
          margin-top: 4px;
          color: ${COLORS.muted};
          font-size: 9px;
          line-height: 1.4;
        }

        .subject-toolbar {
          padding: 15px;
          margin-bottom: 16px;
          border: 1px solid #e8e3d8;
          border-radius: 13px;
          background: #fbfaf7;
        }

        .subject-toolbar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 13px;
        }

        .subject-toolbar-title {
          display: flex;
          align-items: center;
          gap: 9px;
          color: ${COLORS.navy};
          font-size: 12px;
          font-weight: 850;
        }

        .subject-btn {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 11px;
          border: 1px solid #e1ded6;
          border-radius: 8px;
          color: ${COLORS.navy};
          background: white;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s;
        }

        .subject-btn:hover {
          border-color: ${COLORS.gold};
          transform: translateY(-1px);
        }

        .subject-btn.primary {
          color: white;
          border-color: ${COLORS.navy};
          background: ${COLORS.navy};
        }

        .subject-btn:disabled {
          opacity: .5;
          cursor: not-allowed;
          transform: none;
        }

        .subject-search {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 40px;
          padding: 0 12px;
          border: 1px solid #e6e1d7;
          border-radius: 9px;
          background: white;
          color: #9298a7;
        }

        .subject-search input {
          width: 100%;
          border: 0;
          outline: 0;
          color: ${COLORS.ink};
          font: inherit;
          font-size: 11px;
        }

        .subject-filter-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
          gap: 10px;
          margin-top: 13px;
        }

        .subject-filter label {
          display: block;
          margin-bottom: 6px;
          color: #7c8292;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .7px;
        }

        .subject-filter select {
          width: 100%;
          height: 36px;
          padding: 0 9px;
          border: 1px solid #e6e1d7;
          border-radius: 8px;
          color: ${COLORS.ink};
          background: white;
          font-size: 10px;
        }

        .subject-directory-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 21px 1px 12px;
        }

        .subject-directory-head h2 {
          margin: 0;
          color: ${COLORS.navy};
          font-size: 16px;
        }

        .subject-directory-head p {
          margin: 4px 0 0;
          color: ${COLORS.muted};
          font-size: 10px;
        }

        .subject-card-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .subject-card {
          display: flex;
          gap: 14px;
          padding: 17px;
          border: 1px solid #e8dfc9;
          border-radius: 15px;
          background: white;
          box-shadow: 0 5px 18px #20294508;
          animation: subject-card-in .45s ease both;
          transition: transform .2s, box-shadow .2s;
        }

        .subject-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 23px #20294512;
        }

        .subject-card.unassigned {
          border: 2px solid ${COLORS.red};
          box-shadow: 0 5px 20px #ad414615;
        }

        .subject-card.inactive {
          opacity: .68;
          border-style: dashed;
        }

        .subject-card-icon {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          color: ${COLORS.gold};
          background: ${COLORS.goldLight};
        }

        .subject-card.unassigned .subject-card-icon {
          color: ${COLORS.red};
          background: #fbefed;
        }

        .subject-card-main {
          flex: 1;
          min-width: 0;
        }

        .subject-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .subject-card h3 {
          margin: 1px 0 5px;
          color: ${COLORS.navy};
          font-size: 14px;
          font-weight: 850;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .subject-card-code {
          color: #8d7445;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .5px;
        }

        .subject-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 8px;
          color: #7e8494;
          font-size: 9px;
        }

        .subject-faculty-count {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 11px;
          color: #626b80;
          font-size: 10px;
          font-weight: 700;
        }

        .subject-faculty-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 9px;
        }

        .subject-faculty-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border: 1px solid #ebe8e1;
          border-radius: 7px;
          color: #414b63;
          background: #f8f7f4;
          font-size: 9px;
          font-weight: 750;
        }

        .subject-session {
          color: #8b7449;
          font-size: 8px;
          font-weight: 700;
        }

        .subject-unassigned-alert {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 9px;
          padding: 6px 9px;
          border-radius: 7px;
          color: #a33239;
          background: #fff0ef;
          font-size: 9px;
          font-weight: 900;
        }

        .subject-inactive-pill {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 7px;
          color: #777;
          background: #eee;
          font-size: 8px;
          font-weight: 850;
        }

        .subject-empty {
          display: grid;
          place-items: center;
          gap: 9px;
          min-height: 170px;
          padding: 24px;
          color: #858ba0;
          text-align: center;
          font-size: 11px;
        }

        .subject-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 2px;
          color: #777f91;
          font-size: 10px;
        }

        .subject-pagination-controls {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .subject-pagination button,
        .subject-pagination select {
          height: 31px;
          min-width: 31px;
          padding: 0 7px;
          border: 1px solid #e4e0d8;
          border-radius: 7px;
          color: #596176;
          background: white;
          font-size: 9px;
        }

        .subject-pagination button {
          cursor: pointer;
        }

        .subject-pagination button:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        .subject-pagination button.current {
          color: white;
          border-color: ${COLORS.navy};
          background: ${COLORS.navy};
        }

        .subject-upload-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #11182791;
          backdrop-filter: blur(5px);
        }

        .subject-upload-modal {
          width: min(590px, 100%);
          max-height: 90vh;
          overflow: auto;
          padding: 25px;
          border: 1px solid #e7dcc6;
          border-radius: 19px;
          background: linear-gradient(145deg, #fff, #fffdf8);
          box-shadow: 0 25px 80px #11182745;
          animation: subject-zigzag-in .62s cubic-bezier(.2,.8,.2,1) both;
        }

        .subject-modal-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .subject-modal-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 12px;
          color: #92703a;
          background: #f5eddd;
        }

        .subject-modal-top h2 {
          margin: 0;
          color: ${COLORS.navy};
          font-size: 21px;
        }

        .subject-modal-top p {
          margin: 7px 0 0;
          color: #7e8493;
          font-size: 11px;
          line-height: 1.6;
        }

        .subject-modal-close {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 1px solid #e8e2d8;
          border-radius: 9px;
          color: #6c7383;
          background: white;
          cursor: pointer;
        }

        .subject-template-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px;
          margin: 19px 0 14px;
          border: 1px solid #e9dfca;
          border-radius: 12px;
          background: #fbf7ed;
        }

        .subject-template-panel strong {
          display: block;
          color: ${COLORS.navy};
          font-size: 11px;
        }

        .subject-template-panel p {
          margin: 5px 0 0;
          color: #7e8493;
          font-size: 9px;
          line-height: 1.55;
        }

        .subject-template-panel button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          padding: 9px 11px;
          border: 1px solid #dfd0b2;
          border-radius: 8px;
          color: #886833;
          background: #fffdf8;
          font-size: 9px;
          font-weight: 850;
          cursor: pointer;
        }

        .subject-required-columns {
          padding: 11px 12px;
          margin-bottom: 14px;
          border-radius: 9px;
          background: #f6f5f1;
        }

        .subject-required-columns strong {
          display: block;
          color: #5e6678;
          font-size: 9px;
          letter-spacing: .5px;
        }

        .subject-required-columns code {
          display: block;
          margin-top: 7px;
          color: #8a6c38;
          font-size: 9px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .subject-required-columns small {
          display: block;
          margin-top: 7px;
          color: #8a8f9b;
          font-size: 9px;
          line-height: 1.6;
        }

        .subject-dropzone {
          display: grid;
          place-items: center;
          gap: 8px;
          min-height: 155px;
          padding: 20px;
          border: 1.5px dashed #c9b17f;
          border-radius: 13px;
          text-align: center;
          color: ${COLORS.navy};
          background: #fffdf8;
          cursor: pointer;
          transition: .2s;
        }

        .subject-dropzone:hover,
        .subject-dropzone.dragging {
          border-color: ${COLORS.gold};
          background: #fbf4e7;
          box-shadow: inset 0 0 0 3px #c19a5210;
        }

        .subject-dropzone.has-file {
          border-style: solid;
          border-color: #6da887;
          background: #f3faf5;
        }

        .subject-dropzone input {
          display: none;
        }

        .subject-dropzone-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #28744c;
          background: #e7f3eb;
        }

        .subject-dropzone strong {
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        .subject-dropzone span {
          color: #858b98;
          font-size: 9px;
        }

        .subject-dropzone small {
          color: #a0a4ad;
          font-size: 8px;
        }

        .subject-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 17px;
        }

        .subject-spin {
          animation: subject-spin 1s linear infinite;
        }

        @media(max-width:850px) {
          .subject-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .subject-operation-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .subject-card-grid {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width:600px) {
          .subject-heading {
            padding: 22px;
          }

          .subject-heading-mark {
            display: none;
          }

          .subject-filter-grid {
            grid-template-columns: 1fr 1fr;
          }

          .subject-filter-grid .subject-btn {
            grid-column: 1/-1;
          }

          .subject-operation-grid {
            grid-template-columns: 1fr;
          }

          .subject-template-panel {
            align-items: flex-start;
            flex-direction: column;
          }

          .subject-template-panel button {
            width: 100%;
            justify-content: center;
          }

          .subject-pagination {
            align-items: flex-start;
            flex-direction: column;
          }

          .subject-modal-actions {
            flex-direction: column-reverse;
          }

          .subject-modal-actions .subject-btn {
            width: 100%;
          }
        }

        @media print {
          .subject-no-print,
          .subject-actions-shell,
          .subject-toolbar,
          .subject-pagination {
            display: none !important;
          }

          .subject-card {
            break-inside: avoid;
            box-shadow: none !important;
          }

          .subject-card.unassigned {
            border: 2px solid #ad4146 !important;
          }

          .subject-heading {
            color: #111;
            background: white;
            border: 1px solid #ccc;
            box-shadow: none;
          }

          .subject-heading h1,
          .subject-heading p {
            color: #111 !important;
          }
        }

        @media(prefers-reduced-motion:reduce) {
          .subject-page,
          .subject-card,
          .subject-upload-modal {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* PAGE HEADER */}

      <header className="subject-heading">
        <div>
          <p className="subject-kicker">
            <BookOpen size={14} />
            ACADEMIC MANAGEMENT
          </p>

          <h1>Subject &amp; Faculty</h1>

          <p>
            Manage subjects and faculty assignments from one place.
          </p>
        </div>

        <div className="subject-heading-mark">
          <BookOpen size={29} />
        </div>
      </header>

      <Notice
        notice={notice}
        onClose={() => setNotice({ type: "", text: "" })}
      />

      {/* SUMMARY CARDS */}

      <section className="subject-stats">
        <div className="subject-stat">
          <div className="subject-stat-icon">
            <BookOpen size={20} />
          </div>
          <div>
            <span>Total Subjects</span>
            <strong>{subjects.length}</strong>
          </div>
        </div>

        <div className="subject-stat">
          <div className="subject-stat-icon">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Assigned Subjects</span>
            <strong>{assignedSubjectCount}</strong>
          </div>
        </div>

        <div className="subject-stat">
          <div
            className="subject-stat-icon"
            style={{ color: COLORS.red, background: "#fbefed" }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <span>Unassigned Subjects</span>
            <strong style={{
              color: unassignedSubjectCount ? COLORS.red : COLORS.navy
            }}>
              {unassignedSubjectCount}
            </strong>
          </div>
        </div>

        <div className="subject-stat">
          <div className="subject-stat-icon">
            <Users size={20} />
          </div>
          <div>
            <span>Active Faculty Links</span>
            <strong>{assignments.length}</strong>
          </div>
        </div>
      </section>

      {/* SIX EXCEL OPERATIONS */}

      <section className="subject-actions-shell subject-no-print">
        <div className="subject-actions-heading">
          <FileSpreadsheet size={17} />
          EXCEL OPERATIONS
        </div>

        <div className="subject-operation-grid">
          {OPERATIONS.map((operation) => {
            const Icon = operation.icon;

            return (
              <button
                key={operation.key}
                type="button"
                className={`subject-operation ${operation.tone}`}
                onClick={() => openUpload(operation.key)}
                disabled={working}
              >
                <span className="subject-operation-icon">
                  <Icon size={18} />
                </span>

                <span>
                  <strong>{operation.label}</strong>
                  <small>{operation.description}</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SEARCH AND FILTERS */}

      <section className="subject-toolbar subject-no-print">
        <div className="subject-toolbar-top">
          <div className="subject-toolbar-title">
            <SlidersHorizontal size={17} />
            Search and Filters
          </div>

          <div style={{
            display: "flex",
            gap: 7,
            flexWrap: "wrap"
          }}>
            <button
              type="button"
              className="subject-btn"
              onClick={() => loadPage()}
              disabled={loading}
            >
              <RefreshCw size={13} />
              Refresh
            </button>

            <button
              type="button"
              className="subject-btn"
              onClick={exportExcel}
            >
              <Download size={13} />
              Export Excel
            </button>

            <button
              type="button"
              className="subject-btn"
              onClick={printSubjects}
            >
              <Printer size={13} />
              Print
            </button>

            <button
              type="button"
              className="subject-btn"
              onClick={() => setFiltersExpanded((value) => !value)}
            >
              {filtersExpanded ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        <div className="subject-search">
          <Search size={16} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by subject ID, subject name, course or semester..."
          />
        </div>

        {filtersExpanded && (
          <div className="subject-filter-grid">
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
                  <option key={course} value={course}>
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
                  <option key={semester} value={semester}>
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
              <RefreshCw size={13} />
              Reset
            </button>
          </div>
        )}
      </section>

      {/* SUBJECT CARD DIRECTORY */}

      <div className="subject-directory-head">
        <div>
          <h2>Subject Directory</h2>
          <p>
            {filteredSubjects.length} matching subject(s)
            {" · "}
            Red border means no active teacher assignment
          </p>
        </div>

        <span style={{
          color: COLORS.muted,
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: ".8px"
        }}>
          SUBJECT RECORDS
        </span>
      </div>

      {loading ? (
        <div className="subject-empty">
          <LoaderCircle className="subject-spin" size={27} />
          Loading subjects and faculty assignments...
        </div>
      ) : paginatedSubjects.length ? (
        <div className="subject-card-grid">
          {paginatedSubjects.map((subject, index) => {
            const subjectAssignments =
              assignmentsBySubject.get(subject.subjectId) || [];

            const isUnassigned =
              isActive(subject) && subjectAssignments.length === 0;

            return (
              <article
                key={subject.subjectId}
                className={`subject-card ${
                  isUnassigned ? "unassigned" : ""
                } ${!isActive(subject) ? "inactive" : ""}`}
                style={{
                  animationDelay: `${Math.min(index * 45, 250)}ms`
                }}
              >
                <div className="subject-card-icon">
                  <BookOpen size={25} />
                </div>

                <div className="subject-card-main">
                  <div className="subject-card-top">
                    <div>
                      <h3>
                        {subject.subjectName || "Unnamed Subject"}
                      </h3>

                      <div className="subject-card-code">
                        {subject.subjectId}
                      </div>
                    </div>

                    {!isActive(subject) && (
                      <span className="subject-inactive-pill">
                        INACTIVE
                      </span>
                    )}
                  </div>

                  <div className="subject-card-meta">
                    <span>Course: {subject.courseId || "Course not set"}</span>
                    <span>•</span>
                    <span>Semester : {subject.semesterId || "Semester not set"}</span>
                  </div>

                  {isActive(subject) && subjectAssignments.length === 0 ? (
                    <div className="subject-unassigned-alert">
                      <AlertTriangle size={13} />
                      NO TEACHER ASSIGNED
                    </div>
                  ) : (
                    <>
                      <div className="subject-faculty-count">
                        <Users size={14} />
                        {subjectAssignments.length} active faculty assignment(s)
                      </div>

                      <div className="subject-faculty-list">
                        {subjectAssignments.map((assignment, assignmentIndex) => (
                          <span
                            className="subject-faculty-chip"
                            key={`${assignment.teacherId}-${assignment.sessionId}-${assignmentIndex}`}
                          >
                            {assignment.teacherName || assignment.teacherId}

                            {assignment.sessionId && (
                              <span className="subject-session">
                                · {assignment.sessionId}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="subject-empty">
          <BookOpen size={30} />

          {subjects.length
            ? "No subjects match your search or filters."
            : "No subjects are available in the database yet."}
        </div>
      )}

      {/* PAGINATION */}

      {!loading && filteredSubjects.length > 0 && (
        <div className="subject-pagination subject-no-print">
          <span>
            Showing {(safePage - 1) * pageSize + 1}
            {"–"}
            {Math.min(safePage * pageSize, filteredSubjects.length)}
            {" of "}
            {filteredSubjects.length} subjects
          </span>

          <div className="subject-pagination-controls">
            <select
              value={pageSize}
              onChange={(event) =>
                setPageSize(Number(event.target.value))
              }
              aria-label="Subjects per page"
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
              <ChevronsLeft size={14} />
            </button>

            <button
              type="button"
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
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
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              aria-label="Last page"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* EXCEL UPLOAD MODAL */}

      {currentInfo && (
        <div
          className="subject-upload-overlay subject-no-print"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeUpload();
            }
          }}
        >
          <section
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
                  {currentInfo.title}
                </h2>

                <p>{currentInfo.description}</p>
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

            <div className="subject-template-panel">
              <div>
                <strong>Need the correct Excel format?</strong>

                <p>
                  Download the official template, fill in the required
                  rows, and upload it below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => downloadTemplate(uploadType)}
              >
                <Download size={14} />
                Download Template
              </button>
            </div>

            <div className="subject-required-columns">
              <strong>
                REQUIRED EXCEL COLUMNS — IN THIS EXACT ORDER
              </strong>

              <code>
                {currentInfo.columns.join("  |  ")}
              </code>

              <small>{currentInfo.helper}</small>
            </div>

            <div
              className={`subject-dropzone ${
                selectedFile ? "has-file" : ""
              } ${dragging ? "dragging" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);

                const file = event.dataTransfer.files?.[0] || null;
                setSelectedFile(file);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
              />

              <div className="subject-dropzone-icon">
                {selectedFile
                  ? <FileSpreadsheet size={23} />
                  : <FileUp size={23} />}
              </div>

              <strong>
                {selectedFile
                  ? selectedFile.name
                  : "Enter / drop your Excel file here"}
              </strong>

              <span>
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB · Click to choose another file`
                  : "Drag and drop your Excel file here, or click to browse"}
              </span>

              <small>Supported formats: .xlsx and .xls</small>
            </div>

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
                    <LoaderCircle className="subject-spin" size={14} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    {currentInfo.action}
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default SubjectManagement;
