import {
  BarChart3,
  BriefcaseBusiness,
  Check,
  Code2,
  Compass,
  Database,
  Lock,
  Rocket,
} from "lucide-react";
import type { RoadmapWaypoint as RoadmapWaypointType } from "../../types/roadmap";

interface RoadmapWaypointProps {
  waypoint: RoadmapWaypointType;
  isSelected: boolean;
  isFinal?: boolean;
  onSelect: () => void;
}

const iconMap = {
  Orientation: Compass,
  Foundations: Database,
  "Technical Skills": Code2,
  Projects: BriefcaseBusiness,
  "Advanced Skills": BarChart3,
  "Career Launch": Rocket,
};

function RoadmapWaypoint({
  waypoint,
  isSelected,
  isFinal = false,
  onSelect,
}: RoadmapWaypointProps) {
  const Icon =
    iconMap[waypoint.category as keyof typeof iconMap] ?? Compass;

  return (
    <article
      className={`roadmap-waypoint roadmap-waypoint--${waypoint.status} ${
        isSelected ? "roadmap-waypoint--selected" : ""
      } ${
        isFinal ? "roadmap-waypoint--final" : ""
      }`}
      style={{
        left: waypoint.position.left,
        bottom: waypoint.position.bottom,
      }}
    >
      <button
        type="button"
        className="roadmap-node"
        onClick={onSelect}
        aria-label={`Open ${waypoint.title}`}
      >
        {waypoint.id}
      </button>

      <button
        type="button"
        className="roadmap-waypoint-card"
        onClick={onSelect}
      >
        <span className="roadmap-waypoint-icon">
          <Icon size={24} />
        </span>

        <span className="roadmap-waypoint-copy">
          <strong>{waypoint.title}</strong>
          <span>{waypoint.description}</span>

          {waypoint.status === "completed" && (
            <small className="waypoint-status waypoint-status--complete">
              <Check size={13} />
              Completed
            </small>
          )}

          {waypoint.status === "in-progress" && (
            <small className="waypoint-status waypoint-status--progress">
              In progress
            </small>
          )}

          {waypoint.status === "locked" && (
            <small className="waypoint-lock">
              <Lock size={14} />
            </small>
          )}
        </span>
      </button>
    </article>
  );
}

export default RoadmapWaypoint;
