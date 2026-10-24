import { useParams, Link } from "react-router-dom";

const FEATURES = {
  profile: {
    title: "My Profile",
    description: "View your student profile and personal details.",
  },
  "ca-marks": {
    title: "CA Marks",
    description: "View your continuous assessment marks.",
  },
  "university-marks": {
    title: "University Marks",
    description: "View your university examination marks.",
  },
  "course-overview": {
    title: "Course Overview",
    description: "View information about your courses.",
  },
  notices: {
    title: "Announcements",
    description: "View announcements from your department.",
  },
  payments: {
    title: "Payments",
    description: "Payment information will be available here.",
  },
  activities: {
    title: "Activities",
    description: "Student activities will be available here.",
  },
};

export default function StudentFeaturePage() {
  const { feature } = useParams();
  const page = FEATURES[feature];

  return (
    <main className="student-feature-page">
      <style>{`
        .student-feature-page {
          padding: 32px;
          color: #202b49;
          font-family: inherit;
        }

        .student-feature-card {
          max-width: 760px;
          padding: 30px;
          background: #ffffff;
          border: 1px solid #e8ebf2;
          border-radius: 18px;
          box-shadow: 0 8px 24px rgba(30, 43, 73, 0.05);
        }

        .student-feature-card h1 {
          margin: 0 0 12px;
          font-size: 28px;
        }

        .student-feature-card p {
          color: #75809a;
          line-height: 1.7;
        }

        .student-feature-back {
          display: inline-block;
          margin-top: 16px;
          color: #a97928;
          font-weight: 600;
          text-decoration: none;
        }

        .student-feature-back:hover {
          text-decoration: underline;
        }
      `}</style>

      <section className="student-feature-card">
        <h1>{page?.title || "Student Portal"}</h1>

        <p>
          {page?.description ||
            "This section is not available yet."}
        </p>

        <p>
          This page is a placeholder until its student-specific
          functionality is connected.
        </p>

        <Link
          className="student-feature-back"
          to="/student/dashboard"
        >
          ← Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
