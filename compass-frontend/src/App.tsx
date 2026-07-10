import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import GeneratePathwayPage from "./pages/GeneratePathwayPage";
import DashboardPage from "./pages/DashboardPage";
import RoadmapPage from "./pages/RoadmapPage";

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
    </Routes>
  );
}

export default App;
