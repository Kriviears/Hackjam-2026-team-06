import { useLocation } from "react-router-dom";
import type { JourneyResponse, UserProfile } from "../types/journey";
import techLandscape from "../assets/tech-landscape.png";

import "./DashboardPage.css";

// DashboardPage component that displays the user's journey and progress
export default function DashboardPage() {
  const location = useLocation();
  const journey = location.state?.journey as JourneyResponse | undefined;
  const userProfile = location.state?.userProfile as UserProfile | undefined;
  const firstName = userProfile?.firstName.trim();

  if (!journey) {
    return (
      <main className="dashboard-page dashboard-empty">
        <p>No journey found. Please complete onboarding first.</p>
      </main>
    );
  }

  return (
    <main
      className="dashboard-page"
      style={{
        backgroundImage: `
          linear-gradient(180deg, rgba(235, 248, 255, 0.92) 0%, rgba(218, 239, 255, 0.62) 38%, rgba(7, 83, 150, 0.2) 100%),
          url(${techLandscape})
        `,
      }}
    >
      <div className="dashboard-motion-background" aria-hidden="true" />

      <section className="dashboard-panel">
        <h1>{firstName ? `${firstName}'s Compass Dashboard` : "Your Compass Dashboard"}</h1>

        <h2>{journey.destination}</h2>
        <p>Current Stage: {journey.currentStage}</p>
        <p>Progress: {journey.progressPercent}%</p>
        <p>Next Step: {journey.nextStep}</p>
      </section>

      <section className="dashboard-panel">
        <h2>Your Roadmap</h2>

        {journey.waypoints.map((waypoint, index) => (
          <article className="dashboard-waypoint" key={index}>
            <h3>{waypoint.title}</h3>
            <p>{waypoint.description}</p>
            <p>Category: {waypoint.category}</p>
            <p>Status: {waypoint.status}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
