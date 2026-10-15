
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  BookOpen,
  LockKeyhole,
  Mail,
  GraduationCap,
  CalendarDays,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export default function PermanentFacultyLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice(
      "The Permanent Faculty Portal design is ready. Authentication will be connected when the backend endpoint is implemented."
    );
  }

  return (
    <main className="pfl-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .pfl-page {
          --pfl-navy:#101b35;
          --pfl-gold:#c5a05a;
          min-height:100vh;
          padding:24px;
          display:grid;
          place-items:center;
          overflow:hidden;
          position:relative;
          background:
            radial-gradient(circle at 5% 10%,rgba(216,180,106,.19),transparent 26%),
            radial-gradient(circle at 92% 90%,rgba(48,71,113,.1),transparent 28%),
            #f7f5ef;
          color:#17223b;
          font-family:'DM Sans',sans-serif;
          box-sizing:border-box;
        }
        .pfl-page *, .pfl-page *::before, .pfl-page *::after { box-sizing:border-box; }
        .pfl-shell {
          width:100%;
          max-width:1160px;
          min-height:680px;
          display:grid;
          grid-template-columns:1fr 1fr;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.9);
          border-radius:25px;
          background:#fff;
          box-shadow:0 28px 80px rgba(16,27,53,.12);
          animation:pfl-enter .65s ease both;
        }
        @keyframes pfl-enter { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        .pfl-form-panel { display:flex;flex-direction:column;min-width:0;padding:36px clamp(27px,4.2vw,52px) 25px;background:linear-gradient(145deg,#fff 0%,#fff 68%,#fcfaf4 100%); }
        .pfl-back { display:flex;align-items:center;gap:8px;width:fit-content;color:#707b90;font-size:12px;font-weight:600;text-decoration:none;transition:color .2s,transform .2s; }
        .pfl-back:hover { color:#101b35;transform:translateX(-3px); }
        .pfl-mobile-brand { display:none;align-items:center;gap:10px;margin-bottom:30px;color:#101b35;font:800 12px 'Manrope',sans-serif; }
        .pfl-brand-icon { width:44px;height:44px;display:grid;place-items:center;flex-shrink:0;border-radius:13px;background:#f3ead6;color:#8d6c2f; }
        .pfl-content { width:100%;max-width:385px;margin:auto;padding:42px 0; }
        .pfl-kicker { display:flex;align-items:center;gap:9px;margin:0 0 15px;color:#a27c37;font-size:10px;font-weight:800;letter-spacing:2.1px; }
        .pfl-kicker::before { content:"";width:23px;height:2px;border-radius:3px;background:#c5a05a; }
        .pfl-content h1 { margin:0;color:#101b35;font:800 clamp(31px,3.2vw,40px)/1.18 'Manrope',sans-serif;letter-spacing:-1.6px; }
        .pfl-content h1 span { color:#b18b45; }
        .pfl-subtitle { margin:14px 0 29px;color:#7a8498;font-size:13px;line-height:1.9; }
        .pfl-form { display:flex;flex-direction:column;gap:10px; }
        .pfl-form label { margin:6px 0 0;color:#303b52;font-size:12px;font-weight:700; }
        .pfl-input { min-height:53px;display:flex;align-items:center;gap:11px;padding:0 14px;border:1px solid #e3e6ec;border-radius:11px;background:#fcfcfd;color:#929bb0;transition:border-color .2s,box-shadow .2s,background .2s; }
        .pfl-input:focus-within { border-color:#c5a05a;box-shadow:0 0 0 4px rgba(197,160,90,.14);background:white; }
        .pfl-input input { width:100%;min-width:0;height:51px;padding:0;border:0;outline:0;background:transparent;color:#17223b;font:13px 'DM Sans',sans-serif; }
        .pfl-input input::placeholder { color:#a5adbc; }
        .pfl-eye { width:30px;height:30px;display:grid;place-items:center;flex-shrink:0;border:0;border-radius:7px;background:transparent;color:#8993a7;cursor:pointer; }
        .pfl-eye:hover { background:#f1eee6;color:#101b35; }
        .pfl-submit { min-height:53px;display:flex;align-items:center;justify-content:center;gap:12px;margin-top:14px;padding:13px 18px;border:1px solid #101b35;border-radius:11px;background:#101b35;color:white;font:700 13px 'DM Sans',sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s,background .2s; }
        .pfl-submit:hover { transform:translateY(-2px);background:#1a2a4b;box-shadow:0 10px 22px rgba(16,27,53,.17); }
        .pfl-notice { margin-top:14px;padding:12px 13px;border:1px solid #ead9ae;border-radius:10px;background:#fff9eb;color:#765a26;font-size:11px;line-height:1.7; }
        .pfl-security { display:flex;align-items:flex-start;gap:10px;margin-top:22px;padding:13px;border:1px solid #eee8dc;border-radius:11px;background:#fbf9f4;color:#6f7a8d;font-size:11px;line-height:1.7; }
        .pfl-security svg { flex-shrink:0;color:#a27c37; }
        .pfl-help { margin:20px 0 0;text-align:center;color:#8a93a3;font-size:11px;line-height:1.8; }
        .pfl-help a { color:#8c6b32;font-weight:700;text-decoration:none; }
        .pfl-help a:hover { text-decoration:underline; }
        .pfl-copyright { margin:0;padding-top:18px;text-align:center;color:#a0a7b5;font-size:10px; }
        .pfl-visual { position:relative;isolation:isolate;display:flex;flex-direction:column;justify-content:space-between;min-width:0;overflow:hidden;padding:38px 40px 30px;color:white;background:#111d38; }
        .pfl-visual::before { content:"";position:absolute;z-index:-2;inset:0;background:linear-gradient(155deg,rgba(12,24,48,.28),rgba(10,19,39,.88)),url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=85") center/cover; }
        .pfl-visual::after { content:"";position:absolute;z-index:-1;inset:0;background:linear-gradient(180deg,rgba(10,19,39,.24),rgba(10,19,39,.15) 45%,rgba(10,19,39,.85)),radial-gradient(circle at 90% 15%,rgba(216,180,106,.24),transparent 30%); }
        .pfl-visual-brand { display:flex;align-items:center;gap:12px;font:800 10px/1.6 'Manrope',sans-serif;letter-spacing:1.4px; }
        .pfl-visual-brand .pfl-brand-icon { border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#f0dba8; }
        .pfl-visual-copy { max-width:420px;margin:auto 0;padding:65px 0 40px; }
        .pfl-visual-kicker { margin:0 0 17px;color:#f0dba8;font-size:10px;font-weight:800;letter-spacing:2.1px; }
        .pfl-visual-copy h2 { margin:0;color:white;font:800 clamp(35px,4.2vw,51px)/1.13 'Manrope',sans-serif;letter-spacing:-2px; }
        .pfl-visual-copy h2 span { color:#f0dba8; }
        .pfl-visual-copy p { max-width:350px;margin:20px 0 0;color:rgba(255,255,255,.75);font-size:13px;line-height:1.9; }
        .pfl-quote { margin-top:34px;padding:18px 20px;border:1px solid rgba(255,255,255,.24);border-left:3px solid #d8b46a;border-radius:0 12px 12px 0;background:rgba(12,22,43,.42);backdrop-filter:blur(8px); }
        .pfl-quote p { margin:0;color:#fff;font:600 13px/1.8 'Manrope',sans-serif; }
        .pfl-quote span { display:block;margin-top:10px;color:#f0dba8;font-size:10px;letter-spacing:1px; }
        .pfl-visual-foot { display:flex;justify-content:space-between;gap:12px;color:rgba(255,255,255,.62);font-size:10px; }
        .pfl-visual-foot span { display:flex;align-items:center;gap:7px; }
        .pfl-visual-foot svg { color:#f0dba8; }
        .pfl-ring { position:absolute;z-index:-1;border:1px solid rgba(240,219,168,.35);border-radius:50%;pointer-events:none; }
        .pfl-ring-one { width:250px;height:250px;right:-145px;top:80px;box-shadow:0 0 0 22px rgba(240,219,168,.06),0 0 0 48px rgba(240,219,168,.04); }
        .pfl-ring-two { width:190px;height:190px;left:-115px;bottom:60px;box-shadow:0 0 0 20px rgba(240,219,168,.05); }
        @media(max-width:850px) { .pfl-page{padding:16px}.pfl-shell{min-height:650px}.pfl-form-panel{padding:30px 27px 22px}.pfl-visual{padding:30px 26px}.pfl-visual-copy h2{font-size:39px} }
        @media(max-width:680px) { .pfl-page{padding:0;background:#fff}.pfl-shell{min-height:100vh;grid-template-columns:1fr;border:0;border-radius:0;box-shadow:none}.pfl-visual{display:none}.pfl-form-panel{min-height:100vh;padding:25px clamp(22px,7vw,42px) 22px}.pfl-mobile-brand{display:flex}.pfl-content{max-width:440px;padding:35px 0}.pfl-copyright{margin-top:auto} }
        @media(prefers-reduced-motion:reduce){.pfl-page *{animation:none!important;transition:none!important}}
      `}</style>

      <section className="pfl-shell">
        <div className="pfl-form-panel">
          <Link className="pfl-back" to="/"><ArrowLeft size={16} /> Back to home</Link>

          <div className="pfl-mobile-brand">
            <span className="pfl-brand-icon"><GraduationCap size={22} /></span>
            DPP INSTITUTE OF TECHNOLOGY
          </div>

          <div className="pfl-content">
            <p className="pfl-kicker">FACULTY PORTAL</p>
            <h1>Welcome, <span>educator.</span></h1>
            <p className="pfl-subtitle">
              Sign in to access your faculty workspace and stay connected
              with your academic responsibilities.
            </p>

            <form className="pfl-form" onSubmit={handleSubmit}>
              <label htmlFor="permanentFacultyId">Faculty ID or institutional email</label>
              <div className="pfl-input">
                <Mail size={18} />
                <input
                  id="permanentFacultyId"
                  type="text"
                  value={identifier}
                  onChange={(event) => { setIdentifier(event.target.value); setNotice(""); }}
                  placeholder="Enter your faculty ID or email"
                  autoComplete="username"
                  required
                />
              </div>

              <label htmlFor="permanentFacultyPassword">Password</label>
              <div className="pfl-input">
                <LockKeyhole size={18} />
                <input
                  id="permanentFacultyPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setNotice(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button className="pfl-eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="pfl-submit" type="submit">
                Enter faculty portal <ArrowRight size={17} />
              </button>
            </form>

            {notice && <div className="pfl-notice" role="status">{notice}</div>}

            <div className="pfl-security">
              <ShieldCheck size={18} />
              <span><strong>Faculty access</strong><br />Backend authentication will be connected in a later step.</span>
            </div>

            <p className="pfl-help">
              Need a different portal?{" "}
              <Link to="/login/admin">Admin</Link> ·{" "}
              <Link to="/login/visiting-faculty">Visiting faculty</Link>
            </p>
          </div>

          <p className="pfl-copyright">© {new Date().getFullYear()} DPP Institute of Technology</p>
        </div>

        <aside className="pfl-visual">
          <div className="pfl-ring pfl-ring-one" />
          <div className="pfl-ring pfl-ring-two" />

          <div className="pfl-visual-brand">
            <span className="pfl-brand-icon"><BookOpen size={22} /></span>
            <span>DPP INSTITUTE OF TECHNOLOGY</span>
          </div>

          <div className="pfl-visual-copy">
            <p className="pfl-visual-kicker">THE ART OF TEACHING</p>
            <h2>Inspire minds.<br /><span>Shape futures.</span></h2>
            <p>
              Great teaching reaches beyond the classroom. Your faculty portal
              will bring the tools of your academic day into one connected place.
            </p>

            <div className="pfl-quote">
              <p>“Education is not just about filling minds, but opening them to possibility.”</p>
              <span>FOR EVERY EDUCATOR, EVERY DAY</span>
            </div>
          </div>

          <div className="pfl-visual-foot">
            <span><Landmark size={14} /> Faculty community</span>
            <span><CalendarDays size={14} /> Academic life</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
