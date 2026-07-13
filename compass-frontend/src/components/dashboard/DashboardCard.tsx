import type { DashboardCardProps } from "../../types/dashboardComponents";

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
