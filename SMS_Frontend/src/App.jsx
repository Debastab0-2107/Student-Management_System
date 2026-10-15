
import { Route, Routes } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";
import ProgramsPage from "./pages/programs/ProgramsPage";
import ContactPage from "./pages/contact/ContactPage";

import StudentLogin from "./pages/auth/StudentLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import PermanentFacultyLogin from "./pages/auth/PermanentFacultyLogin";
import VisitingFacultyLogin from "./pages/auth/VisitingFacultyLogin";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentFeaturePage from "./pages/student/StudentFeaturePage";
import ClassRoutine from "./pages/student/ClassRoutine";
import StudentLayout from "./components/layout/StudentLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />

      <Route
        path="/login/permanent-faculty"
        element={<PermanentFacultyLogin />}
      />

      <Route
        path="/login/visiting-faculty"
        element={<VisitingFacultyLogin />}
      />

      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="routine" element={<ClassRoutine />} />
        <Route path=":feature" element={<StudentFeaturePage />} />
      </Route>

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
