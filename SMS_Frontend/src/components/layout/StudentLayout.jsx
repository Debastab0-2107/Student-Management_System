import { createContext, useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CheckCircle2, LockKeyhole, LogOut, X } from "lucide-react";
import Sidebar from "./Sidebar";

const StudentLayoutContext = createContext(null);

export function useStudentLayout() {
  const context = useContext(StudentLayoutContext);
  if (!context) {
    throw new Error("useStudentLayout must be used inside StudentLayout.");
  }
  return context;
}

export default function StudentLayout() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [logoutPrompt, setLogoutPrompt] = useState(false);

  function finishLogout() {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_role");
    localStorage.removeItem("sms_student_id");
    navigate("/login/student", { replace: true });
  }

  const value = {
    openSidebar: () => setMobileNavOpen(true),
    closeSidebar: () => setMobileNavOpen(false),
    notify: setNotice,
  };

  return (
    <StudentLayoutContext.Provider value={value}>
      <div className="student-layout-shell">
        <Sidebar
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          onSignOut={() => setLogoutPrompt(true)}
          onNotice={setNotice}
        />
        <div className="student-layout-content">
          <Outlet />
        </div>
        {notice && (
          <div className="student-layout-toast" role="status">
            <CheckCircle2 size={17} />
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">
              <X size={15} />
            </button>
          </div>
        )}
        {logoutPrompt && (
          <div className="student-layout-modal-backdrop" role="presentation">
            <section className="student-layout-modal" role="dialog" aria-modal="true" aria-labelledby="student-layout-logout-title">
              <div className="student-layout-modal-icon"><LockKeyhole size={24} /></div>
              <span className="student-layout-modal-kicker">SECURE SESSION</span>
              <h2 id="student-layout-logout-title">Are you sure you want to sign out?</h2>
              <p>Please make sure your work is complete before leaving the student portal.</p>
              <div className="student-layout-modal-actions">
                <button type="button" className="student-layout-cancel" onClick={() => setLogoutPrompt(false)}>Stay on portal</button>
                <button type="button" className="student-layout-confirm" onClick={finishLogout}>Yes, sign out <LogOut size={15} /></button>
              </div>
            </section>
          </div>
        )}
      </div>
      <style>{`
        .student-layout-shell { display:flex; min-height:100vh; color:#252c43; background:#f7f8fb; }
        .student-layout-content { flex:1; min-width:0; }
        .student-layout-toast { position:fixed; right:22px; bottom:22px; z-index:200; display:flex; align-items:center; gap:10px; max-width:min(430px,calc(100vw - 32px)); padding:13px 15px; color:#27314e; background:#fff; border:1px solid #e6e9f0; border-radius:12px; box-shadow:0 14px 38px rgba(25,32,55,.15); font-size:12px; }
        .student-layout-toast > svg { flex-shrink:0; color:#4b9b7c; }
        .student-layout-toast button { display:grid; place-items:center; margin-left:auto; padding:3px; border:0; background:transparent; color:#6e7588; }
        .student-layout-modal-backdrop { position:fixed; inset:0; z-index:220; display:grid; place-items:center; padding:20px; background:rgba(17,24,43,.52); backdrop-filter:blur(5px); }
        .student-layout-modal { width:min(440px,100%); padding:30px; background:#fff; border:1px solid #e9ebf1; border-radius:20px; box-shadow:0 24px 80px rgba(13,20,40,.25); animation:student-layout-modal-in .22s ease-out; }
        .student-layout-modal-icon { display:grid; place-items:center; width:48px; height:48px; margin-bottom:17px; color:#9b7430; background:#fbf4e7; border-radius:14px; }
        .student-layout-modal-kicker { color:#9b7430; font-size:9px; font-weight:800; letter-spacing:1.5px; }
        .student-layout-modal h2 { margin:9px 0 10px; color:#252c43; font-size:22px; line-height:1.35; }
        .student-layout-modal p { margin:0; color:#7f879b; font-size:12px; line-height:1.8; }
        .student-layout-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:24px; }
        .student-layout-modal-actions button { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:11px 14px; border-radius:9px; font-size:11px; font-weight:700; cursor:pointer; }
        .student-layout-cancel { color:#4b5269; background:#f5f6f9; border:1px solid #e7e9f0; }
        .student-layout-confirm { color:#fff; background:#202945; border:1px solid #202945; }
        @keyframes student-layout-modal-in { from { opacity:0; transform:translateY(8px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        @media(max-width:850px) { .student-layout-modal-actions { flex-direction:column-reverse; } }
        @media(prefers-reduced-motion:reduce) { .student-layout-modal { animation:none; } }
      `}</style>
    </StudentLayoutContext.Provider>
  );
}
