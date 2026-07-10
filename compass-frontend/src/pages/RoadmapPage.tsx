import { Navigate, useLocation } from "react-router-dom";
import CompassProgress from "../components/CompassProgress";
import ProgressSidebar from "../components/ProgressSidebar";
import Sidebar from "../components/Sidebar";
import RoadTimeline from "../components/RoadTimeline";
import TopBar from "../components/TopBar";
import type { JourneyResponse } from "../types/journey";
import "./RoadmapPage.css";

interface RoadmapLocationState {
  roadmap?: JourneyResponse;
}

function RoadmapPage() {
  const location = useLocation();

  const state = location.state as RoadmapLocationState | null;
  const roadmap = state?.roadmap;

  if (!roadmap) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="roadmap-page">
      <Sidebar />

      <main className="roadmap-main">
        <TopBar />

        <header className="roadmap-page-header">
          <span>Your personalized career journey</span>
          <h1>Navigate Your Path to {roadmap.destination}</h1>
          <p>
            Follow your customized waypoints, build the right skills, and move
            steadily toward your career destination.
          </p>
        </header>

        <CompassProgress
          destination={roadmap.destination}
          stage={roadmap.currentStage}
          progress={roadmap.progressPercent}
          nextStep={roadmap.nextStep}
        />

        <RoadTimeline waypoints={roadmap.waypoints} />
      </main>

      <ProgressSidebar waypoints={roadmap.waypoints} />
    </div>
  );
}

export default RoadmapPage;