import type { JourneyRequest } from "../types/journey";
import type {
  ApiErrorResponse,
  RawJourneyResponse,
} from "../types/generatePathway";

const JOURNEY_GENERATE_ENDPOINT = "http://localhost:8000/journey/generate";

// Sends onboarding data to the backend and returns the unnormalized roadmap payload.
export async function generateJourney(
  data: JourneyRequest
): Promise<RawJourneyResponse> {
  const response = await fetch(JOURNEY_GENERATE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as ApiErrorResponse;

      if (typeof errorBody.error === "string" && errorBody.error.trim()) {
        message = errorBody.error.trim();
      }
    } catch {
      // If the server did not send JSON, keep the status-based fallback.
    }

    throw new Error(message);
  }

  return (await response.json()) as RawJourneyResponse;
}
