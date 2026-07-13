import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import RoadmapSidebar from "../components/roadmap/RoadmapSidebar";
import RoadmapCanvas from "../components/roadmap/RoadmapCanvas";
import WaypointDetails from "../components/roadmap/WaypointDetails";

import type {
  JourneyResponse,
  RoadmapData,
  RoadmapWaypoint,
  WaypointStatus,
} from "../types/roadmap";
import type {
  Point,
  RoadmapLandingPosition,
  RoadmapLocationState,
} from "../types/roadmapPage";
import {
  applyStoredJourneyProgress,
  saveJourneyProgress,
} from "../utils/journeyProgressStorage";

import "./RoadmapPage.css";

const startLandingPosition: RoadmapLandingPosition = {
  leftPercent: 33,
  bottomPercent: 7,
  roadProgressPercent: 0,
};

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
  const leftPercent = (point.x / 800) * 100;
  const bottomPercent = ((1000 - point.y) / 1000) * 100 + 1.75;

  return {
    left: `${leftPercent}%`,
    bottom: `${bottomPercent}%`,
    leftPercent,
    bottomPercent,
    roadProgressPercent: progress * 100,
  };
}

function interpolateLandingPosition(
  from: RoadmapLandingPosition,
  to: RoadmapLandingPosition,
  progress: number,
) {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return {
    leftPercent:
      from.leftPercent + (to.leftPercent - from.leftPercent) * clampedProgress,
    bottomPercent:
      from.bottomPercent + (to.bottomPercent - from.bottomPercent) * clampedProgress,
    roadProgressPercent:
      from.roadProgressPercent +
      (to.roadProgressPercent - from.roadProgressPercent) * clampedProgress,
  };
}

function getRoadLandingAtProgress(roadProgressPercent: number) {
  const clampedRoadProgress = Math.max(0, Math.min(100, roadProgressPercent));
  const point = getPointAtRoadProgress(clampedRoadProgress / 100);
  const leftPercent = (point.x / 800) * 100;
  const bottomPercent = ((1000 - point.y) / 1000) * 100 + 1.75;

  return {
    leftPercent,
    bottomPercent,
    roadProgressPercent: clampedRoadProgress,
  };
}

function getSegmentLandingPosition(
  from: RoadmapLandingPosition,
  to: RoadmapLandingPosition,
  progress: number,
) {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  /*
   * The first movement starts from the banner, which is intentionally off-road.
   * Every later movement follows the sampled road curve between marker landings.
   */
  if (from.roadProgressPercent === 0) {
    return interpolateLandingPosition(from, to, clampedProgress);
  }

  return getRoadLandingAtProgress(
    from.roadProgressPercent +
      (to.roadProgressPercent - from.roadProgressPercent) * clampedProgress,
  );
}

function getAvatarPosition(waypoints: RoadmapWaypoint[]) {
  let previousLanding = startLandingPosition;

  for (const waypoint of waypoints) {
    if (waypoint.status === "locked") {
      break;
    }

    const completedTasks = waypoint.tasks.filter((task) => task.completed).length;
    const waypointProgress =
      waypoint.tasks.length > 0 ? completedTasks / waypoint.tasks.length : 0;
    const waypointLanding = waypoint.position;

    if (waypointProgress < 1) {
      const landing = getSegmentLandingPosition(
        previousLanding,
        waypointLanding,
        waypointProgress,
      );

      return {
        left: `${landing.leftPercent}%`,
        bottom: `calc(${landing.bottomPercent}% + 8.2rem)`,
        roadProgressPercent: landing.roadProgressPercent,
      };
    }

    previousLanding = waypointLanding;
  }

  return {
    left: `${previousLanding.leftPercent}%`,
    bottom: `calc(${previousLanding.bottomPercent}% + 8.2rem)`,
    roadProgressPercent: previousLanding.roadProgressPercent,
  };
}

function normalizeStatus(status: unknown, index: number): WaypointStatus {
  if (
    status === "completed" ||
    status === "in-progress" ||
    status === "not-started" ||
    status === "locked"
  ) {
    return status;
  }

  return index === 0 ? "in-progress" : "locked";
}

function normalizeTasks(
  tasks: unknown,
  waypointTitle: string,
) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return [
      {
        title: `Review ${waypointTitle}`,
        completed: false,
      },
      {
        title: `Complete ${waypointTitle}`,
        completed: false,
      },
      {
        title: `Document progress for ${waypointTitle}`,
        completed: false,
      },
    ];
  }

  return tasks.map((task, taskIndex) => {
    const taskRecord =
      task && typeof task === "object"
        ? (task as { title?: unknown; completed?: unknown })
        : {};

    return {
      title:
        typeof taskRecord.title === "string" && taskRecord.title.trim()
          ? taskRecord.title.trim()
          : `${waypointTitle} task ${taskIndex + 1}`,
      completed: false,
    };
  });
}

function getStatusFromTasks(
  tasks: RoadmapWaypoint["tasks"],
  index: number,
  previousWaypoint?: RoadmapWaypoint,
): WaypointStatus {
  if (index > 0 && previousWaypoint?.status !== "completed") {
    return "locked";
  }

  if (tasks.length > 0 && tasks.every((task) => task.completed)) {
    return "completed";
  }

  if (tasks.some((task) => task.completed)) {
    return "in-progress";
  }

  return "in-progress";
}

function normalizeWaypointProgress(waypoints: RoadmapWaypoint[]) {
  return waypoints.reduce<RoadmapWaypoint[]>((normalizedWaypoints, waypoint, index) => {
    const previousWaypoint = normalizedWaypoints[index - 1];

    normalizedWaypoints.push({
      ...waypoint,
      status: getStatusFromTasks(waypoint.tasks, index, previousWaypoint),
    });

    return normalizedWaypoints;
  }, []);
}

function calculateJourneyProgress(waypoints: RoadmapWaypoint[]) {
  if (waypoints.length === 0) {
    return 0;
  }

  if (waypoints.every((waypoint) => waypoint.status === "completed")) {
    return 100;
  }

  const waypointCompletionShare = Math.round(100 / waypoints.length);
  const progress = waypoints.reduce((totalProgress, waypoint) => {
    if (waypoint.status === "locked" || waypoint.tasks.length === 0) {
      return totalProgress;
    }

    const completedTasks = waypoint.tasks.filter((task) => task.completed).length;
    const checklistStepShare = waypointCompletionShare / waypoint.tasks.length;

    return totalProgress + completedTasks * checklistStepShare;
  }, 0);

  return Math.round(progress);
}

function buildRoadmapData(
  journeyResponse: JourneyResponse,
  userType: JourneyResponse["userType"],
): RoadmapData {
  const waypoints = journeyResponse.waypoints.map(
    (waypoint, index): RoadmapWaypoint => {
      const title = waypoint.title || `Waypoint ${index + 1}`;
      const status = normalizeStatus(waypoint.status, index);

      return {
        ...waypoint,
        title,
        status,
        tasks: normalizeTasks(
          (waypoint as { tasks?: unknown }).tasks,
          title,
        ),

        /*
         * These values are for React rendering and visual placement.
         * They are not AI-generated roadmap content.
         */
        id: index + 1,

        position: getWaypointPosition(index, journeyResponse.waypoints.length),
      };
    },
  );
  const normalizedWaypoints = normalizeWaypointProgress(waypoints);
  const resources = Array.isArray(journeyResponse.resources)
    ? journeyResponse.resources
    : [];

  return {
    ...journeyResponse,
    userType,
    progressPercent: calculateJourneyProgress(normalizedWaypoints),
    waypoints: normalizedWaypoints,
    resources,
  };
}

function getCurrentWaypointId(roadmap: RoadmapData | null) {
  if (!roadmap) {
    return null;
  }

  const currentWaypoint =
    roadmap.waypoints.find((waypoint) => waypoint.status === "in-progress") ??
    roadmap.waypoints.find((waypoint) => waypoint.status !== "completed") ??
    roadmap.waypoints[0];

  return currentWaypoint?.id ?? null;
}

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
