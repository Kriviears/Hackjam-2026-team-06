import type { LucideIcon } from "lucide-react";
import type { JourneyRequest, JourneyResponse, UserProfile } from "./journey";

export interface GeneratingLocationState {
  formData?: JourneyRequest;
  userProfile?: UserProfile;
}

export interface GenerationStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface GenerationStepCardProps {
  step: GenerationStep;
  activeStep: number;
  completedSteps: number[];
}

export interface RawWaypoint {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  status?: unknown;
  tasks?: unknown;
}

export interface RawWaypointTask {
  title?: unknown;
  completed?: unknown;
}

export interface RawLearningResource {
  title?: unknown;
  type?: unknown;
  url?: unknown;
  reason?: unknown;
}

export interface RawFutureYouCompany {
  name?: unknown;
  reason?: unknown;
}

export interface RawFutureYouOpportunity {
  title?: unknown;
  reason?: unknown;
}

export interface RawFutureYou {
  title?: unknown;
  summary?: unknown;
  roles?: unknown;
  companies?: unknown;
  opportunityTypes?: unknown;
  networkingActions?: unknown;
  nextOpportunity?: unknown;
}

export type RawJourneyResponse = Partial<Omit<JourneyResponse, "waypoints" | "resources">> & {
  waypoints?: unknown;
  resources?: unknown;
  futureYou?: unknown;
};

export interface ApiErrorResponse {
  error?: unknown;
}
