import type { AskCompassRequest, AskCompassResponse } from "../types/askCompass";

const ASK_COMPASS_ENDPOINT = "http://localhost:8000/assistant/ask";

// Payload sent from the Dashboard when a user clicks one Ask Compass option.
// We send both the full journey and the progress chart so the LLM can answer
// from the same state the Roadmap/Dashboard are displaying.
// Small API wrapper for Ask Compass.
// Keeping fetch logic here keeps DashboardPage focused on UI state and rendering.
// Sends one suggested question plus the current learner and journey state to the backend.
export async function askCompass({
  question,
  journey,
  userProfile,
  journeyProgressChart,
}: AskCompassRequest) {
  const response = await fetch(ASK_COMPASS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      journey,
      userProfile,
      journeyProgressChart,
    }),
  });
  const data = (await response.json()) as AskCompassResponse;

  // Surface backend errors in the assistant panel instead of silently failing.
  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Ask Compass could not answer right now.",
    );
  }

  // The backend should return { answer }, but this fallback protects the UI
  // from empty or malformed responses during demos.
  return typeof data.answer === "string" && data.answer.trim()
    ? data.answer.trim()
    : "I could not create a response for that question. Try another option.";
}
