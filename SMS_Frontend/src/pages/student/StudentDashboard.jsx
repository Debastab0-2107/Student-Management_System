
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import api from "../../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const token = localStorage.getItem("sms_token");
      const role = localStorage.getItem("sms_role");

      if (!token || role !== "STUDENT") {
        navigate("/login/student", { replace: true });
        return;
      }

      try {
        const response = await api.get("/student/profile");
        if (active) setProfile(response.data);
      } catch (requestError) {
        if (!active) return;

        if (requestError.response?.status === 401 ||
            requestError.response?.status === 403) {
          localStorage.removeItem("sms_token");
          localStorage.removeItem("sms_role");
          localStorage.removeItem("sms_student_id");
          navigate("/login/student", { replace: true });
          return;
        }

        setError(
          requestError.response?.data?.message ||
          "Your profile could not be loaded. Please try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_role");
    localStorage.removeItem("sms_student_id");
    navigate("/login/student", { replace: true });
  }

  return (
    <main className="coming-soon-page">
      <section className="coming-soon-card">
        <p className="eyebrow">DPP INSTITUTE OF TECHNOLOGY</p>

        <div style={{ color: "#292e4d", marginBottom: 16 }}>
          <GraduationCap size={36} />
        </div>

        <h1>Student Dashboard</h1>

        {loading ? (
          <p>Loading your student profile...</p>
        ) : error ? (
          <>
            <p role="alert">{error}</p>
            <button
              className="primary-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </>
        ) : (
          <>
            <p>
              Welcome{profile?.name ? `, ${profile.name}` : ""}. Your login
              was successful, and your student profile has been retrieved.
            </p>
            <p>
              <strong>Student ID:</strong>{" "}
              {profile?.studentId ||
                localStorage.getItem("sms_student_id")}
            </p>
            <p>
              The complete dashboard, CA marks, results, and profile tools
              will be added in the next stage.
            </p>
          </>
        )}

        <button
          className="primary-button"
          onClick={handleLogout}
          style={{ marginTop: 18 }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </section>
    </main>
  );
}
