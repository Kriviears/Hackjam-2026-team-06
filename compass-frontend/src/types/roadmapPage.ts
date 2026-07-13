import type { JourneyResponse } from "./roadmap";
import type { UserProfile } from "./journey";

export interface RoadmapLocationState {
  roadmap?: JourneyResponse;
  userType?: JourneyResponse["userType"];
  userProfile?: UserProfile;
}

export interface Point {
  x: number;
  y: number;
}

export interface RoadmapLandingPosition {
  leftPercent: number;
  bottomPercent: number;
  roadProgressPercent: number;
}
