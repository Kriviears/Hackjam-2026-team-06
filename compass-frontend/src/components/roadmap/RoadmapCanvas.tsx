import {
    List,
    PartyPopper,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import roadmapAvatar from "../../assets/roadmap-avatar1.png";
import type { RoadmapData } from "../../types/roadmap";
import type { RoadmapCanvasProps } from "../../types/roadmapComponents";
import RoadmapControls from "./RoadmapControls";
import RoadmapWaypoint from "./RoadmapWaypoint";

function getDestinationMessage(userType: RoadmapData["userType"]) {
    if (userType === "alumna") {
        return "You're Hired!";
    }

    if (userType === "currentLearner" || userType === "current_learner") {
        return "You Graduated!";
    }

    return "You're Admitted!";
}

function getPersonalizedDestination(userType: RoadmapData["userType"]) {
    if (userType === "alumna") {
        return "getting your dream job";
    }

    if (userType === "currentLearner" || userType === "current_learner") {
        return "graduating from Per Scholas";
    }

    return "becoming a Per Scholian";
}

function RoadmapCanvas({
    roadmap,
    userProfile,
    selectedWaypointId,
    highlightedWaypointId,
    highlightTone,
    travelerPosition,
    onSelectWaypoint,
    onHoverWaypoint,
}: RoadmapCanvasProps) {
    const navigate = useNavigate();
    const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({});
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const destinationMessage = getDestinationMessage(roadmap.userType);
    const personalizedDestination = getPersonalizedDestination(roadmap.userType);
    const firstName = userProfile?.firstName.trim();
    const journeyProgressPercent = roadmap.progressPercent;
    const roadProgressPercent = travelerPosition.roadProgressPercent;
    const travelerStyle = {
        "--traveler-left": travelerPosition.left,
        "--traveler-bottom": travelerPosition.bottom,
    } as CSSProperties;

    useEffect(() => {
        if (selectedWaypointId === null) {
            return;
        }

        cardRefs.current[selectedWaypointId]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });
    }, [selectedWaypointId]);

    const handleZoomOut = () => {
        setZoomLevel((currentZoom) => Math.max(0.85, currentZoom - 0.1));
    };

    const handleZoomIn = () => {
        setZoomLevel((currentZoom) => Math.min(1.25, currentZoom + 0.1));
    };

    const handleCenter = () => {
        setZoomLevel(1);
        canvasRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });
    };

    const handleRecalculate = () => {
        navigate("/onboarding");
    };

    return (
        <section className="roadmap-main">
            <header className="roadmap-header">
                <div>
                    <h1>{firstName ? `Welcome ${firstName}!` : "Welcome!"}</h1>

                    <p>
                        Here is your personalized roadmap from where you are today to your
                        {" "}
                        {personalizedDestination}.
                    </p>
                </div>
            </header>

            <div className="roadmap-view-actions">
                <button type="button" className="roadmap-outline-button">
                    <List size={18} />
                    View as List
                </button>
            </div>

            <div className="roadmap-canvas" ref={canvasRef}>
                <div
                    className="roadmap-stage"
                    style={{ "--roadmap-zoom": zoomLevel } as CSSProperties}
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
                            className="roadmap-path-progress"
                            fill="none"
                            pathLength={100}
                            style={{
                                strokeDasharray: `${roadProgressPercent} 100`,
                            }}
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

                    <div
                        className="roadmap-traveler roadmap-traveler--on-road"
                        style={travelerStyle}
                        aria-hidden="true"
                    >
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
                            highlightTone={
                                waypoint.id === highlightedWaypointId
                                    ? highlightTone
                                    : null
                            }
                            isFinal={waypoint.id === roadmap.waypoints.length}
                            onSelect={() => onSelectWaypoint(waypoint.id)}
                            onHoverChange={(isHovered) =>
                                onHoverWaypoint(isHovered ? waypoint.id : null)
                            }
                            cardRef={(element) => {
                                cardRefs.current[waypoint.id] = element;
                            }}
                        />
                    ))}
                </div>

                <div className="roadmap-map-progress" aria-label={`Journey progress ${journeyProgressPercent}%`}>
                    <span className="roadmap-map-progress-title">Journey Progress</span>

                    <div
                        className="roadmap-map-progress-chart"
                        style={{
                            background: `conic-gradient(#078aa4 ${journeyProgressPercent}%, rgba(219, 229, 238, 0.9) 0)`,
                        }}
                        aria-hidden="true"
                    >
                        <span>{journeyProgressPercent}%</span>
                    </div>

                    <p>
                        Every waypoint you finish brings you closer to your tech career.
                        <strong>Keep going!</strong>
                    </p>
                </div>

                <RoadmapControls
                    onZoomOut={handleZoomOut}
                    onZoomIn={handleZoomIn}
                    onCenter={handleCenter}
                    onRecalculate={handleRecalculate}
                />
            </div>
        </section>
    );
}

export default RoadmapCanvas;
