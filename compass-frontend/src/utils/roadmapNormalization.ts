import type {
  JourneyResponse,
  RoadmapData,
  RoadmapWaypoint,
  WaypointStatus,
} from "../types/roadmap";
import { getWaypointPosition } from "./roadmapGeometry";

// Safely normalizes backend statuses for roadmap rendering.
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

// Converts backend tasks into unchecked roadmap checklist items.
function normalizeTasks(tasks: unknown, waypointTitle: string) {
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

// Derives waypoint status from checklist completion and previous waypoint state.
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

// Recomputes locked/current/completed waypoint state after checklist changes.
export function normalizeWaypointProgress(waypoints: RoadmapWaypoint[]) {
  return waypoints.reduce<RoadmapWaypoint[]>((normalizedWaypoints, waypoint, index) => {
    const previousWaypoint = normalizedWaypoints[index - 1];

    normalizedWaypoints.push({
      ...waypoint,
      status: getStatusFromTasks(waypoint.tasks, index, previousWaypoint),
    });

    return normalizedWaypoints;
  }, []);
}

// Calculates total journey progress from completed waypoint tasks.
export function calculateJourneyProgress(waypoints: RoadmapWaypoint[]) {
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

// Converts a generated journey response into positioned roadmap data.
export function buildRoadmapData(
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
        tasks: normalizeTasks((waypoint as { tasks?: unknown }).tasks, title),

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

// Finds the waypoint that should be selected by default.
export function getCurrentWaypointId(roadmap: RoadmapData | null) {
  if (!roadmap) {
    return null;
  }

  const currentWaypoint =
    roadmap.waypoints.find((waypoint) => waypoint.status === "in-progress") ??
    roadmap.waypoints.find((waypoint) => waypoint.status !== "completed") ??
    roadmap.waypoints[0];

  return currentWaypoint?.id ?? null;
}
