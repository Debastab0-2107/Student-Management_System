
import { Link, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import ProgramsPage from "./pages/programs/ProgramsPage";
import ContactPage from "./pages/contact/ContactPage";

function PortalComingSoon() {
  return (
    <main className="coming-soon-page">
      <div className="coming-soon-card">
        <p className="eyebrow">DPP INSTITUTE OF TECHNOLOGY</p>
        <h1>Portal login is being prepared</h1>
        <p>
          This login page will be implemented in the next development
          stage. Please return to the landing page.
        </p>
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
      <Route path="/login/*" element={<PortalComingSoon />} />
      <Route path="*" element={<LandingPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}
