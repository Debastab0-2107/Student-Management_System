import { Route, Routes } from "react-router-dom";

// PUBLIC PAGES
import LandingPage from "./pages/landing/LandingPage";
import ProgramsPage from "./pages/programs/ProgramsPage";
import ContactPage from "./pages/contact/ContactPage";

// LOGIN PAGES
import StudentLogin from "./pages/auth/StudentLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import FacultyLogin from "./pages/auth/FacultyLogin";

// STUDENT PAGES
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentFeaturePage from "./pages/student/StudentFeaturePage";
import StudentProfile from "./pages/student/StudentProfile";
import ClassRoutine from "./pages/student/ClassRoutine";
import CourseOverview from "./pages/student/CourseOverview";
import Announcements from "./pages/student/Announcements";
import StudentLayout from "./components/layout/StudentLayout";

// ADMIN PAGES
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacultyManagement from "./pages/admin/FacultyManagement";
import AdminChangePassword from "./pages/admin/AdminChangePassword";
import AdminSectionPlaceholder from "./pages/admin/AdminSectionPlaceholder";
import SubjectManagement from "./pages/admin/SubjectManagement";
import StudentManagement, {
  StudentList,
} from "./pages/admin/StudentManagement";

// FACULTY PAGES
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyProfile from "./pages/faculty/FacultyProfile";
import FacultyNotices from "./pages/faculty/FacultyNotices";
import FacultyRoutine from "./pages/faculty/FacultyRoutine";
import FacultyStudents from "./pages/faculty/FacultyStudents";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* LOGIN */}
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/faculty" element={<FacultyLogin />} />

      {/* STUDENT */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="routine" element={<ClassRoutine />} />
        <Route path="course-overview" element={<CourseOverview />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="notices" element={<Announcements />} />
        <Route path=":feature" element={<StudentFeaturePage />} />
      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="students/list" element={<StudentList />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="password" element={<AdminChangePassword />} />
        <Route path="subjects" element={<SubjectManagement />} />
        <Route
          path="university"
          element={<AdminSectionPlaceholder type="university" />}
        />
      </Route>

      {/* PERMANENT FACULTY */}
      <Route path="/faculty/permanent/dashboard" element={<FacultyDashboard />} />
      <Route path="/faculty/permanent/profile" element={<FacultyProfile />} />
      <Route path="/faculty/permanent/notices" element={<FacultyNotices />} />
      <Route path="/faculty/permanent/routine" element={<FacultyRoutine />} />
      <Route path="/faculty/permanent/students" element={<FacultyStudents />}/>

      {/* VISITING FACULTY */}
      <Route path="/faculty/visiting/dashboard" element={<FacultyDashboard />} />
      <Route path="/faculty/visiting/profile" element={<FacultyProfile />} />
      <Route path="/faculty/visiting/notices" element={<FacultyNotices />} />
      <Route path="/faculty/visiting/routine" element={<FacultyRoutine />} />

      {/* FALLBACK */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}