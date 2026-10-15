import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  BookOpen,
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
  Search,
  X,
  Clock3,
  Compass,
  Sparkles,
  SlidersHorizontal,
  Info,
  ChevronRight,
  CheckCircle2,
  Building2,
} from "lucide-react";

const courses = [
  {
    code: "MCA",
    name: "Master of Computer Applications",
    duration: "2 Years",
    category: "Computing",
    type: "Postgraduate",
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
    category: "Engineering",
    type: "Undergraduate",
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
    category: "Engineering",
    type: "Undergraduate",
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
    category: "Computing",
    type: "Undergraduate",
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
    category: "Computing",
    type: "Undergraduate",
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
    category: "Computing",
    type: "Undergraduate",
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
    category: "Engineering",
    type: "Undergraduate",
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
    category: "Engineering",
    type: "Undergraduate",
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
    category: "Computing",
    type: "Specialisation",
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
    category: "Computing",
    type: "Specialisation",
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
    category: "Technology",
    type: "Specialisation",
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
    category: "Technology",
    type: "Specialisation",
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
    category: "Technology",
    type: "Specialisation",
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
    category: "Technology",
    type: "Specialisation",
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
    category: "Technology",
    type: "Specialisation",
    description:
      "Explore network architecture, communication protocols, routing, connectivity, and network services.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85",
    icon: Network,
  },
];

const categories = [
  "All Areas",
  "Computing",
  "Engineering",
  "Technology",
];

function SectionLabel({ children, light = false }) {
  return (
    <div className={`pg-section-label${light ? " pg-section-label-light" : ""}`}>
      <span className="pg-label-line" />
      <span>{children}</span>
    </div>
  );
}

function CourseCard({ course, index }) {
  const CourseIcon = course.icon;

  return (
    <article className="pg-course-card">
      <div
        className="pg-course-image"
        style={{ backgroundImage: `url("${course.image}")` }}
      >
        <div className="pg-course-image-overlay" />

        <div className="pg-course-image-top">
          <span className="pg-course-icon">
            <CourseIcon />
          </span>

          <span className="pg-course-code">{course.code}</span>
        </div>

        <span className="pg-course-index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="pg-course-body">
        <div className="pg-course-tags">
          <span className="pg-course-category">{course.category}</span>
          <span className="pg-course-type">{course.type}</span>
        </div>

        <h3>{course.name}</h3>

        <p className="pg-course-description">{course.description}</p>

        <div className="pg-course-duration">
          <Clock3 />
          <span>{course.duration}</span>
        </div>

        <div className="pg-course-footer">
          <span>Explore study area</span>
          <span className="pg-course-arrow">
            <ArrowRight />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Areas");

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        activeCategory === "All Areas" ||
        course.category === activeCategory;

      const searchableText = [
        course.name,
        course.code,
        course.description,
        course.category,
        course.type,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All Areas");
  };

  return (
    <div className="pg-page">
      <style>{`
        :root {
          --pg-navy: var(--navy, #292e4d);
          --pg-navy-dark: var(--navy-dark, #191d35);
          --pg-navy-light: var(--navy-light, #3b4266);
          --pg-gold: var(--gold, #c8a66a);
          --pg-gold-light: var(--gold-light, #ead9b3);
          --pg-white: var(--white, #ffffff);
          --pg-background: var(--background, #f7f7f9);
          --pg-text: var(--text, #292e3c);
          --pg-muted: var(--muted, #74798a);
          --pg-border: var(--border, #e5e6ec);
        }

        .pg-page {
          min-height: 100vh;
          overflow: hidden;
          color: var(--pg-text);
          background: white;
          font-family: inherit;
        }

        .pg-page *,
        .pg-page *::before,
        .pg-page *::after {
          box-sizing: border-box;
        }

        .pg-page a {
          color: inherit;
          text-decoration: none;
        }

        .pg-container {
          width: min(1160px, calc(100% - 48px));
          margin: 0 auto;
        }

        .pg-utility {
          min-height: 36px;
          display: flex;
          align-items: center;
          background: var(--pg-navy-dark);
          color: rgba(255, 255, 255, 0.76);
          font-size: 10px;
          letter-spacing: 0.04em;
        }

        .pg-utility-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .pg-utility-left,
        .pg-utility-right {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .pg-utility-dot {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--pg-gold);
        }

        .pg-utility-right {
          color: var(--pg-gold-light);
        }

        .pg-utility-right svg {
          width: 13px;
          height: 13px;
        }

        .pg-navbar {
          position: relative;
          z-index: 5;
          border-bottom: 1px solid var(--pg-border);
          background: white;
        }

        .pg-nav-inner {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .pg-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .pg-brand-mark {
          width: 47px;
          height: 47px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 13px 13px 13px 4px;
          color: var(--pg-gold-light);
          background: var(--pg-navy);
        }

        .pg-brand-mark svg {
          width: 25px;
          height: 25px;
        }

        .pg-brand-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pg-brand-name {
          color: var(--pg-navy);
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.2;
        }

        .pg-brand-subtitle {
          color: var(--pg-muted);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .pg-nav-links {
          display: flex;
          align-items: center;
          gap: 29px;
        }

        .pg-nav-link {
          color: #5e6272 !important;
          font-size: 12px;
          font-weight: 650;
          transition: color 0.2s ease;
        }

        .pg-nav-link:hover,
        .pg-nav-link-active {
          color: var(--pg-navy) !important;
        }

        .pg-nav-cta {
          min-height: 43px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 16px;
          border: 1px solid var(--pg-navy);
          border-radius: 5px;
          background: var(--pg-navy);
          color: white !important;
          font-size: 11px;
          font-weight: 750;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .pg-nav-cta:hover {
          background: var(--pg-navy-light);
          transform: translateY(-1px);
        }

        .pg-nav-cta svg {
          width: 15px;
          height: 15px;
        }

        .pg-hero {
          position: relative;
          padding: 69px 0 62px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 85% 10%, rgba(200, 166, 106, 0.15), transparent 31%),
            linear-gradient(115deg, #fbfaf7 0%, #ffffff 55%, #f5f4f0 100%);
        }

        .pg-hero::before {
          position: absolute;
          top: 0;
          right: 0;
          width: 39%;
          height: 100%;
          background-image: radial-gradient(rgba(41, 46, 77, 0.1) 0.8px, transparent 0.8px);
          background-size: 15px 15px;
          content: "";
          opacity: 0.45;
          pointer-events: none;
          mask-image: linear-gradient(to left, black, transparent);
        }

        .pg-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(270px, 0.7fr);
          align-items: center;
          gap: 60px;
        }

        .pg-hero-copy {
          max-width: 690px;
        }

        .pg-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
          color: var(--pg-navy);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .pg-eyebrow-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(200, 166, 106, 0.65);
          border-radius: 50%;
          color: #98743d;
          background: rgba(200, 166, 106, 0.12);
        }

        .pg-eyebrow-icon svg {
          width: 14px;
          height: 14px;
        }

        .pg-hero h1 {
          margin: 0;
          color: var(--pg-navy-dark);
          font-size: clamp(43px, 5.3vw, 67px);
          font-weight: 800;
          letter-spacing: -0.065em;
          line-height: 1.04;
        }

        .pg-hero h1 em {
          color: #a27c42;
          font-style: normal;
        }

        .pg-hero-description {
          max-width: 580px;
          margin: 23px 0 0;
          color: #696e7e;
          font-size: 14px;
          line-height: 1.95;
        }

        .pg-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 29px;
          color: #85899a;
          font-size: 11px;
        }

        .pg-breadcrumb a {
          color: var(--pg-navy);
          font-weight: 750;
        }

        .pg-breadcrumb svg {
          width: 13px;
          height: 13px;
        }

        .pg-hero-card {
          position: relative;
          padding: 27px;
          border: 1px solid rgba(41, 46, 77, 0.09);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 20px 55px rgba(25, 29, 53, 0.09);
        }

        .pg-hero-card::before {
          position: absolute;
          top: -6px;
          left: 25px;
          width: 55px;
          height: 4px;
          border-radius: 5px;
          background: var(--pg-gold);
          content: "";
        }

        .pg-hero-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 22px;
        }

        .pg-hero-card-top small {
          display: block;
          margin-bottom: 7px;
          color: #9b7944;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .pg-hero-card-top h2 {
          margin: 0;
          color: var(--pg-navy);
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .pg-hero-card-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 8px;
          background: #f3efe6;
          color: #92703a;
        }

        .pg-hero-card-icon svg {
          width: 21px;
          height: 21px;
        }

        .pg-hero-stat {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 0;
          border-top: 1px solid #ececf1;
        }

        .pg-hero-stat-icon {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 7px;
          background: #f1f1f6;
          color: var(--pg-navy);
        }

        .pg-hero-stat-icon svg {
          width: 19px;
          height: 19px;
        }

        .pg-hero-stat-copy strong {
          display: block;
          color: var(--pg-navy);
          font-size: 12px;
          font-weight: 800;
        }

        .pg-hero-stat-copy span {
          display: block;
          margin-top: 4px;
          color: var(--pg-muted);
          font-size: 10px;
          line-height: 1.5;
        }

        .pg-hero-card-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 8px;
          padding: 12px;
          border-radius: 5px;
          background: #faf7f0;
          color: #7d6a4b;
          font-size: 10px;
          line-height: 1.7;
        }

        .pg-hero-card-note svg {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .pg-highlights {
          background: var(--pg-navy);
          color: white;
        }

        .pg-highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .pg-highlight {
          min-height: 98px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 21px 25px;
          border-right: 1px solid rgba(255, 255, 255, 0.12);
        }

        .pg-highlight:first-child {
          padding-left: 0;
        }

        .pg-highlight:last-child {
          border-right: 0;
        }

        .pg-highlight-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(234, 217, 179, 0.32);
          border-radius: 7px;
          background: rgba(234, 217, 179, 0.09);
          color: var(--pg-gold-light);
        }

        .pg-highlight-icon svg {
          width: 20px;
          height: 20px;
        }

        .pg-highlight-copy strong {
          display: block;
          color: white;
          font-size: 12px;
          font-weight: 750;
        }

        .pg-highlight-copy span {
          display: block;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.61);
          font-size: 10px;
          line-height: 1.5;
        }

        .pg-section {
          padding: 78px 0;
        }

        .pg-section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          color: #9a7944;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .pg-label-line {
          width: 28px;
          height: 2px;
          flex-shrink: 0;
          background: var(--pg-gold);
        }

        .pg-section-label-light {
          color: var(--pg-gold-light);
        }

        .pg-section-heading {
          margin: 0;
          color: var(--pg-navy-dark);
          font-size: clamp(29px, 3.5vw, 42px);
          font-weight: 800;
          letter-spacing: -0.055em;
          line-height: 1.15;
        }

        .pg-section-heading em {
          color: #a27c42;
          font-style: normal;
        }

        .pg-section-description {
          max-width: 570px;
          margin: 15px 0 0;
          color: var(--pg-muted);
          font-size: 12px;
          line-height: 1.9;
        }

        .pg-catalog-section {
          padding: 78px 0 88px;
          background: var(--pg-background);
        }

        .pg-catalog-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 29px;
        }

        .pg-catalog-heading .pg-section-description {
          max-width: 470px;
        }

        .pg-result-count {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          padding: 10px 13px;
          border: 1px solid #e3e4eb;
          border-radius: 5px;
          background: white;
          color: var(--pg-navy);
          font-size: 11px;
          font-weight: 800;
        }

        .pg-result-count svg {
          width: 15px;
          height: 15px;
          color: #a17d42;
        }

        .pg-filter-panel {
          margin-bottom: 28px;
          padding: 20px;
          border: 1px solid #e5e6ec;
          border-radius: 8px;
          background: white;
        }

        .pg-filter-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 16px;
        }

        .pg-filter-title {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--pg-navy);
          font-size: 12px;
          font-weight: 800;
        }

        .pg-filter-title svg {
          width: 16px;
          height: 16px;
          color: #9a7944;
        }

        .pg-clear-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 0;
          border: 0;
          background: transparent;
          color: #777c8c;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .pg-clear-button:hover {
          color: var(--pg-navy);
        }

        .pg-clear-button svg {
          width: 14px;
          height: 14px;
        }

        .pg-filter-controls {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .pg-search-wrap {
          position: relative;
          min-width: 220px;
          flex: 1;
        }

        .pg-search-icon {
          position: absolute;
          top: 50%;
          left: 14px;
          width: 17px;
          height: 17px;
          color: #85899a;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .pg-search-input {
          width: 100%;
          height: 45px;
          padding: 0 42px 0 42px;
          border: 1px solid #e0e2e9;
          border-radius: 5px;
          outline: none;
          background: #fff;
          color: var(--pg-text);
          font-family: inherit;
          font-size: 12px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .pg-search-input::placeholder {
          color: #a0a3b0;
        }

        .pg-search-input:focus {
          border-color: var(--pg-gold);
          box-shadow: 0 0 0 3px rgba(200, 166, 106, 0.13);
        }

        .pg-search-clear {
          position: absolute;
          top: 50%;
          right: 10px;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: #f1f1f5;
          color: #6d7180;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .pg-search-clear svg {
          width: 14px;
          height: 14px;
        }

        .pg-category-filters {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pg-filter-chip {
          min-height: 39px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 13px;
          border: 1px solid #e3e4ea;
          border-radius: 5px;
          background: white;
          color: #626779;
          font-family: inherit;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .pg-filter-chip:hover {
          border-color: var(--pg-gold);
          color: var(--pg-navy);
        }

        .pg-filter-chip-active {
          border-color: var(--pg-navy);
          background: var(--pg-navy);
          color: white;
        }

        .pg-filter-chip-active:hover {
          border-color: var(--pg-navy);
          background: var(--pg-navy-light);
          color: white;
        }

        .pg-filter-chip-count {
          min-width: 19px;
          height: 19px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border-radius: 4px;
          background: rgba(41, 46, 77, 0.07);
          font-size: 9px;
        }

        .pg-filter-chip-active .pg-filter-chip-count {
          background: rgba(255, 255, 255, 0.16);
          color: white;
        }

        .pg-catalog-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin: 0 0 17px;
          color: var(--pg-muted);
          font-size: 11px;
        }

        .pg-catalog-meta strong {
          color: var(--pg-navy);
          font-weight: 800;
        }

        .pg-catalog-meta-note {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .pg-catalog-meta-note svg {
          width: 14px;
          height: 14px;
          color: #9a7944;
        }

        .pg-course-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .pg-course-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e5e6eb;
          border-radius: 8px;
          background: white;
          transition:
            transform 0.23s ease,
            border-color 0.23s ease,
            box-shadow 0.23s ease;
        }

        .pg-course-card:hover {
          transform: translateY(-5px);
          border-color: rgba(200, 166, 106, 0.8);
          box-shadow: 0 16px 34px rgba(25, 29, 53, 0.09);
        }

        .pg-course-image {
          position: relative;
          height: 180px;
          overflow: hidden;
          background-color: #e6e7ed;
          background-position: center;
          background-size: cover;
          transition: background-size 0.3s ease;
        }

        .pg-course-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(25, 29, 53, 0.35) 0%,
            rgba(25, 29, 53, 0.02) 40%,
            rgba(25, 29, 53, 0.38) 100%
          );
        }

        .pg-course-image-top {
          position: absolute;
          top: 16px;
          right: 16px;
          left: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .pg-course-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 7px;
          background: rgba(25, 29, 53, 0.76);
          color: var(--pg-gold-light);
          backdrop-filter: blur(7px);
        }

        .pg-course-icon svg {
          width: 20px;
          height: 20px;
        }

        .pg-course-code {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 29px;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 4px;
          background: rgba(25, 29, 53, 0.74);
          color: white;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.07em;
          backdrop-filter: blur(7px);
        }

        .pg-course-index {
          position: absolute;
          right: 16px;
          bottom: 12px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .pg-course-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 21px;
        }

        .pg-course-tags {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 13px;
        }

        .pg-course-category,
        .pg-course-type {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 750;
        }

        .pg-course-category {
          background: #f2efe7;
          color: #8e6e39;
        }

        .pg-course-type {
          border: 1px solid #e7e8ed;
          background: white;
          color: #737889;
        }

        .pg-course-body h3 {
          min-height: 45px;
          margin: 0;
          color: var(--pg-navy);
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.5;
        }

        .pg-course-description {
          min-height: 66px;
          margin: 11px 0 17px;
          color: var(--pg-muted);
          font-size: 11px;
          line-height: 1.85;
        }

        .pg-course-duration {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 0;
          border-top: 1px solid #eeeeF2;
          color: #5f6475;
          font-size: 10px;
          font-weight: 700;
        }

        .pg-course-duration svg {
          width: 15px;
          height: 15px;
          color: #9a7944;
        }

        .pg-course-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 13px;
          border-top: 1px solid #eeeeF2;
          color: var(--pg-navy);
          font-size: 10px;
          font-weight: 800;
        }

        .pg-course-arrow {
          width: 29px;
          height: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e6ec;
          border-radius: 50%;
          color: #9a7944;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .pg-course-arrow svg {
          width: 15px;
          height: 15px;
        }

        .pg-course-card:hover .pg-course-arrow {
          transform: translateX(2px);
          border-color: var(--pg-navy);
          background: var(--pg-navy);
          color: white;
        }

        .pg-empty-state {
          grid-column: 1 / -1;
          padding: 54px 24px;
          border: 1px dashed #d8dae3;
          border-radius: 8px;
          background: white;
          text-align: center;
        }

        .pg-empty-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: #f0f1f6;
          color: var(--pg-navy);
        }

        .pg-empty-icon svg {
          width: 23px;
          height: 23px;
        }

        .pg-empty-state h3 {
          margin: 0;
          color: var(--pg-navy);
          font-size: 17px;
        }

        .pg-empty-state p {
          margin: 9px 0 19px;
          color: var(--pg-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .pg-empty-reset {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 39px;
          padding: 0 14px;
          border: 1px solid var(--pg-navy);
          border-radius: 4px;
          background: var(--pg-navy);
          color: white;
          font-family: inherit;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .pg-empty-reset svg {
          width: 14px;
          height: 14px;
        }

        .pg-notice {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-top: 28px;
          padding: 19px 21px;
          border: 1px solid #e7e0d1;
          border-radius: 7px;
          background: #fbf8f1;
          color: #74664e;
        }

        .pg-notice-icon {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #e5d8bc;
          border-radius: 6px;
          background: #f4eddf;
          color: #94733d;
        }

        .pg-notice-icon svg {
          width: 18px;
          height: 18px;
        }

        .pg-notice strong {
          display: block;
          margin-bottom: 5px;
          color: #665438;
          font-size: 11px;
          font-weight: 800;
        }

        .pg-notice p {
          margin: 0;
          font-size: 10px;
          line-height: 1.8;
        }

        .pg-explore-section {
          padding: 76px 0;
          background: white;
        }

        .pg-explore-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
          align-items: center;
          gap: 60px;
        }

        .pg-explore-copy {
          max-width: 600px;
        }

        .pg-explore-copy p {
          max-width: 550px;
          margin: 17px 0 0;
          color: var(--pg-muted);
          font-size: 12px;
          line-height: 1.95;
        }

        .pg-explore-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 46px;
          margin-top: 24px;
          padding: 0 17px;
          border: 1px solid var(--pg-navy);
          border-radius: 5px;
          background: var(--pg-navy);
          color: white !important;
          font-size: 11px;
          font-weight: 800;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .pg-explore-button:hover {
          transform: translateY(-2px);
          background: var(--pg-navy-light);
        }

        .pg-explore-button svg {
          width: 15px;
          height: 15px;
        }

        .pg-explore-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pg-explore-point {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 16px;
          border: 1px solid #e8e9ee;
          border-radius: 6px;
          background: #fff;
        }

        .pg-explore-point-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 6px;
          background: #f1f1f6;
          color: var(--pg-navy);
        }

        .pg-explore-point-icon svg {
          width: 18px;
          height: 18px;
        }

        .pg-explore-point strong {
          display: block;
          color: var(--pg-navy);
          font-size: 12px;
          font-weight: 800;
        }

        .pg-explore-point p {
          margin: 5px 0 0;
          color: var(--pg-muted);
          font-size: 10px;
          line-height: 1.7;
        }

        .pg-contact-section {
          padding: 0 0 78px;
          background: white;
        }

        .pg-contact-banner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 36px 40px;
          overflow: hidden;
          border-radius: 8px;
          background: var(--pg-navy);
          color: white;
        }

        .pg-contact-banner::after {
          position: absolute;
          top: -95px;
          right: 120px;
          width: 260px;
          height: 260px;
          border: 1px solid rgba(234, 217, 179, 0.13);
          border-radius: 50%;
          box-shadow:
            0 0 0 35px rgba(234, 217, 179, 0.035),
            0 0 0 70px rgba(234, 217, 179, 0.025);
          content: "";
          pointer-events: none;
        }

        .pg-contact-copy {
          position: relative;
          z-index: 1;
          max-width: 600px;
        }

        .pg-contact-copy h2 {
          margin: 0;
          color: white;
          font-size: clamp(24px, 3vw, 33px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 1.2;
        }

        .pg-contact-copy p {
          margin: 11px 0 0;
          color: rgba(255, 255, 255, 0.66);
          font-size: 11px;
          line-height: 1.8;
        }

        .pg-contact-button {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 45px;
          padding: 0 17px;
          flex-shrink: 0;
          border: 1px solid var(--pg-gold-light);
          border-radius: 5px;
          background: var(--pg-gold-light);
          color: var(--pg-navy-dark) !important;
          font-size: 11px;
          font-weight: 800;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .pg-contact-button:hover {
          transform: translateY(-2px);
          background: white;
        }

        .pg-contact-button svg {
          width: 15px;
          height: 15px;
        }

        .pg-footer {
          padding: 37px 0 22px;
          background: var(--pg-navy-dark);
          color: white;
        }

        .pg-footer-main {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 40px;
          padding-bottom: 30px;
        }

        .pg-footer-brand {
          max-width: 360px;
        }

        .pg-footer-brand .pg-brand-name {
          color: white;
        }

        .pg-footer-brand .pg-brand-subtitle {
          color: rgba(255, 255, 255, 0.55);
        }

        .pg-footer-brand p {
          max-width: 320px;
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.56);
          font-size: 10px;
          line-height: 1.9;
        }

        .pg-footer-links-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 65px;
        }

        .pg-footer-column h4 {
          margin: 0 0 14px;
          color: var(--pg-gold-light);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .pg-footer-column a {
          display: block;
          margin-top: 11px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 10px;
          transition: color 0.2s ease;
        }

        .pg-footer-column a:hover {
          color: white;
        }

        .pg-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.48);
          font-size: 9px;
        }

        .pg-footer-bottom span:last-child {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .pg-footer-bottom svg {
          width: 13px;
          height: 13px;
          color: var(--pg-gold);
        }

        @media (max-width: 1000px) {
          .pg-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(260px, 0.8fr);
            gap: 32px;
          }

          .pg-hero-card {
            padding: 22px;
          }

          .pg-course-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pg-course-image {
            height: 190px;
          }

          .pg-explore-grid {
            gap: 35px;
          }

          .pg-footer-links-wrap {
            gap: 35px;
          }
        }

        @media (max-width: 760px) {
          .pg-container {
            width: min(100% - 34px, 560px);
          }

          .pg-utility {
            min-height: 33px;
            font-size: 9px;
          }

          .pg-utility-right {
            display: none;
          }

          .pg-nav-inner {
            min-height: 72px;
          }

          .pg-brand-mark {
            width: 42px;
            height: 42px;
          }

          .pg-brand-name {
            font-size: 13px;
          }

          .pg-brand-subtitle {
            font-size: 8px;
          }

          .pg-nav-links {
            gap: 17px;
          }

          .pg-nav-link {
            font-size: 11px;
          }

          .pg-nav-cta {
            min-height: 39px;
            padding: 0 11px;
            font-size: 10px;
          }

          .pg-hero {
            padding: 50px 0;
          }

          .pg-hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .pg-hero h1 {
            font-size: clamp(42px, 9vw, 57px);
          }

          .pg-hero-description {
            font-size: 13px;
          }

          .pg-hero-card {
            max-width: 560px;
          }

          .pg-highlights-grid {
            grid-template-columns: 1fr;
          }

          .pg-highlight,
          .pg-highlight:first-child {
            min-height: 78px;
            padding: 16px 0;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          }

          .pg-highlight:last-child {
            border-bottom: 0;
          }

          .pg-section,
          .pg-catalog-section,
          .pg-explore-section {
            padding: 59px 0;
          }

          .pg-catalog-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 17px;
          }

          .pg-filter-controls {
            align-items: stretch;
            flex-direction: column;
            gap: 13px;
          }

          .pg-search-wrap {
            min-width: 0;
          }

          .pg-category-filters {
            gap: 7px;
          }

          .pg-filter-chip {
            min-height: 36px;
            padding: 0 10px;
          }

          .pg-course-grid {
            gap: 14px;
          }

          .pg-course-image {
            height: 160px;
          }

          .pg-course-body {
            padding: 17px;
          }

          .pg-course-body h3 {
            min-height: 0;
            font-size: 14px;
          }

          .pg-course-description {
            min-height: 0;
          }

          .pg-explore-grid {
            grid-template-columns: 1fr;
            gap: 29px;
          }

          .pg-contact-section {
            padding-bottom: 59px;
          }

          .pg-contact-banner {
            align-items: flex-start;
            flex-direction: column;
            gap: 23px;
            padding: 29px 25px;
          }

          .pg-footer-main {
            flex-direction: column;
            gap: 30px;
          }

          .pg-footer-links-wrap {
            width: 100%;
            justify-content: space-between;
            gap: 25px;
          }
        }

        @media (max-width: 480px) {
          .pg-container {
            width: calc(100% - 28px);
          }

          .pg-brand {
            gap: 9px;
          }

          .pg-brand-mark {
            width: 38px;
            height: 38px;
          }

          .pg-brand-name {
            font-size: 12px;
          }

          .pg-brand-subtitle {
            font-size: 7px;
            letter-spacing: 0.09em;
          }

          .pg-nav-links {
            gap: 12px;
          }

          .pg-nav-link {
            font-size: 10px;
          }

          .pg-nav-cta {
            min-height: 35px;
            gap: 5px;
            padding: 0 8px;
            font-size: 9px;
          }

          .pg-nav-cta svg {
            width: 12px;
            height: 12px;
          }

          .pg-hero h1 {
            font-size: 41px;
          }

          .pg-hero-card {
            padding: 19px 15px;
          }

          .pg-course-grid {
            grid-template-columns: 1fr;
          }

          .pg-course-image {
            height: 190px;
          }

          .pg-course-body {
            padding: 21px;
          }

          .pg-course-body h3 {
            font-size: 15px;
          }

          .pg-course-description {
            min-height: 0;
          }

          .pg-filter-panel {
            padding: 15px;
          }

          .pg-filter-top {
            align-items: flex-start;
          }

          .pg-category-filters {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pg-filter-chip {
            width: 100%;
          }

          .pg-catalog-meta {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .pg-notice {
            padding: 15px;
          }

          .pg-footer-links-wrap {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pg-footer-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>

      {/* Utility bar */}
      <div className="pg-utility">
        <div className="pg-container pg-utility-inner">
          <div className="pg-utility-left">
            <span className="pg-utility-dot" />
            <span>STUDENT MANAGEMENT SYSTEM</span>
          </div>

          <div className="pg-utility-right">
            <ShieldCheck />
            <span>Explore academic opportunities</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="pg-navbar">
        <div className="pg-container pg-nav-inner">
          <Link to="/" className="pg-brand">
            <span className="pg-brand-mark">
              <GraduationCap />
            </span>

            <span className="pg-brand-copy">
              <span className="pg-brand-name">Student Management</span>
              <span className="pg-brand-subtitle">Academic Portal</span>
            </span>
          </Link>

          <nav className="pg-nav-links" aria-label="Main navigation">
            <Link to="/" className="pg-nav-link">
              Home
            </Link>

            <Link
              to="/programs"
              className="pg-nav-link pg-nav-link-active"
              aria-current="page"
            >
              Programs
            </Link>

            <Link to="/contact" className="pg-nav-link">
              Contact
            </Link>

            <Link to="/login/student" className="pg-nav-cta">
              Student Portal <ArrowUpRight />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pg-hero">
          <div className="pg-container pg-hero-grid">
            <div className="pg-hero-copy">
              <div className="pg-eyebrow">
                <span className="pg-eyebrow-icon">
                  <Sparkles />
                </span>
                Explore your possibilities
              </div>

              <h1>
                Discover your future.
                <br />
                Find your <em>direction.</em>
              </h1>

              <p className="pg-hero-description">
                Explore study areas across computing, engineering, and
                emerging technologies. Discover subjects that interest you,
                learn what they cover, and start thinking about your next
                academic step.
              </p>

              <div className="pg-breadcrumb">
                <Link to="/">Home</Link>
                <ChevronRight />
                <span>Programs</span>
              </div>
            </div>

            <aside className="pg-hero-card">
              <div className="pg-hero-card-top">
                <div>
                  <small>Your next chapter</small>
                  <h2>Explore the possibilities</h2>
                </div>

                <span className="pg-hero-card-icon">
                  <Compass />
                </span>
              </div>

              <div className="pg-hero-stat">
                <span className="pg-hero-stat-icon">
                  <BookOpen />
                </span>

                <span className="pg-hero-stat-copy">
                  <strong>{courses.length} study areas</strong>
                  <span>Explore a range of academic subjects</span>
                </span>
              </div>

              <div className="pg-hero-stat">
                <span className="pg-hero-stat-icon">
                  <Building2 />
                </span>

                <span className="pg-hero-stat-copy">
                  <strong>Multiple disciplines</strong>
                  <span>Computing, engineering, and technology</span>
                </span>
              </div>

              <div className="pg-hero-stat">
                <span className="pg-hero-stat-icon">
                  <Search />
                </span>

                <span className="pg-hero-stat-copy">
                  <strong>Find what interests you</strong>
                  <span>Search by name, subject, or category</span>
                </span>
              </div>

              <div className="pg-hero-card-note">
                <Info />
                <span>
                  This catalogue is illustrative. Confirm actual offerings
                  and admission details with the institute.
                </span>
              </div>
            </aside>
          </div>
        </section>

        {/* Highlights */}
        <section className="pg-highlights" aria-label="Catalogue features">
          <div className="pg-container pg-highlights-grid">
            <div className="pg-highlight">
              <span className="pg-highlight-icon">
                <Search />
              </span>

              <span className="pg-highlight-copy">
                <strong>Easy discovery</strong>
                <span>Search subjects and specialisations</span>
              </span>
            </div>

            <div className="pg-highlight">
              <span className="pg-highlight-icon">
                <SlidersHorizontal />
              </span>

              <span className="pg-highlight-copy">
                <strong>Simple filtering</strong>
                <span>Browse by study area</span>
              </span>
            </div>

            <div className="pg-highlight">
              <span className="pg-highlight-icon">
                <GraduationCap />
              </span>

              <span className="pg-highlight-copy">
                <strong>Plan your next step</strong>
                <span>Compare topics and indicative durations</span>
              </span>
            </div>
          </div>
        </section>

        {/* Catalogue */}
        <section className="pg-catalog-section" id="catalogue">
          <div className="pg-container">
            <div className="pg-catalog-heading">
              <div>
                <SectionLabel>Academic catalogue</SectionLabel>

                <h2 className="pg-section-heading">
                  Find your area of
                  <br />
                  <em>interest.</em>
                </h2>

                <p className="pg-section-description">
                  Browse the study areas below. Use the search box or category
                  filters to narrow the list and find subjects you want to
                  explore.
                </p>
              </div>

              <div className="pg-result-count">
                <BookOpen />
                {filteredCourses.length} of {courses.length} areas
              </div>
            </div>

            {/* Search and filters */}
            <div className="pg-filter-panel">
              <div className="pg-filter-top">
                <div className="pg-filter-title">
                  <SlidersHorizontal />
                  Find a study area
                </div>

                {(searchQuery || activeCategory !== "All Areas") && (
                  <button
                    type="button"
                    className="pg-clear-button"
                    onClick={clearFilters}
                  >
                    <X />
                    Clear filters
                  </button>
                )}
              </div>

              <div className="pg-filter-controls">
                <div className="pg-search-wrap">
                  <Search className="pg-search-icon" />

                  <input
                    className="pg-search-input"
                    type="search"
                    placeholder="Search programs, subjects, or keywords..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    aria-label="Search study areas"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      className="pg-search-clear"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X />
                    </button>
                  )}
                </div>

                <div className="pg-category-filters" aria-label="Filter by category">
                  {categories.map((category) => {
                    const count =
                      category === "All Areas"
                        ? courses.length
                        : courses.filter(
                            (course) => course.category === category
                          ).length;

                    return (
                      <button
                        type="button"
                        key={category}
                        className={`pg-filter-chip${
                          activeCategory === category
                            ? " pg-filter-chip-active"
                            : ""
                        }`}
                        onClick={() => setActiveCategory(category)}
                        aria-pressed={activeCategory === category}
                      >
                        {category}
                        <span className="pg-filter-chip-count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pg-catalog-meta">
              <span>
                Showing <strong>{filteredCourses.length}</strong>{" "}
                {filteredCourses.length === 1 ? "result" : "results"}
                {activeCategory !== "All Areas" ? ` in ${activeCategory}` : ""}
              </span>

              <span className="pg-catalog-meta-note">
                <Info />
                Course details are illustrative
              </span>
            </div>

            {/* Course cards */}
            <div className="pg-course-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <CourseCard
                    key={course.code}
                    course={course}
                    index={courses.findIndex(
                      (item) => item.code === course.code
                    )}
                  />
                ))
              ) : (
                <div className="pg-empty-state">
                  <span className="pg-empty-icon">
                    <Search />
                  </span>

                  <h3>No matching study areas</h3>

                  <p>
                    Try another keyword or select a different category to
                    see more results.
                  </p>

                  <button
                    type="button"
                    className="pg-empty-reset"
                    onClick={clearFilters}
                  >
                    <X />
                    Clear search and filters
                  </button>
                </div>
              )}
            </div>

            {/* Important disclaimer */}
            <aside className="pg-notice">
              <span className="pg-notice-icon">
                <Info />
              </span>

              <div>
                <strong>Important course information</strong>

                <p>
                  These 15 entries demonstrate the catalogue design and are
                  not a verified list of institute offerings. Program names,
                  availability, durations, eligibility requirements, and
                  admissions details must be confirmed with the institute.
                  Category labels are for browsing convenience only.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Explore guidance */}
        <section className="pg-explore-section">
          <div className="pg-container pg-explore-grid">
            <div className="pg-explore-copy">
              <SectionLabel>Make an informed choice</SectionLabel>

              <h2 className="pg-section-heading">
                Start with curiosity.
                <br />
                Choose with <em>confidence.</em>
              </h2>

              <p>
                A study area is a starting point for exploring what you enjoy
                and where you want to grow. Read about the topics, compare
                potential pathways, and check official course details before
                making an academic decision.
              </p>

              <Link to="/contact" className="pg-explore-button">
                Contact Us for Guidance <ArrowRight />
              </Link>
            </div>

            <div className="pg-explore-points">
              <div className="pg-explore-point">
                <span className="pg-explore-point-icon">
                  <CheckCircle2 />
                </span>

                <div>
                  <strong>Explore the subject</strong>
                  <p>
                    Review the topics and skills associated with an area of
                    study.
                  </p>
                </div>
              </div>

              <div className="pg-explore-point">
                <span className="pg-explore-point-icon">
                  <Compass />
                </span>

                <div>
                  <strong>Consider your interests</strong>
                  <p>
                    Think about the kinds of problems and projects you enjoy.
                  </p>
                </div>
              </div>

              <div className="pg-explore-point">
                <span className="pg-explore-point-icon">
                  <GraduationCap />
                </span>

                <div>
                  <strong>Verify official details</strong>
                  <p>
                    Confirm availability, eligibility, fees, and duration
                    before applying.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact callout */}
        <section className="pg-contact-section">
          <div className="pg-container">
            <div className="pg-contact-banner">
              <div className="pg-contact-copy">
                <SectionLabel light>Need more information?</SectionLabel>

                <h2>Your next step starts with a conversation.</h2>

                <p>
                  Reach out for assistance navigating the portal or finding
                  the right information about academic offerings.
                </p>
              </div>

              <Link to="/contact" className="pg-contact-button">
                Contact Us <ArrowUpRight />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pg-footer">
        <div className="pg-container">
          <div className="pg-footer-main">
            <div className="pg-footer-brand">
              <Link to="/" className="pg-brand">
                <span className="pg-brand-mark">
                  <GraduationCap />
                </span>

                <span className="pg-brand-copy">
                  <span className="pg-brand-name">Student Management</span>
                  <span className="pg-brand-subtitle">Academic Portal</span>
                </span>
              </Link>

              <p>
                A centralised academic platform connecting students, faculty,
                and administrators through a simpler digital experience.
              </p>
            </div>

            <div className="pg-footer-links-wrap">
              <div className="pg-footer-column">
                <h4>Explore</h4>
                <Link to="/">Home</Link>
                <Link to="/programs">Programs</Link>
                <Link to="/contact">Contact</Link>
              </div>

              <div className="pg-footer-column">
                <h4>Portals</h4>
                <Link to="/login/student">Student</Link>
                <Link to="/login/admin">Administrator</Link>
                <Link to="/login/permanent-faculty">Permanent Faculty</Link>
                <Link to="/login/visiting-faculty">Visiting Faculty</Link>
              </div>
            </div>
          </div>

          <div className="pg-footer-bottom">
            <span>
              © {new Date().getFullYear()} Student Management System. All
              rights reserved.
            </span>

            <span>
              Explore. Learn. Grow. <GraduationCap />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
