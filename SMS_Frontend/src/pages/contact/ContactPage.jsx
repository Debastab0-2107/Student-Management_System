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
} from "lucide-react";
import "./ContactPage.css";

const contactDetails = [
  {
    icon: Mail,
    title: "Email Us",
    value: "info@dppinstitute.edu",
    description: "Send us your questions anytime.",
    href: "mailto:info@dppinstitute.edu",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+91 98765 43210",
    description: "Contact our support team.",
    href: "tel:+919876543210",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "DPP Institute of Technology",
    description: "Contact the institute for campus directions.",
    href: null,
  },
  {
    icon: Clock,
    title: "Office Hours",
    value: "Monday – Friday",
    description: "10:00 AM – 5:00 PM (indicative hours)",
    href: null,
  },
];

export default function ContactPage() {
  const handleSubmit = (event) => {
    event.preventDefault();

    // Demo form only: no backend or email service is connected.
    window.alert(
      "Thank you for contacting us! This is a demo form. Your message has not been sent to the institute."
    );

    event.target.reset();
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <div className="contact-header-inner">
          <Link to="/" className="contact-brand">
            <span className="contact-brand-icon">
              <Landmark size={25} />
            </span>

            <span className="contact-brand-text">
              <strong>DPP Institute of Technology</strong>
              <small>Student Management System</small>
            </span>
          </Link>

          <nav className="contact-navigation" aria-label="Contact navigation">
            <Link to="/" className="contact-nav-link">
              Home
            </Link>

            <Link to="/programs" className="contact-nav-link">
              Programs
            </Link>

            <Link to="/#portal" className="contact-nav-link">
              Portals
            </Link>

            <Link to="/" className="contact-home-button">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="contact-hero">
          <div className="contact-hero-pattern" />

          <div className="contact-hero-inner">
            <span className="contact-eyebrow">
              WE'RE HERE TO HELP
            </span>

            <h1>
              Get in <span>Touch</span>
            </h1>

            <p>
              Have a question about academic information or the Student
              Management System? We are here to help you find the right
              information.
            </p>

            <div className="contact-breadcrumb">
              <Link to="/">Home</Link>
              <ArrowRight size={14} />
              <span>Contact Us</span>
            </div>
          </div>
        </section>

        {/* Contact details */}
        <section className="contact-details-section">
          <div className="contact-container">
            <div className="contact-section-heading">
              <span className="contact-eyebrow contact-eyebrow-light">
                CONTACT INFORMATION
              </span>

              <h2>We'd Love to Hear From You</h2>

              <p>
                Choose a contact option below to get in touch with our
                institute.
              </p>
            </div>

            <div className="contact-details-grid">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;

                const content = (
                  <>
                    <span className="contact-detail-icon">
                      <Icon size={25} />
                    </span>

                    <h3>{detail.title}</h3>
                    <strong className="contact-detail-value">
                      {detail.value}
                    </strong>
                    <p>{detail.description}</p>

                    {detail.href && (
                      <span className="contact-detail-action">
                        Contact us <ArrowRight size={15} />
                      </span>
                    )}
                  </>
                );

                return (
                  <article className="contact-detail-card" key={detail.title}>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="contact-detail-link"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="contact-detail-content">
                        {content}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Message form and information panel */}
        <section className="contact-message-section">
          <div className="contact-container contact-message-grid">
            <div className="contact-message-intro">
              <span className="contact-eyebrow contact-eyebrow-light">
                SEND AN ENQUIRY
              </span>

              <h2>
                Let's Start a <span>Conversation.</span>
              </h2>

              <p>
                Fill out the form with your details and enquiry. This
                demonstration form shows the intended interface; connecting
                it to a backend or email service can be done later.
              </p>

              <div className="contact-help-card">
                <span className="contact-help-icon">
                  <MessageCircle size={23} />
                </span>

                <div>
                  <h3>Need help with the portal?</h3>
                  <p>
                    For account access, academic records, or student
                    services, use the relevant portal after signing in.
                  </p>

                  <Link to="/#portal">
                    Explore login portals <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="contact-trust-note">
                <span>
                  <FileText size={18} />
                </span>
                <p>
                  Please do not include passwords or other sensitive
                  account information in an enquiry.
                </p>
              </div>
            </div>

            <div className="contact-form-card">
              <div className="contact-form-heading">
                <span className="contact-form-heading-icon">
                  <Send size={22} />
                </span>

                <div>
                  <h2>Send Us a Message</h2>
                  <p>All fields are required.</p>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-field">
                  <label htmlFor="contact-name">Full Name</label>

                  <div className="contact-input-wrap">
                    <User size={18} aria-hidden="true" />

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-email">Email Address</label>

                  <div className="contact-input-wrap">
                    <Mail size={18} aria-hidden="true" />

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-subject">Subject</label>

                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="What is your enquiry about?"
                    required
                  />
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-message">Your Message</label>

                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Write your message here..."
                    required
                  />
                </div>

                <button type="submit" className="contact-submit-button">
                  Submit Enquiry <ArrowRight size={18} />
                </button>

                <p className="contact-form-disclaimer">
                  Demo only — this form does not send or store your message.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Closing banner */}
        <section className="contact-bottom-banner">
          <div className="contact-container contact-bottom-content">
            <div>
              <span className="contact-eyebrow">
                DPP INSTITUTE OF TECHNOLOGY
              </span>

              <h2>Your academic journey matters to us.</h2>

              <p>
                Access your academic services through the Student
                Management System.
              </p>
            </div>

            <Link to="/#portal" className="contact-bottom-button">
              Access Student Portal <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="contact-footer">
        <div className="contact-container contact-footer-inner">
          <Link to="/" className="contact-footer-brand">
            <Landmark size={22} />
            <span>DPP Institute of Technology</span>
          </Link>

          <p>
            © {new Date().getFullYear()} DPP Institute of Technology.
            All rights reserved.
          </p>

          <Link to="/" className="contact-footer-link">
            Return Home ↑
          </Link>
        </div>
      </footer>
    </div>
  );
}
