import { Link } from "react-router-dom";
import settings404Mockup from "../assets/settings404Mockup.png";

import "./SettingsPage.css";

function SettingsPage() {
  return (
    <main className="settings-page" aria-label="Settings page mockup">
      <div className="settings-mockup-frame">
        <img src={settings404Mockup} alt="Settings page mockup" />
        <Link
          className="settings-dashboard-hotspot"
          to="/dashboard"
          aria-label="Return to dashboard"
        />
        <Link
          className="settings-roadmap-hotspot"
          to="/roadmap"
          aria-label="Explore roadmap"
        />
      </div>
    </main>
  );
}

export default SettingsPage;
