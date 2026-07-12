// Request interface for initiating a new journey
export interface UserProfile {
  firstName: string;
  lastName: string;
}

export interface JourneyRequest {
  firstName: string;
  lastName: string;

  userType:
    | "prospective_learner"
    | "current_learner"
    | "prospectiveLearner"
    | "currentLearner"
    | "alumna"
    | "";

  careerGoal: string;
  experienceLevel: string;
  weeklyTimeCommitment: string;

  existingSkills: string[];
  learningInterests: string[];
  targetTimeline: string;
  biggestChallenge: string;
  additionalNotes: string;
}

// Interface for each waypoint in the journey   
export interface WaypointTask {
  title: string;
  completed: boolean;
}

export interface Waypoint {
  title: string;
  description: string;
  category: string;
  status: "pending" | "not-started" | "locked" | "in-progress" | "completed";
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

// Response interface for the journey, including progress and waypoints
export interface JourneyResponse {
  id: string;
  destination: string;
  currentStage: string;
  progressPercent: number;
  nextStep: string;
  userType?: JourneyRequest["userType"];
  weeklyCommitment?: string;
  targetTimeline?: string;
  waypoints: Waypoint[];
  resources: LearningResource[];
  futureYou?: FutureYou;
}
