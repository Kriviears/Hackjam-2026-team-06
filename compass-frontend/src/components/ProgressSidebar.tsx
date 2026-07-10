import {
  Check,
  Circle,
  CircleDot,
  Flag,
  ListChecks,
  LockKeyhole,
} from "lucide-react";
import type { Waypoint } from "../types/journey";

interface ProgressSidebarProps {
  waypoints: Waypoint[];
}

function ProgressSidebar({ waypoints }: ProgressSidebarProps) {
  const completedCount = waypoints.filter(
    (waypoint) => waypoint.status === "completed",
  ).length;

  const currentWaypoint = waypoints.find(
    (waypoint) => waypoint.status === "in-progress",
  );

  const getTimelineIcon = (status: Waypoint["status"]) => {
    switch (status) {
      case "completed":
        return <Check size={17} />;

      case "in-progress":
        return <CircleDot size={17} />;

      case "pending":
        return <LockKeyhole size={15} />;

      default:
        return <Circle size={15} />;
    }
  };

  return (
    <aside className="progress-sidebar">
      <div className="progress-sidebar-heading">
        <ListChecks size={22} />

        <div>
          <span>Journey Overview</span>
          <h2>Your Roadmap</h2>
        </div>
      </div>

      <div className="progress-statistics">
        <div className="progress-stat">
          <strong>{completedCount}</strong>
          <span>Completed</span>
        </div>

        <div className="progress-stat">
          <strong>{waypoints.length}</strong>
          <span>Total Steps</span>
        </div>
      </div>

      <div className="sidebar-waypoint-list">
        {waypoints.map((waypoint, index) => (
          <div
            className={`sidebar-waypoint sidebar-waypoint-${waypoint.status}`}
            key={`${waypoint.title}-${index}`}
          >
            <div className="sidebar-waypoint-marker">
              {getTimelineIcon(waypoint.status)}
            </div>

            <div className="sidebar-waypoint-copy">
              <span>Waypoint {index + 1}</span>
              <h3>{waypoint.title}</h3>
              <p>{waypoint.description}</p>
            </div>
          </div>
        ))}
      </div>

      {currentWaypoint && (
        <div className="current-focus-card">
          <div className="current-focus-heading">
            <Flag size={18} />
            <span>Current Focus</span>
          </div>

          <h3>{currentWaypoint.title}</h3>
          <p>{currentWaypoint.description}</p>
        </div>
      )}
    </aside>
  );
}

export default ProgressSidebar;
