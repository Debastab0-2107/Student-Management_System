
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import api from "../../services/api";
import "./StudentLogin.css";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const cleanStudentId = studentId.trim();

    if (!cleanStudentId || !password) {
      setError("Please enter your student ID and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/student/login", {
        studentId: cleanStudentId,
        password,
      });

      const { token, role } = response.data;

      if (!token || role !== "STUDENT") {
        throw new Error("The server returned an unexpected login response.");
      }

      localStorage.setItem("sms_token", token);
      localStorage.setItem("sms_role", role);
      localStorage.setItem("sms_student_id", cleanStudentId);

      // Keep the loading screen visible briefly before navigating.
      await new Promise((resolve) => setTimeout(resolve, 650));

      navigate("/student/dashboard", { replace: true });
    } catch (requestError) {
      const status = requestError.response?.status;
      const serverMessage = requestError.response?.data?.message;

      if (!requestError.response) {
        setError(
          "Cannot connect to the server. Please check that the backend is running."
        );
      } else if (status === 401) {
        setError(serverMessage || "Invalid student ID or password.");
      } else if (status === 400) {
        setError(serverMessage || "Please check the details you entered.");
      } else {
        setError(serverMessage || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="student-login-page">
      <section className="student-login-shell">
        <div className="student-login-form-panel">
          <Link className="student-login-back" to="/">
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>

          <div className="student-login-form-content">
            <div className="student-login-mobile-brand">
              <span className="student-login-brand-icon">
                <GraduationCap size={22} />
              </span>
              <span>DPP Institute of Technology</span>
            </div>

            <p className="student-login-kicker">STUDENT PORTAL</p>
            <h1>Welcome back.</h1>
            <p className="student-login-subtitle">
              Sign in to access your academic profile and student services.
            </p>

            <form onSubmit={handleSubmit} className="student-login-form">
              <label htmlFor="studentId">Student ID</label>
              <div className="student-login-input-wrap">
                <UserRound size={18} aria-hidden="true" />
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  required
                  disabled={loading}
                />
              </div>

              <label htmlFor="studentPassword">Password</label>
              <div className="student-login-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  id="studentPassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  className="student-login-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <div className="student-login-error" role="alert">
                  {error}
                </div>
              )}

              <button
                className="student-login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="student-login-spinner" />
                    <span>Signing you in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to your account</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="student-login-security">
              <ShieldCheck size={17} />
              <span>Your account is protected by secure authentication.</span>
            </div>

            <p className="student-login-help">
              Having trouble signing in? Contact your institute administrator.
            </p>
          </div>

          <p className="student-login-copyright">
            © {new Date().getFullYear()} DPP Institute of Technology
          </p>
        </div>

        <aside className="student-login-visual-panel">
          <div className="student-login-visual-glow" />
          <div className="student-login-visual-content">
            <div className="student-login-visual-brand">
              <span className="student-login-brand-icon">
                <GraduationCap size={23} />
              </span>
              <span>DPP INSTITUTE OF TECHNOLOGY</span>
            </div>

            <p className="student-login-visual-eyebrow">
              YOUR ACADEMIC JOURNEY
            </p>
            <h2>
              Your future
              <br />
              starts <span>here.</span>
            </h2>
            <p className="student-login-visual-description">
              One place for your academic information, results, and student
              services.
            </p>

            <div className="student-login-art">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
                alt="Students studying together on campus"
              />
              <div className="student-login-art-caption">
                <span className="student-login-art-dot" />
                <div>
                  <strong>Learn. Grow. Achieve.</strong>
                  <span>Your academic journey, connected.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="student-login-decoration student-login-decoration-one" />
          <div className="student-login-decoration student-login-decoration-two" />
        </aside>
      </section>
    </main>
  );
}
