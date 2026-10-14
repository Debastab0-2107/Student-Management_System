import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  LibraryBig,
  Brain,
  Cloud,
  Code,
  BarChart3,
  Zap,
  Cpu,
  Database,
  ShieldCheck,
  Globe,
  Smartphone,
  Network,
  Info,
} from "lucide-react";

const courses = [
  {
    code: "MCA",
    name: "Master of Computer Applications",
    duration: "2 Years",
    description:
      "Explore advanced computing, software development, database systems, and application design.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    icon: LibraryBig,
  },
  {
    code: "CSE",
    name: "Computer Science Engineering",
    duration: "4 Years",
    description:
      "Learn programming, algorithms, computer architecture, operating systems, and software engineering.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
    icon: BookOpen,
  },
  {
    code: "IT",
    name: "Information Technology",
    duration: "4 Years",
    description:
      "Focus on software engineering, web technologies, cloud computing, and information security.",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=85",
    icon: Cloud,
  },
  {
    code: "CSE-AIML",
    name: "CSE (Artificial Intelligence & Machine Learning)",
    duration: "4 Years",
    description:
      "Explore machine learning, neural networks, deep learning, and intelligent applications.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85",
    icon: Brain,
  },
  {
    code: "BCA",
    name: "Bachelor of Computer Applications",
    duration: "3 Years",
    description:
      "Learn programming fundamentals, database management, web development, and computer applications.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
    icon: Code,
  },
  {
    code: "CSE-DS",
    name: "CSE (Data Science)",
    duration: "4 Years",
    description:
      "Study statistics, data analysis, data mining, big data technologies, and predictive modelling.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
    icon: BarChart3,
  },
  {
    code: "EE",
    name: "Electrical Engineering",
    duration: "4 Years",
    description:
      "Explore electrical circuits, power systems, control engineering, and renewable energy technologies.",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85",
    icon: Zap,
  },
  {
    code: "ECE",
    name: "Electronics & Communication Engineering",
    duration: "4 Years",
    description:
      "Study electronic circuits, communication systems, embedded devices, and digital signal processing.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85",
    icon: Cpu,
  },
  {
    code: "DS",
    name: "Data Science",
    duration: "3–4 Years",
    description:
      "Discover data preparation, statistical analysis, visualisation, and data-driven decision-making.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
    icon: Database,
  },
  {
    code: "CYBER",
    name: "Cybersecurity",
    duration: "3–4 Years",
    description:
      "Learn about network security, threat detection, secure systems, and digital risk management.",
    image:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=900&q=85",
    icon: ShieldCheck,
  },
  {
    code: "WEB",
    name: "Web Development",
    duration: "Course-dependent",
    description:
      "Build modern websites and applications using frontend, backend, and database technologies.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
    icon: Globe,
  },
  {
    code: "APP",
    name: "Mobile Application Development",
    duration: "Course-dependent",
    description:
      "Explore mobile interfaces, application architecture, API integration, and cross-platform development.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=85",
    icon: Smartphone,
  },
  {
    code: "CLOUD",
    name: "Cloud Computing",
    duration: "Course-dependent",
    description:
      "Understand cloud platforms, virtualisation, distributed systems, and scalable deployment.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85",
    icon: Cloud,
  },
  {
    code: "DBMS",
    name: "Database Management",
    duration: "Course-dependent",
    description:
      "Learn database design, SQL, data integrity, transaction processing, and database administration.",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=85",
    icon: Database,
  },
  {
    code: "NET",
    name: "Computer Networks",
    duration: "Course-dependent",
    description:
      "Explore network architecture, communication protocols, routing, connectivity, and network services.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85",
    icon: Network,
  },
];

function CourseCard({ course }) {
  const CourseIcon = course.icon;

  return (
    <article className="program-course-card">
      <div
        className="program-course-top"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(29, 33, 57, 0.35), rgba(29, 33, 57, 0.02)), url("${course.image}")`,
        }}
      >
        <span className="program-course-icon" aria-hidden="true">
          <CourseIcon size={21} />
        </span>

        <span className="program-course-code">{course.code}</span>
      </div>

      <div className="program-course-body">
        <h3>{course.name}</h3>
        <p className="program-course-description">{course.description}</p>

        <div className="program-course-duration">
          {course.duration}
        </div>

        <div className="program-course-footer">
          <span>Academic program</span>
          <ArrowRight size={17} aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}

export default function ProgramsPage() {
  return (
    <div className="programs-page">
      <header className="programs-header">
        <div className="programs-header-inner">
          <Link to="/" className="programs-brand">
            <span className="programs-brand-icon">
              <GraduationCap size={23} />
            </span>

            <span>
              <strong>DPP Institute of Technology</strong>
              <small>Learning • Innovation • Excellence</small>
            </span>
          </Link>

          <Link to="/" className="programs-home-link">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      <section className="programs-hero">
        <div className="programs-hero-inner">
          <span className="programs-eyebrow">ACADEMIC EXCELLENCE</span>

          <h1>Discover Your Future</h1>

          <p>
            Explore computing, engineering, and technology study areas.
            Find a subject that matches your interests and career goals.
          </p>

          <div className="programs-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Programs</span>
          </div>
        </div>
      </section>

      <main className="program-catalog">
        <div className="program-catalog-heading">
          <div>
            <span className="programs-eyebrow">COURSE CATALOGUE</span>
            <h2>Explore Our Study Areas</h2>
            <p>
              Browse 15 illustrative study areas. Confirm actual courses
              and durations with the institute before making a decision.
            </p>
          </div>

          <span className="catalog-count">
            {courses.length} examples
          </span>
        </div>

        <div className="program-cards">
          {courses.map((course) => (
            <CourseCard key={course.code} course={course} />
          ))}
        </div>

        <aside className="programs-notice">
          <Info size={20} />
          <p>
            <strong>Important:</strong> These entries demonstrate the course
            catalogue layout. They are not a verified list of DPP Institute
            of Technology offerings. Course names, availability, and durations
            should be confirmed with the institute.
          </p>
        </aside>
      </main>

      <footer className="programs-footer">
        <span>© {new Date().getFullYear()} DPP Institute of Technology</span>
        <Link to="/">Return to Home</Link>
      </footer>
    </div>
  );
}
