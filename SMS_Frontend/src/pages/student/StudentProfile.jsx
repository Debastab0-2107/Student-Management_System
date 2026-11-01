import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  CalendarDays,
  Phone,
  Users,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  Pencil,
  Check,
  X,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import { useStudentLayout } from "../../components/layout/StudentLayout";

const EMPTY_PROFILE = {
  studentId: "",
  name: "",
  phoneNumber: "",
  email: "",
  dateOfBirth: "",
  courseId: "",
  sessionId: "",
  fatherName: "",
  fatherPhoneNumber: "",
  motherName: "",
  motherPhoneNumber: "",
  mustChangePassword: false,
};

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function ProfileField({ label, value, icon: Icon, readOnly = false }) {
  return (
    <div className="sp-detail">
      <div className="sp-detail-icon">
        <Icon size={19} strokeWidth={1.9} />
      </div>

      <div className="sp-detail-content">
        <span className="sp-detail-label">{label}</span>
        <span className="sp-detail-value">
          {value || "Not provided"}
        </span>
      </div>

      {readOnly && <span className="sp-readonly">Fixed</span>}
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <label className="sp-form-field">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </label>
  );
}

export default function StudentProfile() {
  const { notify } = useStudentLayout();

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [activeModal, setActiveModal] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profileForm, setProfileForm] = useState({
    email: "",
    dateOfBirth: "",
    fatherName: "",
    fatherPhoneNumber: "",
    motherName: "",
    motherPhoneNumber: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Fetch the authenticated student's profile.
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setPageError("");

        const response = await api.get("/student/profile");

        if (!active) return;

        const data = response.data || {};
        setProfile({ ...EMPTY_PROFILE, ...data });

        setProfileForm({
          email: data.email || "",
          dateOfBirth: data.dateOfBirth || "",
          fatherName: data.fatherName || "",
          fatherPhoneNumber: data.fatherPhoneNumber || "",
          motherName: data.motherName || "",
          motherPhoneNumber: data.motherPhoneNumber || "",
        });
      } catch (error) {
        if (!active) return;

        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          localStorage.removeItem("sms_token");
          localStorage.removeItem("sms_role");
          localStorage.removeItem("sms_student_id");
          window.location.href = "/login/student";
          return;
        }

        setPageError(getErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // Close the successful modal first, then show the layout notification.
  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => {
      setActiveModal("");
      setSuccessMessage("");
      setModalError("");
      notify(successMessage);
    }, 1100);

    return () => window.clearTimeout(timer);
  }, [successMessage, notify]);

  function openProfileModal() {
    setProfileForm({
      email: profile.email || "",
      dateOfBirth: profile.dateOfBirth || "",
      fatherName: profile.fatherName || "",
      fatherPhoneNumber: profile.fatherPhoneNumber || "",
      motherName: profile.motherName || "",
      motherPhoneNumber: profile.motherPhoneNumber || "",
    });

    setModalError("");
    setSuccessMessage("");
    setActiveModal("profile");
  }

  function openPasswordModal() {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });

    setModalError("");
    setSuccessMessage("");
    setActiveModal("password");
  }

  function closeModal() {
    if (saving || successMessage) return;

    setActiveModal("");
    setModalError("");
  }

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function submitProfile(event) {
    event.preventDefault();
    setModalError("");

    try {
      setSaving(true);

      const payload = {
        email: profileForm.email.trim(),
        dateOfBirth: profileForm.dateOfBirth,
        fatherName: profileForm.fatherName.trim(),
        fatherPhoneNumber: profileForm.fatherPhoneNumber.trim(),
        motherName: profileForm.motherName.trim(),
        motherPhoneNumber: profileForm.motherPhoneNumber.trim(),
      };

      const response = await api.put("/student/profile", payload);

      // Use the updated profile returned by the backend.
      const updatedProfile = response.data || {
        ...profile,
        ...payload,
      };

      setProfile((previous) => ({
        ...previous,
        ...updatedProfile,
      }));

      setProfileForm({
        email: updatedProfile.email || "",
        dateOfBirth: updatedProfile.dateOfBirth || "",
        fatherName: updatedProfile.fatherName || "",
        fatherPhoneNumber: updatedProfile.fatherPhoneNumber || "",
        motherName: updatedProfile.motherName || "",
        motherPhoneNumber: updatedProfile.motherPhoneNumber || "",
      });

      setSuccessMessage("Your profile has been updated successfully.");
    } catch (error) {
      setModalError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function submitPassword(event) {
    event.preventDefault();
    setModalError("");

    if (!passwordForm.currentPassword.trim()) {
      setModalError("Please enter your current password.");
      return;
    }

    if (!passwordForm.newPassword.trim()) {
      setModalError("Please enter your new password.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setModalError("Your new password must contain at least 8 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setModalError("The new password and confirmation do not match.");
      return;
    }

    try {
      setSaving(true);

      await api.put("/student/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccessMessage("Your password has been changed successfully.");
    } catch (error) {
      setModalError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  function togglePassword(field) {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  }

  if (loading) {
    return (
      <main className="sp-page">
        <div className="sp-loading">
          <LoaderCircle className="sp-spinner" size={30} />
          <p>Loading your profile...</p>
        </div>
        <ProfileStyles />
      </main>
    );
  }

  return (
    <main className="sp-page">
      <ProfileStyles />

      <div className="sp-background-circle sp-circle-one" />
      <div className="sp-background-circle sp-circle-two" />
      <div className="sp-background-circle sp-circle-three" />

      <div className="sp-container">
        <Link to="/student/dashboard" className="sp-back">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <header className="sp-heading">
          <div className="sp-heading-icon">
            <UserRound size={25} />
          </div>

          <div>
            <span className="sp-eyebrow">STUDENT PORTAL</span>
            <h1>My Profile</h1>
            <p>
              View your personal information and manage your account
              securely.
            </p>
          </div>
        </header>

        {pageError && (
          <div className="sp-page-error" role="alert">
            <AlertCircle size={18} />
            <span>{pageError}</span>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!pageError && (
          <>
            <section className="sp-identity-card">
              <div className="sp-avatar">
                <UserRound size={31} />
              </div>

              <div className="sp-identity-text">
                <span className="sp-identity-label">
                  STUDENT ACCOUNT
                </span>
                <h2>{profile.name || "Student"}</h2>
                <p>
                  Student ID: {profile.studentId || "Not available"}
                </p>
              </div>

              <div className="sp-verified">
                <ShieldCheck size={16} />
                Authenticated
              </div>
            </section>

            <section className="sp-section sp-personal-section">
              <div className="sp-section-heading">
                <div>
                  <span className="sp-section-kicker">
                    PERSONAL INFORMATION
                  </span>
                  <h2>Student details</h2>
                  <p>
                    Your authority-provided information and personal
                    details.
                  </p>
                </div>

                <button
                  type="button"
                  className="sp-primary-button"
                  onClick={openProfileModal}
                >
                  <Pencil size={15} />
                  Update Profile
                </button>
              </div>

              <div className="sp-details-grid">
                <ProfileField
                  label="Full name"
                  value={profile.name}
                  icon={UserRound}
                  readOnly
                />
                <ProfileField
                  label="Student ID"
                  value={profile.studentId}
                  icon={ShieldCheck}
                  readOnly
                />
                <ProfileField
                  label="Phone number"
                  value={profile.phoneNumber}
                  icon={Phone}
                  readOnly
                />
                <ProfileField
                  label="Email address"
                  value={profile.email}
                  icon={Mail}
                />
                <ProfileField
                  label="Date of birth"
                  value={profile.dateOfBirth}
                  icon={CalendarDays}
                />
                <ProfileField
                  label="Course ID"
                  value={profile.courseId}
                  icon={Users}
                  readOnly
                />
                <ProfileField
                  label="Academic session ID"
                  value={profile.sessionId}
                  icon={CalendarDays}
                  readOnly
                />
              </div>
            </section>

            <section className="sp-section sp-family-section">
              <div className="sp-section-heading">
                <div>
                  <span className="sp-section-kicker">
                    FAMILY INFORMATION
                  </span>
                  <h2>Parent / Guardian details</h2>
                  <p>
                    Contact information for your parents or guardians.
                  </p>
                </div>
              </div>

              <div className="sp-details-grid">
                <ProfileField
                  label="Father's name"
                  value={profile.fatherName}
                  icon={UserRound}
                />
                <ProfileField
                  label="Father's phone number"
                  value={profile.fatherPhoneNumber}
                  icon={Phone}
                />
                <ProfileField
                  label="Mother's name"
                  value={profile.motherName}
                  icon={UserRound}
                />
                <ProfileField
                  label="Mother's phone number"
                  value={profile.motherPhoneNumber}
                  icon={Phone}
                />
              </div>
            </section>

            <section className="sp-security-card">
              <div className="sp-security-icon">
                <LockKeyhole size={22} />
              </div>

              <div className="sp-security-content">
                <span className="sp-section-kicker">ACCOUNT SECURITY</span>
                <h2>Password & security</h2>
                <p>
                  Keep your student account secure by using a strong,
                  private password.
                </p>

                {profile.mustChangePassword && (
                  <span className="sp-password-reminder">
                    Please change your initial password.
                  </span>
                )}
              </div>

              <button
                type="button"
                className="sp-secondary-button"
                onClick={openPasswordModal}
              >
                <LockKeyhole size={15} />
                Update Password
              </button>
            </section>
          </>
        )}
      </div>

      {activeModal && (
        <div
          className="sp-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="sp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sp-modal-title"
          >
            {!successMessage ? (
              <>
                <div className="sp-modal-header">
                  <div className="sp-modal-heading-icon">
                    {activeModal === "profile" ? (
                      <UserRound size={22} />
                    ) : (
                      <LockKeyhole size={22} />
                    )}
                  </div>

                  <button
                    type="button"
                    className="sp-modal-close"
                    onClick={closeModal}
                    disabled={saving}
                    aria-label="Close dialog"
                  >
                    <X size={19} />
                  </button>

                  <span className="sp-section-kicker">
                    {activeModal === "profile"
                      ? "PERSONAL INFORMATION"
                      : "ACCOUNT SECURITY"}
                  </span>

                  <h2 id="sp-modal-title">
                    {activeModal === "profile"
                      ? "Update your profile"
                      : "Change your password"}
                  </h2>

                  <p>
                    {activeModal === "profile"
                      ? "Make changes to your editable personal information."
                      : "Verify your current password before setting a new one."}
                  </p>
                </div>

                {modalError && (
                  <div className="sp-modal-error" role="alert">
                    <AlertCircle size={16} />
                    {modalError}
                  </div>
                )}

                {activeModal === "profile" ? (
                  <form onSubmit={submitProfile}>
                    <div className="sp-form-grid">
                      <FormField
                        label="Email address"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        placeholder="example@email.com"
                      />

                      <FormField
                        label="Date of birth"
                        name="dateOfBirth"
                        type="date"
                        value={profileForm.dateOfBirth}
                        onChange={handleProfileChange}
                      />

                      <FormField
                        label="Father's name"
                        name="fatherName"
                        value={profileForm.fatherName}
                        onChange={handleProfileChange}
                      />

                      <FormField
                        label="Father's phone number"
                        name="fatherPhoneNumber"
                        type="tel"
                        value={profileForm.fatherPhoneNumber}
                        onChange={handleProfileChange}
                      />

                      <FormField
                        label="Mother's name"
                        name="motherName"
                        value={profileForm.motherName}
                        onChange={handleProfileChange}
                      />

                      <FormField
                        label="Mother's phone number"
                        name="motherPhoneNumber"
                        type="tel"
                        value={profileForm.motherPhoneNumber}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="sp-modal-actions">
                      <button
                        type="button"
                        className="sp-cancel-button"
                        onClick={closeModal}
                        disabled={saving}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="sp-submit-button"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <LoaderCircle className="sp-spinner" size={16} />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={submitPassword}>
                    <div className="sp-password-fields">
                      <PasswordField
                        label="Current password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        visible={showPasswords.current}
                        onChange={handlePasswordChange}
                        onToggle={() => togglePassword("current")}
                      />

                      <PasswordField
                        label="New password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        visible={showPasswords.new}
                        onChange={handlePasswordChange}
                        onToggle={() => togglePassword("new")}
                      />

                      <PasswordField
                        label="Confirm new password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        visible={showPasswords.confirm}
                        onChange={handlePasswordChange}
                        onToggle={() => togglePassword("confirm")}
                      />

                      <p className="sp-password-hint">
                        Use at least 8 characters. Your new password
                        must be different from your current password.
                      </p>
                    </div>

                    <div className="sp-modal-actions">
                      <button
                        type="button"
                        className="sp-cancel-button"
                        onClick={closeModal}
                        disabled={saving}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="sp-submit-button"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <LoaderCircle className="sp-spinner" size={16} />
                            Updating...
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={15} />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <div className="sp-success-content">
                <div className="sp-success-ring">
                  <div className="sp-success-check">
                    <Check size={38} strokeWidth={3} />
                  </div>
                </div>

                <span className="sp-section-kicker">
                  UPDATE COMPLETED
                </span>

                <h2>
                  {activeModal === "profile"
                    ? "Profile updated!"
                    : "Password changed!"}
                </h2>

                <p>{successMessage}</p>

                <div className="sp-success-progress">
                  <span />
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function PasswordField({
  label,
  name,
  value,
  visible,
  onChange,
  onToggle,
}) {
  return (
    <label className="sp-form-field">
      <span>{label}</span>

      <div className="sp-password-input">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          autoComplete="off"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  );
}

function ProfileStyles() {
  return (
    <style>{`
      .sp-page {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        isolation: isolate;
        padding: 30px clamp(18px, 4vw, 52px) 55px;
        color: #202945;
        background:
          radial-gradient(ellipse at 8% 5%, rgba(216,223,248,.78), transparent 32%),
          radial-gradient(ellipse at 92% 25%, rgba(193,154,82,.17), transparent 30%),
          radial-gradient(ellipse at 50% 100%, rgba(226,231,247,.65), transparent 42%),
          linear-gradient(135deg, #fbf4e7 0%, #f9f4ef 48%, #eef1fb 100%);
        font-family: inherit;
      }

      .sp-page::before {
        content: "";
        position: absolute;
        z-index: -1;
        inset: 0;
        pointer-events: none;
        opacity: .25;
        background-image: radial-gradient(rgba(48,59,93,.16) .7px, transparent .7px);
        background-size: 24px 24px;
        mask-image: linear-gradient(to bottom, black, transparent 75%);
      }

      .sp-background-circle {
        position: absolute;
        z-index: -1;
        pointer-events: none;
        border: 1px solid rgba(48,59,93,.1);
        border-radius: 50%;
        animation: sp-float 9s ease-in-out infinite;
      }

      .sp-circle-one {
        width: 430px;
        height: 430px;
        top: 70px;
        right: -200px;
      }

      .sp-circle-two {
        width: 290px;
        height: 290px;
        top: 145px;
        right: -130px;
        animation-delay: -3s;
      }

      .sp-circle-three {
        width: 250px;
        height: 250px;
        bottom: 25px;
        left: -145px;
        border-color: rgba(193,154,82,.2);
        animation-delay: -5s;
      }

      @keyframes sp-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-13px); }
      }

      .sp-container {
        position: relative;
        z-index: 1;
        width: min(1120px, 100%);
        margin: 0 auto;
      }

      .sp-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #86632c;
        font-size: 12px;
        font-weight: 750;
        text-decoration: none;
        transition: gap .22s ease, color .22s ease;
      }

      .sp-back:hover {
        gap: 12px;
        color: #202945;
      }

      .sp-heading {
        display: flex;
        align-items: center;
        gap: 16px;
        margin: 28px 0 24px;
        animation: sp-rise-in .55s ease both;
      }

      .sp-heading-icon {
        display: grid;
        place-items: center;
        width: 56px;
        height: 56px;
        flex-shrink: 0;
        color: #fff;
        background: linear-gradient(145deg, #303b5d, #202945);
        border: 1px solid rgba(255,255,255,.3);
        border-radius: 17px;
        box-shadow: 0 10px 25px rgba(32,41,69,.2);
      }

      .sp-eyebrow, .sp-section-kicker {
        display: block;
        color: #a27b37;
        font-size: 9px;
        font-weight: 850;
        letter-spacing: 1.7px;
      }

      .sp-heading h1 {
        margin: 4px 0;
        color: #202945;
        font-size: clamp(27px, 4vw, 35px);
        letter-spacing: -.8px;
      }

      .sp-heading p {
        margin: 0;
        color: #7b8296;
        font-size: 12px;
        line-height: 1.6;
      }

      /* Student identity banner */

      .sp-identity-card {
        position: relative;
        display: flex;
        align-items: center;
        gap: 18px;
        overflow: hidden;
        padding: 25px 28px;
        color: #fff;
        background:
          radial-gradient(circle at 90% 0%, rgba(193,154,82,.3), transparent 35%),
          linear-gradient(115deg, #202945, #303b5d);
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 21px;
        box-shadow: 0 15px 35px rgba(32,41,69,.16);
        animation: sp-rise-in .6s .06s ease both;
      }

      .sp-identity-card::after {
        content: "";
        position: absolute;
        width: 220px;
        height: 220px;
        top: -145px;
        right: 100px;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 50%;
        box-shadow: 0 0 0 25px rgba(255,255,255,.025),
                    0 0 0 50px rgba(255,255,255,.02);
        pointer-events: none;
      }

      .sp-avatar {
        position: relative;
        z-index: 1;
        display: grid;
        place-items: center;
        width: 62px;
        height: 62px;
        flex-shrink: 0;
        color: #f6e5c3;
        background: rgba(255,255,255,.12);
        border: 1px solid rgba(255,255,255,.22);
        border-radius: 19px;
      }

      .sp-identity-label {
        color: #d9c18f;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.5px;
      }

      .sp-identity-text h2 {
        margin: 5px 0;
        color: #fff;
        font-size: 21px;
        letter-spacing: -.3px;
      }

      .sp-identity-text p {
        margin: 0;
        color: #d0d5e1;
        font-size: 11px;
      }

      .sp-verified {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        margin-left: auto;
        padding: 10px 14px;
        color: #e4f4e9;
        background: rgba(90,164,125,.17);
        border: 1px solid rgba(155,218,180,.25);
        border-radius: 30px;
        font-size: 10px;
        font-weight: 750;
      }

      /* Main information section cards */

      .sp-section {
        position: relative;
        overflow: hidden;
        margin-top: 25px;
        padding: 29px;
        background:
          linear-gradient(145deg, rgba(255,255,255,.97), rgba(250,251,255,.94));
        border: 1px solid rgba(211,216,231,.95);
        border-radius: 22px;
        box-shadow:
          0 15px 38px rgba(32,41,69,.065),
          0 2px 7px rgba(32,41,69,.025),
          inset 0 1px 0 rgba(255,255,255,.95);
        backdrop-filter: blur(12px);
        animation: sp-rise-in .65s ease both;
        transition: box-shadow .3s ease, border-color .3s ease;
      }

      .sp-section::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #b58a43, #e5d0a7 48%, #303b5d);
        opacity: .9;
      }

      .sp-section::after {
        content: "";
        position: absolute;
        top: -115px;
        right: -90px;
        width: 250px;
        height: 250px;
        border: 1px solid rgba(193,154,82,.09);
        border-radius: 50%;
        pointer-events: none;
      }

      .sp-section:hover {
        border-color: rgba(193,154,82,.4);
        box-shadow:
          0 18px 42px rgba(32,41,69,.085),
          0 3px 9px rgba(32,41,69,.035);
      }

      .sp-personal-section {
        animation-delay: .1s;
      }

      .sp-family-section {
        animation-delay: .18s;
      }

      .sp-section-heading {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 24px;
      }

      .sp-section-heading h2,
      .sp-security-content h2 {
        margin: 7px 0 6px;
        color: #202945;
        font-size: 21px;
        font-weight: 800;
        letter-spacing: -.45px;
      }

      .sp-section-heading p,
      .sp-security-content p {
        margin: 0;
        color: #7d879d;
        font-size: 12px;
        line-height: 1.7;
      }

      .sp-section-kicker {
        color: #a27b37;
        font-size: 9px;
      }

      /* More prominent individual information boxes */

      .sp-details-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 15px;
      }

      .sp-detail {
        position: relative;
        display: flex;
        align-items: center;
        gap: 15px;
        min-width: 0;
        min-height: 86px;
        padding: 17px 19px;
        overflow: hidden;
        background:
          linear-gradient(115deg, #ffffff 0%, #f9faff 100%);
        border: 1px solid #e2e7f1;
        border-left: 3px solid rgba(193,154,82,.75);
        border-radius: 15px;
        box-shadow:
          0 4px 12px rgba(32,41,69,.035),
          inset 0 1px 0 rgba(255,255,255,.9);
        transition:
          transform .25s ease,
          box-shadow .25s ease,
          border-color .25s ease,
          background .25s ease;
        animation: sp-card-in .5s ease both;
      }

      .sp-detail::after {
        content: "";
        position: absolute;
        right: -35px;
        bottom: -48px;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(193,154,82,.09), transparent 70%);
        border-radius: 50%;
        opacity: 0;
        transition: opacity .25s ease;
        pointer-events: none;
      }

      .sp-detail:hover {
        transform: translateY(-3px);
        border-color: rgba(193,154,82,.55);
        border-left-color: #a77c35;
        background: linear-gradient(115deg, #fff, #f8f9ff);
        box-shadow:
          0 10px 22px rgba(32,41,69,.075),
          0 2px 5px rgba(193,154,82,.07);
      }

      .sp-detail:hover::after {
        opacity: 1;
      }

      .sp-detail-icon {
        position: relative;
        z-index: 1;
        display: grid;
        place-items: center;
        width: 47px;
        height: 47px;
        flex-shrink: 0;
        color: #9b712d;
        background: linear-gradient(145deg, #fff8eb, #f8edda);
        border: 1px solid rgba(193,154,82,.18);
        border-radius: 14px;
        box-shadow: 0 3px 9px rgba(193,154,82,.07);
        transition:
          transform .25s ease,
          background .25s ease,
          color .25s ease;
      }

      .sp-detail:hover .sp-detail-icon {
        color: #fff;
        background: linear-gradient(145deg, #b58a43, #96702f);
        transform: scale(1.05);
      }

      .sp-detail-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 7px;
        min-width: 0;
      }

      .sp-detail-label {
        color: #7e879c;
        font-size: 11px;
        font-weight: 550;
        letter-spacing: .1px;
      }

      .sp-detail-value {
        overflow-wrap: anywhere;
        color: #26324f;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.4;
        letter-spacing: -.15px;
      }

      .sp-readonly {
        position: relative;
        z-index: 1;
        align-self: center;
        flex-shrink: 0;
        padding: 5px 9px;
        color: #7c8497;
        background: #f0f2f7;
        border: 1px solid #e7eaf1;
        border-radius: 20px;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .2px;
      }

      /* Buttons */

      .sp-primary-button,
      .sp-secondary-button,
      .sp-submit-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 17px;
        color: #fff;
        background: #202945;
        border: 1px solid #202945;
        border-radius: 11px;
        font-size: 11px;
        font-weight: 750;
        cursor: pointer;
        transition:
          transform .22s ease,
          box-shadow .22s ease,
          background .22s ease;
      }

      .sp-primary-button:hover,
      .sp-submit-button:hover {
        background: #303b5d;
        box-shadow: 0 8px 19px rgba(32,41,69,.2);
        transform: translateY(-2px);
      }

      .sp-primary-button:active,
      .sp-secondary-button:active,
      .sp-submit-button:active {
        transform: translateY(0);
      }

      /* Security section */

      .sp-security-card {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-top: 25px;
        padding: 24px 27px;
        background:
          radial-gradient(circle at 95% 0%, rgba(193,154,82,.12), transparent 32%),
          linear-gradient(110deg, rgba(216,223,248,.75), rgba(255,255,255,.96));
        border: 1px solid #dfe4f1;
        border-radius: 20px;
        box-shadow: 0 10px 27px rgba(32,41,69,.05);
        transition: box-shadow .25s ease, transform .25s ease;
        animation: sp-rise-in .65s .25s ease both;
      }

      .sp-security-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 30px rgba(32,41,69,.08);
      }

      .sp-security-icon {
        display: grid;
        place-items: center;
        width: 52px;
        height: 52px;
        flex-shrink: 0;
        color: #9b7738;
        background: #fff;
        border: 1px solid #e8eaf2;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(32,41,69,.06);
      }

      .sp-security-content {
        flex: 1;
      }

      .sp-password-reminder {
        display: inline-block;
        margin-top: 9px;
        padding: 6px 9px;
        color: #94651e;
        background: #fff6e6;
        border: 1px solid #f1e1c1;
        border-radius: 7px;
        font-size: 10px;
        font-weight: 750;
      }

      .sp-secondary-button {
        color: #303b5d;
        background: #fff;
        border-color: #dfe3ef;
      }

      .sp-secondary-button:hover {
        background: #f8f9fd;
        box-shadow: 0 6px 15px rgba(32,41,69,.09);
        transform: translateY(-2px);
      }

      /* Loading and errors */

      .sp-loading {
        position: relative;
        z-index: 1;
        display: grid;
        min-height: 65vh;
        place-content: center;
        justify-items: center;
        gap: 12px;
        color: #68728a;
        font-size: 12px;
      }

      .sp-spinner {
        animation: sp-spin .9s linear infinite;
      }

      @keyframes sp-spin {
        to { transform: rotate(360deg); }
      }

      .sp-page-error,
      .sp-modal-error {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 13px 15px;
        color: #9c3d3d;
        background: #fff4f3;
        border: 1px solid #f1d5d2;
        border-radius: 11px;
        font-size: 11px;
      }

      .sp-page-error button {
        margin-left: auto;
        color: #8c3939;
        background: transparent;
        border: 0;
        font-weight: 800;
        cursor: pointer;
      }

      /* Modal */

      .sp-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 300;
        display: grid;
        place-items: center;
        overflow-y: auto;
        padding: 22px;
        background: rgba(18,25,44,.62);
        backdrop-filter: blur(8px);
        animation: sp-fade-in .2s ease both;
      }

      .sp-modal {
        width: min(620px, 100%);
        max-height: min(90vh, 850px);
        overflow-y: auto;
        padding: 29px;
        background: #fff;
        border: 1px solid rgba(255,255,255,.8);
        border-radius: 22px;
        box-shadow: 0 25px 90px rgba(12,19,39,.3);
        animation: sp-modal-in .28s cubic-bezier(.2,.8,.2,1) both;
      }

      .sp-modal-header {
        position: relative;
        margin-bottom: 22px;
      }

      .sp-modal-heading-icon {
        display: grid;
        place-items: center;
        width: 45px;
        height: 45px;
        margin-bottom: 15px;
        color: #9b7738;
        background: #fbf4e7;
        border: 1px solid #f0e3c9;
        border-radius: 14px;
      }

      .sp-modal-close {
        position: absolute;
        top: 0;
        right: 0;
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        color: #747d91;
        background: #f5f6f9;
        border: 1px solid #eceef3;
        border-radius: 10px;
        cursor: pointer;
        transition: background .2s ease, transform .2s ease;
      }

      .sp-modal-close:hover {
        background: #eceef5;
        transform: rotate(5deg);
      }

      .sp-modal-close:disabled {
        opacity: .5;
        cursor: not-allowed;
      }

      .sp-modal-header h2 {
        margin: 7px 0;
        color: #202945;
        font-size: 23px;
      }

      .sp-modal-header p {
        margin: 0;
        color: #81899c;
        font-size: 11px;
        line-height: 1.7;
      }

      .sp-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .sp-form-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
        color: #46506b;
        font-size: 10px;
        font-weight: 750;
      }

      .sp-form-field input {
        width: 100%;
        min-width: 0;
        height: 45px;
        padding: 0 13px;
        color: #303a57;
        background: #fbfcff;
        border: 1px solid #e3e7f0;
        border-radius: 10px;
        outline: none;
        font: inherit;
        font-size: 11px;
        font-weight: 500;
        transition: border .2s ease, box-shadow .2s ease, background .2s ease;
      }

      .sp-form-field input:hover {
        border-color: #cbd2e2;
      }

      .sp-form-field input:focus {
        background: #fff;
        border-color: #b89555;
        box-shadow: 0 0 0 3px rgba(193,154,82,.14);
      }

      .sp-password-fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .sp-password-input {
        position: relative;
      }

      .sp-password-input input {
        padding-right: 44px;
      }

      .sp-password-input button {
        position: absolute;
        top: 50%;
        right: 10px;
        display: grid;
        place-items: center;
        padding: 4px;
        color: #858da0;
        background: transparent;
        border: 0;
        transform: translateY(-50%);
        cursor: pointer;
      }

      .sp-password-hint {
        margin: -4px 0 0;
        color: #858da0;
        font-size: 10px;
        line-height: 1.6;
      }

      .sp-modal-error {
        margin-bottom: 17px;
      }

      .sp-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 25px;
        padding-top: 18px;
        border-top: 1px solid #eff0f4;
      }

      .sp-cancel-button {
        padding: 11px 16px;
        color: #626b80;
        background: #f5f6f9;
        border: 1px solid #e8eaf0;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 750;
        cursor: pointer;
        transition: background .2s ease;
      }

      .sp-cancel-button:hover {
        background: #eceef4;
      }

      .sp-submit-button:disabled {
        opacity: .65;
        cursor: wait;
        transform: none;
      }

      /* Success state */

      .sp-success-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 330px;
        padding: 20px 10px;
        text-align: center;
        animation: sp-success-in .3s ease both;
      }

      .sp-success-ring {
        display: grid;
        place-items: center;
        width: 104px;
        height: 104px;
        margin-bottom: 24px;
        background: #eaf7ef;
        border: 1px solid #d5efdf;
        border-radius: 50%;
        animation: sp-ring-pop .45s cubic-bezier(.2,.8,.2,1) both;
      }

      .sp-success-check {
        display: grid;
        place-items: center;
        width: 67px;
        height: 67px;
        color: #fff;
        background: #48a878;
        border-radius: 50%;
        box-shadow: 0 7px 20px rgba(72,168,120,.27);
        animation: sp-check-pop .45s .12s cubic-bezier(.2,.8,.2,1) both;
      }

      .sp-success-content h2 {
        margin: 9px 0 7px;
        color: #202945;
        font-size: 24px;
      }

      .sp-success-content p {
        max-width: 360px;
        margin: 0;
        color: #7e8799;
        font-size: 11px;
        line-height: 1.7;
      }

      .sp-success-progress {
        width: 145px;
        height: 3px;
        margin-top: 25px;
        overflow: hidden;
        background: #edf0f3;
        border-radius: 10px;
      }

      .sp-success-progress span {
        display: block;
        width: 100%;
        height: 100%;
        background: #48a878;
        transform-origin: left;
        animation: sp-progress 1.1s linear both;
      }

      /* Animations */

      @keyframes sp-rise-in {
        from {
          opacity: 0;
          transform: translateY(13px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes sp-card-in {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes sp-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes sp-modal-in {
        from {
          opacity: 0;
          transform: translateY(18px) scale(.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes sp-success-in {
        from {
          opacity: 0;
          transform: scale(.97);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes sp-ring-pop {
        from {
          opacity: 0;
          transform: scale(.65);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes sp-check-pop {
        from {
          opacity: 0;
          transform: scale(.35) rotate(-35deg);
        }
        to {
          opacity: 1;
          transform: scale(1) rotate(0);
        }
      }

      @keyframes sp-progress {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }

      /* Responsive layout */

      @media(max-width: 700px) {
        .sp-page {
          padding: 22px 15px 40px;
        }

        .sp-section {
          padding: 22px 19px;
        }

        .sp-section-heading {
          align-items: flex-start;
          flex-direction: column;
        }

        .sp-identity-card {
          flex-wrap: wrap;
          padding: 19px;
        }

        .sp-verified {
          margin-left: 0;
        }

        .sp-security-card {
          align-items: flex-start;
          flex-wrap: wrap;
          padding: 20px;
        }

        .sp-security-content {
          min-width: calc(100% - 75px);
        }

        .sp-secondary-button {
          margin-left: 70px;
        }
      }

      @media(max-width: 520px) {
        .sp-details-grid,
        .sp-form-grid {
          grid-template-columns: 1fr;
        }

        .sp-detail {
          min-height: 79px;
          padding: 14px;
        }

        .sp-detail-value {
          font-size: 13px;
        }

        .sp-detail-icon {
          width: 43px;
          height: 43px;
        }

        .sp-modal {
          padding: 21px;
        }

        .sp-modal-actions {
          flex-direction: column-reverse;
        }

        .sp-modal-actions button {
          width: 100%;
        }

        .sp-heading {
          align-items: flex-start;
        }

        .sp-heading-icon {
          width: 47px;
          height: 47px;
        }

        .sp-readonly {
          padding: 4px 6px;
          font-size: 8px;
        }

        .sp-identity-text h2 {
          font-size: 18px;
        }
      }

      @media(max-width: 370px) {
        .sp-detail {
          gap: 10px;
          padding: 12px 10px;
        }

        .sp-detail-icon {
          width: 39px;
          height: 39px;
        }

        .sp-readonly {
          display: none;
        }

        .sp-identity-card {
          gap: 12px;
        }
      }

      @media(prefers-reduced-motion: reduce) {
        .sp-page *,
        .sp-page *::before,
        .sp-page *::after {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  );
}