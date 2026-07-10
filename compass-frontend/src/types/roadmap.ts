export type WaypointStatus =
  | "completed"
  | "in-progress"
  | "not-started"
  | "locked";

export interface JourneyWaypoint {
  title: string;
  description: string;
  category: string;
  status: WaypointStatus;
}

export interface JourneyResponse {
  destination: string;
  currentStage: string;
  progressPercent: number;
  nextStep: string;
  waypoints: JourneyWaypoint[];
}

export interface WaypointPosition {
  left: string;
  bottom: string;
}

export interface RoadmapWaypoint extends JourneyWaypoint {
  id: number;
  position: WaypointPosition;
}

export interface RoadmapData
  extends Omit<JourneyResponse, "waypoints"> {
  waypoints: RoadmapWaypoint[];
}