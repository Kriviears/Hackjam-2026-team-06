import { Bell, ChevronDown } from "lucide-react";

function TopBar() {
  return (
    <header className="roadmap-topbar">
      <button
        type="button"
        className="notification-button"
        aria-label="View notifications"
      >
        <Bell size={22} />
        <span className="notification-dot" />
      </button>

      <button type="button" className="profile-button">
        <div className="profile-avatar" aria-hidden="true">
          FA
        </div>

        <span className="profile-name">Fabiola A.</span>

        <ChevronDown size={17} />
      </button>
    </header>
  );
}

export default TopBar;