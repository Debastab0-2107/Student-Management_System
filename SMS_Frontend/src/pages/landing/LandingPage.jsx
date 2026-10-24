import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Users,
  ClipboardCheck,
  CalendarDays,
  Mail,
  ChevronRight,
  CheckCircle2,
  UserRound,
  Building2,
  Sparkles,
} from "lucide-react";

const roles = [
  {
    role: "student",
    title: "Student Portal",
    description:
      "Access academic information, results, attendance, and student services.",
    to: "/login/student",
    icon: GraduationCap,
    number: "01",
  },
  {
    role: "admin",
    title: "Administrator Portal",
    description:
      "Manage student records, academic information, and institutional activities.",
    to: "/login/admin",
    icon: ShieldCheck,
    number: "02",
  },
  {
    role: "permanent",
    title: "Permanent Faculty",
    description:
      "Manage classes, student performance, attendance, and academic records.",
    to: "/login/permanent-faculty",
    icon: BookOpen,
    number: "03",
  },
  {
    role: "visiting",
    title: "Visiting Faculty",
    description:
      "Access teaching information and assigned academic responsibilities.",
    to: "/login/visiting-faculty",
    icon: Users,
    number: "04",
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description: "Role-based portal access",
  },
  {
    icon: ClipboardCheck,
    title: "Academic Records",
    description: "Information in one place",
  },
  {
    icon: Users,
    title: "Connected Community",
    description: "One platform for everyone",
  },
];

const services = [
  {
    icon: BookOpen,
    number: "01",
    title: "Academic Management",
    description:
      "Keep academic information and institutional workflows organised through a central platform.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Results & Performance",
    description:
      "Make academic results and performance information easier to access for authorised users.",
  },
  {
    icon: CalendarDays,
    number: "03",
    title: "Attendance & Records",
    description:
      "Access attendance and essential academic records from the relevant user portal.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your portal",
    description: "Select the portal that matches your role.",
  },
  {
    number: "02",
    title: "Sign in securely",
    description: "Continue through the appropriate login page.",
  },
  {
    number: "03",
    title: "Access your workspace",
    description: "Use the tools and information available to your role.",
  },
];

function SectionLabel({ children, light = false }) {
  return (
    <div className={`rp-section-label${light ? " rp-section-label-light" : ""}`}>
      <span className="rp-label-line" />
      <span>{children}</span>
    </div>
  );
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="rp-page">
      <style>{`
        :root {
          --rp-navy: var(--navy, #292e4d);
          --rp-navy-dark: var(--navy-dark, #191d35);
          --rp-navy-light: var(--navy-light, #3b4266);
          --rp-gold: var(--gold, #c8a66a);
          --rp-gold-light: var(--gold-light, #ead9b3);
          --rp-white: var(--white, #ffffff);
          --rp-background: var(--background, #f7f7f9);
          --rp-text: var(--text, #292e3c);
          --rp-muted: var(--muted, #74798a);
          --rp-border: var(--border, #e5e6ec);
        }

        .rp-page {
          min-height: 100vh;
          overflow: hidden;
          background: var(--rp-white);
          color: var(--rp-text);
          font-family: inherit;
        }

        .rp-page *,
        .rp-page *::before,
        .rp-page *::after {
          box-sizing: border-box;
        }

        .rp-page a {
          color: inherit;
          text-decoration: none;
        }

        .rp-container {
          width: min(1160px, calc(100% - 48px));
          margin: 0 auto;
        }

        .rp-utility {
          min-height: 36px;
          display: flex;
          align-items: center;
          background: var(--rp-navy-dark);
          color: rgba(255, 255, 255, 0.78);
          font-size: 11px;
          letter-spacing: 0.035em;
        }

        .rp-utility-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .rp-utility-left,
        .rp-utility-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rp-utility-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--rp-gold);
          flex-shrink: 0;
        }

        .rp-utility-right {
          color: var(--rp-gold-light);
        }

        .rp-navbar {
          position: relative;
          z-index: 10;
          background: var(--rp-white);
          border-bottom: 1px solid var(--rp-border);
        }

        .rp-nav-inner {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 26px;
        }

        .rp-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .rp-brand-mark {
          width: 47px;
          height: 47px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--rp-gold-light);
          background: var(--rp-navy);
          border-radius: 13px 13px 13px 4px;
        }

        .rp-brand-mark svg {
          width: 25px;
          height: 25px;
        }

        .rp-brand-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rp-brand-name {
          color: var(--rp-navy);
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.15;
        }

        .rp-brand-subtitle {
          color: var(--rp-muted);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .rp-nav-links {
          display: flex;
          align-items: center;
          gap: 31px;
        }

        .rp-nav-link {
          position: relative;
          padding: 8px 0;
          color: #555b6c;
          font-size: 13px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .rp-nav-link:hover {
          color: var(--rp-navy);
        }

        .rp-nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 17px;
          border: 1px solid var(--rp-navy);
          border-radius: 5px;
          background: var(--rp-navy);
          color: white !important;
          font-size: 12px;
          font-weight: 700;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .rp-nav-cta:hover {
          background: var(--rp-navy-light);
          transform: translateY(-1px);
        }

        .rp-nav-cta svg {
          width: 15px;
          height: 15px;
        }

        .rp-menu-toggle {
          display: none;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--rp-border);
          border-radius: 5px;
          background: white;
          color: var(--rp-navy);
          cursor: pointer;
        }

        .rp-menu-toggle svg {
          width: 21px;
          height: 21px;
        }

        .rp-hero {
          position: relative;
          padding: 70px 0 76px;
          background:
            radial-gradient(ellipse at 85% 10%, rgba(200, 166, 106, 0.13), transparent 31%),
            linear-gradient(115deg, #fbfaf7 0%, #ffffff 55%, #f5f4f0 100%);
        }

        .rp-hero::before {
          position: absolute;
          top: 0;
          right: 0;
          width: 35%;
          height: 100%;
          background-image: radial-gradient(rgba(41, 46, 77, 0.09) 0.8px, transparent 0.8px);
          background-size: 15px 15px;
          content: "";
          opacity: 0.45;
          pointer-events: none;
          mask-image: linear-gradient(to left, black, transparent);
        }

        .rp-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.78fr);
          align-items: center;
          gap: 72px;
        }

        .rp-hero-copy {
          max-width: 620px;
        }

        .rp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 23px;
          color: var(--rp-navy);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .rp-eyebrow-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 27px;
          height: 27px;
          border: 1px solid rgba(200, 166, 106, 0.6);
          border-radius: 50%;
          color: #96733c;
          background: rgba(200, 166, 106, 0.12);
        }

        .rp-eyebrow-icon svg {
          width: 14px;
          height: 14px;
        }

        .rp-hero h1 {
          max-width: 640px;
          margin: 0;
          color: var(--rp-navy-dark);
          font-size: clamp(43px, 5.3vw, 68px);
          font-weight: 800;
          letter-spacing: -0.065em;
          line-height: 1.04;
        }

        .rp-hero h1 em {
          color: #a27c42;
          font-style: normal;
        }

        .rp-hero-description {
          max-width: 530px;
          margin: 25px 0 0;
          color: #666b7b;
          font-size: 15px;
          line-height: 1.9;
        }

        .rp-hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 13px;
          margin-top: 30px;
        }

        .rp-button-primary,
        .rp-button-secondary {
          min-height: 49px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 19px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 750;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .rp-button-primary {
          border: 1px solid var(--rp-navy);
          background: var(--rp-navy);
          color: white !important;
        }

        .rp-button-primary:hover {
          background: var(--rp-navy-light);
          transform: translateY(-2px);
        }

        .rp-button-secondary {
          border: 1px solid #d8d9e0;
          background: rgba(255, 255, 255, 0.8);
          color: var(--rp-navy) !important;
        }

        .rp-button-secondary:hover {
          border-color: var(--rp-gold);
          transform: translateY(-2px);
        }

        .rp-button-primary svg,
        .rp-button-secondary svg {
          width: 16px;
          height: 16px;
        }

        .rp-hero-note {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 27px;
          color: #777c8b;
          font-size: 11px;
        }

        .rp-hero-note svg {
          width: 16px;
          height: 16px;
          color: #9a7a45;
          flex-shrink: 0;
        }

        .rp-login-panel {
          position: relative;
          padding: 28px;
          border: 1px solid rgba(41, 46, 77, 0.09);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 65px rgba(25, 29, 53, 0.1);
        }

        .rp-login-panel::before {
          position: absolute;
          top: -7px;
          left: 26px;
          width: 58px;
          height: 4px;
          border-radius: 5px;
          background: var(--rp-gold);
          content: "";
        }

        .rp-panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 22px;
        }

        .rp-panel-heading h2 {
          margin: 0;
          color: var(--rp-navy);
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .rp-panel-heading p {
          margin: 7px 0 0;
          color: var(--rp-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .rp-panel-heading-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 41px;
          height: 41px;
          flex-shrink: 0;
          border-radius: 9px;
          background: #f4f0e7;
          color: #8f6e38;
        }

        .rp-panel-heading-icon svg {
          width: 20px;
          height: 20px;
        }

        .rp-role-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .rp-role-link {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 13px 12px;
          border: 1px solid #e9e9ee;
          border-radius: 6px;
          background: white;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .rp-role-link:hover {
          border-color: rgba(200, 166, 106, 0.8);
          background: #fdfbf7;
          transform: translateX(3px);
        }

        .rp-role-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 41px;
          height: 41px;
          flex-shrink: 0;
          border-radius: 6px;
          background: #f0f1f6;
          color: var(--rp-navy);
        }

        .rp-role-icon svg {
          width: 20px;
          height: 20px;
        }

        .rp-role-copy {
          min-width: 0;
          flex: 1;
        }

        .rp-role-title {
          display: block;
          color: var(--rp-navy);
          font-size: 12px;
          font-weight: 800;
          line-height: 1.4;
        }

        .rp-role-description {
          display: block;
          margin-top: 4px;
          color: var(--rp-muted);
          font-size: 10px;
          line-height: 1.5;
        }

        .rp-role-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          border-radius: 50%;
          color: #9a7a45;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .rp-role-arrow svg {
          width: 16px;
          height: 16px;
        }

        .rp-role-link:hover .rp-role-arrow {
          background: var(--rp-navy);
          color: white;
        }

        .rp-panel-footer {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          padding-top: 15px;
          border-top: 1px solid #eeeeF2;
          color: #7c8090;
          font-size: 10px;
        }

        .rp-panel-footer svg {
          width: 14px;
          height: 14px;
          color: #a17d42;
        }

        .rp-highlights {
          background: var(--rp-navy);
          color: white;
        }

        .rp-highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .rp-highlight {
          display: flex;
          align-items: center;
          gap: 15px;
          min-height: 110px;
          padding: 23px 28px;
          border-right: 1px solid rgba(255, 255, 255, 0.12);
        }

        .rp-highlight:first-child {
          padding-left: 0;
        }

        .rp-highlight:last-child {
          border-right: 0;
        }

        .rp-highlight-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          padding: 0;
          flex-shrink: 0;
          box-sizing: border-box;
          border: 1px solid rgba(234, 217, 179, 0.32);
          border-radius: 7px;
          background: rgba(234, 217, 179, 0.09);
          color: var(--rp-gold-light);
        }

        .rp-highlight-icon svg {
          display: block;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin: 0;
        }

        .rp-highlight-copy strong {
          display: block;
          color: white;
          font-size: 12px;
          font-weight: 750;
        }

        .rp-highlight-copy span {
          display: block;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 10px;
        }

        .rp-section {
          padding: 88px 0;
        }

        .rp-section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 17px;
          color: #9a7944;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .rp-label-line {
          width: 28px;
          height: 2px;
          flex-shrink: 0;
          background: var(--rp-gold);
        }

        .rp-section-label-light {
          color: var(--rp-gold-light);
        }

        .rp-section-heading {
          margin: 0;
          color: var(--rp-navy-dark);
          font-size: clamp(30px, 3.7vw, 43px);
          font-weight: 800;
          letter-spacing: -0.055em;
          line-height: 1.15;
        }

        .rp-section-heading em {
          color: #a27c42;
          font-style: normal;
        }

        .rp-section-description {
          max-width: 560px;
          margin: 17px 0 0;
          color: var(--rp-muted);
          font-size: 13px;
          line-height: 1.9;
        }

        .rp-intro-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.94fr) minmax(0, 1fr);
          align-items: center;
          gap: 85px;
        }

        .rp-intro-copy {
          max-width: 500px;
        }

        .rp-intro-copy .rp-button-primary {
          margin-top: 26px;
        }

        .rp-intro-image {
          position: relative;
          min-height: 410px;
          overflow: hidden;
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(41, 46, 77, 0.12), rgba(200, 166, 106, 0.25)),
            #e9e8e3;
        }

        .rp-campus-image {
          display: block;
          width: 100%;
          height: 410px;
          object-fit: cover;
          object-position: center;
        }

        .rp-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(25, 29, 53, 0.8), transparent 58%);
          pointer-events: none;
        }

        .rp-image-caption {
          position: absolute;
          right: 22px;
          bottom: 22px;
          left: 22px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          color: white;
        }

        .rp-image-caption small {
          display: block;
          margin-bottom: 7px;
          color: var(--rp-gold-light);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .rp-image-caption strong {
          display: block;
          font-size: 19px;
          font-weight: 750;
          letter-spacing: -0.025em;
        }

        .rp-caption-dot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 50%;
          color: white;
        }

        .rp-caption-dot svg {
          width: 19px;
          height: 19px;
        }

        .rp-services-section {
          background: var(--rp-background);
        }

        .rp-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 36px;
        }

        .rp-section-header .rp-section-description {
          max-width: 390px;
          margin-bottom: 3px;
        }

        .rp-service-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .rp-service-card {
          position: relative;
          min-height: 245px;
          padding: 28px;
          overflow: hidden;
          border: 1px solid #e6e7ed;
          border-radius: 7px;
          background: white;
          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .rp-service-card:hover {
          transform: translateY(-5px);
          border-color: rgba(200, 166, 106, 0.7);
          box-shadow: 0 14px 30px rgba(25, 29, 53, 0.06);
        }

        .rp-service-number {
          position: absolute;
          top: 20px;
          right: 22px;
          color: #e5e5eb;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.06em;
        }

        .rp-service-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          margin-bottom: 24px;
          border-radius: 8px;
          background: #f1f1f6;
          color: var(--rp-navy);
        }

        .rp-service-icon svg {
          width: 22px;
          height: 22px;
        }

        .rp-service-card h3 {
          margin: 0;
          color: var(--rp-navy);
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .rp-service-card p {
          margin: 12px 0 0;
          color: var(--rp-muted);
          font-size: 12px;
          line-height: 1.85;
        }

        .rp-how-section {
          background: white;
        }

        .rp-how-grid {
          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 80px;
          align-items: start;
        }

        .rp-how-intro {
          max-width: 370px;
        }

        .rp-step-list {
          border-top: 1px solid var(--rp-border);
        }

        .rp-step {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr) 25px;
          align-items: center;
          gap: 20px;
          padding: 23px 0;
          border-bottom: 1px solid var(--rp-border);
        }

        .rp-step-number {
          color: #a17d42;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .rp-step h3 {
          margin: 0;
          color: var(--rp-navy);
          font-size: 14px;
          font-weight: 800;
        }

        .rp-step p {
          margin: 6px 0 0;
          color: var(--rp-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .rp-step-check {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9a7a45;
        }

        .rp-step-check svg {
          width: 19px;
          height: 19px;
        }

        .rp-portals-section {
          padding: 80px 0 88px;
          background: #f8f7f4;
        }

        .rp-portals-header {
          max-width: 600px;
          margin: 0 auto 39px;
          text-align: center;
        }

        .rp-portals-header .rp-section-label {
          justify-content: center;
        }

        .rp-portals-header .rp-section-description {
          margin-right: auto;
          margin-left: auto;
        }

        .rp-portal-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
        }

        .rp-portal-card {
          display: flex;
          flex-direction: column;
          min-height: 222px;
          padding: 23px 21px;
          border: 1px solid #e5e4e0;
          border-radius: 7px;
          background: white;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .rp-portal-card:hover {
          transform: translateY(-4px);
          border-color: var(--rp-gold);
          box-shadow: 0 12px 28px rgba(25, 29, 53, 0.06);
        }

        .rp-portal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 22px;
        }

        .rp-portal-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          border-radius: 7px;
          background: var(--rp-navy);
          color: var(--rp-gold-light);
        }

        .rp-portal-icon svg {
          width: 21px;
          height: 21px;
        }

        .rp-portal-number {
          color: #b0b2bd;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .rp-portal-card h3 {
          margin: 0;
          color: var(--rp-navy);
          font-size: 14px;
          font-weight: 800;
          line-height: 1.45;
        }

        .rp-portal-card p {
          flex: 1;
          margin: 9px 0 19px;
          color: var(--rp-muted);
          font-size: 11px;
          line-height: 1.75;
        }

        .rp-portal-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid #efeff2;
          color: var(--rp-navy);
          font-size: 10px;
          font-weight: 800;
        }

        .rp-portal-card-bottom svg {
          width: 15px;
          height: 15px;
          color: #a17d42;
          transition: transform 0.2s ease;
        }

        .rp-portal-card:hover .rp-portal-card-bottom svg {
          transform: translateX(3px);
        }

        .rp-contact-section {
          padding: 0 0 82px;
          background: #f8f7f4;
        }

        .rp-contact-banner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
          padding: 38px 43px;
          overflow: hidden;
          border-radius: 8px;
          background: var(--rp-navy);
          color: white;
        }

        .rp-contact-banner::after {
          position: absolute;
          top: -80px;
          right: 160px;
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

        .rp-contact-copy {
          position: relative;
          z-index: 1;
          max-width: 600px;
        }

        .rp-contact-copy h2 {
          margin: 0;
          color: white;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 1.2;
        }

        .rp-contact-copy p {
          margin: 11px 0 0;
          color: rgba(255, 255, 255, 0.66);
          font-size: 12px;
          line-height: 1.8;
        }

        .rp-contact-button {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 47px;
          padding: 0 18px;
          flex-shrink: 0;
          border: 1px solid var(--rp-gold-light);
          border-radius: 5px;
          background: var(--rp-gold-light);
          color: var(--rp-navy-dark) !important;
          font-size: 12px;
          font-weight: 800;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .rp-contact-button:hover {
          transform: translateY(-2px);
          background: white;
        }

        .rp-contact-button svg {
          width: 16px;
          height: 16px;
        }

        .rp-footer {
          padding: 38px 0 23px;
          background: var(--rp-navy-dark);
          color: white;
        }

        .rp-footer-main {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 40px;
          padding-bottom: 32px;
        }

        .rp-footer-brand {
          max-width: 360px;
        }

        .rp-footer-brand .rp-brand-name {
          color: white;
        }

        .rp-footer-brand .rp-brand-subtitle {
          color: rgba(255, 255, 255, 0.56);
        }

        .rp-footer-brand p {
          max-width: 320px;
          margin: 17px 0 0;
          color: rgba(255, 255, 255, 0.56);
          font-size: 11px;
          line-height: 1.9;
        }

        .rp-footer-links-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 65px;
        }

        .rp-footer-column h4 {
          margin: 0 0 15px;
          color: var(--rp-gold-light);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .rp-footer-column a {
          display: block;
          margin-top: 11px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 11px;
          transition: color 0.2s ease;
        }

        .rp-footer-column a:hover {
          color: white;
        }

        .rp-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 19px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.48);
          font-size: 10px;
        }

        .rp-footer-bottom span:last-child {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .rp-footer-bottom svg {
          width: 13px;
          height: 13px;
          color: var(--rp-gold);
        }

        @media (max-width: 1000px) {
          .rp-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(315px, 0.9fr);
            gap: 35px;
          }

          .rp-hero {
            padding: 60px 0;
          }

          .rp-login-panel {
            padding: 22px;
          }

          .rp-intro-grid {
            gap: 45px;
          }

          .rp-portal-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .rp-portal-card {
            min-height: 200px;
          }

          .rp-footer-links-wrap {
            gap: 35px;
          }
        }

        @media (max-width: 760px) {
          .rp-container {
            width: min(100% - 34px, 560px);
          }

          .rp-utility {
            min-height: 33px;
            font-size: 9px;
          }

          .rp-utility-right {
            display: none;
          }

          .rp-nav-inner {
            min-height: 72px;
          }

          .rp-brand-mark {
            width: 42px;
            height: 42px;
          }

          .rp-brand-name {
            font-size: 14px;
          }

          .rp-brand-subtitle {
            font-size: 9px;
          }

          .rp-menu-toggle {
            display: flex;
          }

          .rp-nav-links {
            position: absolute;
            top: calc(100% + 1px);
            right: 0;
            left: 0;
            display: none;
            align-items: stretch;
            gap: 0;
            padding: 12px 20px 20px;
            border-bottom: 1px solid var(--rp-border);
            background: white;
            box-shadow: 0 14px 25px rgba(25, 29, 53, 0.08);
          }

          .rp-nav-links.rp-nav-links-open {
            display: flex;
            flex-direction: column;
          }

          .rp-nav-link {
            padding: 14px 0;
            border-bottom: 1px solid #f0f0f3;
          }

          .rp-nav-cta {
            margin-top: 14px;
          }

          .rp-hero {
            padding: 51px 0 55px;
          }

          .rp-hero-grid {
            grid-template-columns: 1fr;
            gap: 38px;
          }

          .rp-hero h1 {
            max-width: 560px;
            font-size: clamp(42px, 9vw, 59px);
          }

          .rp-hero-description {
            font-size: 14px;
          }

          .rp-login-panel {
            max-width: 560px;
          }

          .rp-highlights-grid {
            grid-template-columns: 1fr;
          }

          .rp-highlight,
          .rp-highlight:first-child {
            min-height: 82px;
            padding: 17px 0;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          }

          .rp-highlight:last-child {
            border-bottom: 0;
          }

          .rp-section {
            padding: 64px 0;
          }

          .rp-intro-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .rp-intro-image {
            min-height: 310px;
          }

          .rp-campus-image {
            height: 310px;
          }

          .rp-section-header {
            display: block;
            margin-bottom: 27px;
          }

          .rp-section-header .rp-section-description {
            margin-top: 13px;
          }

          .rp-service-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .rp-service-card {
            min-height: auto;
            padding: 24px;
          }

          .rp-service-icon {
            margin-bottom: 18px;
          }

          .rp-how-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .rp-portals-section {
            padding: 64px 0;
          }

          .rp-portal-grid {
            gap: 12px;
          }

          .rp-portal-card {
            padding: 18px;
          }

          .rp-contact-section {
            padding-bottom: 60px;
          }

          .rp-contact-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 29px 25px;
            gap: 23px;
          }

          .rp-footer-main {
            flex-direction: column;
            gap: 32px;
          }

          .rp-footer-links-wrap {
            width: 100%;
            justify-content: space-between;
            gap: 25px;
          }
        }

        @media (max-width: 420px) {
          .rp-container {
            width: calc(100% - 28px);
          }

          .rp-brand {
            gap: 9px;
          }

          .rp-brand-mark {
            width: 38px;
            height: 38px;
          }

          .rp-brand-name {
            font-size: 13px;
          }

          .rp-brand-subtitle {
            font-size: 8px;
            letter-spacing: 0.09em;
          }

          .rp-hero h1 {
            font-size: 41px;
          }

          .rp-hero-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .rp-button-primary,
          .rp-button-secondary {
            width: 100%;
          }

          .rp-login-panel {
            padding: 18px 14px;
          }

          .rp-panel-heading h2 {
            font-size: 19px;
          }

          .rp-role-link {
            gap: 9px;
            padding: 10px 8px;
          }

          .rp-role-icon {
            width: 36px;
            height: 36px;
          }

          .rp-role-title {
            font-size: 11px;
          }

          .rp-role-description {
            font-size: 9px;
          }

          .rp-portal-grid {
            grid-template-columns: 1fr;
          }

          .rp-portal-card {
            min-height: auto;
          }

          .rp-portal-top {
            margin-bottom: 14px;
          }

          .rp-footer-links-wrap {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .rp-footer-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .rp-step {
            grid-template-columns: 32px minmax(0, 1fr) 20px;
            gap: 12px;
          }
        }
      `}</style>

      {/* Utility bar */}
      <div className="rp-utility">
        <div className="rp-container rp-utility-inner">
          <div className="rp-utility-left">
            <span className="rp-utility-dot" />
            <span>STUDENT MANAGEMENT SYSTEM</span>
          </div>

          <div className="rp-utility-right">
            <ShieldCheck size={13} />
            <span>A central platform for your academic journey</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="rp-navbar">
        <div className="rp-container rp-nav-inner">
          <Link to="/" className="rp-brand" onClick={closeMenu}>
            <span className="rp-brand-mark">
              <GraduationCap />
            </span>

            <span className="rp-brand-copy">
              <span className="rp-brand-name">Student Management</span>
              <span className="rp-brand-subtitle">Academic Portal</span>
            </span>
          </Link>

          <button
            type="button"
            className="rp-menu-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={`rp-nav-links${menuOpen ? " rp-nav-links-open" : ""}`}>
            <Link to="/" className="rp-nav-link" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/programs" className="rp-nav-link" onClick={closeMenu}>
              Programs
            </Link>
            <Link to="/contact" className="rp-nav-link" onClick={closeMenu}>
              Contact
            </Link>
            <Link
              to="/login/student"
              className="rp-nav-cta"
              onClick={closeMenu}
            >
              Access Portal <ArrowUpRight />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="rp-hero">
          <div className="rp-container rp-hero-grid">
            <div className="rp-hero-copy">
              <div className="rp-eyebrow">
                <span className="rp-eyebrow-icon">
                  <Sparkles />
                </span>
                A smarter academic experience
              </div>

              <h1>
                Everything academic.
                <br />
                All in <em>one place.</em>
              </h1>

              <p className="rp-hero-description">
                A centralised platform designed to bring students, faculty,
                and administrators together. Access academic information,
                manage records, and stay connected throughout your academic
                journey.
              </p>

              <div className="rp-hero-actions">
                <Link to="/login/student" className="rp-button-primary">
                  Explore Student Portal <ArrowRight />
                </Link>

                <Link to="/programs" className="rp-button-secondary">
                  Discover Programs <ChevronRight />
                </Link>
              </div>

              <div className="rp-hero-note">
                <CheckCircle2 />
                <span>One platform. Dedicated access for every role.</span>
              </div>
            </div>

            {/* Role access panel */}
            <div className="rp-login-panel">
              <div className="rp-panel-heading">
                <div>
                  <h2>Welcome to your portal</h2>
                  <p>Select your role to continue to your workspace.</p>
                </div>

                <span className="rp-panel-heading-icon">
                  <UserRound />
                </span>
              </div>

              <div className="rp-role-list">
                {roles.map((role) => {
                  const Icon = role.icon;

                  return (
                    <Link
                      to={role.to}
                      className="rp-role-link"
                      key={role.role}
                    >
                      <span className="rp-role-icon">
                        <Icon />
                      </span>

                      <span className="rp-role-copy">
                        <span className="rp-role-title">{role.title}</span>
                        <span className="rp-role-description">
                          {role.description}
                        </span>
                      </span>

                      <span className="rp-role-arrow">
                        <ArrowUpRight />
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="rp-panel-footer">
                <ShieldCheck />
                Secure, role-based access to your academic workspace
              </div>
            </div>
          </div>
        </section>

        {/* Highlights strip */}
        <section className="rp-highlights" aria-label="Platform highlights">
          <div className="rp-container rp-highlights-grid">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div className="rp-highlight" key={item.title}>
                  <span className="rp-highlight-icon">
                    <Icon />
                  </span>

                  <span className="rp-highlight-copy">
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Introduction */}
        <section className="rp-section">
          <div className="rp-container rp-intro-grid">
            <div className="rp-intro-copy">
              <SectionLabel>Designed around your campus</SectionLabel>

              <h2 className="rp-section-heading">
                A connected campus.
                <br />
                A more <em>organised future.</em>
              </h2>

              <p className="rp-section-description">
                Academic life involves many moving parts. This platform
                brings essential student and faculty workflows together,
                helping make information easier to find and everyday academic
                tasks easier to manage.
              </p>

              <p className="rp-section-description">
                Whether you are checking academic information, managing
                records, or accessing your assigned responsibilities, start
                from one central place.
              </p>

              <Link to="/programs" className="rp-button-primary">
                Learn About Our Programs <ArrowRight />
              </Link>
            </div>

            <div className="rp-intro-image">
              <img
                className="rp-campus-image"
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85"
                alt="University campus building"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              <div className="rp-image-overlay" />

              <div className="rp-image-caption">
                <div>
                  <small>Our commitment</small>
                  <strong>Learning without boundaries.</strong>
                </div>

                <span className="rp-caption-dot">
                  <Building2 />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="rp-section rp-services-section">
          <div className="rp-container">
            <div className="rp-section-header">
              <div>
                <SectionLabel>What you can do</SectionLabel>
                <h2 className="rp-section-heading">
                  Essential tools.
                  <br />
                  <em>One connected system.</em>
                </h2>
              </div>

              <p className="rp-section-description">
                Find the academic information and everyday tools you need
                through a clear, centralised experience.
              </p>
            </div>

            <div className="rp-service-grid">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article className="rp-service-card" key={service.number}>
                    <span className="rp-service-number">
                      {service.number}
                    </span>

                    <span className="rp-service-icon">
                      <Icon />
                    </span>

                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="rp-section rp-how-section">
          <div className="rp-container rp-how-grid">
            <div className="rp-how-intro">
              <SectionLabel>Getting started</SectionLabel>

              <h2 className="rp-section-heading">
                Your academic workspace,
                <br />
                <em>in three steps.</em>
              </h2>

              <p className="rp-section-description">
                Getting started is straightforward. Choose the correct portal
                and follow the sign-in process to access the features available
                to your role.
              </p>
            </div>

            <div className="rp-step-list">
              {steps.map((step) => (
                <div className="rp-step" key={step.number}>
                  <span className="rp-step-number">{step.number}</span>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>

                  <span className="rp-step-check">
                    <CheckCircle2 />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portal directory */}
        <section className="rp-portals-section">
          <div className="rp-container">
            <div className="rp-portals-header">
              <SectionLabel>Portal directory</SectionLabel>

              <h2 className="rp-section-heading">
                The right access.
                <br />
                <em>For every role.</em>
              </h2>

              <p className="rp-section-description">
                Each portal provides a dedicated entry point for its intended
                users. Select your role below to continue.
              </p>
            </div>

            <div className="rp-portal-grid">
              {roles.map((role) => {
                const Icon = role.icon;

                return (
                  <Link
                    to={role.to}
                    className="rp-portal-card"
                    key={role.role}
                  >
                    <div className="rp-portal-top">
                      <span className="rp-portal-icon">
                        <Icon />
                      </span>

                      <span className="rp-portal-number">{role.number}</span>
                    </div>

                    <h3>{role.title}</h3>
                    <p>{role.description}</p>

                    <div className="rp-portal-card-bottom">
                      <span>Go to portal</span>
                      <ArrowRight />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact callout */}
        <section className="rp-contact-section">
          <div className="rp-container">
            <div className="rp-contact-banner">
              <div className="rp-contact-copy">
                <SectionLabel light>Need assistance?</SectionLabel>

                <h2>We're here to help you get started.</h2>

                <p>
                  Have a question about portal access or need help finding
                  information? Get in touch with the team.
                </p>
              </div>

              <Link to="/contact" className="rp-contact-button">
                Contact Us <ArrowUpRight />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="rp-footer">
        <div className="rp-container">
          <div className="rp-footer-main">
            <div className="rp-footer-brand">
              <Link to="/" className="rp-brand">
                <span className="rp-brand-mark">
                  <GraduationCap />
                </span>

                <span className="rp-brand-copy">
                  <span className="rp-brand-name">
                    Student Management
                  </span>
                  <span className="rp-brand-subtitle">
                    Academic Portal
                  </span>
                </span>
              </Link>

              <p>
                A centralised academic platform connecting students, faculty,
                and administrators through a simpler digital experience.
              </p>
            </div>

            <div className="rp-footer-links-wrap">
              <div className="rp-footer-column">
                <h4>Explore</h4>
                <Link to="/">Home</Link>
                <Link to="/programs">Programs</Link>
                <Link to="/contact">Contact</Link>
              </div>

              <div className="rp-footer-column">
                <h4>Portals</h4>
                <Link to="/login/student">Student</Link>
                <Link to="/login/admin">Administrator</Link>
                <Link to="/login/permanent-faculty">Permanent Faculty</Link>
                <Link to="/login/visiting-faculty">Visiting Faculty</Link>
              </div>
            </div>
          </div>

          <div className="rp-footer-bottom">
            <span>
              © {new Date().getFullYear()} Student Management System. All
              rights reserved.
            </span>

            <span>
              Built for a connected academic community <GraduationCap />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
