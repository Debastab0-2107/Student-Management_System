import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  LibraryBig,
  Landmark,
} from "lucide-react";

const courses = [
  {
    code: "MCA",
    name: "Master of Computer Applications",
    duration: "Duration to be confirmed",
    description:
      "Explore computing, software development, database systems, and application design.",
    icon: LibraryBig,
  },
  {
    code: "CS",
    name: "Computer Science",
    duration: "Duration to be confirmed",
    description:
      "Explore programming, algorithms, computer systems, and software technologies.",
    icon: BookOpen,
  },
  {
    code: "IT",
    name: "Information Technology",
    duration: "Duration to be confirmed",
    description:
      "Explore information systems, networking, and digital technologies.",
    icon: GraduationCap,
  },
];

export default function ProgramsPage() {
  return (
    <div className="programs-page">
      <header className="programs-header">
        <div className="programs-header-inner">
          <Link to="/" className="programs-brand" aria-label="DPP Institute home">
            <span className="programs-brand-icon">
              <Landmark size={23} />
            </span>
            <span>
              <strong>DPP Institute of Technology</strong>
              <small>Student Management System</small>
            </span>
          </Link>

          <Link to="/" className="programs-home-link">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      <main>
        <section className="programs-hero">
          <div className="programs-hero-inner">
            <span className="programs-eyebrow">ACADEMIC INFORMATION</span>
            <h1>Find Your Path to What’s Next</h1>
            <p>
              Explore study areas and academic resources from one place.
              Official course details can be added when verified institute
              information is available.
            </p>

            <div className="programs-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span aria-current="page">Programs</span>
            </div>
          </div>
        </section>

        <section className="program-catalog">
          <div className="program-catalog-heading">
            <div>
              <span className="programs-eyebrow">COURSE CATALOGUE</span>
              <h2>Explore Our Study Areas</h2>
              <p>
                These are illustrative categories, not a verified list of
                institute offerings.
              </p>
            </div>
            <span className="catalog-count">{courses.length} examples</span>
          </div>

          <div className="program-cards">
            {courses.map((course) => {
              const Icon = course.icon;

              return (
                <article className="program-course-card" key={course.code}>
                  <div className="program-course-top">
                    <span className="program-course-icon">
                      <Icon size={23} />
                    </span>
                    <span className="program-course-code">{course.code}</span>
                  </div>

                  <h3>{course.name}</h3>
                  <p className="program-course-description">
                    {course.description}
                  </p>

                  <div className="program-course-duration">{course.duration}</div>

                  <div className="program-course-footer">
                    <span>Academic program</span>
                    <ArrowRight size={17} />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="programs-notice">
            <BookOpen size={20} />
            <p>
              The final course list, duration, and eligibility details should
              be populated from verified institute information or the backend
              when that data is available.
            </p>
          </div>
        </section>
      </main>

      <footer className="programs-footer">
        <span>DPP Institute of Technology</span>
        <Link to="/">Return to landing page</Link>
      </footer>
    </div>
  );
}
