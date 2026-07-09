// Request interface for initiating a new journey
export interface JourneyRequest {
  userType: "prospect" | "currentLearner" | "alumni" | "";
  // fullName: string;
  // email: string;
  careerGoal: string;
  experienceLevel: string;
  weeklyTimeCommitment: string;
}

// Interface for each waypoint in the journey   
export interface Waypoint {
  title: string;
  description: string;
  category: string;
  status: "complete" | "current" | "locked";
}

// Response interface for the journey, including progress and waypoints
export interface JourneyResponse {
  destination: string;
  currentStage: string;
  progressPercent: number;
  nextStep: string;
  waypoints: Waypoint[];
}