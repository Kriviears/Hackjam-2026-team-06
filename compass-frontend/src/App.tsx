import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import GeneratePathwayPage from "./pages/GeneratePathwayPage";
import DashboardPage from "./pages/DashboardPage";
import RoadmapPage from "./pages/RoadmapPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";


// Defines the page routes available in the Compass single-page app.
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/onboarding"
        element={<OnboardingPage />}
      />

      <Route
        path="/generating-path"
        element={<GeneratePathwayPage />}
      />

      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />

      <Route
        path="/roadmap"
        element={<RoadmapPage />}
      />

      <Route
        path="/profile"
        element={<ProfilePage />}
      />

      <Route
        path="/settings"
        element={<SettingsPage />}
      />

    </Routes>

    
  );
}

export default App;
