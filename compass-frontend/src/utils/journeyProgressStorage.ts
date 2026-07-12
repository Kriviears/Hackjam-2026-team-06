interface ProgressTask {
  title: string;
  completed: boolean;
}

interface ProgressWaypoint {
  title: string;
  description?: string;
  category?: string;
  status: string;
  tasks: ProgressTask[];
}

interface ProgressJourney {
  id?: string;
  destination: string;
  currentStage: string;
  nextStep?: string;
  progressPercent: number;
  waypoints: ProgressWaypoint[];
}

export interface JourneyProgressChart {
  progressPercent: number;
  completedWaypoints: number;
  totalWaypoints: number;
  currentWaypointTitle: string | null;
  nextWaypointTitle: string | null;
  waypoints: ProgressWaypoint[];
}

interface StoredJourneyProgress {
  waypoints: ProgressWaypoint[];
  progressPercent: number;
  chart?: JourneyProgressChart;
}

function getJourneyProgressStorageKey(journey: Pick<ProgressJourney, "id" | "destination" | "currentStage" | "nextStep">) {
  const identity = journey.id || `${journey.destination}-${journey.currentStage}-${journey.nextStep ?? ""}`;
  return `compass-journey-progress-${encodeURIComponent(identity.toLowerCase())}`;
}

export function readJourneyProgress(journey: Pick<ProgressJourney, "id" | "destination" | "currentStage" | "nextStep">) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(getJourneyProgressStorageKey(journey));
    return stored ? (JSON.parse(stored) as StoredJourneyProgress) : null;
  } catch {
    return null;
  }
}

export function buildJourneyProgressChart(journey: ProgressJourney): JourneyProgressChart {
  const completedWaypoints = journey.waypoints.filter(
    (waypoint) => waypoint.status === "completed",
  ).length;
  const currentWaypoint =
    journey.waypoints.find((waypoint) => waypoint.status === "in-progress") ??
    journey.waypoints.find((waypoint) => waypoint.status !== "completed") ??
    null;
  const nextWaypoint =
    journey.waypoints.find((waypoint) => waypoint.status !== "completed") ??
    currentWaypoint;

  return {
    progressPercent: journey.progressPercent,
    completedWaypoints,
    totalWaypoints: journey.waypoints.length,
    currentWaypointTitle: currentWaypoint?.title ?? null,
    nextWaypointTitle: nextWaypoint?.title ?? null,
    waypoints: journey.waypoints.map((waypoint) => ({
      title: waypoint.title,
      description: waypoint.description,
      category: waypoint.category,
      status: waypoint.status,
      tasks: waypoint.tasks.map((task) => ({
        title: task.title,
        completed: task.completed,
      })),
    })),
  };
}

export function saveJourneyProgress(journey: ProgressJourney) {
  if (typeof window === "undefined") {
    return;
  }

  const chart = buildJourneyProgressChart(journey);
  const progress: StoredJourneyProgress = {
    progressPercent: chart.progressPercent,
    waypoints: chart.waypoints,
    chart,
  };

  window.localStorage.setItem(
    getJourneyProgressStorageKey(journey),
    JSON.stringify(progress),
  );
}

export function applyStoredJourneyProgress<TJourney extends ProgressJourney>(journey: TJourney): TJourney {
  const stored = readJourneyProgress(journey);

  if (!stored) {
    return journey;
  }

  return {
    ...journey,
    progressPercent: stored.progressPercent,
    waypoints: journey.waypoints.map((waypoint, index) => {
      const storedWaypoint =
        stored.waypoints[index]?.title === waypoint.title
          ? stored.waypoints[index]
          : stored.waypoints.find((candidate) => candidate.title === waypoint.title);

      if (!storedWaypoint) {
        return waypoint;
      }

      return {
        ...waypoint,
        status: storedWaypoint.status,
        tasks: waypoint.tasks.map((task, taskIndex) => {
          const storedTask =
            storedWaypoint.tasks[taskIndex]?.title === task.title
              ? storedWaypoint.tasks[taskIndex]
              : storedWaypoint.tasks.find((candidate) => candidate.title === task.title);

          return storedTask
            ? {
                ...task,
                completed: storedTask.completed,
              }
            : task;
        }),
      };
    }),
  };
}
