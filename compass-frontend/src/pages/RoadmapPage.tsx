import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import RoadmapSidebar from "../components/roadmap/RoadmapSidebar";
import RoadmapCanvas from "../components/roadmap/RoadmapCanvas";
import WaypointDetails from "../components/roadmap/WaypointDetails";

import type {
  RoadmapData,
} from "../types/roadmap";
import type { RoadmapLocationState } from "../types/roadmapPage";
import {
  applyStoredJourneyProgress,
  saveJourneyProgress,
} from "../utils/journeyProgressStorage";
import { getAvatarPosition } from "../utils/roadmapGeometry";
import {
  buildRoadmapData,
  calculateJourneyProgress,
  getCurrentWaypointId,
  normalizeWaypointProgress,
} from "../utils/roadmapNormalization";

import "./RoadmapPage.css";

// Renders the roadmap page and owns task progress interactions.
function RoadmapPage() {
  const location = useLocation();
  const state = location.state as RoadmapLocationState | null;

  const journeyResponse = state?.roadmap;
  const userProfile = state?.userProfile;
  const getInitialRoadmap = () =>
    journeyResponse
      ? applyStoredJourneyProgress(
          buildRoadmapData(
            journeyResponse,
            state?.userType ?? journeyResponse.userType,
          ),
        )
      : null;
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(() =>
    getInitialRoadmap(),
  );
  const [selectedWaypointId, setSelectedWaypointId] = useState<number | null>(
    () => getCurrentWaypointId(getInitialRoadmap()),
  );
  const [hoveredWaypointId, setHoveredWaypointId] = useState<number | null>(
    null,
  );

  const handleToggleTask = (waypointId: number, taskIndex: number) => {
    if (!roadmap) {
      return;
    }

    const activeWaypoint = roadmap.waypoints.find(
      (waypoint) => waypoint.id === waypointId,
    );

    if (!activeWaypoint || activeWaypoint.status === "locked") {
      return;
    }

    const updatedWaypoints = roadmap.waypoints.map((waypoint) => {
      if (waypoint.id !== waypointId) {
        return waypoint;
      }

      return {
        ...waypoint,
        tasks: waypoint.tasks.map((task, index) =>
          index === taskIndex
            ? {
                ...task,
                completed: !task.completed,
              }
            : task,
        ),
      };
    });
    const normalizedWaypoints = normalizeWaypointProgress(updatedWaypoints);
    const updatedRoadmap = {
      ...roadmap,
      progressPercent: calculateJourneyProgress(normalizedWaypoints),
      waypoints: normalizedWaypoints,
    };
    const updatedWaypoint = normalizedWaypoints.find(
      (waypoint) => waypoint.id === waypointId,
    );

    setRoadmap(updatedRoadmap);

    if (
      updatedWaypoint?.status === "completed" &&
      selectedWaypointId === waypointId
    ) {
      const nextWaypoint =
        normalizedWaypoints.find((waypoint) => waypoint.id > waypointId) ??
        updatedWaypoint;

      setSelectedWaypointId(nextWaypoint.id);
      setHoveredWaypointId(null);
    }
  };

  useEffect(() => {
    if (roadmap) {
      saveJourneyProgress(roadmap);
    }
  }, [roadmap]);

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
    (selectedWaypointId === null
      ? null
      : roadmap.waypoints.find(
          (waypoint) => waypoint.id === selectedWaypointId,
        )) ??
    roadmap.waypoints[0];
  const highlightedWaypointId = hoveredWaypointId ?? selectedWaypointId;
  const highlightedWaypoint =
    highlightedWaypointId === null
      ? null
      : roadmap.waypoints.find((waypoint) => waypoint.id === highlightedWaypointId);
  const currentWaypointId = getCurrentWaypointId(roadmap);
  const highlightTone =
    highlightedWaypointId === null
      ? null
      : highlightedWaypoint?.status === "locked"
        ? "locked"
        : highlightedWaypointId === currentWaypointId
        ? "current"
        : "preview";
  const travelerPosition = getAvatarPosition(roadmap.waypoints);

  return (
    <main className="roadmap-page">
      <RoadmapSidebar roadmap={roadmap} userProfile={userProfile} />

      <RoadmapCanvas
        roadmap={roadmap}
        userProfile={userProfile}
        selectedWaypointId={selectedWaypointId}
        highlightedWaypointId={highlightedWaypointId}
        highlightTone={highlightTone}
        travelerPosition={travelerPosition}
        onSelectWaypoint={setSelectedWaypointId}
        onHoverWaypoint={setHoveredWaypointId}
      />

      <WaypointDetails
        roadmap={roadmap}
        waypoint={selectedWaypoint}
        totalWaypoints={roadmap.waypoints.length}
        highlightedWaypointId={highlightedWaypointId}
        highlightTone={highlightTone}
        onToggleTask={handleToggleTask}
      />
    </main>
  );
}

export default RoadmapPage;
