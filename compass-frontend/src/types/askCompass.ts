import type { JourneyProgressChart } from "./journeyProgress";
import type { JourneyResponse, UserProfile } from "./journey";

export interface AskCompassRequest {
  question: string;
  journey: JourneyResponse;
  userProfile: UserProfile;
  journeyProgressChart: JourneyProgressChart;
}

export interface AskCompassResponse {
  answer?: unknown;
  error?: unknown;
}
