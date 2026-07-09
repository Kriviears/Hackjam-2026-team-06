export interface JourneyRequest {
  userType: string;
  careerGoal: string;
  experienceLevel: string;
  weeklyTimeCommitment: string;
}

export interface Waypoint {
  title: string;
  description: string;
  category: string;
  status: "complete" | "current" | "locked";
}

export interface JourneyResponse {
  destination: string;
  currentStage: string;
  progressPercent: number;
  nextStep: string;
  waypoints: Waypoint[];
}