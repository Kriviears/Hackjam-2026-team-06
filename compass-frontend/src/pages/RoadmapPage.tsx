import { useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import RoadmapSidebar from "../components/roadmap/RoadmapSidebar";
import RoadmapCanvas from "../components/roadmap/RoadmapCanvas";
import WaypointDetails from "../components/roadmap/WaypointDetails";

import type {
  JourneyResponse,
  RoadmapWaypoint,
} from "../types/roadmap";

import "./RoadmapPage.css";

interface RoadmapLocationState {
  roadmap?: JourneyResponse;
}

const waypointPositions = [
  {
    left: "47%",
    bottom: "7%",
  },
  {
    left: "50%",
    bottom: "24%",
  },
  {
    left: "50%",
    bottom: "43%",
  },
  {
    left: "51%",
    bottom: "60%",
  },
  {
    left: "57%",
    bottom: "75%",
  },
  {
    left: "66%",
    bottom: "88%",
  },
];

function RoadmapPage() {
  const location = useLocation();
  const state = location.state as RoadmapLocationState | null;

  const journeyResponse = state?.roadmap;

  /*
   * Start with the current waypoint rather than always selecting waypoint 2.
   * If the response is unavailable, default temporarily to 1.
   */
  const initialWaypointId =
    journeyResponse?.waypoints.findIndex(
      (waypoint) =>
        waypoint.status === "in-progress" ||
        waypoint.title === journeyResponse.currentStage,
    ) ?? 0;

  const [selectedWaypointId, setSelectedWaypointId] =
    useState<number>(initialWaypointId + 1);

  /*
   * Convert the backend JourneyResponse into the frontend shape needed
   * by the visual components.
   *
   * The actual roadmap content still comes from the backend.
   */
  const roadmap = useMemo(() => {
    if (!journeyResponse) {
      return null;
    }

    return {
      ...journeyResponse,

      waypoints: journeyResponse.waypoints.map(
        (waypoint, index): RoadmapWaypoint => ({
          ...waypoint,

          /*
           * These values are for React rendering and visual placement.
           * They are not AI-generated roadmap content.
           */
          id: index + 1,

          position:
            waypointPositions[index] ??
            waypointPositions[waypointPositions.length - 1],
        }),
      ),
    };
  }, [journeyResponse]);

  /*
   * No mock roadmap:
   * send the user back to onboarding if they reached this page without
   * generating a roadmap.
   */
  if (!roadmap) {
    return (
      <Navigate
        to="/onboarding"
        replace
        state={{
          error:
            "Please complete onboarding to generate your roadmap.",
        }}
      />
    );
  }

  const selectedWaypoint =
    roadmap.waypoints.find(
      (waypoint) => waypoint.id === selectedWaypointId,
    ) ?? roadmap.waypoints[0];

  return (
    <main className="roadmap-page">
      <RoadmapSidebar roadmap={roadmap} />

      <RoadmapCanvas
        roadmap={roadmap}
        selectedWaypointId={selectedWaypointId}
        onSelectWaypoint={setSelectedWaypointId}
      />

      <WaypointDetails
        waypoint={selectedWaypoint}
        totalWaypoints={roadmap.waypoints.length}
      />
    </main>
  );
}

export default RoadmapPage;