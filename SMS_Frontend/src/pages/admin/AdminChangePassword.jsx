
import { useState } from "react";
import api from "../../services/api";
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LockKeyhole,
  LoaderCircle,
} from "lucide-react";

/*
  IMPORTANT:
  PasswordField is outside AdminChangePassword.
  This prevents the input from remounting on every keystroke.
*/
function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  toggle,
  placeholder,
  autoComplete,
}) {
  return (
    <div className="acp-field">
      <label htmlFor={id}>{label}</label>

      <div className="acp-input-wrap">
        <LockKeyhole size={16} />

        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />

        <button
          type="button"
          className="acp-eye"
          onClick={toggle}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

export default function AdminChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice({ type: "", text: "" });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setNotice({
        type: "error",
        text: "Please fill in all three password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotice({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setNotice({
        type: "error",
        text: "Your new password must be different from your current password.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.put("/admin/password", {
        currentPassword,
        newPassword,
      });

      const successMessage =
        response.data?.message || "Admin password changed successfully.";

      setNotice({
        type: "success",
        text: successMessage,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Notify the shared Admin header.
      window.dispatchEvent(
        new CustomEvent("admin:notification", {
          detail: {
            type: "success",
            message: successMessage,
          },
        })
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Unable to change password. Please verify your current password and try again.";

      setNotice({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="acp-page">
      <style>{`
        .acp-page {
          max-width: 1050px;
          margin: 0 auto;
          color: #202945;
          font-family: inherit;
        }

        .acp-page * {
          box-sizing: border-box;
        }

        .acp-heading {
          margin-bottom: 24px;
        }

        .acp-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          color: #a27c37;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .acp-heading h1 {
          margin: 0;
          font-size: clamp(25px, 4vw, 34px);
          letter-spacing: -1px;
        }

        .acp-heading p {
          margin: 8px 0 0;
          color: #858ba0;
          font-size: 12px;
          line-height: 1.7;
        }

        .acp-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(230px, .7fr);
          gap: 18px;
          align-items: start;
        }

        .acp-card {
          padding: 25px;
          border: 1px solid #ffffffdc;
          border-radius: 17px;
          background: #ffffffd1;
          box-shadow: 0 12px 32px #2029450d;
        }

        .acp-card-title {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 22px;
        }

        .acp-card-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border: 1px solid #e8d7b3;
          border-radius: 12px;
          color: #a27c37;
          background: #fbf4e7;
        }

        .acp-card-title h2 {
          margin: 0;
          font-size: 16px;
        }

        .acp-card-title p {
          margin: 5px 0 0;
          color: #858ba0;
          font-size: 10px;
        }

        .acp-form {
          display: grid;
          gap: 16px;
        }

        .acp-field {
          display: grid;
          gap: 7px;
        }

        .acp-field label {
          color: #59637a;
          font-size: 10px;
          font-weight: 800;
        }

        .acp-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 46px;
          padding: 0 12px;
          border: 1px solid #dfe2e9;
          border-radius: 10px;
          color: #9098aa;
          background: white;
          transition: border-color .2s, box-shadow .2s;
        }

        .acp-input-wrap:focus-within {
          border-color: #c19a52;
          box-shadow: 0 0 0 3px #c19a521c;
        }

        .acp-input-wrap input {
          display: block;
          flex: 1;
          width: 100%;
          min-width: 0;
          height: 100%;
          padding: 0;
          border: 0;
          outline: none;
          color: #202945;
          background: transparent;
          font-family: inherit;
          font-size: 12px;
        }

        .acp-input-wrap input::placeholder {
          color: #a6acba;
        }

        .acp-eye {
          width: 30px;
          height: 32px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 0;
          border-radius: 7px;
          color: #788198;
          background: transparent;
          cursor: pointer;
        }

        .acp-eye:hover {
          color: #a27c37;
          background: #fbf4e7;
        }

        .acp-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 45px;
          margin-top: 4px;
          border: 0;
          border-radius: 10px;
          color: white;
          background: linear-gradient(100deg, #202945, #394767);
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 7px 16px #20294520;
          transition: transform .2s, box-shadow .2s;
        }

        .acp-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px #2029452b;
        }

        .acp-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
          transform: none;
        }

        .acp-notice {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 12px 13px;
          border-radius: 10px;
          font-size: 10px;
          line-height: 1.6;
        }

        .acp-notice.success {
          color: #236447;
          border: 1px solid #b8ddc9;
          background: #edf8f1;
        }

        .acp-notice.error {
          color: #9b3434;
          border: 1px solid #edc4c4;
          background: #fff1f1;
        }

        .acp-notice svg {
          flex-shrink: 0;
        }

        .acp-side {
          padding: 22px;
          border: 1px solid #ffffffb8;
          border-radius: 17px;
          color: white;
          background: linear-gradient(145deg, #202945, #354365);
          box-shadow: 0 12px 32px #20294516;
        }

        .acp-side-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid #e6c47f55;
          border-radius: 14px;
          color: #e6c47f;
          background: #ffffff0c;
        }

        .acp-side h3 {
          margin: 19px 0 8px;
          font-size: 16px;
        }

        .acp-side > p {
          margin: 0;
          color: #c4cbda;
          font-size: 10px;
          line-height: 1.8;
        }

        .acp-tips {
          display: grid;
          gap: 13px;
          padding: 0;
          margin: 22px 0 0;
          list-style: none;
        }

        .acp-tips li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #d9deea;
          font-size: 10px;
          line-height: 1.6;
        }

        .acp-tips svg {
          flex-shrink: 0;
          color: #e6c47f;
        }

        .acp-security-note {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          margin-top: 16px;
          padding: 13px;
          border: 1px solid #ffffff20;
          border-radius: 10px;
          color: #d9deea;
          background: #ffffff09;
          font-size: 9px;
          line-height: 1.7;
        }

        .acp-security-note svg {
          flex-shrink: 0;
          color: #e6c47f;
        }

        /* LOADING POPUP */

        .acp-loading-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #111a3080;
          backdrop-filter: blur(5px);
          animation: acp-fade-in .2s ease both;
        }

        .acp-loading-box {
          width: min(340px, 100%);
          padding: 30px 25px;
          border: 1px solid #ffffff;
          border-radius: 18px;
          background: white;
          box-shadow: 0 22px 65px #10182b35;
          text-align: center;
          animation: acp-popup-in .25s ease both;
        }

        .acp-loading-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin: 0 auto 17px;
          border-radius: 17px;
          color: #a27c37;
          background: #fbf4e7;
        }

        .acp-loading-icon svg {
          animation: acp-spin 1s linear infinite;
        }

        .acp-loading-box h3 {
          margin: 0 0 7px;
          color: #202945;
          font-size: 16px;
        }

        .acp-loading-box p {
          margin: 0;
          color: #858ba0;
          font-size: 11px;
          line-height: 1.7;
        }

        @keyframes acp-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes acp-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes acp-popup-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media(max-width: 760px) {
          .acp-layout {
            grid-template-columns: 1fr;
          }

          .acp-side {
            order: 2;
          }
        }

        @media(max-width: 430px) {
          .acp-card,
          .acp-side {
            padding: 18px;
          }
        }

        @media(prefers-reduced-motion: reduce) {
          .acp-loading-overlay,
          .acp-loading-box,
          .acp-loading-icon svg {
            animation: none !important;
          }
        }
      `}</style>

      <header className="acp-heading">
        <p className="acp-eyebrow">
          <KeyRound size={14} />
          ADMINISTRATION / SECURITY
        </p>

        <h1>Change Password</h1>
        <p>Update your administrator account password securely.</p>
      </header>

      <div className="acp-layout">
        <section className="acp-card">
          <div className="acp-card-title">
            <div className="acp-card-icon">
              <KeyRound size={21} />
            </div>

            <div>
              <h2>Update your password</h2>
              <p>
                Enter your current password before choosing a new one.
              </p>
            </div>
          </div>

          <form className="acp-form" onSubmit={handleSubmit}>
            <PasswordField
              id="acp-current"
              label="CURRENT PASSWORD"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrent}
              toggle={() => setShowCurrent((value) => !value)}
              placeholder="Enter current password"
              autoComplete="current-password"
            />

            <PasswordField
              id="acp-new"
              label="NEW PASSWORD"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              toggle={() => setShowNew((value) => !value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />

            <PasswordField
              id="acp-confirm"
              label="CONFIRM NEW PASSWORD"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              toggle={() => setShowConfirm((value) => !value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />

            {notice.text && (
              <div className={`acp-notice ${notice.type}`} role="alert">
                {notice.type === "success" ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <AlertCircle size={17} />
                )}
                <span>{notice.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="acp-submit"
              disabled={loading}
            >
              <ShieldCheck size={16} />
              Update Password
            </button>
          </form>
        </section>

        <aside className="acp-side">
          <div className="acp-side-icon">
            <ShieldCheck size={25} />
          </div>

          <h3>Keep your account secure</h3>

          <p>
            A strong password helps protect your administrator account
            and the information managed through this portal.
          </p>

          <ul className="acp-tips">
            <li>
              <CheckCircle2 size={15} />
              Use a password that is difficult to guess.
            </li>
            <li>
              <CheckCircle2 size={15} />
              Avoid reusing your previous password.
            </li>
            <li>
              <CheckCircle2 size={15} />
              Do not share your password with anyone.
            </li>
          </ul>

          <div className="acp-security-note">
            <LockKeyhole size={15} />
            Your password update is submitted securely to the Admin
            authentication endpoint.
          </div>
        </aside>
      </div>

      {loading && (
        <div
          className="acp-loading-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Updating password"
        >
          <div className="acp-loading-box">
            <div className="acp-loading-icon">
              <LoaderCircle size={29} />
            </div>

            <h3>Updating Password</h3>
            <p>
              Please wait while we securely update your administrator
              password. Do not close this page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
