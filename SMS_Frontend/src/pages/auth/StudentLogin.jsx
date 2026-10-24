
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
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/api";

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
    <main className="sl-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

       
.sl-page {
  --sl-navy: #101b35;
  --sl-navy-deep: #0a1226;
  --sl-gold: #d8b46a;
  --sl-gold-light: #f0dba8;
  --sl-ink: #17223b;
  --sl-muted: #778197;
  --sl-border: #e6e9ef;

  min-height: 100vh;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  background:
    radial-gradient(circle at 8% 14%,
      rgba(216, 180, 106, 0.22) 0,
      rgba(216, 180, 106, 0.08) 12%,
      transparent 27%),
    radial-gradient(circle at 91% 82%,
      rgba(72, 99, 155, 0.15) 0,
      rgba(72, 99, 155, 0.06) 15%,
      transparent 30%),
    radial-gradient(circle at 52% 48%,
      #ffffff 0,
      #f8f9fc 48%,
      #eef1f7 100%);

  color: var(--sl-ink);
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

        
/* Soft gold and navy ambient circles */
.sl-page::before,
.sl-page::after {
  content: "";
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
}

.sl-page::before {
  width: 390px;
  height: 390px;
  top: -190px;
  left: -145px;
  border: 1px solid rgba(190, 151, 75, 0.24);
  box-shadow:
    0 0 0 28px rgba(190, 151, 75, 0.045),
    0 0 0 58px rgba(190, 151, 75, 0.035),
    0 0 0 92px rgba(190, 151, 75, 0.025);
}

.sl-page::after {
  width: 460px;
  height: 460px;
  right: -230px;
  bottom: -250px;
  border: 1px solid rgba(37, 57, 94, 0.15);
  box-shadow:
    0 0 0 30px rgba(37, 57, 94, 0.035),
    0 0 0 65px rgba(37, 57, 94, 0.025),
    0 0 0 100px rgba(37, 57, 94, 0.018);
}

/* Fine, understated dot pattern */
.sl-page .sl-shell {
  position: relative;
  z-index: 1;
}

.sl-page .sl-form-panel {
  background-image:
    radial-gradient(rgba(16, 27, 53, 0.055) 0.8px, transparent 0.8px);
  background-size: 19px 19px;
  background-position: right top;
}

/* Keep the form area readable */
.sl-page .sl-form-content {
  position: relative;
  z-index: 1;
}

/* Respect smaller screens */
@media (max-width: 720px) {
  .sl-page::before {
    width: 270px;
    height: 270px;
    top: -145px;
    left: -125px;
  }

  .sl-page::after {
    width: 300px;
    height: 300px;
    right: -175px;
    bottom: -175px;
  }
}

        .sl-page *,
        .sl-page *::before,
        .sl-page *::after {
          box-sizing: border-box;
        }

        .sl-page a {
          text-decoration: none;
        }

        .sl-shell {
          width: 100%;
          max-width: 1160px;
          min-height: 690px;
          display: grid;
          grid-template-columns: .93fr 1.07fr;
          overflow: hidden;
          border-radius: 27px;
          background: #fff;
          box-shadow: 0 30px 90px rgba(16, 27, 53, .13),
                      0 5px 20px rgba(16, 27, 53, .04);
          border: 1px solid rgba(255,255,255,.9);
          animation: sl-enter .7s ease both;
        }

        @keyframes sl-enter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sl-form-panel {
          padding: 35px 48px 26px;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #fff;
        }

        .sl-back {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #68738a;
          font-size: 13px;
          font-weight: 600;
          transition: color .2s, transform .2s;
        }

        .sl-back:hover {
          color: var(--sl-navy);
          transform: translateX(-3px);
        }

        .sl-mobile-brand {
          display: none;
          align-items: center;
          gap: 10px;
          margin: 24px 0 0;
          color: var(--sl-navy);
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 13px;
        }

        .sl-brand-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 43px;
          height: 43px;
          color: var(--sl-gold-light);
          background: var(--sl-navy);
          border-radius: 13px;
          box-shadow: 0 6px 15px rgba(16,27,53,.16);
        }

        .sl-form-content {
          width: 100%;
          max-width: 390px;
          margin: auto;
          padding: 40px 0 30px;
        }

        .sl-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 15px;
          color: #a47c32;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.1px;
        }

        .sl-kicker::before {
          content: "";
          width: 23px;
          height: 2px;
          border-radius: 4px;
          background: var(--sl-gold);
        }

        .sl-heading {
          margin: 0;
          color: var(--sl-navy);
          font-family: 'Manrope', sans-serif;
          font-size: clamp(31px, 3vw, 40px);
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -1.8px;
        }

        .sl-heading span {
          color: #b48b42;
        }

        .sl-subtitle {
          margin: 14px 0 31px;
          max-width: 350px;
          color: var(--sl-muted);
          font-size: 13.5px;
          line-height: 1.85;
        }

        .sl-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sl-label {
          display: block;
          margin: 7px 0 0;
          color: #303b52;
          font-size: 12px;
          font-weight: 700;
        }

        .sl-input-wrap {
          width: 100%;
          min-height: 53px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 15px;
          color: #929bb0;
          border: 1px solid #e2e6ed;
          border-radius: 12px;
          background: #fbfcfe;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }

        .sl-input-wrap:focus-within {
          border-color: #c4a15b;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(216,180,106,.14);
        }

        .sl-input-wrap input {
          width: 100%;
          min-width: 0;
          height: 51px;
          padding: 0;
          border: none;
          outline: none;
          color: var(--sl-ink);
          background: transparent;
          font-family: inherit;
          font-size: 13px;
        }

        .sl-input-wrap input::placeholder {
          color: #a5adbc;
        }

        .sl-input-wrap input:disabled {
          opacity: .65;
        }

        .sl-password-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          padding: 0;
          border: none;
          border-radius: 8px;
          color: #8993a7;
          background: transparent;
          cursor: pointer;
          transition: color .2s, background .2s;
        }

        .sl-password-toggle:hover:not(:disabled) {
          color: var(--sl-navy);
          background: #eef1f6;
        }

        .sl-password-toggle:disabled {
          cursor: not-allowed;
          opacity: .5;
        }

        .sl-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 5px;
          padding: 12px 13px;
          color: #a22e36;
          background: #fff3f3;
          border: 1px solid #f4d3d5;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.6;
        }

        .sl-submit {
          width: 100%;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 14px;
          padding: 13px 20px;
          border: 1px solid var(--sl-navy);
          border-radius: 12px;
          color: #fff;
          background: var(--sl-navy);
          box-shadow: 0 8px 18px rgba(16,27,53,.15);
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s, background .2s;
        }

        .sl-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #1b2a4b;
          box-shadow: 0 12px 24px rgba(16,27,53,.21);
        }

        .sl-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .sl-submit:disabled {
          cursor: wait;
          opacity: .78;
        }

        .sl-submit-arrow {
          display: inline-flex;
          transition: transform .2s;
        }

        .sl-submit:hover:not(:disabled) .sl-submit-arrow {
          transform: translateX(4px);
        }

        .sl-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: sl-spin .7s linear infinite;
        }

        @keyframes sl-spin {
          to { transform: rotate(360deg); }
        }

        .sl-security {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 23px;
          padding: 13px 14px;
          border: 1px solid #e8edf1;
          border-radius: 11px;
          background: #f8fafb;
          color: #69758a;
          font-size: 11px;
          line-height: 1.6;
        }

        .sl-security-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          color: #8b6b2f;
          background: #f6ecd5;
          border-radius: 9px;
        }

        .sl-help {
          margin: 21px 0 0;
          color: #8992a3;
          font-size: 11px;
          line-height: 1.8;
          text-align: center;
        }

        .sl-help a {
          color: #8c6b32;
          font-weight: 700;
        }

        .sl-help a:hover {
          text-decoration: underline;
        }

        .sl-copyright {
          margin: 0;
          padding-top: 20px;
          color: #a0a7b5;
          font-size: 10px;
          text-align: center;
        }

        .sl-visual-panel {
          min-width: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 40px 43px 32px;
          color: #fff;
          background: var(--sl-navy-deep);
          isolation: isolate;
        }

        .sl-visual-panel::before {
          content: "";
          position: absolute;
          z-index: -2;
          inset: 0;
          background:
            linear-gradient(155deg, rgba(16,27,53,.96) 4%, rgba(12,22,43,.83) 43%, rgba(9,17,33,.97) 100%),
            url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=85") center / cover;
        }

        .sl-visual-panel::after {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          background:
            radial-gradient(circle at 85% 14%, rgba(216,180,106,.18), transparent 29%),
            linear-gradient(135deg, transparent 48%, rgba(216,180,106,.05) 48.2%, transparent 48.6%);
          pointer-events: none;
        }

        .sl-visual-top {
          position: relative;
          z-index: 1;
        }

        .sl-visual-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,.9);
          font-family: 'Manrope', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.55px;
          line-height: 1.6;
        }

        .sl-visual-brand .sl-brand-icon {
          width: 46px;
          height: 46px;
          color: var(--sl-gold-light);
          border: 1px solid rgba(216,180,106,.35);
          background: rgba(255,255,255,.07);
          box-shadow: none;
        }

        .sl-visual-copy {
          margin-top: 72px;
          max-width: 420px;
        }

        .sl-visual-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 18px;
          color: var(--sl-gold-light);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.3px;
        }

        .sl-visual-eyebrow svg {
          color: var(--sl-gold);
        }

        .sl-visual-title {
          margin: 0;
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: clamp(35px, 4vw, 52px);
          line-height: 1.13;
          font-weight: 800;
          letter-spacing: -2.1px;
        }

        .sl-visual-title span {
          color: var(--sl-gold-light);
        }

        .sl-visual-description {
          max-width: 360px;
          margin: 20px 0 0;
          color: rgba(255,255,255,.68);
          font-size: 13px;
          line-height: 1.95;
        }

        .sl-photo-card {
          position: relative;
          min-height: 190px;
          margin-top: 40px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 17px;
          background: rgba(255,255,255,.06);
          box-shadow: 0 20px 45px rgba(0,0,0,.18);
        }

        .sl-photo-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 42%;
          opacity: .72;
        }

        .sl-photo-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 20px;
          background: linear-gradient(0deg, rgba(7,14,28,.94), rgba(7,14,28,.05) 90%);
        }

        .sl-photo-caption {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sl-photo-caption-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--sl-gold-light);
          border: 1px solid rgba(216,180,106,.4);
          border-radius: 12px;
          background: rgba(216,180,106,.13);
        }

        .sl-photo-caption strong {
          display: block;
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          font-weight: 800;
        }

        .sl-photo-caption span {
          display: block;
          margin-top: 5px;
          color: rgba(255,255,255,.65);
          font-size: 11px;
        }

        .sl-visual-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 26px;
          color: rgba(255,255,255,.48);
          font-size: 10px;
        }

        .sl-visual-footer span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .sl-visual-footer svg {
          color: var(--sl-gold);
        }

        .sl-decoration {
          position: absolute;
          pointer-events: none;
          border: 1px solid rgba(216,180,106,.13);
          border-radius: 50%;
        }

        .sl-decoration-one {
          width: 260px;
          height: 260px;
          top: -135px;
          right: -110px;
        }

        .sl-decoration-two {
          width: 340px;
          height: 340px;
          bottom: -235px;
          left: -210px;
        }

        @media (max-width: 980px) {
          .sl-page {
            padding: 18px;
          }

          .sl-shell {
            max-width: 760px;
            grid-template-columns: 1fr .85fr;
            min-height: 650px;
          }

          .sl-form-panel {
            padding: 30px 30px 22px;
          }

          .sl-visual-panel {
            padding: 32px 27px 26px;
          }

          .sl-visual-copy {
            margin-top: 55px;
          }

          .sl-visual-title {
            font-size: 39px;
          }

          .sl-photo-card {
            min-height: 165px;
            margin-top: 30px;
          }
        }

        @media (max-width: 720px) {
          .sl-page {
            min-height: 100vh;
            padding: 0;
            align-items: stretch;
            background: #fff;
          }

          .sl-shell {
            min-height: 100vh;
            grid-template-columns: 1fr;
            border: none;
            border-radius: 0;
            box-shadow: none;
          }

          .sl-form-panel {
            min-height: 100vh;
            padding: 24px clamp(22px, 7vw, 46px) 22px;
          }

          .sl-mobile-brand {
            display: flex;
          }

          .sl-form-content {
            max-width: 440px;
            padding: 42px 0 35px;
          }

          .sl-heading {
            font-size: 37px;
          }

          .sl-subtitle {
            margin-bottom: 27px;
          }

          .sl-visual-panel {
            display: none;
          }

          .sl-copyright {
            margin-top: auto;
          }
        }

        @media (max-width: 380px) {
          .sl-form-panel {
            padding-right: 19px;
            padding-left: 19px;
          }

          .sl-heading {
            font-size: 33px;
          }

          .sl-input-wrap {
            padding: 0 12px;
            gap: 9px;
          }

          .sl-security {
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sl-page *,
          .sl-page *::before,
          .sl-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <section className="sl-shell">
        <div className="sl-form-panel">
          <Link className="sl-back" to="/">
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>

          <div className="sl-mobile-brand">
            <span className="sl-brand-icon">
              <GraduationCap size={22} />
            </span>
            <span>DPP Institute of Technology</span>
          </div>

          <div className="sl-form-content">
            <p className="sl-kicker">STUDENT PORTAL</p>

            <h1 className="sl-heading">
              Welcome <span>back.</span>
            </h1>

            <p className="sl-subtitle">
              Your academic journey, all in one place. Sign in to access your
              student profile, academic information, and campus services.
            </p>

            <form onSubmit={handleSubmit} className="sl-form">
              <label className="sl-label" htmlFor="studentId">
                Student ID
              </label>

              <div className="sl-input-wrap">
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

              <label className="sl-label" htmlFor="studentPassword">
                Password
              </label>

              <div className="sl-input-wrap">
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
                  className="sl-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {error && (
                <div className="sl-error" role="alert">
                  <ShieldCheck size={17} />
                  <span>{error}</span>
                </div>
              )}

              <button
                className="sl-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="sl-spinner" />
                    <span>Signing you in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to your account</span>
                    <span className="sl-submit-arrow">
                      <ArrowRight size={18} />
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="sl-security">
              <span className="sl-security-icon">
                <ShieldCheck size={17} />
              </span>
              <span>
                <strong>Secure student access</strong>
                <br />
                Your account is protected by secure authentication.
              </span>
            </div>

            <p className="sl-help">
              Having trouble signing in? Contact your institute administrator.
            </p>
          </div>

          <p className="sl-copyright">
            © {new Date().getFullYear()} DPP Institute of Technology. All rights
            reserved.
          </p>
        </div>

        <aside className="sl-visual-panel">
          <div className="sl-decoration sl-decoration-one" />
          <div className="sl-decoration sl-decoration-two" />

          <div className="sl-visual-top">
            <div className="sl-visual-brand">
              <span className="sl-brand-icon">
                <GraduationCap size={24} />
              </span>
              <span>DPP INSTITUTE OF TECHNOLOGY</span>
            </div>

            <div className="sl-visual-copy">
              <p className="sl-visual-eyebrow">
                <Sparkles size={15} />
                YOUR ACADEMIC JOURNEY
              </p>

              <h2 className="sl-visual-title">
                Your future
                <br />
                starts <span>here.</span>
              </h2>

              <p className="sl-visual-description">
                Every achievement begins with a step forward. Access your
                academic world and keep moving toward your goals.
              </p>
            </div>

            <div className="sl-photo-card">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
                alt="Students learning and collaborating together"
              />

              <div className="sl-photo-overlay">
                <div className="sl-photo-caption">
                  <div className="sl-photo-caption-icon">
                    <BookOpen size={21} />
                  </div>

                  <div>
                    <strong>Learn. Grow. Achieve.</strong>
                    <span>Your academic journey, connected.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sl-visual-footer">
            <span>
              <Award size={15} />
              Built for your success
            </span>

            <span>
              <CheckCircle2 size={15} />
              Student portal
            </span>
          </div>
        </aside>
      </section>
    </main>
  );
}
