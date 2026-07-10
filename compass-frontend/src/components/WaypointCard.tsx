import {
  Check,
  Circle,
  LockKeyhole,
  MapPin,
  Play,
} from "lucide-react";
import type { Waypoint } from "../types/journey";

interface WaypointCardProps {
  waypoint: Waypoint;
  index: number;
}

function WaypointCard({ waypoint, index }: WaypointCardProps) {
  const getStatusIcon = () => {
    switch (waypoint.status) {
      case "completed":
        return <Check size={21} />;

      case "in-progress":
        return <Play size={18} fill="currentColor" />;

      case "pending":
        return <LockKeyhole size={18} />;

      default:
        return <Circle size={18} />;
    }
  };

  const getStatusLabel = () => {
    switch (waypoint.status) {
      case "completed":
        return "Completed";

      case "in-progress":
        return "Current Step";

      case "pending":
        return "Locked";

      default:
        return "Upcoming";
    }
  };

  return (
    <article className={`waypoint-card waypoint-${waypoint.status}`}>
      <div className="waypoint-number">
        <MapPin size={20} />
        <span>{index + 1}</span>
      </div>

      <div className="waypoint-card-content">
        <div className="waypoint-card-header">
          <span className="waypoint-category">{waypoint.category}</span>

          <span className={`waypoint-status status-${waypoint.status}`}>
            {getStatusIcon()}
            {getStatusLabel()}
          </span>
        </div>

        <h3>{waypoint.title}</h3>

        <p>{waypoint.description}</p>

        {waypoint.status === "in-progress" && (
          <button type="button" className="waypoint-action-button">
            Continue This Step
            <Play size={16} fill="currentColor" />
          </button>
        )}
      </div>
    </article>
  );
}

export default WaypointCard;
