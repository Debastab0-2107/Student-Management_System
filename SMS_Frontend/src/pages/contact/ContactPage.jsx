// File: src/pages/contact/ContactPage.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Landmark,
  User,
  FileText,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const contactDetails = [
  {
    icon: Mail,
    title: "Email Us",
    value: "info@dppinstitute.edu",
    description: "Send us your questions anytime.",
    action: "mailto:info@dppinstitute.edu",
    actionLabel: "Send an email",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+91 98765 43210",
    description: "Speak with our support team.",
    action: "tel:+919876543210",
    actionLabel: "Call now",
  },
  {
    icon: MapPin,
    title: "Visit Our Campus",
    value: "DPP Institute of Technology",
    description: "Contact the institute for directions.",
    action: null,
    actionLabel: null,
  },
];

const initialForm = {
  name: "",
  email: "",
  subject: "",
  category: "General Enquiry",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Frontend demonstration only.
    // Connect this handler to your backend API to send messages.
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className="contact-page">
      <style>{`
        .contact-page {
          --contact-navy: #101d3a;
          --contact-navy-light: #192c50;
          --contact-gold: #d5ad55;
          --contact-gold-light: #f3dfaa;
          --contact-text: #26334a;
          --contact-muted: #718096;
          --contact-border: #e5eaf2;
          min-height: 100vh;
          background: #f6f8fc;
          color: var(--contact-text);
          font-family: Inter, "Segoe UI", Arial, sans-serif;
          overflow: hidden;
        }

        .contact-page *,
        .contact-page *::before,
        .contact-page *::after {
          box-sizing: border-box;
        }

        .contact-page a {
          color: inherit;
          text-decoration: none;
        }

        .contact-page button,
        .contact-page input,
        .contact-page select,
        .contact-page textarea {
          font: inherit;
        }

        .contact-page .contact-container {
          width: min(1160px, calc(100% - 48px));
          margin: 0 auto;
        }

        .contact-page .contact-topbar {
          background: #fff;
          border-bottom: 1px solid #edf0f5;
        }

        .contact-page .contact-topbar-inner {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .contact-page .contact-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: var(--contact-navy);
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .contact-page .contact-brand-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--contact-navy);
          background: linear-gradient(
            145deg,
            var(--contact-gold-light),
            var(--contact-gold)
          );
          box-shadow: 0 7px 18px #d5ad5538;
        }

        .contact-page .contact-brand-name {
          display: block;
          font-size: 15px;
          line-height: 1.35;
        }

        .contact-page .contact-brand-subtitle {
          display: block;
          margin-top: 3px;
          color: #8490a3;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .contact-page .contact-back-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 15px;
          border: 1px solid var(--contact-border);
          border-radius: 11px;
          color: var(--contact-navy);
          font-size: 13px;
          font-weight: 700;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .contact-page .contact-back-link:hover {
          background: #f5f7fb;
          transform: translateX(-3px);
        }

        .contact-page .contact-hero {
          position: relative;
          isolation: isolate;
          padding: 78px 0 100px;
          background:
            radial-gradient(
              circle at 85% 18%,
              #d5ad5525,
              transparent 26%
            ),
            linear-gradient(
              120deg,
              #0d1832 0%,
              var(--contact-navy) 58%,
              #20385f 100%
            );
          color: #fff;
        }

        .contact-page .contact-hero::before {
          content: "";
          position: absolute;
          z-index: -1;
          width: 360px;
          height: 360px;
          right: -150px;
          bottom: -190px;
          border: 1px solid #ffffff12;
          border-radius: 50%;
          box-shadow:
            0 0 0 35px #ffffff08,
            0 0 0 70px #ffffff05;
        }

        .contact-page .contact-hero-content {
          max-width: 760px;
          animation: contact-fade-up 0.65s ease both;
        }

        .contact-page .contact-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 13px;
          border: 1px solid #d5ad5550;
          border-radius: 999px;
          background: #d5ad5512;
          color: var(--contact-gold-light);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        .contact-page .contact-hero h1 {
          margin: 25px 0 19px;
          max-width: 720px;
          font-size: clamp(38px, 5.4vw, 66px);
          line-height: 1.08;
          letter-spacing: -2.3px;
          font-weight: 800;
        }

        .contact-page .contact-hero h1 span {
          color: var(--contact-gold);
        }

        .contact-page .contact-hero-description {
          max-width: 600px;
          margin: 0;
          color: #d1d9e8;
          font-size: 16px;
          line-height: 1.85;
        }

        .contact-page .contact-hero-note {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 27px;
          color: #e4eaf4;
          font-size: 13px;
        }

        .contact-page .contact-hero-note svg {
          color: var(--contact-gold);
          flex-shrink: 0;
        }

        .contact-page .contact-main {
          position: relative;
          padding-bottom: 76px;
        }

        .contact-page .contact-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: -43px;
          position: relative;
          z-index: 2;
        }

        .contact-page .contact-info-card {
          min-width: 0;
          padding: 27px 25px 24px;
          background: #fff;
          border: 1px solid #edf0f5;
          border-radius: 18px;
          box-shadow: 0 15px 45px #1424450a;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
          animation: contact-fade-up 0.6s ease both;
        }

        .contact-page .contact-info-card:nth-child(2) {
          animation-delay: 0.08s;
        }

        .contact-page .contact-info-card:nth-child(3) {
          animation-delay: 0.16s;
        }

        .contact-page .contact-info-card:hover {
          transform: translateY(-6px);
          border-color: #e3cc91;
          box-shadow: 0 22px 48px #14244512;
        }

        .contact-page .contact-card-icon {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          margin-bottom: 21px;
          border-radius: 14px;
          background: #f8f0dc;
          color: #987126;
        }

        .contact-page .contact-info-card h2 {
          margin: 0 0 10px;
          color: var(--contact-navy);
          font-size: 17px;
          font-weight: 800;
        }

        .contact-page .contact-info-value {
          overflow-wrap: anywhere;
          color: #263650;
          font-size: 14px;
          font-weight: 700;
        }

        .contact-page .contact-info-description {
          min-height: 40px;
          margin: 10px 0 17px;
          color: var(--contact-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .contact-page .contact-card-action {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #987126;
          font-size: 12px;
          font-weight: 800;
        }

        .contact-page .contact-card-action:hover {
          color: var(--contact-navy);
        }

        .contact-page .contact-lower-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 45px;
          align-items: start;
          margin-top: 72px;
        }

        .contact-page .contact-section-label {
          display: inline-block;
          margin-bottom: 15px;
          color: #a17a2c;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        .contact-page .contact-intro h2 {
          margin: 0 0 18px;
          color: var(--contact-navy);
          font-size: clamp(30px, 3.5vw, 43px);
          line-height: 1.18;
          letter-spacing: -1.3px;
        }

        .contact-page .contact-intro > p {
          margin: 0;
          color: #6d7b91;
          font-size: 14px;
          line-height: 1.9;
        }

        .contact-page .contact-support-list {
          display: grid;
          gap: 20px;
          margin-top: 31px;
        }

        .contact-page .contact-support-item {
          display: flex;
          align-items: flex-start;
          gap: 13px;
        }

        .contact-page .contact-support-icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #fff;
          border: 1px solid var(--contact-border);
          color: #9b772e;
        }

        .contact-page .contact-support-item h3 {
          margin: 1px 0 5px;
          color: var(--contact-navy);
          font-size: 13px;
          font-weight: 800;
        }

        .contact-page .contact-support-item p {
          margin: 0;
          color: var(--contact-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .contact-page .contact-form-card {
          padding: 34px;
          border: 1px solid #e9edf4;
          border-radius: 21px;
          background: #fff;
          box-shadow: 0 20px 55px #17294a0a;
        }

        .contact-page .contact-form-heading {
          margin-bottom: 26px;
        }

        .contact-page .contact-form-heading h2 {
          margin: 0 0 9px;
          color: var(--contact-navy);
          font-size: 25px;
          letter-spacing: -0.7px;
        }

        .contact-page .contact-form-heading p {
          margin: 0;
          color: var(--contact-muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .contact-page .contact-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 19px;
        }

        .contact-page .contact-field {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .contact-page .contact-field-full {
          grid-column: 1 / -1;
        }

        .contact-page .contact-field label {
          color: #35435a;
          font-size: 12px;
          font-weight: 800;
        }

        .contact-page .contact-field input,
        .contact-page .contact-field select,
        .contact-page .contact-field textarea {
          width: 100%;
          min-width: 0;
          border: 1px solid #dfe5ef;
          border-radius: 10px;
          background: #fbfcfe;
          color: #25334a;
          outline: none;
          font-size: 13px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .contact-page .contact-field input,
        .contact-page .contact-field select {
          height: 46px;
          padding: 0 13px;
        }

        .contact-page .contact-field textarea {
          min-height: 130px;
          padding: 13px;
          resize: vertical;
          line-height: 1.7;
        }

        .contact-page .contact-field input::placeholder,
        .contact-page .contact-field textarea::placeholder {
          color: #a1aabb;
        }

        .contact-page .contact-field input:focus,
        .contact-page .contact-field select:focus,
        .contact-page .contact-field textarea:focus {
          border-color: #c6a04b;
          background: #fff;
          box-shadow: 0 0 0 4px #d5ad5520;
        }

        .contact-page .contact-submit {
          width: 100%;
          min-height: 49px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 23px;
          padding: 13px 18px;
          border: none;
          border-radius: 11px;
          background: var(--contact-navy);
          color: #fff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 9px 20px #101d3a20;
          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .contact-page .contact-submit:hover {
          transform: translateY(-2px);
          background: #20365d;
          box-shadow: 0 12px 25px #101d3a2b;
        }

        .contact-page .contact-submit:focus-visible,
        .contact-page .contact-back-link:focus-visible,
        .contact-page .contact-card-action:focus-visible {
          outline: 3px solid #d5ad5580;
          outline-offset: 3px;
        }

        .contact-page .contact-form-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 15px 0 0;
          color: #8792a4;
          font-size: 11px;
          line-height: 1.7;
        }

        .contact-page .contact-form-disclaimer svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: #9b772e;
        }

        .contact-page .contact-success {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 22px;
          padding: 15px;
          border: 1px solid #b7e4ca;
          border-radius: 12px;
          background: #effaf3;
          color: #17643a;
          animation: contact-fade-up 0.3s ease both;
        }

        .contact-page .contact-success svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-page .contact-success strong {
          display: block;
          margin-bottom: 4px;
          font-size: 13px;
        }

        .contact-page .contact-success p {
          margin: 0;
          font-size: 12px;
          line-height: 1.7;
        }

        .contact-page .contact-bottom-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-top: 65px;
          padding: 27px 30px;
          border: 1px solid #e9d9ad;
          border-radius: 17px;
          background: linear-gradient(110deg, #fffaf0, #fff);
        }

        .contact-page .contact-bottom-banner h2 {
          margin: 0 0 7px;
          color: var(--contact-navy);
          font-size: 17px;
        }

        .contact-page .contact-bottom-banner p {
          margin: 0;
          color: var(--contact-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .contact-page .contact-program-link {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 17px;
          border-radius: 10px;
          background: var(--contact-gold);
          color: #19243a;
          font-size: 12px;
          font-weight: 800;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .contact-page .contact-program-link:hover {
          transform: translateY(-2px);
          background: #e6c879;
        }

        .contact-page .contact-footer {
          padding: 25px 0;
          border-top: 1px solid #e7ebf2;
          background: #fff;
        }

        .contact-page .contact-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #8390a3;
          font-size: 11px;
        }

        .contact-page .contact-footer-brand {
          color: var(--contact-navy);
          font-weight: 800;
        }

        @keyframes contact-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .contact-page .contact-lower-grid {
            grid-template-columns: 1fr;
            gap: 35px;
            margin-top: 55px;
          }

          .contact-page .contact-intro {
            max-width: 650px;
          }

          .contact-page .contact-support-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .contact-page .contact-container {
            width: min(100% - 32px, 560px);
          }

          .contact-page .contact-topbar-inner {
            min-height: 68px;
          }

          .contact-page .contact-brand-icon {
            width: 39px;
            height: 39px;
          }

          .contact-page .contact-brand-name {
            font-size: 13px;
          }

          .contact-page .contact-brand-subtitle {
            font-size: 9px;
          }

          .contact-page .contact-back-link {
            gap: 6px;
            padding: 9px 10px;
            font-size: 11px;
          }

          .contact-page .contact-hero {
            padding: 59px 0 78px;
          }

          .contact-page .contact-hero h1 {
            margin-top: 22px;
            font-size: clamp(37px, 9vw, 52px);
            letter-spacing: -1.5px;
          }

          .contact-page .contact-hero-description {
            font-size: 14px;
          }

          .contact-page .contact-cards {
            grid-template-columns: 1fr;
            gap: 13px;
            margin-top: -30px;
          }

          .contact-page .contact-info-card {
            padding: 21px;
          }

          .contact-page .contact-card-icon {
            width: 43px;
            height: 43px;
            margin-bottom: 15px;
          }

          .contact-page .contact-info-description {
            min-height: 0;
            margin-bottom: 12px;
          }

          .contact-page .contact-support-list {
            grid-template-columns: 1fr;
          }

          .contact-page .contact-form-card {
            padding: 23px 18px;
            border-radius: 16px;
          }

          .contact-page .contact-form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .contact-page .contact-field-full {
            grid-column: auto;
          }

          .contact-page .contact-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            margin-top: 45px;
            padding: 23px 20px;
          }

          .contact-page .contact-footer-inner {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-page *,
          .contact-page *::before,
          .contact-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Top navigation */}
      <header className="contact-topbar">
        <div className="contact-container contact-topbar-inner">
          <Link to="/" className="contact-brand">
            <span className="contact-brand-icon">
              <Landmark size={23} />
            </span>

            <span>
              <span className="contact-brand-name">
                DPP Institute of Technology
              </span>
              <span className="contact-brand-subtitle">
                Student Management Portal
              </span>
            </span>
          </Link>

          <Link to="/" className="contact-back-link">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section className="contact-hero">
        <div className="contact-container">
          <div className="contact-hero-content">
            <div className="contact-eyebrow">
              <Sparkles size={14} />
              We're Here to Help
            </div>

            <h1>
              Let's start a
              <br />
              <span>conversation.</span>
            </h1>

            <p className="contact-hero-description">
              Have a question about academics, student services, or your
              student portal? Reach out to us. Our team is here to help
              you find the right information and support.
            </p>

            <div className="contact-hero-note">
              <ShieldCheck size={18} />
              <span>
                Your questions matter. We're happy to assist.
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="contact-main">
        <div className="contact-container">
          {/* Contact information cards */}
          <section
            className="contact-cards"
            aria-label="Contact information"
          >
            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <article className="contact-info-card" key={item.title}>
                  <div className="contact-card-icon">
                    <Icon size={22} />
                  </div>

                  <h2>{item.title}</h2>

                  <div className="contact-info-value">
                    {item.value}
                  </div>

                  <p className="contact-info-description">
                    {item.description}
                  </p>

                  {item.action && (
                    <a
                      className="contact-card-action"
                      href={item.action}
                    >
                      {item.actionLabel}
                      <ArrowRight size={15} />
                    </a>
                  )}
                </article>
              );
            })}
          </section>

          {/* Introduction and form */}
          <section className="contact-lower-grid">
            <div className="contact-intro">
              <span className="contact-section-label">
                Get in Touch
              </span>

              <h2>
                How can we
                <br />
                help you today?
              </h2>

              <p>
                Whether you're a student, parent, or prospective
                applicant, you can contact us using the form. Choose
                the topic that best describes your question so the
                right team can assist you.
              </p>

              <div className="contact-support-list">
                <div className="contact-support-item">
                  <div className="contact-support-icon">
                    <Clock size={19} />
                  </div>

                  <div>
                    <h3>Office Hours</h3>
                    <p>
                      Monday – Friday
                      <br />
                      10:00 AM – 5:00 PM
                    </p>
                  </div>
                </div>

                <div className="contact-support-item">
                  <div className="contact-support-icon">
                    <MessageCircle size={19} />
                  </div>

                  <div>
                    <h3>General Enquiries</h3>
                    <p>
                      Questions about admissions, academics,
                      and student services.
                    </p>
                  </div>
                </div>

                <div className="contact-support-item">
                  <div className="contact-support-icon">
                    <GraduationCap size={20} />
                  </div>

                  <div>
                    <h3>Student Support</h3>
                    <p>
                      Help with portal access and student-related
                      information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <div className="contact-form-heading">
                <h2>Send us a message</h2>
                <p>
                  Fill in the details below and tell us how we can help.
                </p>
              </div>

              {submitted && (
                <div
                  className="contact-success"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2 size={21} />

                  <div>
                    <strong>Form submitted successfully!</strong>
                    <p>
                      This is a frontend demonstration. Your message
                      has not been sent or stored. Connect the form
                      to your backend API to enable real submissions.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="contact-form-grid">
                  <div className="contact-field">
                    <label htmlFor="contact-name">
                      Full Name *
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-email">
                      Email Address *
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="contact-field contact-field-full">
                    <label htmlFor="contact-category">
                      Enquiry Type *
                    </label>

                    <select
                      id="contact-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option>General Enquiry</option>
                      <option>Admissions</option>
                      <option>Academic Support</option>
                      <option>Student Portal</option>
                      <option>Technical Issue</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="contact-field contact-field-full">
                    <label htmlFor="contact-subject">
                      Subject *
                    </label>

                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      placeholder="What is your message about?"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="contact-field contact-field-full">
                    <label htmlFor="contact-message">
                      Your Message *
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                </div>

                <button className="contact-submit" type="submit">
                  <Send size={16} />
                  Submit Message
                  <ArrowRight size={16} />
                </button>

                <p className="contact-form-disclaimer">
                  <ShieldCheck size={15} />
                  Please don't include passwords or sensitive personal
                  information in your message.
                </p>
              </form>
            </div>
          </section>

          {/* Bottom call to action */}
          <section className="contact-bottom-banner">
            <div>
              <h2>Looking for something else?</h2>
              <p>
                Explore the institute's available programmes and
                learn more about your academic options.
              </p>
            </div>

            <Link to="/programs" className="contact-program-link">
              Explore Programmes
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="contact-container contact-footer-inner">
          <span className="contact-footer-brand">
            DPP Institute of Technology
          </span>

          <span>
            © {new Date().getFullYear()} DPP Institute. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
