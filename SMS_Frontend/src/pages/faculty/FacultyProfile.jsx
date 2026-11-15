import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  ArrowLeft, UserRound, Mail, Phone, GraduationCap,
  BriefcaseBusiness, Pencil, LockKeyhole, Eye, EyeOff,
  X, CheckCircle2, AlertCircle, ShieldCheck, Save,
  Sparkles, Fingerprint, BookOpen,
} from "lucide-react";

export default function FacultyProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const base = location.pathname.includes("/visiting/")
    ? "/faculty/visiting"
    : "/faculty/permanent";

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function clearSession() {
    [
      "sms_token",
      "sms_role",
      "sms_teacher_id",
      "sms_must_change_password",
      "sms_faculty_type",
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (
        !localStorage.getItem("sms_token") ||
        localStorage.getItem("sms_role") !== "TEACHER"
      ) {
        navigate("/login/faculty", { replace: true });
        return;
      }

      try {
        const response = await api.get("/faculty/profile");
        if (!active) return;

        const data = response?.data || {};
        const type = String(data.facultyType || "")
          .trim()
          .toUpperCase();

        const visiting = ["VISITING", "VISITING FACULTY"].includes(type);
        const permanent = [
          "REGULAR",
          "PERMANENT",
          "PERMANENT FACULTY",
        ].includes(type);

        if (!visiting && !permanent) {
          setError("Your faculty type could not be verified.");
          return;
        }

        if (
          (base === "/faculty/visiting" && !visiting) ||
          (base === "/faculty/permanent" && !permanent)
        ) {
          navigate(
            visiting
              ? "/faculty/visiting/dashboard"
              : "/faculty/permanent/dashboard",
            { replace: true }
          );
          return;
        }

        localStorage.setItem("sms_faculty_type", type);
        setProfile(data);
        setForm({
          email: data.email || "",
          alternatePhoneNumber: data.alternatePhoneNumber || "",
          educationalDetails: data.educationalDetails || "",
        });
      } catch (err) {
        if (!active) return;

        if ([401, 403].includes(err.response?.status)) {
          clearSession();
          navigate("/login/faculty", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
          "Unable to load your faculty profile."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate, base]);

  const updateForm = (key, value) => {
    setForm((old) => ({ ...old, [key]: value }));
    setError("");
    setNotice("");
  };

  const normalizePhone = (value = "") =>
    value.replace(/[\s-]/g, "");

  const validPhone = (value = "") =>
    /^(\+91)?[6-9]\d{9}$/.test(normalizePhone(value));

  const alternateError =
    form.alternatePhoneNumber &&
    !validPhone(form.alternatePhoneNumber)
      ? "Enter a valid 10-digit Indian mobile number."
      : "";

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.email?.trim()) {
      setError("Email address cannot be empty.");
      return;
    }

    if (alternateError) {
      setError(alternateError);
      return;
    }

    setSaving(true);

    try {
      const response = await api.put("/faculty/profile", {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        email: form.email.trim(),
        alternatePhoneNumber: normalizePhone(
          form.alternatePhoneNumber || ""
        ),
        educationalDetails: form.educationalDetails || "",
      });

      const updated = response?.data || {
        ...profile,
        email: form.email.trim(),
        alternatePhoneNumber: normalizePhone(
          form.alternatePhoneNumber || ""
        ),
        educationalDetails: form.educationalDetails || "",
      };

      setProfile(updated);
      setForm({
        email: updated.email || "",
        alternatePhoneNumber: updated.alternatePhoneNumber || "",
        educationalDetails: updated.educationalDetails || "",
      });
      setEditOpen(false);
      setNotice("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Profile update failed. Confirm that your backend supports PUT /faculty/profile."
      );
    } finally {
      setSaving(false);
    }
  }

  const rules = [
    { label: "At least 8 characters", test: (v) => v.length >= 8 },
    { label: "One uppercase letter (A–Z)", test: (v) => /[A-Z]/.test(v) },
    { label: "One lowercase letter (a–z)", test: (v) => /[a-z]/.test(v) },
    { label: "One number (0–9)", test: (v) => /\d/.test(v) },
    { label: "One special character (@ . - _)", test: (v) => /[@._-]/.test(v) },
  ];

  const passwordValid = rules.every((rule) =>
    rule.test(passwords.newPassword)
  );

  const passwordsMatch =
    passwords.confirmPassword.length > 0 &&
    passwords.newPassword === passwords.confirmPassword;

  async function changePassword(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!passwords.currentPassword) {
      setError("Enter your current password.");
      return;
    }

    if (!passwordValid) {
      setError("Your new password does not meet all requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Your new password and confirmation do not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      await api.put("/faculty/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setPasswordOpen(false);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setNotice("Your password has been changed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Password change failed. Confirm that your backend supports PUT /faculty/password."
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  const togglePassword = (key) => {
    setShowPasswords((old) => ({ ...old, [key]: !old[key] }));
  };

  const infoCard = (label, value, Icon, locked = false) => (
    <div className={`fp-info ${locked ? "fp-locked" : ""}`}>
      <div className="fp-info-icon"><Icon size={19} /></div>
      <div className="fp-info-content">
        <span>{label}</span>
        <strong>{value || "Not provided"}</strong>
        {locked && (
          <small><LockKeyhole size={10} /> Protected information</small>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fp-loading">
        <div className="fp-loader" />
        Loading your profile...
        <style>{`
          .fp-loading{min-height:100vh;display:grid;place-content:center;justify-items:center;gap:13px;background:#f4f5f9;color:#687286;font:13px Arial}
          .fp-loader{width:30px;height:30px;border:3px solid #e7e9ef;border-top-color:#c19a52;border-radius:50%;animation:fprotate .8s linear infinite}
          @keyframes fprotate{to{transform:rotate(360deg)}}
        `}</style>
      </div>
    );
  }

  return (
    <div className="fp-page">
      <style>{`
        .fp-page,.fp-page *{box-sizing:border-box}
        .fp-page{min-height:100vh;padding:26px clamp(14px,4vw,48px) 45px;background:radial-gradient(ellipse at 5% 10%,#e8eaf2 0,transparent 35%),radial-gradient(ellipse at 95% 90%,#f1e9da 0,transparent 35%),#f4f5f9;color:#202945;font-family:Inter,Arial,sans-serif}
        .fp-wrap{max-width:1180px;margin:auto}
        .fp-back{display:inline-flex;align-items:center;gap:8px;margin-bottom:22px;padding:8px 0;border:0;background:none;color:#92713b;font-size:12px;font-weight:800;cursor:pointer}
        .fp-hero{position:relative;overflow:hidden;min-height:260px;display:flex;align-items:center;justify-content:space-between;gap:25px;padding:clamp(25px,5vw,48px);border-radius:23px;background:radial-gradient(circle at 82% 20%,#c19a5230 0,transparent 26%),linear-gradient(120deg,#182139,#263451 65%,#354363);color:white;box-shadow:0 20px 50px #20294520}
        .fp-hero:before{content:"";position:absolute;width:330px;height:330px;right:-90px;top:-150px;border:1px solid #ffffff20;border-radius:50%;box-shadow:0 0 0 28px #ffffff08,0 0 0 58px #ffffff06}
        .fp-hero-content{position:relative;z-index:2;max-width:650px}
        .fp-eyebrow{display:flex;align-items:center;gap:8px;color:#e6c98f;font-size:10px;font-weight:800;letter-spacing:2px}
        .fp-hero h1{margin:17px 0 9px;font-size:clamp(28px,5vw,43px);line-height:1.12;letter-spacing:-1.2px}
        .fp-hero p{max-width:510px;margin:0;color:#d1d8e5;font-size:12px;line-height:1.9}
        .fp-hero-id{display:inline-flex;align-items:center;gap:9px;margin-top:20px;padding:10px 13px;border:1px solid #ffffff30;border-radius:9px;background:#ffffff10;color:#f4e6c8;font-size:11px;font-weight:700}
        .fp-hero-art{position:relative;z-index:2;width:145px;height:145px;display:grid;place-items:center;flex-shrink:0;border:1px solid #ffffff35;border-radius:40px;background:#ffffff15;color:#e7ca91;transform:rotate(4deg)}
        .fp-main{overflow:hidden;margin-top:23px;border:1px solid #e7e9ef;border-radius:19px;background:white;box-shadow:0 10px 35px #20294509}
        .fp-main-head{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:21px 25px;border-bottom:1px solid #edf0f4}
        .fp-main-title{display:flex;align-items:center;gap:12px}
        .fp-main-symbol{width:40px;height:40px;display:grid;place-items:center;border-radius:12px;background:#f7f0e3;color:#a17c3e}
        .fp-main-head h2{margin:0;font-size:15px}.fp-main-head p{margin:5px 0 0;color:#9299a8;font-size:10px}
        .fp-actions{display:flex;flex-wrap:wrap;gap:9px}
        .fp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 14px;border:1px solid #e2e5ec;border-radius:9px;background:white;color:#47536b;font-size:10px;font-weight:800;cursor:pointer}
        .fp-btn.gold{border-color:#c19a52;background:#c19a52;color:#202945}
        .fp-body{padding:24px}.fp-section-heading{display:flex;align-items:center;gap:9px;margin:0 0 16px;color:#35415a;font-size:12px;font-weight:800}
        .fp-section-heading svg{color:#a17c3e}
        .fp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
        .fp-info{min-width:0;display:flex;align-items:center;gap:13px;padding:17px;border:1px solid #eceef3;border-radius:12px;background:#fcfcfd}
        .fp-info-icon{width:41px;height:41px;display:grid;place-items:center;flex-shrink:0;border-radius:12px;background:#f7f0e3;color:#a17c3e}
        .fp-info-content{min-width:0}.fp-info span{display:block;margin-bottom:6px;color:#939aaa;font-size:10px}
        .fp-info strong{display:block;overflow-wrap:anywhere;color:#35415a;font-size:12px;line-height:1.5}
        .fp-locked{border:1px dashed #dfe2e9;background:#f0f1f4;opacity:.72;filter:saturate(.45);cursor:not-allowed}
        .fp-locked .fp-info-icon{background:#e3e5ea;color:#8c93a2}
        .fp-locked .fp-info-content small{display:flex;align-items:center;gap:4px;margin-top:6px;color:#9299a8;font-size:9px}
        .fp-wide{grid-column:1/-1}
        .fp-protected-note{display:flex;align-items:flex-start;gap:10px;margin-top:17px;padding:13px 15px;border:1px solid #eee8dc;border-radius:10px;background:#fbf9f4;color:#7b8495;font-size:10px;line-height:1.8}
        .fp-protected-note svg{flex-shrink:0;color:#a17c3e}
        .fp-message{margin:15px 0;padding:12px 14px;border-radius:9px;font-size:11px;line-height:1.6}
        .fp-error{border:1px solid #f0d5d5;background:#fff5f4;color:#a34d4d}
        .fp-success{border:1px solid #cce7d5;background:#f0faf3;color:#34764b}
        .fp-overlay{position:fixed;z-index:1000;inset:0;display:grid;place-items:center;padding:18px;background:#101a31b8;backdrop-filter:blur(8px)}
        .fp-modal{width:100%;max-width:570px;max-height:90vh;overflow:auto;padding:25px;border:1px solid #eee8dc;border-radius:18px;background:white;box-shadow:0 25px 80px #0003}
        .fp-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}
        .fp-modal-head h2{margin:0;font-size:20px}
        .fp-close{width:35px;height:35px;display:grid;place-items:center;border:0;border-radius:9px;background:#f1f2f5;color:#59647a;cursor:pointer}
        .fp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .fp-field{min-width:0;display:flex;flex-direction:column;gap:7px}
        .fp-field.full{grid-column:1/-1}
        .fp-field label{color:#566178;font-size:11px;font-weight:700}
        .fp-field input,.fp-field textarea{width:100%;padding:12px;border:1px solid #e1e5ec;border-radius:9px;outline:none;background:white;color:#26314b;font:12px Arial}
        .fp-field input:focus,.fp-field textarea:focus{border-color:#c19a52;box-shadow:0 0 0 3px #c19a521c}
        .fp-field textarea{min-height:100px;resize:vertical}
        .fp-field small{color:#b24e4e;font-size:10px}
        .fp-field input:disabled{border:1px dashed #d5d8e0;background:#eceef2;color:#858b99;cursor:not-allowed}
        .fp-locked-label{display:flex;align-items:center;gap:5px;color:#9299a8;font-size:9px}
        .fp-submit{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:19px;padding:13px;border:0;border-radius:9px;background:#202945;color:white;font-size:12px;font-weight:800;cursor:pointer}
        .fp-submit:disabled{opacity:.55;cursor:not-allowed}
        .fp-password-field{position:relative}.fp-password-field input{padding-right:42px}
        .fp-eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:none;color:#7c879a;cursor:pointer}
        .fp-rules{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:14px 0;padding:14px;border-radius:10px;background:#f7f8fa}
        .fp-rule{display:flex;align-items:center;gap:7px;color:#9299a8;font-size:10px}
        .fp-rule.pass{color:#37835a}
        .fp-footer{margin-top:22px;color:#9ba2af;font-size:10px;text-align:center}
        @media(max-width:720px){.fp-hero{min-height:230px}.fp-hero-art{width:95px;height:95px}.fp-main-head{align-items:flex-start;flex-direction:column}.fp-actions{width:100%}}
        @media(max-width:560px){.fp-page{padding:18px 13px 35px}.fp-hero{padding:24px 20px}.fp-hero-art{display:none}.fp-grid,.fp-form-grid,.fp-rules{grid-template-columns:1fr}.fp-wide,.fp-field.full{grid-column:auto}.fp-body{padding:17px}.fp-main-head{padding:17px}.fp-modal{padding:19px}.fp-actions{flex-direction:column}.fp-actions button{width:100%}}


/* ==================================
   FACULTY PROFILE ANIMATIONS
================================== */

/* Smooth page entrance */
.fp-page {
  animation: fpPageEnter 0.7s ease both;
}

@keyframes fpPageEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hero entrance */
.fp-hero {
  animation: fpHeroEnter 0.8s cubic-bezier(.2,.8,.2,1) both;
}

@keyframes fpHeroEnter {
  from {
    opacity: 0;
    transform: translateY(22px) scale(.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Hero decorative icon */
.fp-hero-art {
  animation: fpArtFloat 5s ease-in-out infinite;
}

@keyframes fpArtFloat {
  0%, 100% {
    transform: rotate(4deg) translateY(0);
  }
  50% {
    transform: rotate(1deg) translateY(-9px);
  }
}

/* Main profile panel */
.fp-main {
  animation: fpPanelEnter .8s ease .15s both;
}

@keyframes fpPanelEnter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Information cards: staggered entrance */
.fp-info {
  animation: fpCardEnter .55s ease both;
  transition:
    transform .25s ease,
    box-shadow .25s ease,
    border-color .25s ease,
    background .25s ease;
}

.fp-info:nth-child(1) { animation-delay: .10s; }
.fp-info:nth-child(2) { animation-delay: .16s; }
.fp-info:nth-child(3) { animation-delay: .22s; }
.fp-info:nth-child(4) { animation-delay: .28s; }
.fp-info:nth-child(5) { animation-delay: .34s; }
.fp-info:nth-child(6) { animation-delay: .40s; }
.fp-info:nth-child(7) { animation-delay: .46s; }
.fp-info:nth-child(8) { animation-delay: .52s; }

@keyframes fpCardEnter {
  from {
    opacity: 0;
    transform: translateY(13px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Information card hover */
.fp-info:not(.fp-locked):hover {
  transform: translateY(-4px);
  border-color: #d8c092;
  background: #fffefa;
  box-shadow: 0 9px 22px #2029450d;
}

.fp-info-icon {
  transition:
    transform .3s ease,
    background .3s ease;
}

.fp-info:not(.fp-locked):hover .fp-info-icon {
  transform: scale(1.08) rotate(-4deg);
  background: #f3e8d2;
}

/* Buttons */
.fp-btn,
.fp-submit,
.fp-close,
.fp-back {
  transition:
    transform .22s ease,
    box-shadow .22s ease,
    background .22s ease,
    border-color .22s ease;
}

.fp-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px #20294512;
}

.fp-btn.gold:hover:not(:disabled) {
  background: #d0aa66;
  box-shadow: 0 7px 18px #c19a5235;
}

.fp-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px #20294525;
}

.fp-close:hover {
  transform: rotate(90deg);
  background: #e9ebf0;
}

.fp-back:hover {
  transform: translateX(-4px);
}

/* Modal entrance */
.fp-overlay {
  animation: fpOverlayEnter .25s ease both;
}

.fp-modal {
  animation: fpModalEnter .35s cubic-bezier(.2,.8,.2,1) both;
}

@keyframes fpOverlayEnter {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fpModalEnter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Protected information remains visually restricted */
.fp-locked {
  transition: none;
}

.fp-locked:hover {
  transform: none;
  box-shadow: none;
}

/* Focus accessibility */
.fp-btn:focus-visible,
.fp-submit:focus-visible,
.fp-close:focus-visible,
.fp-back:focus-visible {
  outline: 3px solid #c19a52;
  outline-offset: 3px;
}

/* Respect reduced-motion preferences */
@media (prefers-reduced-motion: reduce) {
  .fp-page *,
  .fp-page *::before,
  .fp-page *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}


/* Broader and more visible borders */

.fp-hero {
  border: 2px solid #c19a52;
}

.fp-main {
  border: 2px solid #d5dbe6;
}

.fp-info {
  border: 1.5px solid #d5dbe6;
}

.fp-protected-note {
  border: 1.5px solid #d9c79f;
}

.fp-panel,
.fp-modal {
  border: 2px solid #d5dbe6;
}

/* Stronger border on hover */
.fp-info:not(.fp-locked):hover {
  border: 2px solid #c19a52;
}

.fp-btn {
  border-width: 1.5px;
}

.fp-btn.gold {
  border: 2px solid #b18b4b;
}

      `}</style>

      <div className="fp-wrap">
        <button className="fp-back" onClick={() => navigate(`${base}/dashboard`)}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <section className="fp-hero">
          <div className="fp-hero-content">
            <div className="fp-eyebrow"><Sparkles size={14} /> FACULTY ACCOUNT</div>
            <h1>Your Professional<br />Profile</h1>
            <p>Your faculty identity and academic information in one place. Keep your contact and educational details up to date.</p>
            <div className="fp-hero-id">
              <Fingerprint size={15} />
              {profile?.teacherId || localStorage.getItem("sms_teacher_id") || "Faculty ID unavailable"}
            </div>
          </div>
          <div className="fp-hero-art"><UserRound size={65} strokeWidth={1.2} /></div>
        </section>

        {error && <div className="fp-message fp-error">{error}</div>}
        {notice && <div className="fp-message fp-success">{notice}</div>}

        <section className="fp-main">
          <div className="fp-main-head">
            <div className="fp-main-title">
              <div className="fp-main-symbol"><ShieldCheck size={20} /></div>
              <div>
                <h2>Personal Information</h2>
                <p>Your registered faculty information</p>
              </div>
            </div>
            <div className="fp-actions">
              <button className="fp-btn gold" onClick={() => { setError(""); setEditOpen(true); }}>
                <Pencil size={14} /> Edit Profile
              </button>
              <button className="fp-btn" onClick={() => { setError(""); setPasswordOpen(true); }}>
                <LockKeyhole size={14} /> Change Password
              </button>
            </div>
          </div>

          <div className="fp-body">
            <h3 className="fp-section-heading"><UserRound size={16} /> Faculty Details</h3>
            <div className="fp-grid">
              {infoCard("Full Name", profile?.name, UserRound, true)}
              {infoCard("Faculty ID", profile?.teacherId || localStorage.getItem("sms_teacher_id"), Fingerprint)}
              {infoCard("Email Address", profile?.email, Mail)}
              {infoCard("Primary Mobile Number", profile?.phoneNumber, Phone, true)}
              {infoCard("Alternate Mobile Number", profile?.alternatePhoneNumber, Phone)}
              {infoCard("Faculty Type", profile?.facultyType, BriefcaseBusiness)}
              {infoCard("Department", profile?.deptId || "MCA Department", GraduationCap)}
              <div className="fp-info fp-wide">
                <div className="fp-info-icon"><BookOpen size={19} /></div>
                <div className="fp-info-content">
                  <span>Educational Details</span>
                  <strong>{profile?.educationalDetails || "Not provided"}</strong>
                </div>
              </div>
            </div>

            <div className="fp-protected-note">
              <ShieldCheck size={17} />
              <div>
                <strong>Protected faculty information.</strong> Your registered full name and primary mobile number are protected and cannot be edited from this page. Contact the administrator if either detail needs correction.
              </div>
            </div>
          </div>
        </section>

        <div className="fp-footer">Faculty Account · DPP Institute of Technology</div>
      </div>

      {editOpen && (
        <div className="fp-overlay" onClick={() => setEditOpen(false)}>
          <section className="fp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fp-modal-head">
              <h2>Edit Faculty Profile</h2>
              <button className="fp-close" onClick={() => setEditOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={saveProfile}>
              <div className="fp-form-grid">
                <div className="fp-field">
                  <label>Full Name</label>
                  <input value={profile?.name || ""} disabled readOnly />
                  <span className="fp-locked-label"><LockKeyhole size={11} /> Cannot be changed</span>
                </div>

                <div className="fp-field">
                  <label>Primary Mobile Number</label>
                  <input value={profile?.phoneNumber || ""} disabled readOnly />
                  <span className="fp-locked-label"><LockKeyhole size={11} /> Cannot be changed</span>
                </div>

                <div className="fp-field full">
                  <label>Email Address</label>
                  <input type="email" value={form.email || ""} onChange={(e) => updateForm("email", e.target.value)} required />
                </div>

                <div className="fp-field full">
                  <label>Alternate Mobile Number</label>
                  <input type="tel" value={form.alternatePhoneNumber || ""} onChange={(e) => updateForm("alternatePhoneNumber", e.target.value)} placeholder="Enter alternate mobile number" />
                  {alternateError && <small>{alternateError}</small>}
                </div>

                <div className="fp-field full">
                  <label>Educational Details</label>
                  <textarea value={form.educationalDetails || ""} onChange={(e) => updateForm("educationalDetails", e.target.value)} placeholder="Enter your qualifications and educational details" />
                </div>
              </div>

              <button className="fp-submit" type="submit" disabled={saving || !!alternateError}>
                <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </section>
        </div>
      )}

      {passwordOpen && (
        <div className="fp-overlay" onClick={() => setPasswordOpen(false)}>
          <section className="fp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fp-modal-head">
              <h2>Change Password</h2>
              <button className="fp-close" onClick={() => setPasswordOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={changePassword}>
              {[
                ["currentPassword", "Current Password"],
                ["newPassword", "New Password"],
                ["confirmPassword", "Confirm New Password"],
              ].map(([key, label]) => (
                <div className="fp-field" style={{ marginBottom: 14 }} key={key}>
                  <label>{label}</label>
                  <div className="fp-password-field">
                    <input
                      type={showPasswords[key] ? "text" : "password"}
                      value={passwords[key]}
                      onChange={(e) => setPasswords((old) => ({ ...old, [key]: e.target.value }))}
                      required
                    />
                    <button type="button" className="fp-eye" onClick={() => togglePassword(key)}>
                      {showPasswords[key] ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="fp-rules">
                {rules.map((rule) => {
                  const passed = rule.test(passwords.newPassword);
                  return (
                    <div className={`fp-rule ${passed ? "pass" : ""}`} key={rule.label}>
                      {passed ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      {rule.label}
                    </div>
                  );
                })}
                <div className={`fp-rule ${passwordsMatch ? "pass" : ""}`}>
                  {passwordsMatch ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  Passwords match
                </div>
              </div>

              <button className="fp-submit" type="submit" disabled={passwordSaving || !passwordValid || !passwordsMatch}>
                <LockKeyhole size={16} /> {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
