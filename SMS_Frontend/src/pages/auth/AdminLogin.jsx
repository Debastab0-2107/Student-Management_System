
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  LockKeyhole,
  Mail,
  Building2,
  Fingerprint,
} from "lucide-react";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice(
      "The Admin Portal design is ready. Authentication will be connected when the backend endpoint is implemented."
    );
  }

  return (
    <main className="al-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .al-page {
          min-height: 100vh;
          padding: 24px;
          display: grid;
          place-items: center;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(circle at 5% 10%, rgba(216,180,106,.2), transparent 25%),
            radial-gradient(circle at 95% 90%, rgba(43,67,112,.13), transparent 28%),
            #f3f5f9;
          color: #17223b;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }
        .al-page *, .al-page *::before, .al-page *::after { box-sizing: border-box; }
        .al-shell {
          width: 100%;
          max-width: 1160px;
          min-height: 680px;
          display: grid;
          grid-template-columns: 1.02fr .98fr;
          overflow: hidden;
          border-radius: 25px;
          background: white;
          border: 1px solid rgba(255,255,255,.9);
          box-shadow: 0 28px 80px rgba(16,27,53,.14);
          animation: al-enter .65s ease both;
        }
        @keyframes al-enter { from {opacity:0; transform:translateY(14px)} to {opacity:1;transform:translateY(0)} }
        .al-visual {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 38px 42px 30px;
          color: white;
          background: #0a1226;
        }
        .al-visual::before {
          content: "";
          position: absolute;
          z-index: -2;
          inset: 0;
          background:
            linear-gradient(145deg, rgba(9,17,35,.84), rgba(10,18,38,.94)),
            url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85") center/cover;
        }
        .al-visual::after {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(216,180,106,.2), transparent 30%);
        }
        .al-brand { display:flex; align-items:center; gap:12px; font:800 10px/1.6 'Manrope',sans-serif; letter-spacing:1.4px; }
        .al-brand-icon { width:46px;height:46px;display:grid;place-items:center;flex-shrink:0;border:1px solid rgba(216,180,106,.4);border-radius:13px;background:rgba(216,180,106,.12);color:#f0dba8; }
        .al-copy { margin:auto 0; padding:65px 0; max-width:430px; }
        .al-eyebrow { display:flex;align-items:center;gap:9px;margin:0 0 18px;color:#e5c77f;font-size:10px;font-weight:800;letter-spacing:2.1px; }
        .al-copy h1 { margin:0;color:white;font:800 clamp(36px,4.5vw,55px)/1.12 'Manrope',sans-serif;letter-spacing:-2px; }
        .al-copy h1 span { color:#e2c477; }
        .al-description { max-width:355px;margin:20px 0 0;color:rgba(255,255,255,.68);font-size:13px;line-height:1.9; }
        .al-stats { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:36px; }
        .al-stat { padding:16px;border:1px solid rgba(255,255,255,.13);border-radius:13px;background:rgba(255,255,255,.055); }
        .al-stat svg { color:#e2c477; }
        .al-stat strong { display:block;margin-top:12px;font:700 12px 'Manrope',sans-serif; }
        .al-stat span { display:block;margin-top:5px;color:rgba(255,255,255,.56);font-size:10px;line-height:1.6; }
        .al-foot { display:flex;justify-content:space-between;gap:12px;color:rgba(255,255,255,.48);font-size:10px; }
        .al-foot span { display:flex;align-items:center;gap:7px; }
        .al-foot svg { color:#e2c477; }
        .al-ring { position:absolute;z-index:-1;border:1px solid rgba(216,180,106,.18);border-radius:50%;pointer-events:none; }
        .al-ring-one { width:330px;height:330px;right:-170px;top:-135px;box-shadow:0 0 0 28px rgba(216,180,106,.035),0 0 0 60px rgba(216,180,106,.025); }
        .al-ring-two { width:250px;height:250px;left:-170px;bottom:-110px;box-shadow:0 0 0 25px rgba(216,180,106,.035); }
        .al-form-panel { padding:36px clamp(27px,4.4vw,55px) 25px;display:flex;flex-direction:column;min-width:0; }
        .al-back { display:flex;align-items:center;gap:8px;width:fit-content;color:#707b90;font-size:12px;font-weight:600;text-decoration:none;transition:color .2s,transform .2s; }
        .al-back:hover { color:#101b35;transform:translateX(-3px); }
        .al-form-content { width:100%;max-width:375px;margin:auto;padding:42px 0; }
        .al-mobile-brand { display:none;align-items:center;gap:10px;margin-bottom:36px;color:#101b35;font:800 12px 'Manrope',sans-serif; }
        .al-kicker { margin:0 0 14px;color:#a27c37;font-size:10px;font-weight:800;letter-spacing:2.2px; }
        .al-form-content h2 { margin:0;color:#101b35;font:800 clamp(31px,3.2vw,39px)/1.2 'Manrope',sans-serif;letter-spacing:-1.5px; }
        .al-form-content h2 span { color:#b28a43; }
        .al-subtitle { margin:13px 0 28px;color:#7a8498;font-size:13px;line-height:1.85; }
        .al-form { display:flex;flex-direction:column;gap:10px; }
        .al-form label { margin:6px 0 0;color:#303b52;font-size:12px;font-weight:700; }
        .al-input { min-height:53px;display:flex;align-items:center;gap:11px;padding:0 14px;border:1px solid #e1e6ee;border-radius:11px;background:#fbfcfe;color:#929bb0;transition:border-color .2s,box-shadow .2s; }
        .al-input:focus-within { border-color:#c3a15e;box-shadow:0 0 0 4px rgba(216,180,106,.14);background:#fff; }
        .al-input input { width:100%;min-width:0;height:51px;padding:0;border:0;outline:0;background:transparent;color:#17223b;font:13px 'DM Sans',sans-serif; }
        .al-input input::placeholder { color:#a5adbc; }
        .al-eye { width:30px;height:30px;display:grid;place-items:center;flex-shrink:0;border:0;border-radius:7px;background:transparent;color:#8993a7;cursor:pointer; }
        .al-eye:hover { background:#edf0f5;color:#101b35; }
        .al-submit { min-height:53px;margin-top:14px;padding:13px 18px;display:flex;align-items:center;justify-content:center;gap:12px;border:1px solid #101b35;border-radius:11px;background:#101b35;color:white;font:700 13px 'DM Sans',sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s,background .2s; }
        .al-submit:hover { transform:translateY(-2px);background:#1a2a4b;box-shadow:0 10px 22px rgba(16,27,53,.17); }
        .al-notice { margin-top:14px;padding:12px 13px;border:1px solid #ead9ae;border-radius:10px;background:#fff9eb;color:#765a26;font-size:11px;line-height:1.7; }
        .al-security { display:flex;align-items:flex-start;gap:10px;margin-top:22px;padding:13px;border:1px solid #e8ebf0;border-radius:11px;background:#f8fafc;color:#6f7a8d;font-size:11px;line-height:1.7; }
        .al-security svg { flex-shrink:0;color:#a27c37; }
        .al-help { margin:20px 0 0;text-align:center;color:#8a93a3;font-size:11px;line-height:1.8; }
        .al-help a { color:#8c6b32;font-weight:700;text-decoration:none; }
        .al-help a:hover { text-decoration:underline; }
        .al-copyright { margin:0;padding-top:18px;text-align:center;color:#a0a7b5;font-size:10px; }
        @media(max-width:850px) { .al-page{padding:16px}.al-shell{grid-template-columns:.95fr 1.05fr;min-height:650px}.al-visual{padding:30px 25px}.al-form-panel{padding:30px 27px 22px}.al-copy h1{font-size:40px}.al-stats{gap:8px}.al-stat{padding:12px} }
        @media(max-width:680px) { .al-page{padding:0;background:#fff}.al-shell{min-height:100vh;grid-template-columns:1fr;border:0;border-radius:0;box-shadow:none}.al-visual{display:none}.al-form-panel{min-height:100vh;padding:25px clamp(22px,7vw,42px) 22px}.al-mobile-brand{display:flex}.al-form-content{max-width:440px;padding:35px 0}.al-copyright{margin-top:auto} }
        @media(prefers-reduced-motion:reduce){.al-page *{animation:none!important;transition:none!important}}
      `}</style>

      <section className="al-shell">
        <aside className="al-visual">
          <div className="al-ring al-ring-one" />
          <div className="al-ring al-ring-two" />

          <div className="al-brand">
            <span className="al-brand-icon"><Building2 size={23} /></span>
            <span>DPP INSTITUTE OF TECHNOLOGY</span>
          </div>

          <div className="al-copy">
            <p className="al-eyebrow"><ShieldCheck size={15} /> ADMINISTRATION ACCESS</p>
            <h1>Lead with <span>clarity.</span></h1>
            <p className="al-description">
              Your administration workspace starts here. A dedicated access
              point for managing institutional operations and supporting the
              campus community.
            </p>

            <div className="al-stats">
              <div className="al-stat">
                <Fingerprint size={20} />
                <strong>Protected access</strong>
                <span>Designed for authorized administrators</span>
              </div>
              <div className="al-stat">
                <Building2 size={20} />
                <strong>One institution</strong>
                <span>Connected campus operations</span>
              </div>
            </div>
          </div>

          <div className="al-foot">
            <span><ShieldCheck size={14} /> Administrative portal</span>
            <span>EST. DPP INSTITUTE</span>
          </div>
        </aside>

        <div className="al-form-panel">
          <Link className="al-back" to="/"><ArrowLeft size={16} /> Back to home</Link>

          <div className="al-mobile-brand">
            <span className="al-brand-icon"><Building2 size={22} /></span>
            DPP INSTITUTE OF TECHNOLOGY
          </div>

          <div className="al-form-content">
            <p className="al-kicker">ADMINISTRATOR PORTAL</p>
            <h2>Welcome <span>back.</span></h2>
            <p className="al-subtitle">
              Sign in to continue to the administration workspace.
            </p>

            <form className="al-form" onSubmit={handleSubmit}>
              <label htmlFor="adminIdentifier">Administrator ID or email</label>
              <div className="al-input">
                <Mail size={18} />
                <input
                  id="adminIdentifier"
                  type="text"
                  value={identifier}
                  onChange={(event) => { setIdentifier(event.target.value); setNotice(""); }}
                  placeholder="Enter your ID or email"
                  autoComplete="username"
                  required
                />
              </div>

              <label htmlFor="adminPassword">Password</label>
              <div className="al-input">
                <LockKeyhole size={18} />
                <input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setNotice(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button className="al-eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="al-submit" type="submit">
                Continue to admin portal <ArrowRight size={17} />
              </button>
            </form>

            {notice && <div className="al-notice" role="status">{notice}</div>}

            <div className="al-security">
              <ShieldCheck size={18} />
              <span><strong>Administrator access</strong><br />Backend authentication has not been connected yet.</span>
            </div>

            <p className="al-help">
              Looking for another portal?{" "}
              <Link to="/login/permanent-faculty">Faculty</Link> ·{" "}
              <Link to="/login/visiting-faculty">Visiting faculty</Link>
            </p>
          </div>

          <p className="al-copyright">© {new Date().getFullYear()} DPP Institute of Technology</p>
        </div>
      </section>
    </main>
  );
}
