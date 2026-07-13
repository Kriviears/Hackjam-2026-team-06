export interface ProgressTask {
  title: string;
  completed: boolean;
}

export interface ProgressWaypoint {
  title: string;
  description?: string;
  category?: string;
  status: string;
  tasks: ProgressTask[];
}

export interface ProgressJourney {
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

export interface StoredJourneyProgress {
  waypoints: ProgressWaypoint[];
  progressPercent: number;
  chart?: JourneyProgressChart;
}
