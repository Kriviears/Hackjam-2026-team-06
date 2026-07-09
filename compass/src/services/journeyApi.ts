// Import the necessary types for the journey request and response
import type { JourneyRequest, JourneyResponse } from "../types/journey";

// Function to generate a journey based on the provided request data
export async function generateJourney(
  data: JourneyRequest
): Promise<JourneyResponse> {
  const response = await fetch(
    "http://localhost:8000/journey/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate journey");
  }

  return response.json();
}