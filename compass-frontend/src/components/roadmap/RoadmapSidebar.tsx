import {
  BarChart3,
  BookOpen,
  Clock3,
  LayoutDashboard,
  Map,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import compassLogo from "../../assets/compass-logo.png";
import type { RoadmapData } from "../../types/roadmap";

interface RoadmapSidebarProps {
  roadmap: RoadmapData;
}

function RoadmapSidebar({ roadmap }: RoadmapSidebarProps) {
  return (
    <aside className="roadmap-sidebar">
      <div className="roadmap-brand">
        <img src={compassLogo} alt="" className="roadmap-brand-logo" />

        <div>
          <strong>COMPASS</strong>
          <small>Find Your Direction in Tech</small>
        </div>
      </div>

      <nav className="roadmap-navigation">
        <a href="/dashboard">
          <LayoutDashboard size={20} />
          Dashboard
        </a>

        <a href="/roadmap" className="active">
          <Map size={20} />
          My Roadmap
        </a>

        <a href="/skills">
          <BarChart3 size={20} />
          Skills &amp; Progress
        </a>

        <a href="/resources">
          <BookOpen size={20} />
          Resources
        </a>

        <a href="/assistant">
          <Sparkles size={20} />
          AI Assistant
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

        <div
          className="journey-progress"
          style={{
            background: `conic-gradient(
              #0879e8 ${roadmap.progressPercent}%,
              #dce6f2 0
            )`,
          }}
        >
          <div>
            <strong>{roadmap.progressPercent}%</strong>
          </div>
        </div>

        <p>Overall Progress</p>

        <div className="journey-details">
          <span>Current Stage</span>
          <strong>{roadmap.currentStage}</strong>
          <small>Stage 2 of {roadmap.waypoints.length}</small>
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
