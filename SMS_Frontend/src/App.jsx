
import { Link, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";
import ProgramsPage from "./pages/programs/ProgramsPage";
import ContactPage from "./pages/contact/ContactPage";
import StudentLogin from "./pages/auth/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";

function PortalComingSoon() {
  return (
    <main className="coming-soon-page">
      <div className="coming-soon-card">
        <p className="eyebrow">DPP INSTITUTE OF TECHNOLOGY</p>
        <h1>Portal login is being prepared</h1>
        <p>This portal will be implemented in a later development stage.</p>
        <Link className="primary-button" to="/">
          Return to Home
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />

      <Route path="/login/admin" element={<PortalComingSoon />} />
      <Route
        path="/login/permanent-faculty"
        element={<PortalComingSoon />}
      />
      <Route
        path="/login/visiting-faculty"
        element={<PortalComingSoon />}
      />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
