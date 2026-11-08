
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
import SubjectManagement from "./pages/admin/SubjectManagement";

// Admin Student Management
import StudentManagement, {
  StudentList,
} from "./pages/admin/StudentManagement";

export default function App() {
  return (

    
    <Routes>
      {/* PUBLIC PAGES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* LOGIN PAGES */}
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



      {/* STUDENT SECTION */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="routine" element={<ClassRoutine />} />
        <Route path="course-overview" element={<CourseOverview />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="notices" element={<Announcements />} />
        <Route path=":feature" element={<StudentFeaturePage />} />
      </Route>



      {/* ADMIN SECTION */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Student Management */}
        <Route path="students" element={<StudentManagement />} />
        <Route path="students/list" element={<StudentList />} />

        {/* Faculty Management */}
        <Route path="faculty" element={<FacultyManagement />} />

        {/* Admin Password */}
        <Route path="password" element={<AdminChangePassword />} />

        {/* Subject Management */}
        <Route path="subjects" element={<SubjectManagement />} />

        {/* University Details - backend not ready yet */}
        <Route
          path="university"
          element={<AdminSectionPlaceholder type="university" />}
        />
      </Route>



      {/* FALLBACK */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
