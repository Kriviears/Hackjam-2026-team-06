import {
  BookOpen,
  Bot,
  ChartNoAxesColumnIncreasing,
  CircleUserRound,
  LayoutDashboard,
  Map,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="roadmap-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">✦</div>

        <div>
          <h2>COMPASS</h2>
          <p>Find Your Direction in Tech</p>
        </div>
      </div>

      <nav className="sidebar-navigation" aria-label="Main navigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <LayoutDashboard size={21} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/roadmap"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Map size={21} />
          <span>My Roadmap</span>
        </NavLink>

        <NavLink
          to="/skills"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <ChartNoAxesColumnIncreasing size={21} />
          <span>Skills &amp; Progress</span>
        </NavLink>

        <NavLink
          to="/resources"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <BookOpen size={21} />
          <span>Resources</span>
        </NavLink>

        <NavLink
          to="/assistant"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Bot size={21} />
          <span>AI Assistant</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <CircleUserRound size={21} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Settings size={21} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-ai-card">
        <div className="sidebar-ai-card-heading">
          <Bot size={19} />
          <h3>AI is working for you</h3>
        </div>

        <p>
          Our AI analyzes your goals, skills, and interests to create a
          personalized path designed for your success.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;