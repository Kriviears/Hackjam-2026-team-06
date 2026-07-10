import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { RoadmapWaypoint } from "../../types/roadmap";

interface WaypointDetailsProps {
  waypoint: RoadmapWaypoint;
  totalWaypoints: number;
}

function WaypointDetails({
  waypoint,
  totalWaypoints,
}: WaypointDetailsProps) {
  return (
    <aside className="waypoint-panel">
      <section className="waypoint-summary-card">
        <p className="waypoint-eyebrow">
          Waypoint {waypoint.id} of {totalWaypoints}
        </p>

        <div className="waypoint-title-row">
          <h2>{waypoint.title}</h2>

          <span
            className={`panel-status panel-status--${waypoint.status}`}
          >
            {waypoint.status.replace("-", " ")}
          </span>
        </div>

        <p className="waypoint-description">
          {waypoint.description}
        </p>

        <div className="waypoint-category">
          <span>Category</span>
          <strong>{waypoint.category}</strong>
        </div>
      </section>

      <section className="waypoint-panel-card">
        <h3>Waypoint Status</h3>

        <div className="skill-check-row">
          <CheckCircle2 size={18} />

          <span>
            {waypoint.status === "completed"
              ? "This waypoint is complete."
              : waypoint.status === "in-progress"
                ? "You are currently working on this waypoint."
                : waypoint.status === "locked"
                  ? "Complete the previous waypoint to unlock this stage."
                  : "This waypoint has not been started."}
          </span>
        </div>
      </section>

      <button type="button" className="waypoint-action-button">
        {waypoint.status === "completed"
          ? "Review Waypoint"
          : waypoint.status === "in-progress"
            ? "Continue Journey"
            : "View Waypoint"}

        <ArrowRight size={18} />
      </button>
    </aside>
  );
}

export default WaypointDetails;