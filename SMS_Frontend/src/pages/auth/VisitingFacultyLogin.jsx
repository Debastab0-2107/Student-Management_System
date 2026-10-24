
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Users,
  Globe2,
  Compass,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function VisitingFacultyLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice(
      "The Visiting Faculty Portal design is ready. Authentication will be connected when the backend endpoint is implemented."
    );
  }

  return (
    <main className="vfl-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .vfl-page {
          --vfl-navy:#101b35;
          --vfl-gold:#d8b46a;
          min-height:100vh;
          padding:24px;
          display:grid;
          place-items:center;
          overflow:hidden;
          position:relative;
          background:
            radial-gradient(circle at 8% 12%,rgba(216,180,106,.2),transparent 25%),
            radial-gradient(circle at 94% 88%,rgba(79,116,172,.16),transparent 30%),
            #f1f4f9;
          color:#17223b;
          font-family:'DM Sans',sans-serif;
          box-sizing:border-box;
        }
        .vfl-page *, .vfl-page *::before, .vfl-page *::after { box-sizing:border-box; }
        .vfl-shell {
          width:100%;
          max-width:1160px;
          min-height:680px;
          display:grid;
          grid-template-columns:1.02fr .98fr;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.9);
          border-radius:25px;
          background:#fff;
          box-shadow:0 28px 80px rgba(16,27,53,.14);
          animation:vfl-enter .65s ease both;
        }
        @keyframes vfl-enter { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        .vfl-visual {
          position:relative;
          isolation:isolate;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          min-width:0;
          overflow:hidden;
          padding:38px 42px 30px;
          color:white;
          background:#0a142a;
        }
        .vfl-visual::before {
          content:"";
          position:absolute;
          z-index:-2;
          inset:0;
          background:
            linear-gradient(150deg,rgba(8,18,39,.68),rgba(9,19,40,.92)),
            url("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85") center/cover;
        }
        .vfl-visual::after {
          content:"";
          position:absolute;
          z-index:-1;
          inset:0;
          background:
            radial-gradient(circle at 88% 16%,rgba(91,133,194,.26),transparent 30%),
            linear-gradient(125deg,transparent 45%,rgba(216,180,106,.07) 45.2%,transparent 45.7%);
        }
        .vfl-brand { display:flex;align-items:center;gap:12px;font:800 10px/1.6 'Manrope',sans-serif;letter-spacing:1.4px; }
        .vfl-brand-icon { width:46px;height:46px;display:grid;place-items:center;flex-shrink:0;border:1px solid rgba(216,180,106,.4);border-radius:13px;background:rgba(255,255,255,.08);color:#f0dba8; }
        .vfl-copy { max-width:430px;margin:auto 0;padding:60px 0 35px; }
        .vfl-eyebrow { display:flex;align-items:center;gap:9px;margin:0 0 18px;color:#f0dba8;font-size:10px;font-weight:800;letter-spacing:2px; }
        .vfl-copy h1 { margin:0;color:white;font:800 clamp(35px,4.3vw,53px)/1.12 'Manrope',sans-serif;letter-spacing:-2px; }
        .vfl-copy h1 span { color:#f0dba8; }
        .vfl-description { max-width:355px;margin:20px 0 0;color:rgba(255,255,255,.72);font-size:13px;line-height:1.9; }
        .vfl-feature { display:flex;align-items:flex-start;gap:13px;margin-top:32px;padding:16px;border:1px solid rgba(255,255,255,.17);border-radius:13px;background:rgba(255,255,255,.065);backdrop-filter:blur(8px); }
        .vfl-feature-icon { width:38px;height:38px;display:grid;place-items:center;flex-shrink:0;border:1px solid rgba(216,180,106,.3);border-radius:10px;background:rgba(216,180,106,.1);color:#f0dba8; }
        .vfl-feature strong { display:block;color:#fff;font:700 12px 'Manrope',sans-serif; }
        .vfl-feature span { display:block;margin-top:6px;color:rgba(255,255,255,.6);font-size:11px;line-height:1.7; }
        .vfl-foot { display:flex;justify-content:space-between;gap:12px;color:rgba(255,255,255,.5);font-size:10px; }
        .vfl-foot span { display:flex;align-items:center;gap:7px; }
        .vfl-foot svg { color:#f0dba8; }
        .vfl-orbit { position:absolute;z-index:-1;border:1px solid rgba(216,180,106,.2);border-radius:50%;pointer-events:none; }
        .vfl-orbit-one { width:330px;height:330px;top:-165px;right:-185px;box-shadow:0 0 0 25px rgba(216,180,106,.035),0 0 0 55px rgba(216,180,106,.025); }
        .vfl-orbit-two { width:270px;height:270px;bottom:-150px;left:-170px;box-shadow:0 0 0 24px rgba(100,140,200,.04),0 0 0 50px rgba(100,140,200,.025); }
        .vfl-form-panel { min-width:0;display:flex;flex-direction:column;padding:36px clamp(27px,4.4vw,55px) 25px;background:linear-gradient(145deg,#fff,#fbfcff); }
        .vfl-back { display:flex;align-items:center;gap:8px;width:fit-content;color:#707b90;font-size:12px;font-weight:600;text-decoration:none;transition:color .2s,transform .2s; }
        .vfl-back:hover { color:#101b35;transform:translateX(-3px); }
        .vfl-mobile-brand { display:none;align-items:center;gap:10px;margin-bottom:32px;color:#101b35;font:800 12px 'Manrope',sans-serif; }
        .vfl-mobile-icon { width:43px;height:43px;display:grid;place-items:center;border-radius:13px;background:#eef1f8;color:#334f7f; }
        .vfl-content { width:100%;max-width:375px;margin:auto;padding:42px 0; }
        .vfl-kicker { margin:0 0 14px;color:#9b7939;font-size:10px;font-weight:800;letter-spacing:2.2px; }
        .vfl-content h2 { margin:0;color:#101b35;font:800 clamp(31px,3.2vw,39px)/1.2 'Manrope',sans-serif;letter-spacing:-1.5px; }
        .vfl-content h2 span { color:#b28a43; }
        .vfl-subtitle { margin:13px 0 28px;color:#7a8498;font-size:13px;line-height:1.85; }
        .vfl-form { display:flex;flex-direction:column;gap:10px; }
        .vfl-form label { margin:6px 0 0;color:#303b52;font-size:12px;font-weight:700; }
        .vfl-input { min-height:53px;display:flex;align-items:center;gap:11px;padding:0 14px;border:1px solid #e1e6ee;border-radius:11px;background:#fbfcfe;color:#929bb0;transition:border-color .2s,box-shadow .2s,background .2s; }
        .vfl-input:focus-within { border-color:#b6c4dc;box-shadow:0 0 0 4px rgba(85,117,166,.12);background:white; }
        .vfl-input input { width:100%;min-width:0;height:51px;padding:0;border:0;outline:0;background:transparent;color:#17223b;font:13px 'DM Sans',sans-serif; }
        .vfl-input input::placeholder { color:#a5adbc; }
        .vfl-eye { width:30px;height:30px;display:grid;place-items:center;flex-shrink:0;border:0;border-radius:7px;background:transparent;color:#8993a7;cursor:pointer; }
        .vfl-eye:hover { background:#edf1f7;color:#101b35; }
        .vfl-submit { min-height:53px;display:flex;align-items:center;justify-content:center;gap:12px;margin-top:14px;padding:13px 18px;border:1px solid #101b35;border-radius:11px;background:#101b35;color:white;font:700 13px 'DM Sans',sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s,background .2s; }
        .vfl-submit:hover { transform:translateY(-2px);background:#1a2a4b;box-shadow:0 10px 22px rgba(16,27,53,.17); }
        .vfl-notice { margin-top:14px;padding:12px 13px;border:1px solid #d8e1f0;border-radius:10px;background:#f2f6fc;color:#3d557c;font-size:11px;line-height:1.7; }
        .vfl-security { display:flex;align-items:flex-start;gap:10px;margin-top:22px;padding:13px;border:1px solid #e8ebf0;border-radius:11px;background:#f8fafc;color:#6f7a8d;font-size:11px;line-height:1.7; }
        .vfl-security svg { flex-shrink:0;color:#617ba5; }
        .vfl-help { margin:20px 0 0;text-align:center;color:#8a93a3;font-size:11px;line-height:1.8; }
        .vfl-help a { color:#8c6b32;font-weight:700;text-decoration:none; }
        .vfl-help a:hover { text-decoration:underline; }
        .vfl-copyright { margin:0;padding-top:18px;text-align:center;color:#a0a7b5;font-size:10px; }
        @media(max-width:850px) { .vfl-page{padding:16px}.vfl-shell{min-height:650px;grid-template-columns:.95fr 1.05fr}.vfl-visual{padding:30px 25px}.vfl-form-panel{padding:30px 27px 22px}.vfl-copy h1{font-size:39px} }
        @media(max-width:680px) { .vfl-page{padding:0;background:#fff}.vfl-shell{min-height:100vh;grid-template-columns:1fr;border:0;border-radius:0;box-shadow:none}.vfl-visual{display:none}.vfl-form-panel{min-height:100vh;padding:25px clamp(22px,7vw,42px) 22px}.vfl-mobile-brand{display:flex}.vfl-content{max-width:440px;padding:35px 0}.vfl-copyright{margin-top:auto} }
        @media(prefers-reduced-motion:reduce){.vfl-page *{animation:none!important;transition:none!important}}
      `}</style>

      <section className="vfl-shell">
        <aside className="vfl-visual">
          <div className="vfl-orbit vfl-orbit-one" />
          <div className="vfl-orbit vfl-orbit-two" />

          <div className="vfl-brand">
            <span className="vfl-brand-icon"><Users size={23} /></span>
            <span>DPP INSTITUTE OF TECHNOLOGY</span>
          </div>

          <div className="vfl-copy">
            <p className="vfl-eyebrow"><Sparkles size={15} /> A PLACE FOR NEW PERSPECTIVES</p>
            <h1>Bring your<br /><span>expertise.</span></h1>
            <p className="vfl-description">
              Great ideas travel. Join our academic community, share your
              experience, and make a difference in the next generation of learners.
            </p>

            <div className="vfl-feature">
              <div className="vfl-feature-icon"><Globe2 size={20} /></div>
              <div>
                <strong>One connected academic community</strong>
                <span>A dedicated space for visiting educators and guest faculty.</span>
              </div>
            </div>
          </div>

          <div className="vfl-foot">
            <span><Compass size={14} /> Guest faculty access</span>
            <span>WELCOME TO DPP</span>
          </div>
        </aside>

        <div className="vfl-form-panel">
          <Link className="vfl-back" to="/"><ArrowLeft size={16} /> Back to home</Link>

          <div className="vfl-mobile-brand">
            <span className="vfl-mobile-icon"><Users size={22} /></span>
            DPP INSTITUTE OF TECHNOLOGY
          </div>

          <div className="vfl-content">
            <p className="vfl-kicker">VISITING FACULTY PORTAL</p>
            <h2>Good to have<br /><span>you here.</span></h2>
            <p className="vfl-subtitle">
              Use your registered faculty credentials to continue to the
              visiting faculty workspace.
            </p>

            <form className="vfl-form" onSubmit={handleSubmit}>
              <label htmlFor="visitingFacultyId">Registered email or faculty ID</label>
              <div className="vfl-input">
                <Mail size={18} />
                <input
                  id="visitingFacultyId"
                  type="text"
                  value={identifier}
                  onChange={(event) => { setIdentifier(event.target.value); setNotice(""); }}
                  placeholder="Enter your registered email or ID"
                  autoComplete="username"
                  required
                />
              </div>

              <label htmlFor="visitingFacultyPassword">Password</label>
              <div className="vfl-input">
                <LockKeyhole size={18} />
                <input
                  id="visitingFacultyPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setNotice(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button className="vfl-eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="vfl-submit" type="submit">
                Continue to visiting faculty <ArrowRight size={17} />
              </button>
            </form>

            {notice && <div className="vfl-notice" role="status">{notice}</div>}

            <div className="vfl-security">
              <ShieldCheck size={18} />
              <span><strong>Visiting faculty access</strong><br />This is a frontend-only form until authentication is connected.</span>
            </div>

            <p className="vfl-help">
              Need another portal?{" "}
              <Link to="/login/admin">Admin</Link> ·{" "}
              <Link to="/login/permanent-faculty">Permanent faculty</Link>
            </p>
          </div>

          <p className="vfl-copyright">© {new Date().getFullYear()} DPP Institute of Technology</p>
        </div>
      </section>
    </main>
  );
}
