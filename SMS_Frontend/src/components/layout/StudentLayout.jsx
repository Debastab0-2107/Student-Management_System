
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Outlet, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  LockKeyhole,
  LogOut,
  X,
} from "lucide-react";

import Sidebar from "./Sidebar";

const StudentLayoutContext = createContext(null);

export function useStudentLayout() {
  const context = useContext(StudentLayoutContext);

  if (!context) {
    throw new Error(
      "useStudentLayout must be used inside StudentLayout."
    );
  }

  return context;
}

export default function StudentLayout() {
  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [logoutPrompt, setLogoutPrompt] = useState(false);

  // Open the sidebar.
  const openSidebar = useCallback(() => {
    setMobileNavOpen(true);
  }, []);

  // Close the sidebar.
  const closeSidebar = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  // Toggle the sidebar on every screen size.
  const toggleSidebar = useCallback(() => {
    setMobileNavOpen((previous) => !previous);
  }, []);

  // Show a notification.
  const notify = useCallback((message) => {
    setNotice(message);
  }, []);

  // Prevent background scrolling while the sidebar is open.
  useEffect(() => {
    if (!mobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  // Finish logout after confirmation.
  function finishLogout() {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_role");
    localStorage.removeItem("sms_student_id");

    setLogoutPrompt(false);
    setMobileNavOpen(false);

    navigate("/login/student", { replace: true });
  }

  const value = {
    openSidebar,
    closeSidebar,
    toggleSidebar,
    notify,
  };

  return (
    <StudentLayoutContext.Provider value={value}>
      <div className="student-layout-shell">
        {/* SIDEBAR */}
        <Sidebar
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          onSignOut={() => setLogoutPrompt(true)}
          onNotice={setNotice}
        />

        {/* PAGE CONTENT */}
        <div className="student-layout-content">
          <Outlet />
        </div>

        {/* NOTIFICATION TOAST */}
        {notice && (
          <div className="student-layout-toast" role="status">
            <CheckCircle2 size={17} />

            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* LOGOUT CONFIRMATION */}
        {logoutPrompt && (
          <div
            className="student-layout-modal-backdrop"
            onClick={() => setLogoutPrompt(false)}
            role="presentation"
          >
            <section
              className="student-layout-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="student-layout-logout-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="student-layout-modal-icon">
                <LockKeyhole size={24} />
              </div>

              <span className="student-layout-modal-kicker">
                SECURE SESSION
              </span>

              <h2 id="student-layout-logout-title">
                Are you sure you want to sign out?
              </h2>

              <p>
                Please make sure your work is complete before leaving
                the student portal.
              </p>

              <div className="student-layout-modal-actions">
                <button
                  type="button"
                  className="student-layout-cancel"
                  onClick={() => setLogoutPrompt(false)}
                >
                  Stay on portal
                </button>

                <button
                  type="button"
                  className="student-layout-confirm"
                  onClick={finishLogout}
                >
                  Yes, sign out
                  <LogOut size={15} />
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      <style>{`
        /* =====================================
           LAYOUT
        ===================================== */

        .student-layout-shell {
          position: relative;
          display: flex;
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          color: #252c43;
          background: #f7f8fb;
        }

        .student-layout-content {
          flex: 1;
          min-width: 0;
          width: 100%;
        }

        /* =====================================
           TOAST
        ===================================== */

        .student-layout-toast {
          position: fixed;
          top: 22px;
          right: 22px;
          z-index: 400;

          display: flex;
          align-items: center;
          gap: 10px;

          max-width: min(430px, calc(100vw - 32px));
          padding: 14px 17px;

          color: #27314e;
          background: #fff;

          border: 1px solid #dceee3;
          border-left: 4px solid #48a878;
          border-radius: 12px;

          box-shadow: 0 14px 38px rgba(25, 32, 55, .15);

          font-size: 12px;

          animation: student-toast-in .3s ease-out;
        }

        .student-layout-toast > svg {
          flex-shrink: 0;
          color: #4b9b7c;
        }

        .student-layout-toast span {
          line-height: 1.6;
        }

        .student-layout-toast button {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-left: auto;
          padding: 3px;
          border: 0;
          background: transparent;
          color: #6e7588;
          cursor: pointer;
        }

        .student-layout-toast button:hover {
          color: #202945;
        }

        @keyframes student-toast-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =====================================
           LOGOUT MODAL
        ===================================== */

        .student-layout-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 500;

          display: grid;
          place-items: center;

          padding: 20px;

          background: rgba(17, 24, 43, .52);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }

        .student-layout-modal {
          width: min(440px, 100%);
          padding: 30px;

          background: #fff;
          border: 1px solid #e9ebf1;
          border-radius: 20px;

          box-shadow: 0 24px 80px rgba(13, 20, 40, .25);

          animation: student-layout-modal-in .22s ease-out;
        }

        .student-layout-modal-icon {
          display: grid;
          place-items: center;

          width: 48px;
          height: 48px;
          margin-bottom: 17px;

          color: #9b7430;
          background: #fbf4e7;
          border-radius: 14px;
        }

        .student-layout-modal-kicker {
          color: #9b7430;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .student-layout-modal h2 {
          margin: 9px 0 10px;
          color: #252c43;
          font-size: 22px;
          line-height: 1.35;
        }

        .student-layout-modal p {
          margin: 0;
          color: #7f879b;
          font-size: 12px;
          line-height: 1.8;
        }

        .student-layout-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
        }

        .student-layout-modal-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          padding: 11px 14px;

          border-radius: 9px;
          font-size: 11px;
          font-weight: 700;

          cursor: pointer;
          transition:
            transform .2s ease,
            background .2s ease;
        }

        .student-layout-modal-actions button:hover {
          transform: translateY(-1px);
        }

        .student-layout-cancel {
          color: #4b5269;
          background: #f5f6f9;
          border: 1px solid #e7e9f0;
        }

        .student-layout-cancel:hover {
          background: #eceef4;
        }

        .student-layout-confirm {
          color: #fff;
          background: #202945;
          border: 1px solid #202945;
        }

        .student-layout-confirm:hover {
          background: #303b5d;
        }

        @keyframes student-layout-modal-in {
          from {
            opacity: 0;
            transform: translateY(8px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* =====================================
           MOBILE
        ===================================== */

        @media (max-width: 480px) {
          .student-layout-toast {
            top: 12px;
            right: 12px;
            max-width: calc(100vw - 24px);
          }

          .student-layout-modal {
            padding: 23px;
          }

          .student-layout-modal-actions {
            flex-direction: column-reverse;
          }

          .student-layout-modal-actions button {
            width: 100%;
          }
        }

        /* =====================================
           REDUCED MOTION
        ===================================== */

        @media (prefers-reduced-motion: reduce) {
          .student-layout-toast,
          .student-layout-modal {
            animation: none !important;
          }

          .student-layout-modal-actions button {
            transition: none !important;
          }
        }
      `}</style>
    </StudentLayoutContext.Provider>
  );
}
