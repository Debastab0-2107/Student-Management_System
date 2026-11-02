import { Route, Routes } from "react-router-dom";

// Public pages
import LandingPage from "./pages/landing/LandingPage";
import ProgramsPage from "./pages/programs/ProgramsPage";
import ContactPage from "./pages/contact/ContactPage";

// Login pages
import StudentLogin from "./pages/auth/StudentLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import PermanentFacultyLogin from "./pages/auth/PermanentFacultyLogin";
import VisitingFacultyLogin from "./pages/auth/VisitingFacultyLogin";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentFeaturePage from "./pages/student/StudentFeaturePage";
import StudentProfile from "./pages/student/StudentProfile";
import ClassRoutine from "./pages/student/ClassRoutine";
import CourseOverview from "./pages/student/CourseOverview";
import Announcements from "./pages/student/Announcements";
import StudentLayout from "./components/layout/StudentLayout";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacultyManagement from "./pages/admin/FacultyManagement";
import AdminChangePassword from "./pages/admin/AdminChangePassword";
import AdminSectionPlaceholder from "./pages/admin/AdminSectionPlaceholder";

// Admin Student Management pages
import StudentManagement, {
  StudentList
} from "./pages/admin/StudentManagement";

export default function App() {
  return (
    <Routes>

      {/* ================= PUBLIC PAGES ================= */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/programs" element={<ProgramsPage />} />

      <Route path="/contact" element={<ContactPage />} />


      {/* ================= LOGIN PAGES ================= */}

      <Route
        path="/login/student"
        element={<StudentLogin />}
      />

      <Route
        path="/login/admin"
        element={<AdminLogin />}
      />

      <Route
        path="/login/permanent-faculty"
        element={<PermanentFacultyLogin />}
      />

      <Route
        path="/login/visiting-faculty"
        element={<VisitingFacultyLogin />}
      />


      {/* ================= STUDENT SECTION ================= */}

      <Route
        path="/student"
        element={<StudentLayout />}
      >

        {/* Student Dashboard */}
        <Route
          path="dashboard"
          element={<StudentDashboard />}
        />

        {/* Student Profile */}
        <Route
          path="profile"
          element={<StudentProfile />}
        />

        {/* Class Routine */}
        <Route
          path="routine"
          element={<ClassRoutine />}
        />

        {/* Course Overview */}
        <Route
          path="course-overview"
          element={<CourseOverview />}
        />

        {/* Announcements - support both existing URL patterns */}
        <Route
          path="announcements"
          element={<Announcements />}
        />

        <Route
          path="notices"
          element={<Announcements />}
        />

        {/* Other Student Features */}
        <Route
          path=":feature"
          element={<StudentFeaturePage />}
        />

      </Route>


      {/* ================= ADMIN SECTION ================= */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        {/* Admin Dashboard */}
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        {/* Student Operations Workspace */}
        <Route
          path="students"
          element={<StudentManagement />}
        />

        {/* Student Directory */}
        <Route
          path="students/list"
          element={<StudentList />}
        />

        {/* Faculty Management */}
        <Route
          path="faculty"
          element={<FacultyManagement />}
        />

        {/* Admin Password */}
        <Route
          path="password"
          element={<AdminChangePassword />}
        />

        {/* Course Section */}
        <Route
          path="course"
          element={<AdminSectionPlaceholder type="course" />}
        />

      </Route>


      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<LandingPage />}
      />

    </Routes>
  );
}
