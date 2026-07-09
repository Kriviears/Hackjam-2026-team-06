import { useLocation } from "react-router-dom";
import type { JourneyResponse } from "../types/journey";

export default function DashboardPage() {
  const location = useLocation();
  const journey = location.state?.journey as JourneyResponse | undefined;

  if (!journey) {
    return <p>No journey found. Please complete onboarding first.</p>;
  }

  return (
    <main>
      <h1>Your Compass Dashboard</h1>

      <section>
        <h2>{journey.destination}</h2>
        <p>Current Stage: {journey.currentStage}</p>
        <p>Progress: {journey.progressPercent}%</p>
        <p>Next Step: {journey.nextStep}</p>
      </section>

      <section>
        <h2>Your Roadmap</h2>

        {journey.waypoints.map((waypoint, index) => (
          <article key={index}>
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