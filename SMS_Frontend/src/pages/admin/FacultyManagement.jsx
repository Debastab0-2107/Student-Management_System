
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";
import * as XLSX from "xlsx";
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  Pencil,
  UserX,
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  GraduationCap,
  UserRound,
  Printer,
  FileDown,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
} from "lucide-react";

const EMPTY_FORM = {
  teacherId: "",
  name: "",
  phoneNumber: "",
  deptId: "MCA",
};

const TYPE_OPTIONS = [
  { value: "ALL", label: "All Faculty" },
  { value: "PERMANENT", label: "Permanent" },
  { value: "VISITING", label: "Visiting" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

function getFacultyType(person) {
  const type = String(person.facultyType || "").toUpperCase();

  if (type === "REGULAR" || type === "PERMANENT") return "PERMANENT";
  if (type === "VISITING") return "VISITING";

  return type || "UNKNOWN";
}

function isFacultyActive(person) {
  return (
    person.status === true ||
    String(person.status).toLowerCase() === "active" ||
    String(person.status).toLowerCase() === "true"
  );
}

function safeText(value) {
  return String(value ?? "").trim();
}

function filenamePart(value) {
  return String(value || "")
    .replace(/[^a-z0-9_-]+/gi, "")
    .replace(/^[-_]+|[-_]+$/g, "");
}

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedTypes, setSelectedTypes] = useState(["ALL"]);
  const [selectedDepartments, setSelectedDepartments] = useState(["ALL"]);
  const [selectedStatuses, setSelectedStatuses] = useState(["ALL"]);

  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const [notice, setNotice] = useState({ type: "", text: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [regularUpload, setRegularUpload] = useState(null);
  const [deactivationUpload, setDeactivationUpload] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const regularInputRef = useRef(null);
  const deactivateInputRef = useRef(null);

  async function loadFaculty() {
    setLoading(true);

    try {
      const response = await api.get("/admin/faculty");
      setFaculty(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to load faculty records. Check your Admin login and backend.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFaculty();
  }, []);

  const departmentOptions = useMemo(() => {
    return [
      ...new Set(
        faculty.map((person) => safeText(person.deptId)).filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [faculty]);

  // Apply all filters before pagination.
  const filteredFaculty = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faculty.filter((person) => {
      const type = getFacultyType(person);
      const department = safeText(person.deptId);
      const status = isFacultyActive(person) ? "ACTIVE" : "INACTIVE";

      const matchesType =
        selectedTypes.includes("ALL") || selectedTypes.includes(type);

      const matchesDepartment =
        selectedDepartments.includes("ALL") ||
        selectedDepartments.includes(department);

      const matchesStatus =
        selectedStatuses.includes("ALL") || selectedStatuses.includes(status);

      const searchableValues = [
        person.teacherId,
        person.name,
        person.phoneNumber,
        person.deptId,
        person.facultyType,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          safeText(value).toLowerCase().includes(query)
        );

      return (
        matchesType &&
        matchesDepartment &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    faculty,
    search,
    selectedTypes,
    selectedDepartments,
    selectedStatuses,
  ]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredFaculty.length / pageSize)
  );

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedFaculty = useMemo(() => {
    return filteredFaculty.slice(startIndex, startIndex + pageSize);
  }, [filteredFaculty, startIndex, pageSize]);

  const firstVisibleRecord =
    filteredFaculty.length === 0 ? 0 : startIndex + 1;

  const lastVisibleRecord = Math.min(
    startIndex + pageSize,
    filteredFaculty.length
  );

  // Keep the current page valid if filters or records change.
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  // Return to page one whenever the search or filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTypes, selectedDepartments, selectedStatuses, pageSize]);

  const activeCount = filteredFaculty.filter(isFacultyActive).length;
  const inactiveCount = filteredFaculty.length - activeCount;

  const permanentCount = filteredFaculty.filter(
    (person) => getFacultyType(person) === "PERMANENT"
  ).length;

  const visitingCount = filteredFaculty.filter(
    (person) => getFacultyType(person) === "VISITING"
  ).length;

  const isPermanentIncluded =
    selectedTypes.includes("ALL") || selectedTypes.includes("PERMANENT");

  const isVisitingIncluded =
    selectedTypes.includes("ALL") || selectedTypes.includes("VISITING");

  function showNotice(type, text) {
    setNotice({ type, text });
  }

  function toggleSelection(value, selected, setSelected) {
    if (value === "ALL") {
      setSelected(["ALL"]);
      return;
    }

    const withoutAll = selected.filter((item) => item !== "ALL");

    const updated = withoutAll.includes(value)
      ? withoutAll.filter((item) => item !== value)
      : [...withoutAll, value];

    setSelected(updated.length ? updated : ["ALL"]);
  }

  function resetFilters() {
    setSelectedTypes(["ALL"]);
    setSelectedDepartments(["ALL"]);
    setSelectedStatuses(["ALL"]);
    setSearch("");
    setCurrentPage(1);
  }

  function openAddModal() {
    setEditing(false);
    setForm(EMPTY_FORM);
    setModalOpen(true);
    setNotice({ type: "", text: "" });
  }

  function openEditModal(person) {
    setEditing(true);
    setForm({
      teacherId: person.teacherId || "",
      name: person.name || "",
      phoneNumber: person.phoneNumber || "",
      deptId: person.deptId || "MCA",
    });
    setModalOpen(true);
    setNotice({ type: "", text: "" });
  }

  function closeModal() {
    if (working) return;
    setModalOpen(false);
    setForm(EMPTY_FORM);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSaveVisitingFaculty(event) {
    event.preventDefault();

    if (!form.teacherId.trim() || !form.name.trim()) {
      showNotice("error", "Teacher ID and faculty name are required.");
      return;
    }

    if (form.phoneNumber && !/^[0-9+\-\s]{7,15}$/.test(form.phoneNumber)) {
      showNotice("error", "Please enter a valid phone number.");
      return;
    }

    const payload = {
      teacherId: form.teacherId.trim(),
      name: form.name.trim(),
      phoneNumber: form.phoneNumber.trim(),
      facultyType: "VISITING",
      deptId: form.deptId.trim(),
      status: true,
    };

    setWorking(true);
    setNotice({ type: "", text: "" });

    try {
      if (editing) {
        await api.put(
          `/admin/faculty/visiting/${encodeURIComponent(
            form.teacherId.trim()
          )}`,
          payload
        );

        setModalOpen(false);
        setForm(EMPTY_FORM);
        await loadFaculty();
        showNotice("success", "Visiting Faculty details updated successfully.");
      } else {
        await api.post("/admin/faculty/visiting", payload);

        setModalOpen(false);
        setForm(EMPTY_FORM);
        await loadFaculty();
        showNotice("success", "Visiting Faculty added successfully.");
      }

      setCurrentPage(1);
    } catch (error) {
      showNotice(
        "error",
        error.response?.data?.message ||
          "Unable to save Visiting Faculty details."
      );
    } finally {
      setWorking(false);
    }
  }

  async function deactivateFaculty(person) {
    const isVisiting = getFacultyType(person) === "VISITING";

    const confirmed = window.confirm(
      `Deactivate ${person.name} (${person.teacherId})?\n\nThis will change the faculty status to inactive. It will not delete the database record.`
    );

    if (!confirmed) return;

    setWorking(true);
    setNotice({ type: "", text: "" });

    try {
      if (isVisiting) {
        await api.put(
          `/admin/faculty/visiting/${encodeURIComponent(
            person.teacherId
          )}/deactivate`
        );
      } else {
        await api.put(
          `/admin/faculty/regular/${encodeURIComponent(
            person.teacherId
          )}/deactivate`
        );
      }

      await loadFaculty();
      showNotice("success", `${person.name} has been deactivated.`);
    } catch (error) {
      showNotice(
        "error",
        error.response?.data?.message ||
          "Unable to deactivate this faculty member."
      );
    } finally {
      setWorking(false);
    }
  }

  async function uploadExcel(file, endpoint, successLabel) {
    if (!file) {
      showNotice("error", "Please select an Excel file first.");
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      showNotice("error", "Please select an .xlsx or .xls Excel file.");
      return;
    }

    const data = new FormData();
    data.append("file", file);

    setWorking(true);
    setNotice({ type: "", text: "" });

    try {
      const response = await api.post(endpoint, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const message =
        response.data?.message || `${successLabel} completed successfully.`;

      const count =
        response.data?.count !== undefined
          ? ` Records affected: ${response.data.count}.`
          : "";

      setRegularUpload(null);
      setDeactivationUpload(null);

      if (regularInputRef.current) regularInputRef.current.value = "";
      if (deactivateInputRef.current) deactivateInputRef.current.value = "";

      await loadFaculty();
      setCurrentPage(1);
      showNotice("success", message + count);
    } catch (error) {
      showNotice(
        "error",
        error.response?.data?.message ||
          `${successLabel} failed. Please check the Excel file and try again.`
      );
    } finally {
      setWorking(false);
    }
  }

  const filterDescription = useMemo(() => {
    const typeLabel = selectedTypes.includes("ALL")
      ? "All"
      : selectedTypes
          .map((type) => (type === "PERMANENT" ? "Permanent" : "Visiting"))
          .join("-");

    const departmentLabel = selectedDepartments.includes("ALL")
      ? "AllDepartments"
      : selectedDepartments.map(filenamePart).join("-");

    const statusLabel = selectedStatuses.includes("ALL")
      ? "All"
      : selectedStatuses
          .map((status) => status.charAt(0) + status.slice(1).toLowerCase())
          .join("-");

    return { typeLabel, departmentLabel, statusLabel };
  }, [selectedTypes, selectedDepartments, selectedStatuses]);

  const exportFileName = [
    "Faculty",
    filterDescription.typeLabel,
    filterDescription.departmentLabel,
    filterDescription.statusLabel,
  ]
    .map(filenamePart)
    .filter(Boolean)
    .join("_");

  // Export all filtered records, not only the current page.
  function getExportRows() {
    return filteredFaculty.map((person) => ({
      "Teacher ID": person.teacherId || "",
      "Faculty Name": person.name || "",
      "Phone Number": person.phoneNumber || "",
      Department: person.deptId || "",
      "Faculty Type":
        getFacultyType(person) === "PERMANENT"
          ? "Permanent"
          : getFacultyType(person) === "VISITING"
            ? "Visiting"
            : getFacultyType(person),
      Status: isFacultyActive(person) ? "Active" : "Inactive",
    }));
  }

  function downloadExcel() {
    if (!filteredFaculty.length) {
      showNotice("error", "There are no faculty records to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(getExportRows());

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 28 },
      { wch: 19 },
      { wch: 18 },
      { wch: 18 },
      { wch: 14 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty Listing");

    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);

    showNotice("success", `Excel file downloaded: ${exportFileName}.xlsx`);
  }

  function printListing() {
    if (!filteredFaculty.length) {
      showNotice("error", "There are no faculty records to print.");
      return;
    }

    window.print();
  }

  // Generate compact page numbers for the pagination control.
  function getPageNumbers() {
    const pages = [];
    const maxButtons = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  }

  return (
    <div className="faculty-page">
      <style>{`
        .faculty-page {
          --fm-navy: #202945;
          --fm-navy2: #303b5d;
          --fm-gold: #c19a52;
          --fm-ink: #283149;
          --fm-muted: #858ba0;
          color: var(--fm-ink);
          font-family: "Segoe UI", "Aptos", "Trebuchet MS", sans-serif;
          animation: fm-enter .65s cubic-bezier(.2,.7,.2,1) both;
        }

        .faculty-page * { box-sizing: border-box; }

        @keyframes fm-enter {
          from { opacity: 0; transform: translateY(13px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fm-float-in {
          from { opacity: 0; transform: translateY(17px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fm-spin { to { transform: rotate(360deg); } }

        @keyframes fm-row {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fm-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          min-height: 190px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 30px 32px;
          margin-bottom: 20px;
          border: 1px solid #ffffff24;
          border-radius: 19px;
          color: white;
          background:
            radial-gradient(circle at 84% 15%, #c19a523c, transparent 27%),
            radial-gradient(circle at 72% 120%, #7180a333, transparent 34%),
            linear-gradient(116deg, #202945 0%, #303b5d 65%, #394461 100%);
          box-shadow: 0 15px 35px #20294520;
        }

        .fm-hero::before {
          content: "";
          position: absolute;
          z-index: -1;
          width: 270px;
          height: 270px;
          right: 8%;
          top: -175px;
          border: 1px solid #ffffff20;
          border-radius: 50%;
          box-shadow: 0 0 0 22px #ffffff08, 0 0 0 48px #ffffff06,
            0 0 0 78px #ffffff04;
        }

        .fm-hero::after {
          content: "";
          position: absolute;
          z-index: -1;
          width: 170px;
          height: 170px;
          right: 28%;
          bottom: -130px;
          border: 1px solid #c19a5260;
          border-radius: 50%;
          box-shadow: 0 0 0 16px #c19a5210, 0 0 0 34px #c19a5208;
        }

        .fm-hero-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 12px;
          color: #e3c78d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .fm-hero h1 {
          margin: 0;
          color: #fff;
          font-size: clamp(27px, 3.2vw, 37px);
          font-weight: 650;
          letter-spacing: -.9px;
        }

        .fm-hero-description {
          max-width: 520px;
          margin: 10px 0 0;
          color: #d0d5e2;
          font-size: 12px;
          line-height: 1.75;
        }

        .fm-hero-side {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .fm-hero-seal {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          border: 1px solid #d5b87575;
          border-radius: 18px;
          color: #e7cb91;
          background: #ffffff0d;
          box-shadow: inset 0 0 20px #ffffff08, 0 8px 25px #11182b25;
          transform: rotate(3deg);
          transition: .35s ease;
        }

        .fm-hero:hover .fm-hero-seal {
          transform: rotate(0deg) translateY(-3px);
          border-color: #e2c78e;
        }

        .fm-hero-caption {
          color: #cbd0dc;
          font-size: 9px;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .fm-refresh {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 37px;
          padding: 0 13px;
          border: 1px solid #ffffff3a;
          border-radius: 9px;
          color: white;
          background: #ffffff12;
          font: inherit;
          font-size: 10px;
          font-weight: 650;
          cursor: pointer;
          transition: .25s ease;
        }

        .fm-refresh:hover {
          border-color: #d6b875;
          background: #ffffff20;
          transform: translateY(-2px);
        }

        .fm-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 13px 16px;
          margin-bottom: 18px;
          border-radius: 11px;
          font-size: 11px;
          line-height: 1.6;
          animation: fm-float-in .3s ease both;
        }

        .fm-notice.success {
          color: #236447;
          border: 1px solid #c8e3d2;
          background: #eff8f2;
        }

        .fm-notice.error {
          color: #9b3434;
          border: 1px solid #edcaca;
          background: #fff2f2;
        }

        .fm-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin-bottom: 20px;
        }

        .fm-stat {
          min-height: 112px;
          padding: 17px 18px;
          border: 1px solid #eae8e2;
          border-radius: 13px;
          background: linear-gradient(145deg, #fff, #fcfbf8);
          box-shadow: 0 5px 18px #20294508;
          animation: fm-float-in .55s ease both;
          transition: transform .25s ease, box-shadow .25s ease,
            border-color .25s ease;
        }

        .fm-stat:nth-child(2) { animation-delay: .06s; }
        .fm-stat:nth-child(3) { animation-delay: .12s; }
        .fm-stat:nth-child(4) { animation-delay: .18s; }

        .fm-stat:hover {
          transform: translateY(-4px);
          border-color: #ddcba6;
          box-shadow: 0 12px 25px #20294512;
        }

        .fm-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .fm-stat-label {
          color: #858ba0;
          font-size: 9px;
          font-weight: 750;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .fm-stat-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #9b793e;
          background: #f5efdf;
        }

        .fm-stat strong {
          display: block;
          margin-top: 9px;
          color: var(--fm-navy);
          font-size: 27px;
          font-weight: 650;
          letter-spacing: -.7px;
          line-height: 1;
        }

        .fm-stat small {
          display: block;
          margin-top: 6px;
          color: #a0a5b1;
          font-size: 9px;
        }

        .fm-workspace {
          overflow: hidden;
          border: 1px solid #e9e7e1;
          border-radius: 17px;
          background: #ffffffed;
          box-shadow: 0 10px 32px #2029450a;
          backdrop-filter: blur(12px);
          animation: fm-float-in .65s .1s ease both;
        }

        .fm-workspace-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
          padding: 20px 22px;
          border-bottom: 1px solid #eeece7;
          background: linear-gradient(100deg, #fff, #fcfbf8);
        }

        .fm-workspace-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fm-title-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid #e9dfca;
          border-radius: 11px;
          color: #a17e43;
          background: #f8f3e9;
        }

        .fm-workspace-title h2 {
          margin: 0;
          color: var(--fm-navy);
          font-size: 15px;
          font-weight: 700;
        }

        .fm-workspace-title p {
          margin: 4px 0 0;
          color: #9298a7;
          font-size: 10px;
        }

        .fm-actions { display: flex; flex-wrap: wrap; gap: 8px; }

        .fm-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          padding: 0 12px;
          border: 1px solid #dedfdf;
          border-radius: 8px;
          color: #48536c;
          background: white;
          font: inherit;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease,
            background .2s ease, border-color .2s ease;
        }

        .fm-btn:hover {
          border-color: #c19a52;
          color: #8c6b35;
          background: #fbf8f0;
          transform: translateY(-2px);
          box-shadow: 0 5px 13px #20294510;
        }

        .fm-btn.primary {
          border-color: var(--fm-navy2);
          color: white;
          background: var(--fm-navy2);
        }

        .fm-btn.primary:hover {
          border-color: var(--fm-navy);
          color: white;
          background: var(--fm-navy);
          box-shadow: 0 6px 15px #20294525;
        }

        .fm-btn:disabled {
          opacity: .5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .fm-content { padding: 20px 22px 22px; }

        .fm-filter-shell {
          padding: 17px;
          margin-bottom: 17px;
          border: 1px solid #e9e5dc;
          border-radius: 13px;
          background:
            radial-gradient(circle at 100% 0%, #f6efdf80, transparent 33%),
            #fbfaf7;
        }

        .fm-filter-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 15px;
        }

        .fm-filter-heading-main {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .fm-filter-heading-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #98743a;
          background: #f2ead8;
        }

        .fm-filter-heading h3 {
          margin: 0;
          color: var(--fm-navy);
          font-size: 12px;
          font-weight: 750;
        }

        .fm-filter-heading p {
          margin: 4px 0 0;
          color: #9298a7;
          font-size: 9px;
        }

        .fm-filter-tools { display: flex; gap: 7px; }

        .fm-subtle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 29px;
          padding: 0 9px;
          border: 1px solid #e6dfd1;
          border-radius: 7px;
          color: #7e6a47;
          background: #fffdf9;
          font: inherit;
          font-size: 9px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .fm-subtle-btn:hover {
          border-color: #c19a52;
          background: #f7f0e2;
        }

        .fm-filter-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr 1fr;
          gap: 11px;
        }

        .fm-filter-group {
          min-width: 0;
          padding: 13px;
          border: 1px solid #eceae4;
          border-radius: 10px;
          background: #ffffffd9;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .fm-filter-group:hover {
          border-color: #e0d2b5;
          box-shadow: 0 4px 13px #20294507;
        }

        .fm-filter-group h4 {
          margin: 0 0 11px;
          color: #626c80;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .9px;
          text-transform: uppercase;
        }

        .fm-check-list,
        .fm-department-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 13px;
        }

        .fm-department-list {
          max-height: 105px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .fm-check {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #515d73;
          font-size: 10px;
          cursor: pointer;
          user-select: none;
          transition: color .18s ease;
        }

        .fm-check:hover { color: #9b793e; }

        .fm-check input {
          width: 14px;
          height: 14px;
          margin: 0;
          accent-color: var(--fm-navy2);
          cursor: pointer;
        }

        .fm-search-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin: 16px 0 13px;
        }

        .fm-search {
          position: relative;
          flex: 1;
          min-width: 220px;
          max-width: 440px;
        }

        .fm-search svg {
          position: absolute;
          top: 50%;
          left: 13px;
          transform: translateY(-50%);
          color: #9299aa;
        }

        .fm-search input {
          width: 100%;
          height: 39px;
          padding: 0 13px 0 38px;
          border: 1px solid #e1e2e6;
          border-radius: 8px;
          outline: none;
          color: var(--fm-ink);
          background: white;
          font: inherit;
          font-size: 10px;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .fm-search input:focus,
        .fm-input:focus {
          border-color: #c19a52;
          box-shadow: 0 0 0 3px #c19a521c;
        }

        .fm-result-count {
          color: #8a91a1;
          font-size: 10px;
        }

        .fm-result-count strong {
          color: var(--fm-navy);
          font-weight: 800;
        }

        .fm-table-frame {
          overflow: hidden;
          border: 1px solid #e9e9e7;
          border-radius: 11px;
          background: white;
        }

        .fm-table-scroll { overflow-x: auto; }

        .fm-table {
          width: 100%;
          min-width: 800px;
          border-collapse: separate;
          border-spacing: 0;
        }

        .fm-table th {
          padding: 13px 14px;
          border-bottom: 1px solid #e8e8e5;
          color: #80889a;
          background: #f8f8f6;
          text-align: left;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .75px;
          white-space: nowrap;
        }

        .fm-table td {
          padding: 13px 14px;
          border-bottom: 1px solid #f0f0ed;
          color: #5c6578;
          font-size: 10px;
          white-space: nowrap;
        }

        .fm-table tbody tr {
          animation: fm-row .28s ease both;
          transition: background .18s ease;
        }

        .fm-table tbody tr:hover { background: #fbfaf6; }
        .fm-table tbody tr:last-child td { border-bottom: 0; }

        .fm-table td strong {
          color: #303b5d;
          font-size: 10px;
          font-weight: 750;
        }

        .fm-person-cell {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .fm-person-avatar {
          width: 30px;
          height: 30px;
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid #e9e2d4;
          border-radius: 9px;
          color: #98743a;
          background: #f8f3e9;
        }

        .fm-person-name {
          color: #303b5d;
          font-weight: 700;
        }

        .fm-person-sub {
          display: block;
          margin-top: 3px;
          color: #a0a5b1;
          font-size: 9px;
        }

        .fm-type-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border: 1px solid #e4e7ed;
          border-radius: 6px;
          color: #59647b;
          background: #f3f5f8;
          font-size: 9px;
          font-weight: 750;
        }

        .fm-type-pill.visiting {
          border-color: #eee2c8;
          color: #8a6a35;
          background: #fbf5e8;
        }

        .fm-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 750;
        }

        .fm-status.active {
          color: #28734f;
          background: #eaf6ee;
        }

        .fm-status.inactive {
          color: #a34a4a;
          background: #fff0f0;
        }

        .fm-status::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .fm-row-actions { display: flex; gap: 6px; }

        .fm-icon-btn {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border: 1px solid #e6e7e9;
          border-radius: 7px;
          color: #59647b;
          background: white;
          cursor: pointer;
          transition: .2s ease;
        }

        .fm-icon-btn:hover {
          transform: translateY(-2px);
          border-color: #c19a52;
          color: #99743a;
          background: #fbf8f0;
        }

        .fm-icon-btn.danger:hover {
          border-color: #e4baba;
          color: #b33b3b;
          background: #fff5f5;
        }

        .fm-empty {
          padding: 40px 15px !important;
          color: #858ba0 !important;
          text-align: center;
          font-size: 11px !important;
        }

        .fm-empty svg {
          margin-right: 7px;
          vertical-align: middle;
          animation: fm-spin 1s linear infinite;
        }

        .fm-table-footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding: 11px 13px;
          border-top: 1px solid #efefed;
          color: #9298a7;
          background: #fcfcfa;
          font-size: 9px;
        }

        /* Pagination */
        .fm-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 13px;
          padding: 14px 13px;
          border-top: 1px solid #ecece9;
          background: #fff;
        }

        .fm-pagination-info {
          color: #858ba0;
          font-size: 10px;
        }

        .fm-pagination-info strong {
          color: #303b5d;
          font-weight: 800;
        }

        .fm-pagination-controls {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .fm-page-btn {
          min-width: 31px;
          height: 31px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          border: 1px solid #e5e6e9;
          border-radius: 7px;
          color: #606b80;
          background: white;
          font: inherit;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .fm-page-btn:hover:not(:disabled) {
          border-color: #c19a52;
          color: #8c6b35;
          background: #fbf8f0;
          transform: translateY(-1px);
        }

        .fm-page-btn.active {
          border-color: #303b5d;
          color: white;
          background: #303b5d;
          box-shadow: 0 3px 8px #20294520;
        }

        .fm-page-btn:disabled {
          opacity: .38;
          cursor: not-allowed;
        }

        .fm-page-size {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #858ba0;
          font-size: 10px;
        }

        .fm-page-size select {
          height: 31px;
          padding: 0 25px 0 9px;
          border: 1px solid #e5e6e9;
          border-radius: 7px;
          outline: none;
          color: #48536c;
          background: white;
          font: inherit;
          font-size: 10px;
          cursor: pointer;
        }

        .fm-page-size select:focus {
          border-color: #c19a52;
          box-shadow: 0 0 0 2px #c19a521c;
        }

        .fm-upload-section {
          margin-top: 20px;
          padding-top: 19px;
          border-top: 1px solid #ecebe7;
        }

        .fm-upload-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 12px;
        }

        .fm-upload-heading h3 {
          margin: 0;
          color: var(--fm-navy);
          font-size: 12px;
        }

        .fm-upload-heading p {
          margin: 4px 0 0;
          color: #9298a7;
          font-size: 9px;
        }

        .fm-upload-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .fm-upload-box {
          padding: 15px;
          border: 1px solid #eae5d9;
          border-radius: 11px;
          background: linear-gradient(135deg, #fcfaf5, #fff);
          transition: border-color .2s ease, transform .2s ease,
            box-shadow .2s ease;
        }

        .fm-upload-box:hover {
          transform: translateY(-2px);
          border-color: #d9c79f;
          box-shadow: 0 8px 18px #20294509;
        }

        .fm-upload-box h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 7px;
          color: #303b5d;
          font-size: 11px;
        }

        .fm-upload-box p {
          margin: 0 0 12px;
          color: #858ba0;
          font-size: 9px;
          line-height: 1.65;
        }

        .fm-file-input {
          display: block;
          width: 100%;
          margin: 0 0 11px;
          color: #737c91;
          font: inherit;
          font-size: 9px;
        }

        .fm-file-input::file-selector-button {
          padding: 7px 9px;
          margin-right: 8px;
          border: 1px solid #dedfdf;
          border-radius: 7px;
          color: #48536c;
          background: white;
          font: inherit;
          font-size: 9px;
          cursor: pointer;
        }

        .fm-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 16px;
          background: #111a30a8;
          backdrop-filter: blur(6px);
          animation: fm-enter .2s ease both;
        }

        .fm-modal {
          width: min(100%, 470px);
          max-height: 90vh;
          overflow: auto;
          padding: 24px;
          border: 1px solid white;
          border-radius: 16px;
          background: white;
          box-shadow: 0 25px 80px #10182b40;
          animation: fm-float-in .3s ease both;
        }

        .fm-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .fm-modal-head h2 {
          margin: 0;
          color: var(--fm-navy);
          font-size: 18px;
          font-weight: 700;
        }

        .fm-modal-head p {
          margin: 5px 0 0;
          color: #9298a7;
          font-size: 10px;
        }

        .fm-close {
          width: 33px;
          height: 33px;
          display: grid;
          place-items: center;
          border: 1px solid #e5e6e9;
          border-radius: 8px;
          color: #65708a;
          background: white;
          cursor: pointer;
          transition: .2s ease;
        }

        .fm-close:hover {
          color: #a34a4a;
          border-color: #e7c4c4;
          background: #fff6f6;
          transform: rotate(90deg);
        }

        .fm-form-grid { display: grid; gap: 14px; }
        .fm-field { display: grid; gap: 6px; }

        .fm-field label {
          color: #59637a;
          font-size: 10px;
          font-weight: 750;
        }

        .fm-input {
          width: 100%;
          height: 41px;
          padding: 0 11px;
          border: 1px solid #dfe2e9;
          border-radius: 8px;
          outline: none;
          color: #202945;
          background: white;
          font: inherit;
          font-size: 11px;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .fm-input:disabled {
          color: #858ba0;
          background: #f4f5f8;
        }

        .fm-help {
          padding: 11px 12px;
          border: 1px solid #ece8dd;
          border-radius: 8px;
          color: #737c91;
          background: #faf8f2;
          font-size: 10px;
          line-height: 1.6;
        }

        .fm-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 20px;
        }

        .fm-print-heading { display: none; }

        @media(max-width:900px) {
          .fm-filter-grid { grid-template-columns: 1fr 1fr; }
          .fm-filter-group:last-child { grid-column: 1 / -1; }
        }

        @media(max-width:720px) {
          .fm-hero { padding: 24px; }
          .fm-hero-side { display: none; }
          .fm-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .fm-workspace-heading { align-items: flex-start; }
          .fm-content { padding: 15px; }
          .fm-actions { width: 100%; }
          .fm-actions .fm-btn { flex: 1; }
        }

        @media(max-width:560px) {
          .fm-hero { min-height: 160px; padding: 20px; }
          .fm-hero h1 { font-size: 27px; }
          .fm-filter-grid { grid-template-columns: 1fr; }
          .fm-filter-group:last-child { grid-column: auto; }
          .fm-upload-grid { grid-template-columns: 1fr; }
          .fm-search { max-width: none; }
          .fm-search-toolbar { align-items: stretch; }
          .fm-result-count { text-align: right; }
          .fm-filter-shell { padding: 12px; }
          .fm-workspace-heading { padding: 15px; }
          .fm-pagination { justify-content: center; }
          .fm-pagination-info { width: 100%; text-align: center; }
          .fm-page-size { width: 100%; justify-content: center; }
          .fm-pagination-controls { justify-content: center; }
        }

        @media(max-width:380px) {
          .fm-stats { gap: 8px; }
          .fm-stat { padding: 13px; }
          .fm-stat strong { font-size: 23px; }
          .fm-actions .fm-btn { padding: 0 8px; font-size: 9px; }
          .fm-page-btn { min-width: 28px; height: 29px; }
        }

        @media(prefers-reduced-motion: reduce) {
          .faculty-page *,
          .faculty-page *::before,
          .faculty-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }

        @media print {
          @page { size: landscape; margin: 15mm; }

          body {
            background: white !important;
            color: #202945 !important;
          }

          body * { visibility: hidden !important; }

          .fm-print-area,
          .fm-print-area * { visibility: visible !important; }

          .fm-print-area {
  position: static !important;
  display: block !important;
  width: 100% !important;
  max-width: none !important;
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
  margin: 0 !important;
  padding: 0 !important;
  background: white !important;
  border: 0 !important;
  box-shadow: none !important;
  break-inside: auto !important;
  page-break-inside: auto !important;
}

          .fm-no-print,
          .fm-hero,
          .fm-stats,
          .fm-filter-shell,
          .fm-search-toolbar,
          .fm-actions,
          .fm-row-actions,
          .fm-upload-section,
          .fm-notice,
          .fm-pagination {
            display: none !important;
          }

          .fm-workspace {
            overflow: visible !important;
            border: 0 !important;
            background: white !important;
            box-shadow: none !important;
          }

          .fm-workspace-heading {
            display: block !important;
            padding: 0 0 16px !important;
            border: 0 !important;
            background: white !important;
          }

          .fm-workspace-title { display: none !important; }

          .fm-print-heading {
            display: block !important;
            margin-bottom: 18px !important;
          }

          .fm-print-heading h1 {
            margin: 0 0 5px !important;
            color: #202945 !important;
            font-size: 22px !important;
          }

          .fm-print-heading p {
            margin: 3px 0 !important;
            color: #555 !important;
            font-size: 10px !important;
          }

          .fm-content { padding: 0 !important; }

          .fm-table-frame {
            overflow: visible !important;
            border: 1px solid #ccc !important;
          }

          .fm-table-scroll { overflow: visible !important; }

          .fm-table {
            min-width: 0 !important;
            width: 100% !important;
          }

          .fm-table th {
            color: #202945 !important;
            background: #eee !important;
            border-bottom: 1px solid #aaa !important;
            font-size: 9px !important;
          }

          .fm-table td {
            color: #222 !important;
            border-bottom: 1px solid #ddd !important;
            font-size: 9px !important;
          }

          .fm-status,
          .fm-type-pill {
            padding: 0 !important;
            color: #222 !important;
            background: transparent !important;
          }

          .fm-status::before { display: none !important; }

          .fm-table-frame,
.fm-table-scroll,
.fm-content,
.fm-workspace {
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
}

.fm-table {
  width: 100% !important;
  border-collapse: collapse !important;
  page-break-inside: auto !important;
  break-inside: auto !important;
}

.fm-table thead {
  display: table-header-group !important;
}

.fm-table tbody {
  display: table-row-group !important;
}

.fm-table tr {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

.fm-table th,
.fm-table td {
  padding: 7px !important;
}

html,
body {
  height: auto !important;
  overflow: visible !important;
}
        }
      `}</style>

      <div className="fm-print-area">
        {/* Header */}
        <header className="fm-hero fm-no-print">
          <div>
            <p className="fm-hero-kicker">
              <ShieldCheck size={13} /> Administration / Faculty
            </p>
            <h1>Faculty Management</h1>
            <p className="fm-hero-description">
              A central workspace to manage faculty information, monitor
              department records, and maintain your institute's faculty
              directory.
            </p>
          </div>

          <div className="fm-hero-side">
            <div className="fm-hero-seal">
              <GraduationCap size={30} />
            </div>
            <span className="fm-hero-caption">Faculty administration</span>
            <button
              className="fm-refresh"
              onClick={loadFaculty}
              disabled={loading || working}
            >
              <RefreshCw size={13} /> Refresh records
            </button>
          </div>
        </header>

        {notice.text && (
          <div className={`fm-notice ${notice.type} fm-no-print`}>
            {notice.type === "success" ? (
              <CheckCircle2 size={17} />
            ) : (
              <AlertCircle size={17} />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Statistics */}
        <section className="fm-stats fm-no-print">
          <div className="fm-stat">
            <div className="fm-stat-top">
              <span className="fm-stat-label">Filtered Faculty</span>
              <div className="fm-stat-icon"><Users size={16} /></div>
            </div>
            <strong>{filteredFaculty.length}</strong>
            <small>Matching current filters</small>
          </div>

          <div className="fm-stat">
            <div className="fm-stat-top">
              <span className="fm-stat-label">Permanent Faculty</span>
              <div className="fm-stat-icon"><GraduationCap size={16} /></div>
            </div>
            <strong>{permanentCount}</strong>
            <small>In current listing</small>
          </div>

          <div className="fm-stat">
            <div className="fm-stat-top">
              <span className="fm-stat-label">Visiting Faculty</span>
              <div className="fm-stat-icon"><UserRound size={16} /></div>
            </div>
            <strong>{visitingCount}</strong>
            <small>In current listing</small>
          </div>

          <div className="fm-stat">
            <div className="fm-stat-top">
              <span className="fm-stat-label">Active / Inactive</span>
              <div className="fm-stat-icon"><ShieldCheck size={16} /></div>
            </div>
            <strong>{activeCount} / {inactiveCount}</strong>
            <small>In current listing</small>
          </div>
        </section>

        {/* Main workspace */}
        <section className="fm-workspace">
          <div className="fm-workspace-heading">
            <div className="fm-workspace-title">
              <div className="fm-title-icon"><Building2 size={18} /></div>
              <div>
                <h2>Faculty Directory</h2>
                <p>Browse, filter and manage faculty records</p>
              </div>
            </div>

            <div className="fm-actions fm-no-print">
              {isVisitingIncluded && (
                <button className="fm-btn primary" onClick={openAddModal}>
                  <Plus size={14} /> Add Visiting Faculty
                </button>
              )}

              {isPermanentIncluded && (
                <button
                  className="fm-btn"
                  onClick={() => regularInputRef.current?.click()}
                  disabled={working}
                >
                  <Upload size={14} /> Import Faculty
                </button>
              )}

              <button
                className="fm-btn"
                onClick={printListing}
                disabled={loading || !filteredFaculty.length}
              >
                <Printer size={14} /> Print
              </button>

              <button
                className="fm-btn primary"
                onClick={downloadExcel}
                disabled={loading || !filteredFaculty.length}
              >
                <FileDown size={14} /> Excel
              </button>
            </div>
          </div>

          <div className="fm-content">
            {/* Print heading */}
            <div className="fm-print-heading">
              <h1>DPP Institute of Technology</h1>
              <p>Faculty Management — Faculty Listing</p>
              <p>
                Faculty Type: {filterDescription.typeLabel} | Department:{" "}
                {filterDescription.departmentLabel} | Status:{" "}
                {filterDescription.statusLabel}
              </p>
              <p>
                Records: {filteredFaculty.length} | Printed:{" "}
                {new Date().toLocaleString()}
              </p>
            </div>

            {/* Filters */}
            <section className="fm-filter-shell fm-no-print">
              <div className="fm-filter-heading">
                <div className="fm-filter-heading-main">
                  <div className="fm-filter-heading-icon">
                    <SlidersHorizontal size={16} />
                  </div>
                  <div>
                    <h3>Refine Faculty Listing</h3>
                    <p>Combine filters to find exactly the records you need.</p>
                  </div>
                </div>

                <div className="fm-filter-tools">
                  <button className="fm-subtle-btn" onClick={resetFilters}>
                    <RotateCcw size={12} /> Reset all
                  </button>
                  <button
                    className="fm-subtle-btn"
                    onClick={() => setFiltersExpanded((value) => !value)}
                    aria-expanded={filtersExpanded}
                  >
                    {filtersExpanded ? "Collapse" : "Expand"}
                    <ChevronDown
                      size={13}
                      style={{
                        transform: filtersExpanded ? "rotate(180deg)" : "none",
                        transition: ".2s",
                      }}
                    />
                  </button>
                </div>
              </div>

              {filtersExpanded && (
                <div className="fm-filter-grid">
                  <div className="fm-filter-group">
                    <h4>Faculty Type</h4>
                    <div className="fm-check-list">
                      {TYPE_OPTIONS.map((option) => (
                        <label className="fm-check" key={option.value}>
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(option.value)}
                            onChange={() =>
                              toggleSelection(
                                option.value,
                                selectedTypes,
                                setSelectedTypes
                              )
                            }
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="fm-filter-group">
                    <h4>Department</h4>
                    <div className="fm-department-list">
                      <label className="fm-check">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes("ALL")}
                          onChange={() =>
                            toggleSelection(
                              "ALL",
                              selectedDepartments,
                              setSelectedDepartments
                            )
                          }
                        />
                        All Departments
                      </label>

                      {departmentOptions.map((department) => (
                        <label className="fm-check" key={department}>
                          <input
                            type="checkbox"
                            checked={selectedDepartments.includes(department)}
                            onChange={() =>
                              toggleSelection(
                                department,
                                selectedDepartments,
                                setSelectedDepartments
                              )
                            }
                          />
                          {department}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="fm-filter-group">
                    <h4>Faculty Status</h4>
                    <div className="fm-check-list">
                      {STATUS_OPTIONS.map((option) => (
                        <label className="fm-check" key={option.value}>
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(option.value)}
                            onChange={() =>
                              toggleSelection(
                                option.value,
                                selectedStatuses,
                                setSelectedStatuses
                              )
                            }
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Search */}
            <div className="fm-search-toolbar fm-no-print">
              <div className="fm-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by teacher ID, name, phone, department..."
                />
              </div>

              <div className="fm-result-count">
                Showing <strong>{filteredFaculty.length}</strong> matching
                records
              </div>
            </div>

            {/* Faculty table */}
            <div className="fm-table-frame">
              <div className="fm-table-scroll">
                <table className="fm-table">
                  <thead>
                    <tr>
                      <th>TEACHER ID</th>
                      <th>FACULTY NAME</th>
                      <th>PHONE NUMBER</th>
                      <th>DEPARTMENT</th>
                      <th>FACULTY TYPE</th>
                      <th>STATUS</th>
                      <th className="fm-no-print">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="fm-empty">
                          <LoaderCircle size={18} />
                          Loading faculty records...
                        </td>
                      </tr>
                    ) : paginatedFaculty.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="fm-empty">
                          No faculty records found for the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredFaculty.map((person, index) => {
                        const type = getFacultyType(person);
                        const active = isFacultyActive(person);

                        return (
                          <tr
                            key={person.teacherId || `${person.name}-${index}`}
                            style={{
                              animationDelay: `${Math.min(index, 12) * 25}ms`,
                            }}
                          >
                            <td><strong>{person.teacherId || "—"}</strong></td>

                            <td>
                              <div className="fm-person-cell">
                                <div className="fm-person-avatar">
                                  <UserRound size={15} />
                                </div>
                                <div>
                                  <span className="fm-person-name">
                                    {person.name || "—"}
                                  </span>
                                  <span className="fm-person-sub">
                                    Faculty member
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>{person.phoneNumber || "—"}</td>
                            <td>{person.deptId || "—"}</td>

                            <td>
                              <span
                                className={`fm-type-pill ${
                                  type === "VISITING" ? "visiting" : ""
                                }`}
                              >
                                {type === "PERMANENT"
                                  ? "Permanent"
                                  : type === "VISITING"
                                    ? "Visiting"
                                    : type}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`fm-status ${
                                  active ? "active" : "inactive"
                                }`}
                              >
                                {active ? "Active" : "Inactive"}
                              </span>
                            </td>

                            <td className="fm-no-print">
                              <div className="fm-row-actions">
                                {type === "VISITING" && active && (
                                  <button
                                    className="fm-icon-btn"
                                    title="Edit Visiting Faculty"
                                    onClick={() => openEditModal(person)}
                                    disabled={working}
                                  >
                                    <Pencil size={14} />
                                  </button>
                                )}

                                {active && (
                                  <button
                                    className="fm-icon-btn danger"
                                    title="Deactivate faculty"
                                    onClick={() => deactivateFaculty(person)}
                                    disabled={working}
                                  >
                                    <UserX size={14} />
                                  </button>
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

              {/* Table information and pagination */}
              {!loading && filteredFaculty.length > 0 && (
                <div className="fm-pagination fm-no-print">
                  <div className="fm-pagination-info">
                    Showing <strong>{firstVisibleRecord}–{lastVisibleRecord}</strong>{" "}
                    of <strong>{filteredFaculty.length}</strong> faculty members
                  </div>

                  <div className="fm-pagination-controls">
                    <button
                      className="fm-page-btn"
                      title="First page"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft size={14} />
                    </button>

                    <button
                      className="fm-page-btn"
                      title="Previous page"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        className={`fm-page-btn ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className="fm-page-btn"
                      title="Next page"
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={14} />
                    </button>

                    <button
                      className="fm-page-btn"
                      title="Last page"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight size={14} />
                    </button>
                  </div>

                  <label className="fm-page-size">
                    Rows per page
                    <select
                      value={pageSize}
                      onChange={(event) =>
                        setPageSize(Number(event.target.value))
                      }
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </label>
                </div>
              )}

              {loading && (
                <div className="fm-table-footer fm-no-print">
                  Loading faculty records...
                </div>
              )}

              {!loading && filteredFaculty.length === 0 && (
                <div className="fm-table-footer fm-no-print">
                  No matching faculty records.
                </div>
              )}
            </div>

            {/* Permanent faculty Excel operations */}
            {isPermanentIncluded && (
              <section className="fm-upload-section fm-no-print">
                <div className="fm-upload-heading">
                  <div className="fm-title-icon">
                    <FileSpreadsheet size={16} />
                  </div>
                  <div>
                    <h3>Permanent Faculty Operations</h3>
                    <p>Manage Permanent Faculty records using Excel files.</p>
                  </div>
                </div>

                <div className="fm-upload-grid">
                  <div className="fm-upload-box">
                    <h4><FileSpreadsheet size={14} /> Import Permanent Faculty</h4>
                    <p>
                      Upload the authority Excel file containing teacherId,
                      name, phoneNumber, facultyType and deptId columns.
                    </p>

                    <input
                      ref={regularInputRef}
                      className="fm-file-input"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(event) =>
                        setRegularUpload(event.target.files?.[0] || null)
                      }
                    />

                    <button
                      className="fm-btn primary"
                      disabled={!regularUpload || working}
                      onClick={() =>
                        uploadExcel(
                          regularUpload,
                          "/admin/faculty/regular/upload",
                          "Permanent Faculty import"
                        )
                      }
                    >
                      <Upload size={13} /> Upload Excel
                    </button>
                  </div>

                  <div className="fm-upload-box">
                    <h4><UserX size={14} /> Deactivate Permanent Faculty</h4>
                    <p>
                      Upload the authority Excel file containing the teacherId
                      column for faculty members to deactivate.
                    </p>

                    <input
                      ref={deactivateInputRef}
                      className="fm-file-input"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(event) =>
                        setDeactivationUpload(event.target.files?.[0] || null)
                      }
                    />

                    <button
                      className="fm-btn"
                      disabled={!deactivationUpload || working}
                      onClick={() =>
                        uploadExcel(
                          deactivationUpload,
                          "/admin/faculty/regular/deactivate",
                          "Permanent Faculty deactivation"
                        )
                      }
                    >
                      <UserX size={13} /> Deactivate from Excel
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      </div>

      {/* Add / Edit Visiting Faculty modal */}
      {modalOpen && (
        <div
          className="fm-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="fm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fm-modal-title"
          >
            <div className="fm-modal-head">
              <div>
                <h2 id="fm-modal-title">
                  {editing ? "Edit Visiting Faculty" : "Add Visiting Faculty"}
                </h2>
                <p>
                  {editing
                    ? "Update the faculty member's information."
                    : "Enter the details of the new faculty member."}
                </p>
              </div>

              <button
                className="fm-close"
                onClick={closeModal}
                disabled={working}
                aria-label="Close dialog"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSaveVisitingFaculty}>
              <div className="fm-form-grid">
                <div className="fm-field">
                  <label htmlFor="fm-teacher-id">Teacher ID *</label>
                  <input
                    id="fm-teacher-id"
                    className="fm-input"
                    name="teacherId"
                    value={form.teacherId}
                    onChange={handleFormChange}
                    disabled={editing}
                    required
                    placeholder="Example: VF001"
                  />
                </div>

                <div className="fm-field">
                  <label htmlFor="fm-name">Faculty Name *</label>
                  <input
                    id="fm-name"
                    className="fm-input"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div className="fm-field">
                  <label htmlFor="fm-phone">Phone Number</label>
                  <input
                    id="fm-phone"
                    className="fm-input"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleFormChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="fm-field">
                  <label htmlFor="fm-dept">Department ID</label>
                  <input
                    id="fm-dept"
                    className="fm-input"
                    name="deptId"
                    value={form.deptId}
                    onChange={handleFormChange}
                    placeholder="MCA"
                  />
                </div>

                <div className="fm-help">
                  Faculty type is automatically set to <strong>VISITING</strong>.
                  New Visiting Faculty records are created as active.
                </div>
              </div>

              <div className="fm-modal-actions">
                <button
                  type="button"
                  className="fm-btn"
                  onClick={closeModal}
                  disabled={working}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="fm-btn primary"
                  disabled={working}
                >
                  {working
                    ? "Saving..."
                    : editing
                      ? "Save changes"
                      : "Add faculty"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
