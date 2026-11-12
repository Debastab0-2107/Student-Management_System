import { Link } from "react-router-dom";
import {
  GraduationCap,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";

const roleIcons = {
  student: GraduationCap,
  admin: ShieldCheck,
  faculty: Users,
};

export default function RoleLoginCard({
  role,
  title,
  description,
  to,
}) {
  const Icon = roleIcons[role] || Users;

  return (
    <article className="role-card">
      <div className="role-card-icon">
        <Icon size={28} strokeWidth={1.7} />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <Link className="role-card-link" to={to}>
        Continue to login
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}
