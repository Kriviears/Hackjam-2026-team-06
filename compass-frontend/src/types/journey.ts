// Request interface for initiating a new journey
export interface JourneyRequest {
  userType:
    | "prospective_learner"
    | "current_learner"
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
export interface Waypoint {
  title: string;
  description: string;
  category: string;
   status: "pending" | "in-progress" | "completed";
}

// Response interface for the journey, including progress and waypoints
export interface JourneyResponse {
  id: string;
  destination: string;
  currentStage: string;
  progressPercent: number;
  nextStep: string;
  waypoints: Waypoint[];
}