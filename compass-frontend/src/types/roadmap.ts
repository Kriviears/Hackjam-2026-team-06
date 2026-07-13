// Core roadmap display types used by the roadmap page and components.
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

export interface LearningResource {
  title: string;
  type: "book" | "video" | "course" | "documentation" | "worksheet" | "website";
  url?: string;
  reason: string;
}

export interface FutureYouCompany {
  name: string;
  reason: string;
}

export interface FutureYouOpportunity {
  title: string;
  reason: string;
}

export interface FutureYou {
  title: string;
  summary: string;
  roles: string[];
  companies: FutureYouCompany[];
  opportunityTypes: FutureYouOpportunity[];
  networkingActions: string[];
  nextOpportunity: string;
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
  targetTimeline?: string;
  waypoints: JourneyWaypoint[];
  resources: LearningResource[];
  futureYou?: FutureYou;
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
