import {
    Bell,
    List,
    Share2,
} from "lucide-react";
import techLandscape from "../../assets/tech-landscape.png";
import type { RoadmapData } from "../../types/roadmap";
import RoadmapControls from "./RoadmapControls";
import RoadmapWaypoint from "./RoadmapWaypoint";

interface RoadmapCanvasProps {
    roadmap: RoadmapData;
    selectedWaypointId: number;
    onSelectWaypoint: (id: number) => void;
}

function RoadmapCanvas({
    roadmap,
    selectedWaypointId,
    onSelectWaypoint,
}: RoadmapCanvasProps) {
    return (
        <section className="roadmap-main">
            <header className="roadmap-header">
                <div>
                    <nav className="roadmap-breadcrumb">
                        <span>My Roadmap</span>
                        <span>›</span>
                        <span>Full Roadmap</span>
                    </nav>

                    <h1>Your Full Roadmap</h1>

                    <p>
                        Your personalized path from where you are today to your
                        dream career.
                    </p>
                </div>

                <div className="roadmap-header-actions">
                    <button type="button" className="roadmap-outline-button">
                        <Share2 size={18} />
                        Share Roadmap
                    </button>

                    <button
                        type="button"
                        className="roadmap-icon-button"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                    </button>

                    <button type="button" className="roadmap-profile-button">
                        <span className="roadmap-avatar">FA</span>
                        <span>Fabiola A.</span>
                    </button>
                </div>
            </header>

            <div className="roadmap-view-actions">
                <button type="button" className="roadmap-outline-button">
                    <List size={18} />
                    View as List
                </button>
            </div>

            <div
                className="roadmap-canvas"
                style={{
                    backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(239, 247, 255, 0.2),
              rgba(11, 101, 205, 0.13)
            ),
            url(${techLandscape})
          `,
                }}
            >
                <svg
                    className="roadmap-path"
                    viewBox="0 0 800 1000"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    fill="none"
                >
                    <path
                        className="roadmap-path-glow"
                        d="
              M 280 950
              C 380 880, 230 810, 355 740
              C 470 675, 250 610, 360 545
              C 475 475, 315 420, 420 350
              C 525 280, 390 220, 520 145
              C 590 105, 610 70, 625 20
            "
                    />

                    <path
                        className="roadmap-path-base"
                        d="
              M 280 950
              C 380 880, 230 810, 355 740
              C 470 675, 250 610, 360 545
              C 475 475, 315 420, 420 350
              C 525 280, 390 220, 520 145
              C 590 105, 610 70, 625 20
            "
                    />

                    <path
                        className="roadmap-path-center"
                        d="
              M 280 950
              C 380 880, 230 810, 355 740
              C 470 675, 250 610, 360 545
              C 475 475, 315 420, 420 350
              C 525 280, 390 220, 520 145
              C 590 105, 610 70, 625 20
            "
                    />
                </svg>

                <div className="roadmap-you-are-here">
                    <span>You are</span>
                    <strong>here</strong>
                </div>

                <div className="roadmap-traveler" aria-hidden="true">
                    <div className="traveler-head" />
                    <div className="traveler-body" />
                    <div className="traveler-backpack" />
                    <div className="traveler-leg traveler-leg-left" />
                    <div className="traveler-leg traveler-leg-right" />
                </div>

                {roadmap.waypoints.map((waypoint) => (
                    <RoadmapWaypoint
                        key={waypoint.id}
                        waypoint={waypoint}
                        isSelected={waypoint.id === selectedWaypointId}
                        onSelect={() => onSelectWaypoint(waypoint.id)}
                    />
                ))}

                <RoadmapControls />
            </div>
        </section>
    );
}

export default RoadmapCanvas;