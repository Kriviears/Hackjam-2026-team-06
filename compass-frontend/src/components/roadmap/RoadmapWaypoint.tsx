import {
  Check,
  Laptop,
  Lock,
} from "lucide-react";
import type { RoadmapWaypoint as RoadmapWaypointType } from "../../types/roadmap";

interface RoadmapWaypointProps {
  waypoint: RoadmapWaypointType;
  isSelected: boolean;
  isCurrent: boolean;
  isFinal?: boolean;
  onSelect: () => void;
  cardRef?: (element: HTMLButtonElement | null) => void;
}

function RoadmapWaypoint({
  waypoint,
  isSelected,
  isCurrent,
  isFinal = false,
  onSelect,
  cardRef,
}: RoadmapWaypointProps) {
  const Icon = isCurrent ? Laptop : Lock;

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
        aria-pressed={isSelected}
      >
        {waypoint.id}
      </button>

      <button
        ref={cardRef}
        type="button"
        className="roadmap-waypoint-card"
        onClick={onSelect}
        aria-pressed={isSelected}
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
