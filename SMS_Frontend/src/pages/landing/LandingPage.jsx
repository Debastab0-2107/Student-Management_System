import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Landmark,
  LibraryBig,
  Menu,
  Phone,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import RoleLoginCard from "../../components/landing/RoleLoginCard";

const roles = [
  {
    role: "student",
    title: "Student Portal",
    description:
      "View your profile, academic information, CA marks, and available results.",
    to: "/login/student",
  },
  {
    role: "admin",
    title: "Administrator",
    description: "Access authorized administrative services.",
    to: "/login/admin",
  },
  {
    role: "permanent",
    title: "Permanent Faculty",
    description: "Access assigned subjects and teaching services.",
    to: "/login/permanent-faculty",
  },
  {
    role: "visiting",
    title: "Visiting Faculty",
    description: "Access authorized visiting-faculty services.",
    to: "/login/visiting-faculty",
  },
];

// Illustrative examples only; replace with the institute's actual course list.
const courses = [
  {
    name: "Master of Computer Applications",
    shortName: "MCA",
    description: "Computing, software development, and application design.",
    icon: LibraryBig,
  },
  {
    name: "Computer Science",
    shortName: "CS",
    description: "Programming, algorithms, and computer systems.",
    icon: BookOpen,
  },
  {
    name: "Information Technology",
    shortName: "IT",
    description: "Information systems, digital technologies, and networks.",
    icon: GraduationCap,
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page">
      <div className="top-strip">
        <div className="site-container top-strip-content">
          <span>Student Management System</span>
          <span>Academic Information &amp; Student Services</span>
        </div>
      </div>

      <header className="site-header">
        <div className="site-container header-content">
          <Link to="/" className="brand" onClick={closeMenu}>
            <div className="brand-emblem">
              <Landmark size={28} />
            </div>
            <div className="brand-text">
              <span className="brand-name">DPP Institute of Technology</span>
              <span className="brand-subtitle">Student Management System</span>
            </div>
          </Link>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav
            className={`main-navigation ${menuOpen ? "navigation-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="#home" onClick={closeMenu}>
              Home
            </a>
            <a href="#about" onClick={closeMenu}>
              About
            </a>
            <Link to="/programs" onClick={closeMenu}>Programs
            </Link>
            <a href="#portal" onClick={closeMenu}>
              Portal
            </a>
            <Link
              to="/login/student"
              className="header-login-button"
              onClick={closeMenu}
            >
              Student Login <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-section" id="home">
          <div className="hero-overlay" />
          <div className="site-container hero-content">
            <span className="eyebrow hero-eyebrow">
              LEARNING · KNOWLEDGE · PROGRESS
            </span>

            <h1>
              Excellence in
              <span>
                <strong>Education</strong> &amp; Research
              </span>
            </h1>

            <p className="hero-description">
              Discover academic resources, student services, and convenient
              access to the DPP Institute of Technology Student Management
              System.
            </p>

            <div className="hero-actions">
              <Link to="/programs" className="primary-button">
                <GraduationCap size={19} />
                Explore Programs
              </Link>

              <Link to="/contact" className="secondary-button">
                 <Phone size={17} />
                  Contact Us
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>Academic</strong>
                <span>Resources</span>
              </div>
              <div className="hero-stat">
                <strong>Student</strong>
                <span>Services</span>
              </div>
              <div className="hero-stat">
                <strong>Role-Based</strong>
                <span>Portal Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="welcome-section" id="about">
          <div className="site-container welcome-grid">
            <div className="welcome-copy">
              <span className="eyebrow">ABOUT THE PORTAL</span>
              <h2>
                Your academic journey,
                <span className="heading-accent"> connected.</span>
              </h2>
              <p>
                The Student Management System brings supported academic
                information and student services together in one place.
              </p>
              <p>
                Choose your role to access the services available to you.
                Personal and academic records require authorized sign-in.
              </p>
              <a href="#portal" className="text-link">
                Explore portal access <ArrowRight size={17} />
              </a>
            </div>

            <div className="welcome-visual">
              <div
                className="welcome-image"
                role="img"
                aria-label="College campus building"
              />
              <div className="welcome-image-caption">
                <Landmark size={25} />
                <div>
                  <strong>DPP Institute of Technology</strong>
                  <span>Student Management System</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="programs-section" id="programs">
          <div className="site-container">
            <div className="section-heading">
              <span className="eyebrow">PROGRAMS &amp; STUDY</span>
              <h2>Explore Our Programs</h2>
              <p>
                Explore these illustrative course categories. The institute's
                verified course list can be added later.
              </p>
            </div>

            <div className="course-grid">
              {courses.map((course) => {
                const Icon = course.icon;

                return (
                  <article className="course-card" key={course.shortName}>
                    <div className="course-card-top">
                      <div className="academic-icon">
                        <Icon size={27} />
                      </div>
                      <span className="course-code">{course.shortName}</span>
                    </div>

                    <h3>{course.name}</h3>
                    <p>{course.description}</p>

                    <a href="#portal" className="course-link">
                      Portal access <ArrowRight size={17} />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Academic highlights */}
        <section className="academics-section" id="academics">
          <div className="site-container">
            <div className="section-heading">
              <span className="eyebrow">ACADEMIC SERVICES</span>
              <h2>Information That Matters</h2>
              <p>
                Access information according to your account and authorized
                permissions.
              </p>
            </div>

            <div className="academic-grid">
              <article className="academic-card">
                <div className="academic-icon">
                  <GraduationCap size={27} />
                </div>
                <h3>Student Information</h3>
                <p>
                  View your profile and available course and semester
                  information.
                </p>
              </article>
              <article className="academic-card">
                <div className="academic-icon">
                  <BookOpen size={27} />
                </div>
                <h3>Academic Performance</h3>
                <p>
                  View CA marks and academic records when available in the
                  system.
                </p>
              </article>
              <article className="academic-card">
                <div className="academic-icon">
                  <LibraryBig size={27} />
                </div>
                <h3>Academic Resources</h3>
                <p>
                  Access relevant academic and teaching information for your
                  role.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Role-based login */}
        <section className="portal-section" id="portal">
          <div className="site-container">
            <div className="section-heading portal-heading">
              <span className="eyebrow">PORTAL ACCESS</span>
              <h2>Select Your Login Portal</h2>
              <p>Choose the option that matches your role at the institute.</p>
            </div>

            <div className="role-grid">
              {roles.map((role) => (
                <RoleLoginCard key={role.role} {...role} />
              ))}
            </div>

            <p className="portal-security-note">
              Access to records and services is subject to authorization.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="site-container footer-content">
          <div className="footer-brand">
            <Landmark size={24} />
            <div>
              <strong>DPP Institute of Technology</strong>
              <span>Student Management System</span>
            </div>
          </div>

          <p>
            © {new Date().getFullYear()} DPP Institute of Technology. All rights
            reserved.
          </p>
          <a href="#home" className="footer-top-link">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
