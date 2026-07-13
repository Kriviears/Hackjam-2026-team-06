import {
  Clock3,
  LayoutDashboard,
  Map,
  Settings,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import type { RoadmapSidebarProps } from "../../types/roadmapComponents";

const userTypeLabels: Record<string, string> = {
  prospectiveLearner: "Prospective Learner",
  prospective_learner: "Prospective Learner",
  currentLearner: "Current Learner",
  current_learner: "Current Learner",
  alumna: "Alumna",
};

// Displays persistent journey context and navigation beside the roadmap.
function RoadmapSidebar({ roadmap, userProfile }: RoadmapSidebarProps) {
  const currentStageIndex = roadmap.waypoints.findIndex(
    (waypoint) =>
      waypoint.status === "in-progress" ||
      waypoint.title === roadmap.currentStage,
  );
  const currentStageNumber = currentStageIndex >= 0 ? currentStageIndex + 1 : 1;
  const firstName = userProfile?.firstName.trim();
  const lastName = userProfile?.lastName.trim();
  const learnerName =
    firstName || lastName
      ? `${firstName ?? ""} ${lastName ?? ""}`.trim()
      : "Your Profile";
  const initials =
    firstName || lastName
      ? `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase()
      : "YP";
  const learnerType = userTypeLabels[roadmap.userType ?? ""] ?? "Learner";

  return (
    <aside className="roadmap-sidebar">
      <div className="roadmap-brand">
        <span className="roadmap-brand-profile-ring">{initials}</span>

        <div>
          <strong>COMPASS</strong>
          <small>Find Your Direction in Tech</small>
        </div>
      </div>

      <nav className="roadmap-navigation">
        <NavLink
          to="/dashboard"
          state={{ journey: roadmap, userProfile }}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <a href="/roadmap" className="active">
          <Map size={20} />
          My Roadmap
        </a>

        <a href="/profile">
          <UserRound size={20} />
          Profile
        </a>

        <a href="/settings">
          <Settings size={20} />
          Settings
        </a>
      </nav>

      <section className="journey-card">
        <h3>Your Journey</h3>

        <div className="journey-details">
          <span>Learner</span>
          <strong>{learnerName}</strong>
          <small>{learnerType}</small>
        </div>

        <div className="journey-details">
          <span>Destination</span>
          <strong>{roadmap.destination}</strong>
        </div>

        <div className="journey-details">
          <span>Current Stage</span>
          <strong>{roadmap.currentStage}</strong>
          <small>
            Stage {currentStageNumber} of {roadmap.waypoints.length}
          </small>
        </div>

        <div className="journey-details">
          <span>Weekly Commitment</span>
          <div className="journey-commitment">
            <strong>{roadmap.weeklyCommitment}</strong>
            <Clock3 size={18} />
          </div>
        </div>
      </section>

      <blockquote className="roadmap-quote">
        <span>“</span>
        <p>The best way to predict the future is to create it.</p>
        <cite>— Peter Drucker</cite>
      </blockquote>
    </aside>
  );
}

export default RoadmapSidebar;
