import { useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import RoadmapSidebar from "../components/roadmap/RoadmapSidebar";
import RoadmapCanvas from "../components/roadmap/RoadmapCanvas";
import WaypointDetails from "../components/roadmap/WaypointDetails";

import type {
  JourneyResponse,
  RoadmapWaypoint,
} from "../types/roadmap";
import type { UserProfile } from "../types/journey";

import "./RoadmapPage.css";

interface RoadmapLocationState {
  roadmap?: JourneyResponse;
  userType?: JourneyResponse["userType"];
  userProfile?: UserProfile;
}

interface Point {
  x: number;
  y: number;
}

const roadSegments: Array<[Point, Point, Point, Point]> = [
  [
    { x: 295, y: 910 },
    { x: 250, y: 850 },
    { x: 260, y: 770 },
    { x: 385, y: 720 },
  ],
  [
    { x: 385, y: 720 },
    { x: 560, y: 642 },
    { x: 590, y: 545 },
    { x: 430, y: 475 },
  ],
  [
    { x: 430, y: 475 },
    { x: 270, y: 405 },
    { x: 300, y: 300 },
    { x: 495, y: 248 },
  ],
  [
    { x: 495, y: 248 },
    { x: 650, y: 206 },
    { x: 710, y: 126 },
    { x: 635, y: 40 },
  ],
];

function getCubicPoint([start, controlA, controlB, end]: [Point, Point, Point, Point], t: number) {
  const inverse = 1 - t;

  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * t * controlA.x +
      3 * inverse * t ** 2 * controlB.x +
      t ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * t * controlA.y +
      3 * inverse * t ** 2 * controlB.y +
      t ** 3 * end.y,
  };
}

function getRoadSamples() {
  const samples: Array<Point & { length: number }> = [];
  let previous = roadSegments[0][0];
  let length = 0;

  samples.push({ ...previous, length });

  roadSegments.forEach((segment) => {
    for (let step = 1; step <= 32; step += 1) {
      const point = getCubicPoint(segment, step / 32);
      length += Math.hypot(point.x - previous.x, point.y - previous.y);
      samples.push({ ...point, length });
      previous = point;
    }
  });

  return samples;
}

const roadSamples = getRoadSamples();
const roadLength = roadSamples[roadSamples.length - 1].length;

function getPointAtRoadProgress(progress: number) {
  const targetLength = roadLength * progress;
  const nextIndex = roadSamples.findIndex((sample) => sample.length >= targetLength);

  if (nextIndex <= 0) {
    return roadSamples[0];
  }

  const next = roadSamples[nextIndex];
  const previous = roadSamples[nextIndex - 1];
  const segmentLength = next.length - previous.length || 1;
  const localProgress = (targetLength - previous.length) / segmentLength;

  return {
    x: previous.x + (next.x - previous.x) * localProgress,
    y: previous.y + (next.y - previous.y) * localProgress,
  };
}

function getWaypointPosition(index: number, total: number) {
  const startProgress = 0.18;
  const endProgress = 0.92;
  const progress =
    total <= 1
      ? 0.58
      : startProgress + ((endProgress - startProgress) * index) / (total - 1);
  const point = getPointAtRoadProgress(progress);

  return {
    left: `${(point.x / 800) * 100}%`,
    bottom: `${((1000 - point.y) / 1000) * 100 + 1.75}%`,
  };
}

function RoadmapPage() {
  const location = useLocation();
  const state = location.state as RoadmapLocationState | null;

  const journeyResponse = state?.roadmap;
  const userProfile = state?.userProfile;

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
      userType: state?.userType ?? journeyResponse.userType,

      waypoints: journeyResponse.waypoints.map(
        (waypoint, index): RoadmapWaypoint => ({
          ...waypoint,

          /*
           * These values are for React rendering and visual placement.
           * They are not AI-generated roadmap content.
           */
          id: index + 1,

          position: getWaypointPosition(index, journeyResponse.waypoints.length),
        }),
      ),
    };
  }, [journeyResponse, state?.userType]);

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
        userProfile={userProfile}
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
