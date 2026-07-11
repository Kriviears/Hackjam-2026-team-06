import {
    Bell,
    List,
    PartyPopper,
    Share2,
} from "lucide-react";
import roadmapAvatar from "../../assets/roadmap-avatar1.png";
import type { UserProfile } from "../../types/journey";
import type { RoadmapData } from "../../types/roadmap";
import RoadmapControls from "./RoadmapControls";
import RoadmapWaypoint from "./RoadmapWaypoint";

interface RoadmapCanvasProps {
    roadmap: RoadmapData;
    userProfile?: UserProfile;
    selectedWaypointId: number;
    onSelectWaypoint: (id: number) => void;
}

function getDestinationMessage(userType: RoadmapData["userType"]) {
    if (userType === "alumna") {
        return "You're Hired!";
    }

    if (userType === "currentLearner" || userType === "current_learner") {
        return "You Graduated!";
    }

    return "You're Admitted!";
}

function RoadmapCanvas({
    roadmap,
    userProfile,
    selectedWaypointId,
    onSelectWaypoint,
}: RoadmapCanvasProps) {
    const destinationMessage = getDestinationMessage(roadmap.userType);
    const firstName = userProfile?.firstName.trim();
    const lastName = userProfile?.lastName.trim();
    const displayName =
        firstName && lastName
            ? `${firstName} ${lastName.charAt(0)}.`
            : firstName || "Your Profile";
    const initials =
        firstName || lastName
            ? `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase()
            : "YP";
    const possessiveName = firstName ? `${firstName}'s` : "Your";

    return (
        <section className="roadmap-main">
            <header className="roadmap-header">
                <div>
                    <nav className="roadmap-breadcrumb">
                        <span>My Roadmap</span>
                        <span>›</span>
                        <span>Full Roadmap</span>
                    </nav>

                    <h1>{possessiveName} Full Roadmap</h1>

                    <p>
                        {firstName ? `${firstName}'s` : "Your"} personalized path from where you are today to your
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
                        <span className="roadmap-avatar">{initials}</span>
                        <span>{displayName}</span>
                    </button>
                </div>
            </header>

            <div className="roadmap-view-actions">
                <button type="button" className="roadmap-outline-button">
                    <List size={18} />
                    View as List
                </button>
            </div>

            <div className="roadmap-canvas">
                <div className="roadmap-stage">
                    <svg
                        className="roadmap-path"
                        viewBox="0 0 800 1000"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        fill="none"
                    >
                        <path
                            className="roadmap-path-glow"
                            fill="none"
                            d="
                M 295 910
                C 250 850, 260 770, 385 720
                C 560 642, 590 545, 430 475
                C 270 405, 300 300, 495 248
                C 650 206, 710 126, 635 40
              "
                        />

                        <path
                            className="roadmap-path-base"
                            fill="none"
                            d="
                M 295 910
                C 250 850, 260 770, 385 720
                C 560 642, 590 545, 430 475
                C 270 405, 300 300, 495 248
                C 650 206, 710 126, 635 40
              "
                        />

                        <path
                            className="roadmap-path-center"
                            fill="none"
                            d="
                M 295 910
                C 250 850, 260 770, 385 720
                C 560 642, 590 545, 430 475
                C 270 405, 300 300, 495 248
                C 650 206, 710 126, 635 40
              "
                        />
                    </svg>

                    <div className="roadmap-traveler" aria-hidden="true">
                        <img src={roadmapAvatar} alt="" />
                    </div>

                    <div className="roadmap-start-banner">
                        Your Future Starts Here!
                    </div>

                    <div className="roadmap-destination-badge">
                        <span className="roadmap-destination-icon">
                            <PartyPopper size={20} />
                        </span>

                        <span>Congratulations!</span>
                        <strong>{destinationMessage}</strong>
                    </div>

                    {roadmap.waypoints.map((waypoint) => (
                        <RoadmapWaypoint
                            key={waypoint.id}
                            waypoint={waypoint}
                            isSelected={waypoint.id === selectedWaypointId}
                            isFinal={waypoint.id === roadmap.waypoints.length}
                            onSelect={() => onSelectWaypoint(waypoint.id)}
                        />
                    ))}
                </div>

                <RoadmapControls />
            </div>
        </section>
    );
}

export default RoadmapCanvas;
