import { MapPinned } from "lucide-react";
import type { Waypoint } from "../types/journey";
import WaypointCard from "./WaypointCard";

interface RoadTimelineProps {
  waypoints: Waypoint[];
}

function RoadTimeline({ waypoints }: RoadTimelineProps) {
  if (!waypoints || waypoints.length === 0) {
    return (
      <section className="road-timeline-section">
        <div className="section-heading">
          <MapPinned size={24} />

          <div>
            <span>Your Journey</span>
            <h2>Your Career Roadmap</h2>
          </div>
        </div>

        <div className="empty-roadmap-message">
          <h3>No waypoints are available yet.</h3>
          <p>Return to onboarding to generate your personalized roadmap.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="road-timeline-section">
      <div className="section-heading">
        <MapPinned size={24} />

        <div>
          <span>Your Journey</span>
          <h2>Your Career Roadmap</h2>
        </div>
      </div>

      <div className="road-timeline">
        <div className="road-timeline-line" aria-hidden="true" />

        {waypoints.map((waypoint, index) => (
          <WaypointCard
            key={`${waypoint.title}-${index}`}
            waypoint={waypoint}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

export default RoadTimeline;