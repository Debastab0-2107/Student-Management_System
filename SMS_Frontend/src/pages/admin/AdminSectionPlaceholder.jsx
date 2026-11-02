
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Construction, GraduationCap, BookPlus } from "lucide-react";

export default function AdminSectionPlaceholder({ type }) {
  const location = useLocation();

  const isStudent = type === "students";

  const title = isStudent ? "Student Section" : "Add Course";
  const description = isStudent
    ? "The student management workspace will be configured here."
    : "The course management workspace will be configured here.";

  const Icon = isStudent ? GraduationCap : BookPlus;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>
          <Icon size={30} />
        </div>

        <span style={styles.kicker}>ADMINISTRATION WORKSPACE</span>

        <h1 style={styles.title}>{title}</h1>

        <p style={styles.description}>{description}</p>

        <div style={styles.status}>
          <Construction size={16} />
          <span>Workspace setup pending</span>
        </div>

        <Link to="/admin/dashboard" style={styles.link}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "65vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "560px",
    padding: "42px 30px",
    border: "1px solid #ffffffc9",
    borderRadius: "20px",
    background: "#ffffffd9",
    boxShadow: "0 15px 45px #20294515",
    textAlign: "center",
  },
  icon: {
    width: "64px",
    height: "64px",
    margin: "0 auto 20px",
    display: "grid",
    placeItems: "center",
    borderRadius: "18px",
    color: "#a27c37",
    background: "#fbf4e7",
    border: "1px solid #e9d9b6",
  },
  kicker: {
    color: "#a27c37",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.6px",
  },
  title: {
    margin: "12px 0 8px",
    color: "#202945",
    fontSize: "27px",
  },
  description: {
    maxWidth: "390px",
    margin: "0 auto",
    color: "#858ba0",
    fontSize: "13px",
    lineHeight: 1.8,
  },
  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "24px",
    padding: "10px 14px",
    borderRadius: "9px",
    color: "#85652d",
    background: "#fbf4e7",
    fontSize: "11px",
    fontWeight: 700,
  },
  link: {
    display: "flex",
    width: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    margin: "25px auto 0",
    color: "#a27c37",
    fontSize: "12px",
    fontWeight: 800,
    textDecoration: "none",
  },
};
