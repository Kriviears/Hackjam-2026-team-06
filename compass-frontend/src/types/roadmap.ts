export type WaypointStatus =
  | "completed"
  | "in-progress"
  | "not-started"
  | "locked";

export interface WaypointTask {
  title: string;
  completed: boolean;
}

export interface JourneyWaypoint {
  title: string;
  description: string;
  category: string;
  status: WaypointStatus;
  tasks: WaypointTask[];
}

export interface JourneyResponse {
  destination: string;
  currentStage: string;
  progressPercent: number;
  nextStep: string;
  userType?:
    | "prospective_learner"
    | "current_learner"
    | "prospectiveLearner"
    | "currentLearner"
    | "alumna"
    | "";
  weeklyCommitment?: string;
  waypoints: JourneyWaypoint[];
}

export interface WaypointPosition {
  left: string;
  bottom: string;
  leftPercent: number;
  bottomPercent: number;
  roadProgressPercent: number;
}

export interface RoadmapWaypoint extends JourneyWaypoint {
  id: number;
  position: WaypointPosition;
}

export interface RoadmapData
  extends Omit<JourneyResponse, "waypoints"> {
  waypoints: RoadmapWaypoint[];
}
