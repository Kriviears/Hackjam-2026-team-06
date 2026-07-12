import type { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

function DashboardCard({
  children,
  className = "",
  id,
  title,
  icon,
  action,
}: DashboardCardProps) {
  return (
    <section id={id} className={`dashboard-card ${className}`.trim()}>
      {(title || icon || action) && (
        <header className="dashboard-card-header">
          <div>
            {icon}
            {title && <h2>{title}</h2>}
          </div>

          {action}
        </header>
      )}

      {children}
    </section>
  );
}

export default DashboardCard;
