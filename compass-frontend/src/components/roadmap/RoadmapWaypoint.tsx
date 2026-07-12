import {
  Check,
  Lock,
} from "lucide-react";
import type { RoadmapWaypoint as RoadmapWaypointType } from "../../types/roadmap";

interface RoadmapWaypointProps {
  waypoint: RoadmapWaypointType;
  highlightTone?: "current" | "preview" | null;
  isFinal?: boolean;
  onSelect: () => void;
  onHoverChange?: (isHovered: boolean) => void;
  cardRef?: (element: HTMLButtonElement | null) => void;
}

function RoadmapWaypoint({
  waypoint,
  highlightTone = null,
  isFinal = false,
  onSelect,
  onHoverChange,
  cardRef,
}: RoadmapWaypointProps) {
  const isHighlighted = highlightTone !== null;

  return (
    <article
      className={`roadmap-waypoint roadmap-waypoint--${waypoint.status} ${
        isHighlighted ? "roadmap-waypoint--selected" : ""
      } ${
        highlightTone ? `roadmap-waypoint--highlight-${highlightTone}` : ""
      } ${
        isFinal ? "roadmap-waypoint--final" : ""
      }`}
      style={{
        left: waypoint.position.left,
        bottom: waypoint.position.bottom,
      }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
    >
      <button
        type="button"
        className="roadmap-node"
        onClick={onSelect}
        aria-label={`Open ${waypoint.title}`}
        aria-pressed={isHighlighted}
      >
        {waypoint.id}
      </button>

      <button
        ref={cardRef}
        type="button"
        className="roadmap-waypoint-card"
        onClick={onSelect}
        aria-pressed={isHighlighted}
      >
        <span className="roadmap-waypoint-copy">
          <strong>{waypoint.title}</strong>

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
