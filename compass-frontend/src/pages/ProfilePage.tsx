import { Link } from "react-router-dom";
import profile404Mockup from "../assets/profile404Mockup.png";

import "./ProfilePage.css";

function ProfilePage() {
  return (
    <main className="profile-page" aria-label="Profile page mockup">
      <div className="profile-mockup-frame">
        <img src={profile404Mockup} alt="Profile page mockup" />
        <Link
          className="profile-dashboard-hotspot"
          to="/dashboard"
          aria-label="Return to dashboard"
        />
      </div>
    </main>
  );
}

export default ProfilePage;
